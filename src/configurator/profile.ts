import * as vscode from 'vscode';

export class Profile {
    private profile : string;
    private buildFolder: string;
    private installArg : string;
    private buildArg : string;
    private createArg : string;
    private conanFile : string;
    private createUser : string;
    private createChannel : string;

    constructor(name : string = "default", 
                conanFile : string = ".",
                profile : string = "",
                installArg : string = "", 
                buildArg : string = "",
                createArg : string = "",
                createUser : string = "",
                createChannel: string = "") {
        let rootpath = vscode.workspace.rootPath!;
        conanFile = conanFile.replace("${workspaceFolder}", rootpath);
        this.conanFile = conanFile;
        profile = profile.replace("${workspaceFolder}", rootpath);
        this.profile = profile;
        this.installArg = installArg;
        this.buildArg = buildArg;
        this.createArg = createArg;
        this.createUser = createUser;
        this.createChannel = createChannel;
        var buildFolder = "build/"+name;
        this.buildFolder = buildFolder;
    }

    getConanFile():string{
        return this.conanFile;
    }

    getProfile():string{
        return this.profile;
    }

    getBuildFolder():string{
        return this.buildFolder;
    }
    
    getInstallArguments():string{
        return this.installArg;
    }

    getBuildArguments():string{
        return this.buildArg;
    }

    getCreateArguments():string{
        return this.createArg;
    }

    getCreateUser():string{
        return this.createUser;
    }

    getCreateChannel():string{
        return this.createChannel;
    }

}