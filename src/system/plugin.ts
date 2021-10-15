/* eslint-disable eqeqeq */
import * as vscode from 'vscode';
import { singleton } from "tsyringe";
import { System } from "./interface";


@singleton()
export class SystemPlugin implements System{
    constructor() { }

    getWorkspaceRootPath() {
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
}

