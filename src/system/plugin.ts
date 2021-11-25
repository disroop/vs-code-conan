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

    // getWorkspaceRootPath(): Uri <--- URI
    getWorkspaceRootPath(): string { 
        if (workspace.workspaceFolders !== undefined) {
            if (workspace.workspaceFolders.length === 1) {
                // TODO: Hier wie im extension.ts beschrieben: Ich würde möglichst nie (wenn immer möglich)
                // mit Strings arbeiten wenns um Pfade/Url usw geht ... wenn vscode schon alles
                // als "uri" anbietet.
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

    // #3
    //
    // Ich kenne das threading-model von electron-apps wie vscode zuwenig. Aber falls das so
    // umgesetzt ist wie ich vermute, dann könnte das das UI von VsCode blockieren. Etwas besser
    // wöre hier mit promises zu arbeiten. Also "readFile" anstatt "readFileSync" verwenden:
    //
    // https://nodejs.org/api/fs.html#filehandlereadfileoptions
    readFile(filepath: string): string {
        const fs = require("fs");
        // #1
        //
        // glaube hier könte man die typescript type-definitions für node verwenden; dann hast das
        // typisiert: https://www.npmjs.com/package/@types/node
        const data = fs.readFileSync(filepath);

        // #2
        // laut dokumentation liefert das readFileSync nen Buffer zurpck und nicht nen String
        // https://nodejs.org/api/fs.html#fsreadfilesyncpath-options
        // "If the encoding option is specified then this function returns a string. Otherwise it returns a buffer."
        return data;
    }

    log(message: string) {
        this._outputLog.append(message);
    }

    focusLog() {
        this._outputLog.show();
    }
}

