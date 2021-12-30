/* eslint-disable eqeqeq */
import { singleton } from "tsyringe";
import { System } from "./system";
import { TextDocument, Uri, window, workspace } from "vscode";

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
}

