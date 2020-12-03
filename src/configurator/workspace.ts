import * as vscode from 'vscode';

export class Workspace {
    private readonly profile: string;
    private readonly buildFolder: string;
    private readonly arg: string;
    private readonly conanWs: string;

    constructor(name: string = "default",
                conanWs: string = ".",
                profile: string = "",
                arg: string = "") {
        this.conanWs = conanWs.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        this.profile = profile.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        this.arg = arg;
        this.buildFolder = "build/" + name;
    }

    getConanWorkspace(): string {
        return this.conanWs;
    }

    getProfile(): string {
        return this.profile;
    }

    getBuildFolder(): string {
        return this.buildFolder;
    }

    getArguments(): string {
        return this.arg;
    }
}