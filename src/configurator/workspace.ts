import * as vscode from 'vscode';

export class Workspace {
    private profile : string;
    private buildFolder : string;   
    private arg : string;
    private conanWs : string;

    constructor(name : string = "default", 
                conanWs : string = ".",
                profile : string = "",
                arg : string = "") {
        let rootpath = vscode.workspace.rootPath!;
        conanWs = conanWs.replace("${workspaceFolder}", rootpath);
        this.conanWs = conanWs;
        this.profile = profile;
        this.arg = arg;
        var buildFolder = "build/"+name;
        this.buildFolder = buildFolder;
    }

    getConanWorkspace():string{
        return this.conanWs;
    }

    getProfile():string{
        return this.profile;
    }

    getBuildFolder():string{
        return this.buildFolder;
    }
    
    getArguments():string{
        return this.arg;
    }

}