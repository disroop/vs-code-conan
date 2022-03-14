/* eslint-disable eqeqeq */
import { singleton } from "tsyringe";
import { System } from "./system";
import { Uri, window, workspace } from "vscode";
import { TextEncoder } from "util";

@singleton()
export class SystemPlugin implements System {
    private readonly _outputLog: any;

    constructor() {
        this._outputLog = window.createOutputChannel("conan");
    }

    private getWorkspaceUri(): Uri{
        if (workspace.workspaceFolders !== undefined) {
            if (workspace.workspaceFolders.length === 1) {
                return workspace.workspaceFolders[0].uri;
            }
            else {
                throw new Error("Multiple workspaces are not supported");
            }
        }
        throw new Error("No workspace folders");
    }
    getWorkspaceRootPath(): string {
        return this.getWorkspaceUri().fsPath;
    }

    replaceWorkspaceRoot(filepath:string):string{       
        if (filepath.startsWith(`\${workspaceFolder}/`)) {
            filepath = filepath.replace(`\${workspaceFolder}/`, "");
            filepath = this.addWorkspaceRoot(filepath);
        }
        return filepath;
    }

    addWorkspaceRoot(filepath:string):string{
        let rootUri = this.getWorkspaceUri();
        return Uri.joinPath(rootUri,filepath).fsPath;
    }
    
    showWarningMessage(message: string) {
        window.showWarningMessage(message);
    }
    async readFile(filepath: string): Promise<string> {
        return (await workspace.openTextDocument(filepath)).getText();
    }

    async fileExist(filepath: string): Promise<boolean> {
        try {
            await workspace.fs.stat(Uri.file(filepath));
        } catch {
            return false;
        }
        return true;
    }

    log(message: string) {
        this._outputLog.append(message);
    }

    focusLog() {
        this._outputLog.show();
    }

    async findAllFilesInWorkspace(filename:string): Promise<Uri[]>{
        return workspace.findFiles(`**/${filename}`);
    }

    async writeFile(filepath: string, content: string): Promise<void>{
        const finalUri = Uri.file(filepath);
        let enc = new TextEncoder(); 
        await workspace.fs.writeFile(finalUri,enc.encode(content));
    }

    showCreateTemplateDialog(error:Error, generateTemplate: ()=>any, cancel: ()=>any){
        window.showInformationMessage(error.message, ...[`Create template`, `Cancel`]).then(selection => {
            if(selection === "Create template"){
                generateTemplate();
            }
            else{
                cancel();
            }
        });
    }

}

