import * as vscode from 'vscode';

export class Profile {
    private readonly name: string;
    private readonly profile: string | undefined;
    private readonly profileBuild: string | undefined;
    private readonly profileHost: string | undefined;
    private readonly buildFolder: string;
    private readonly installArg: string;
    private readonly buildArg: string;
    private readonly createArg: string;
    private readonly conanFile: string;
    private readonly createUser: string;
    private readonly createChannel: string;
    private readonly enabled: boolean;

    constructor(name: string = "default",
                conanFile: string = ".",
                profile: string = "",
                profileBuild: string = "",
                profileHost: string = "",
                installArg: string = "",
                buildArg: string = "",
                createArg: string = "",
                createUser: string = "",
                createChannel: string = "",
                enabled: boolean = true) {
        this.name = name;
        this.conanFile = conanFile.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        if(profile.length> 0){
            this.profile = profile.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        }
        if(profileBuild.length> 0){
            this.profileBuild = profileBuild.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        }
        if(profileHost.length> 0){
            this.profileHost = profileHost.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        }
        this.installArg = installArg;
        this.buildArg = buildArg;
        this.createArg = createArg;
        this.createUser = createUser;
        this.createChannel = createChannel;
        this.buildFolder = "build/" + name;
        this.enabled = enabled;
    }

    getConanFile(): string {
        return this.conanFile;
    }

    getProfile(): string | undefined {
        return this.profile;
    }

    getProfileBuild(): string | undefined {
        return this.profileBuild;
    }

    getProfileHost(): string | undefined {
        return this.profileHost;
    }
    getBuildFolder(): string {
        return this.buildFolder;
    }

    getInstallArguments(): string {
        return this.installArg;
    }

    getBuildArguments(): string {
        return this.buildArg;
    }

    getCreateArguments(): string {
        return this.createArg;
    }

    getCreateUser(): string {
        return this.createUser;
    }

    getCreateChannel(): string {
        return this.createChannel;
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    getJson(): object {
        let profile_path = this.profile;
        let conanfile_path = this.conanFile;
        const rootPath = vscode.workspace.workspaceFolders?.[0];
        if (rootPath) {
            const rootFsPath : string = rootPath.uri.fsPath;
            profile_path   = this.profile?.replace(rootFsPath,"${workspaceFolder}");
            conanfile_path = this.conanFile.replace(rootFsPath,"${workspaceFolder}");
        }
        return {
            name:           this.name,
            conanFile:      conanfile_path,
            profile:        profile_path,
            profileBuild:   this.profileBuild,
            profileHost:    this.profileHost,
            installArg:     this.installArg,
            buildArg:       this.buildArg,
            createArg:      this.createArg,
            createUser:     this.createUser,
            createChannel:  this.createChannel,
            enabled:        this.enabled
        };
    }
}