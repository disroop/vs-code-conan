import * as vscode from 'vscode';
import * as child from 'child_process';
import { Queue } from 'queue-typescript';
import { clear } from 'console';

const output = vscode.window.createOutputChannel("conan");

export interface Command{
    executionCommand: string;
    description: string;
}
export class Executor {
    
    private subprocess: any;
    private queue: Queue<Command>;
    constructor() {
        this.queue = new Queue<Command>();
    }
    private executeConanCommand(command: string, resolve: any, reject: any) {

        output.clear();
        output.append(`command: ${command}\n`);

        //Frage: get das auch unter windows mit sh?
        this.subprocess = child.spawn("sh", ['-c', command], {
            stdio: [
                0, // Use parent's stdin for child
                'pipe', // Pipe child's stdout to parent
                'pipe', // Pipe child's stderror to parent
            ]
        });
        this.subprocess.stdout.on("data", (data: string) => {
            output.append(`conan: ${data}`);
        });
        this.subprocess.stderr.on("data", (data: any) => {
            output.append(`stderr: ${data}`);
            this.clearCommandQueue();
        });

        this.subprocess.on('error', (error: { message: any; }) => {
            output.append(`error: ${error.message}`);
            reject(error.message);
            this.clearCommandQueue();
        });

        this.subprocess.on("close", (code: any) => {   
            output.append(`child process exited with code ${code}`);
            resolve();
            this.dequeueCommand();
        });
    }

    private clearCommandQueue() {
        while (this.queue.length > 0) {
            this.queue.removeHead();
        }
    }

    processIsStillRunning():boolean {
        if(!(this.subprocess as child.ChildProcess)){
            return false;
        }
        if(this.subprocess.exitCode === null) {
            return true;
        }
        return false;
    }

    pushCommand(command: Command){
        this.queue.append(command);
        if(!this.processIsStillRunning()) {this.dequeueCommand();}
    }

    private dequeueCommand(){
        let queueLength = this.queue.length;
        let descriptionAddition = "";
        if(queueLength > 0){
            if(queueLength>1){
                descriptionAddition = " (${queueLength-1} to go)";
            }
            let command = this.queue.dequeue();
            command.description = command.description + descriptionAddition;
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
                process.kill(this.subprocess.pid, 'SIGHUP');
            });
            progress.report({message: `I am ${command.description}`});


            return new Promise((resolve, reject) => {
                this.executeConanCommand(command.executionCommand, resolve, reject);
            }).then(() => {
                output.show();
            }).catch((err) => {
                vscode.window.showErrorMessage(err);
                output.show();
            });
        });
    }
}