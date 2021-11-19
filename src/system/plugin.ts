/* eslint-disable eqeqeq */
import { singleton } from "tsyringe";
import { System } from "./system";
import { window, workspace } from "vscode";

@singleton()
export class SystemPlugin implements System {
    private readonly _outputLog: any;

    constructor() {
        this._outputLog = window.createOutputChannel("conan");
    }
    getWorkspaceRootPath(): string {
        if (workspace.workspaceFolders !== undefined) {
            if (workspace.workspaceFolders.length === 1) {
                return String(workspace.workspaceFolders[0].uri.path);
            }
            else {
                throw new Error("Multiple workspaces are not supported");
            }
        }
        throw new Error("No workspace folders");
    }

    showWarningMessage(message: string) {
        window.showWarningMessage(message);
    }

    readFile(filepath: string): string {
        const fs = require("fs");
        const data = fs.readFileSync(filepath);
        return data;
    }

    log(message: string) {
        this._outputLog.append(message);
    }

    focusLog() {
        this._outputLog.show();
    }
}

