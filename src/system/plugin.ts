/* eslint-disable eqeqeq */
import { singleton } from "tsyringe";
@singleton()
export class SystemPlugin{
    getWorkspaceRootPath() {
        const vscode = require('vscode');
        if (vscode.workspace.workspaceFolders !== undefined) {
            if (vscode.workspace.workspaceFolders.length === 1) {
                return vscode.workspace.workspaceFolders[0].uri.path;
            }
            else {
                throw new Error("Multiple workspaces are not supported");
            }
        }
        throw new Error("No workspace folders");
    }

    showWarningMessage(message:string){
        const vscode = require('vscode');
        vscode.window.showWarningMessage(message);
    }

    readFile(filepath:string) : string {
        const fs = require("fs");
        const data = fs.readFileSync(filepath);
        return data;
    }
}

