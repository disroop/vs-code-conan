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
        let rootpath = vscode.workspace.rootPath!;
        this.conanWs = conanWs.replace("${workspaceFolder}", rootpath);
        this.profile = profile.replace("${workspaceFolder}", rootpath);
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