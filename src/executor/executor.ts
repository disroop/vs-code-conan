import * as vscode from 'vscode';

const output = vscode.window.createOutputChannel("conan");

export class Executor {
    private subprocess: any;

    private executeConanCommand(commad: string, resolve: any, reject: any) {
        const child_process = require("child_process");
        output.clear();
        output.append(`command: ${commad}\n`);
        //Frage: get das auch unter windows mit sh?
        this.subprocess = child_process.spawn("sh", ['-c', commad], {
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
        });

        this.subprocess.on('error', (error: { message: any; }) => {
            output.append(`error: ${error.message}`);
            reject(error.message);
        });

        this.subprocess.on("close", (code: any) => {
            output.append(`child process exited with code ${code}`);
            resolve();
        });
    }

    runCommand(command: string, typeDoing: string) {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Conan is working",
            cancellable: true
        }, (progress, token) => {
            token.onCancellationRequested(() => {
                process.kill(this.subprocess.pid, 'SIGHUP');
            });
            progress.report({message: `I am ${typeDoing}`});


            return new Promise((resolve, reject) => {
                this.executeConanCommand(command, resolve, reject);
            }).then(() => {
                output.show();
            }).catch((err) => {
                vscode.window.showErrorMessage(err);
                output.show();
            });
        });
    }
}