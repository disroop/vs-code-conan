import * as vscode from 'vscode';

export class Profile {
    private readonly profile: string;
    private readonly buildFolder: string;
    private readonly installArg: string;
    private readonly buildArg: string;
    private readonly createArg: string;
    private readonly conanFile: string;
    private readonly createUser: string;
    private readonly createChannel: string;

    constructor(name: string = "default",
                conanFile: string = ".",
                profile: string = "",
                installArg: string = "",
                buildArg: string = "",
                createArg: string = "",
                createUser: string = "",
                createChannel: string = "") {
        this.conanFile = conanFile.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        this.profile = profile.replace("${workspaceFolder}", vscode.workspace.rootPath!);
        this.installArg = installArg;
        this.buildArg = buildArg;
        this.createArg = createArg;
        this.createUser = createUser;
        this.createChannel = createChannel;
        this.buildFolder = "build/" + name;
    }

    getConanFile(): string {
        return this.conanFile;
    }

    getProfile(): string {
        return this.profile;
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
}