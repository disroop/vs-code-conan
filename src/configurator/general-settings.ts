import * as vscode from 'vscode';

export class GeneralSettings {
    private conanPath: string;
    private profilesDir: string;
    private workspacesDir: string;
    private user: string;
    private channel: string;

    constructor(conanPath: string = "conan",
                profilesDir: string = "",
                workspacesDir: string = "",
                user: string = "default",
                channel: string = "development") {
        this.conanPath = conanPath;
        this.profilesDir = profilesDir;
        this.workspacesDir = workspacesDir;
        this.user = user;
        this.channel = channel;
    }

    getConanPath(): string {
        return this.conanPath;
    }

    hasProfilesDir(): boolean {
        return this.profilesDir.length > 0 ? true : false;
    }

    getProfilesDir(): string {
        return this.profilesDir;
    }

    getWorkspacesDir(): string {
        return this.workspacesDir;
    }

    getUser(): string {
        return this.user;
    }

    getChannel(): string {
        return this.channel;
    }

    getJson(): object {
        let profilesDir = this.profilesDir;
        let workspacesDir = this.workspacesDir;
        const rootPath = vscode.workspace.workspaceFolders?.[0];
        if (rootPath) {
            const rootFsPath : string = rootPath.uri.fsPath;
            profilesDir   = this.profilesDir.replace(rootFsPath,"${workspaceFolder}");
            workspacesDir = this.workspacesDir.replace(rootFsPath,"${workspaceFolder}");
        }
        return {
            conanPath: this.conanPath,
            profilesDir: profilesDir,
            workspacesDir: workspacesDir,
            user: this.user,
            channel: this.channel
        };
    }
}