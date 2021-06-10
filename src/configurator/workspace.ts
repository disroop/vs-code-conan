import * as vscode from 'vscode';

export class Workspace {
    private readonly name: string;
    private readonly profile: string | undefined;
    private readonly profileHost: string | undefined;
    private readonly profileBuild: string | undefined;
    private readonly buildFolder: string;
    private readonly arg: string;
    private readonly conanWs: string;
    private readonly enabled: boolean;

    constructor(name: string = "default",
                conanWs: string = ".",
                profile: string = "",
                profileBuild: string = "",
                profileHost: string = "",
                arg: string = "--build=missing",
                enabled: boolean = true) {
        this.name = name;
        this.conanWs = conanWs.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        if(profile.length > 0){
            this.profile = profile.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        }
        if(profileHost.length > 0){
            this.profileHost = profileHost.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        }
        if(profileBuild.length > 0){
            this.profileBuild = profileBuild.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        }
        this.arg = arg;
        this.buildFolder = "build/" + name;
        this.enabled = enabled;
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

    isEnabled(): boolean {
        return this.enabled;
    }

    getJson(): object {
        let profile_path = this.profile;
        let conanWs_path = this.conanWs;
        const rootPath = vscode.workspace.workspaceFolders?.[0];
        if (rootPath) {
            const rootFsPath : string = rootPath.uri.fsPath;
            profile_path = this.profile?.replace(rootFsPath,"${workspaceFolder}");
            conanWs_path = this.conanWs.replace(rootFsPath,"${workspaceFolder}");
        }
        return {
            name:           this.name,
            conanWs:        conanWs_path,
            profile:        profile_path,
            profileBuild:   this.profileBuild,
            profileHost:    this.profileHost,
            arg:            this.arg,
            enabled:        this.enabled
        };
    }
}