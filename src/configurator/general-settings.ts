import * as vscode from 'vscode';

export class GeneralSettings {
    private conanPath: string;
    private profilesDirectory: string;
    

    constructor(conanPath: string = "conan",
                profilesDirectory: string = "") {
        this.conanPath = conanPath;
        this.profilesDirectory = profilesDirectory;
    }

    getConanPath(): string {
        return this.conanPath;
    }
    
    setConanPath(conanPath: string) {
        this.conanPath = conanPath;
    }
}