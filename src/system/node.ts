import * as vscode from 'vscode';
import * as child from 'child_process';
import { Queue } from 'queue-typescript';
import { autoInjectable, container, singleton } from "tsyringe";
import { System, Executor, Command } from './system';
import path = require('path');

@singleton()
@autoInjectable()
export class ExecutorNodeJs implements Executor {
    private subprocess: any;
    private queue: Queue<Command>;
    private system: System;
    constructor() {
        this.subprocess = null;
        this.queue = new Queue<Command>();
        this.system = container.resolve("System");
    }
    private executeConanCommand(command: string, resolve: any, reject: any) {
        this.system.log(`command: ${command}\n`);
        const spawn_opts: child.SpawnOptions = {
            stdio: [
                'pipe', // Use parent's stdin for child
                'pipe', // Pipe child's stdout to parent
                'pipe', // Pipe child's stderror to parent
            ],
            shell: true
        };
        this.subprocess = child.spawn(command, [], spawn_opts);

        this.subprocess.stdout.on("data", (data: string) => {
            this.system.log(`conan: ${data}`);
        });
        this.subprocess.stderr.on("data", (data: any) => {
            this.system.log(`stderr: ${data}`);
            this.clearCommandQueue();
        });

        this.subprocess.on('error', (error: { message: any; }) => {
            this.system.log(`error: ${error.message}`);
            reject(error.message);
            this.clearCommandQueue();
        });

        this.subprocess.on("close", (code: any) => {
            if (code !== null) {
                this.system.log(`child process exited with code ${code}`);
                resolve();
                this.dequeueCommand();
            }
            else {
                this.system.log(`conan: process cancelled!`);
                this.clearCommandQueue();
            }
            this.system.log("");
            this.subprocess = null;
        });
    }

    private clearCommandQueue() {
        while (this.queue.length > 0) {
            this.queue.removeHead();
        }
    }

    normalizePathForExecution(filePath: string): string {
        let normalizedPath = undefined;
        switch (process.platform) {
            case 'darwin': 
                normalizedPath = path.posix.normalize(filePath);
                break;
            case 'linux': 
                normalizedPath = path.posix.normalize(filePath);
                break;
            case 'win32': 
                normalizedPath = path.win32.normalize(filePath);
                if(normalizedPath.startsWith("\\")){
                    normalizedPath=normalizedPath.substring(1);
                }
                break;
        }
        if(normalizedPath===undefined){
            return filePath;
        }
        else{
            return normalizedPath;
        }
    }

    processIsStillRunning(): boolean {
        return this.subprocess !== null;
    }

    pushCommand(command: Command) {
        this.queue.append(command);
        if (!this.processIsStillRunning()) { this.dequeueCommand(); }
    }

    executeShortCommand(command: string): string {
        let [executed, commandOutput] = this.executeSyncCommand(command);
        if (executed) {
            return commandOutput;
        }
        throw Error(`Not able to execute command: ${command}. Process is still running!`);
    }

    private executeSyncCommand(command: string): [executed: boolean, stdout: string] {
        if (this.processIsStillRunning()) {
            return [false, ""];
        } else {
            return [true, child.execSync(command).toString()]; //NOSONAR this executes only a short command
        }
    }

    private dequeueCommand() {
        if (this.queue.length > 0) {
            let command = this.queue.dequeue();
            this.executeCommand(command);
        }
    }

    private executeCommand(command: Command) {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Conan is working",
            cancellable: true
        }, (progress, token) => {
            token.onCancellationRequested(() => {
                var kill = require('tree-kill');
                kill(this.subprocess.pid);
            });
            progress.report({ message: `I am ${command.description}` });
            return new Promise((resolve, reject) => {
                this.executeConanCommand(command.executionCommand, resolve, reject);
            }).then(() => {
                this.system.focusLog();
            }).catch((err) => {
                vscode.window.showErrorMessage(err);
                this.system.focusLog();
            });
        });
    }
}
