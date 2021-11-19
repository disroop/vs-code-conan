import * as vscode from 'vscode';
import * as child from 'child_process';
import { Queue } from 'queue-typescript';
import { autoInjectable, inject, singleton } from "tsyringe";
import { System, Executor, Command} from './system';

@singleton()
@autoInjectable()
export class ExecutorNodeJs implements Executor {
    private subprocess: any;
    private queue: Queue<Command>;
    private system: System;
    constructor(@inject("System") system?:System) {
        this.subprocess=null;
        this.queue = new Queue<Command>();
        if(!system){
            throw Error("System has to be defined");
        }
        this.system = system;
    }
    private executeConanCommand(command: string, resolve: any, reject: any) {
        this.system.log(`command: ${command}\n`);
        
        this.subprocess = child.spawn(command, {
            stdio: [
                'pipe', // Use parent's stdin for child
                'pipe', // Pipe child's stdout to parent
                'pipe', // Pipe child's stderror to parent
            ],
            shell: true, 
        });

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
            if(code !== null){
                this.system.log(`child process exited with code ${code}`);
                resolve();
                this.dequeueCommand();
            }
            else{ 
                this.system.log(`conan: process cancelled!`);
                this.clearCommandQueue();
            }
            this.system.log("");
            this.subprocess=null;
        });
    }

    private clearCommandQueue() {
        while (this.queue.length > 0) {
            this.queue.removeHead();
        }
    }

    processIsStillRunning():boolean {
        if(this.subprocess === null) {
            return false;
        }
        return true;
    }

    pushCommand(command: Command){
        this.queue.append(command);
        if(!this.processIsStillRunning()) {this.dequeueCommand();}
    }

    private dequeueCommand(){ 
        if(this.queue.length > 0){
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
            progress.report({message: `I am ${command.description}`});


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
