import * as vscode from 'vscode';

export class Workspace {
    private readonly profile: string | undefined;
    private readonly profileHost: string | undefined;
    private readonly profileBuild: string | undefined;
    private readonly buildFolder: string;
    private readonly arg: string;
    private readonly conanWs: string;

    constructor(name: string = "default",
                conanWs: string = ".",
                profile: string = "",
                profileBuild: string = "",
                profileHost: string = "",
                arg: string = "") {
        this.conanWs = conanWs.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        if(profile.length > 0){
            this.profile = profile.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        }
        if(profileHost.length > 0){
            this.profileHost = profile.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        }
        if(profileBuild.length > 0){
            this.profileBuild = profile.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        }
        this.arg = arg;
        this.buildFolder = "build/" + name;
    }

    
    getConanWorkspace(): string {
        return this.conanWs;
    }

    getProfile(): string | undefined{
        return this.profile;
    }

    getProfileHost(): string | undefined{
        return this.profileHost;
    }

    getProfileBuild(): string | undefined{
        return this.profileBuild;
    }

    getBuildFolder(): string {
        return this.buildFolder;
    }

    getArguments(): string {
        return this.arg;
    }
}