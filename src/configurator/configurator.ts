/* eslint-disable eqeqeq */
import * as vscode from 'vscode';
import { SettingsParser } from "./settings-parser";
import { Profile } from "./profile";
import { Workspace } from "./workspace";
import { GeneralSettings } from "./general-settings";
import { output } from "../extension";

interface ProfileExtended {
    build: string | undefined;
    host: string | undefined;
}

const conanPathDialogOptions: vscode.OpenDialogOptions = {
    canSelectFolders: false,
    canSelectFiles: true,
    title: "Select conan path:"
};
const profilesDirDialogOptions: vscode.OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    title: "Select profiles directory:"
};
const workspacesDirDialogOptions: vscode.OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    title: "Select workspaces directory:"
};
const userInputBoxOpt: vscode.InputBoxOptions = {
    prompt: "Enter conan user name.",
    value: "default"
};
const channelInputBoxOpt: vscode.InputBoxOptions = {
    prompt: "Enter conan channel.",
    value: "development"
};
const setupProfilesAndWorkspacesDirsOpt: vscode.QuickPickOptions = {
    canPickMany:false,
    placeHolder:"Both"
};

export class Configurator {
    private readonly file: string;
    private settings: GeneralSettings = new GeneralSettings();
    private profiles: Map<string, Profile> = new Map<string, Profile>();
    private workspaces: Map<string, Workspace> = new Map<string, Workspace>();
    private user: string = "";
    private channel: string = "";
    private conanPath: string = "conan";
    private profilesDir: string = "";
    private workspacesDir: string  = "";
    private tryAgainCounter: number = 0;

    constructor(file: string) {
        this.file = file;
    }

    readFile() {
        let fs = require("fs");
        let data = fs.readFileSync(this.file);
        this.settings = SettingsParser.readSettings(data);
        this.profiles = SettingsParser.convert(data);
        this.workspaces = SettingsParser.convertWs(data);
    }

    getConanPath(): string {
        return this.settings.getConanPath();
    }

    getProfilesDir(): string {
        return this.settings.getProfilesDir();
    }

    getConanFile(name: string): string {
        let conanFile = this.isWorkspace(name)
            ? this.workspaces.get(name)?.getConanWorkspace()
            : this.profiles.get(name)?.getConanFile();
        if (!conanFile) {
            throw new Error("No profile found");
        }
        return conanFile;
    }

    getProfileOrWorkspace(name:string): Profile|Workspace {
        let out = this.isWorkspace(name)
            ? this.workspaces.get(name)
            : this.profiles.get(name);
        if (!out) {
            throw new Error("No existing profile or workspace found.");
        }
        return out;
    }

    getAllNames(): string[] {
        const profileNames = Array.from(this.profiles.keys());
        const workspaceNames = Array.from(this.workspaces.keys());
        const names = profileNames.concat(workspaceNames);
        if (this.checkUniqueName(names)) {
            throw new Error("Duplication of names");
        }
        return names;
    }

    getAllEnabledNames(): string[] {
        return this.getAllNames().filter( (name) => {
            if (this.getProfileOrWorkspace(name).isEnabled()) {
                return name;
            }
        });
    }

    checkUniqueName(names: string[]): boolean {
        return new Set(names).size !== names.length;
    }

    getProfile(name: string): string | ProfileExtended {
        let { profile, retVal } = this.getActiveProfile(name);
        if (profile != undefined) {
            return profile;
        }
        if (retVal.build == undefined && retVal.host == undefined) {
            throw new Error("A profile has to be set for this configuration!");
        }
        return retVal;
    }

    private getActiveProfile(name: string) {
        let profile: string | undefined;
        let retVal: ProfileExtended;
        if (this.isWorkspace(name)) {
            let ws = this.workspaces.get(name);
            if (ws == undefined) {
                throw new Error("Workspace not found");
            }
            profile = ws.getProfile();
            retVal = { build: ws.getProfileBuild(), host: ws.getProfileHost() };

        }
        else {
            let pr = this.profiles.get(name);
            if (pr == undefined) {
                throw new Error("Profile not found");
            }
            profile = pr.getProfile();
            retVal = { build: pr.getProfileBuild(), host: pr.getProfileHost() };
        }
        return { profile, retVal };
    }

    isWorkspace(name: string): boolean {
        return this.workspaces.has(name);
    }

    getBuildFolder(name: string): string {
        let buildFolder = this.isWorkspace(name)
            ? this.workspaces.get(name)?.getBuildFolder()
            : this.profiles.get(name)?.getBuildFolder();
        if (!buildFolder) {
            throw new Error("No build folder found");
        }
        return buildFolder;
    }

    getInstallArg(name: string): string {
        let installArg = this.isWorkspace(name)
            ? this.workspaces.get(name)?.getArguments()
            : this.profiles.get(name)?.getInstallArguments();
        if (!installArg) {
            installArg = "";
        }
        return installArg;
    }

    getBuildArg(name: string): string {
        let buildArg = this.profiles.get(name)?.getBuildArguments();
        if (!buildArg) {
            buildArg = "";
        }
        return buildArg;
    }

    getCreateArg(name: string): string {
        let createArg = this.profiles.get(name)?.getCreateArguments();
        if (!createArg) {
            createArg = "";
        }
        return createArg;
    }

    getCreateUser(name: string): string {
        let createUser = this.profiles.get(name)?.getCreateUser();
        if (!createUser) {
            throw new Error("No createUser found");
        }
        return createUser;
    }

    getCreateChannel(name: string): string {
        let createChannel = this.profiles.get(name)?.getCreateChannel();
        if (!createChannel) {
            throw new Error("No createChannel found");
        }
        return createChannel;
    }

    initSetupFile() {
        vscode.window.showInformationMessage(
            "Would you like to begin Disroop Conan setup? Or setup manually?",
            "Yes", "No", "Manual").then( value => {
                if (!value) { return; }
                else if (value === "Yes") {
                    this.setupConfigs().then( () => {
                        this.settings = new GeneralSettings(
                            this.conanPath,
                            this.profilesDir,
                            this.workspacesDir,
                            this.user,
                            this.channel);
                        this.generateConanSettingsFile();
                    }, reason => {
                        console.error(reason);
                    });
                } else if (value === "Manual") {
                    this.generateDefaultConanSettingsFile();
                }
            }
        );
    }

    async setupConfigs(): Promise<void | undefined> {
        try {
            await vscode.window.showInformationMessage(
                "Use conan from path environment variable?", "Yes", "No")
                .then( value => {
                    if (!value) { return; }
                    else if (value === "No") {
                        vscode.window.showOpenDialog(conanPathDialogOptions)
                            .then( value => {
                                if (!value) { return; }
                                this.conanPath = value[0].fsPath;
                        });
                    }
                });
            await vscode.window.showInputBox(userInputBoxOpt)
                .then( value => {
                    if (!value) { return; }
                    this.user = value;
                    output.appendLine(`Username: ${this.user}`);
                });
            await vscode.window.showInputBox(channelInputBoxOpt)
                .then( value => {
                    if (!value) { return; }
                    this.channel = value;
                    output.appendLine(`Channel: ${this.channel}`);
                });
            let option :string = "";
            const options_list :string[] = ["Both","Profiles","Workspaces"];
            await vscode.window.showQuickPick(options_list, setupProfilesAndWorkspacesDirsOpt)
                .then( value => {
                    if (!value) { return; }
                    option = value;
                })
                .then( () => {
                    if ( option.length === 0 ) {
                        throw new Error(`A selection needs to be made from ${options_list}`);
                    }
                });
            await this.setupProfilesAndWorkspacesDirs(option);
        } catch {
            return this.trySetupAgain();
        }
    }

    async setupProfilesAndWorkspacesDirs(option: string): Promise< void | undefined > {
        output.appendLine(`Option: ${option}`);
        console.log(`Option: ${option}`);
        if (option === "Profiles" || option === "Both") {
            await vscode.window.showOpenDialog(profilesDirDialogOptions)
            .then( value => {
                if (!value) { return; }
                this.profilesDir = value[0].fsPath;
                output.appendLine(`Profiles directory: ${this.profilesDir}`);
                console.log(`Profiles directory: ${this.profilesDir}`);
                this.profiles = SettingsParser.profilesFromDir(this.profilesDir);
            });
        }
        if (option === "Workspaces" || option === "Both") {
            await vscode.window.showOpenDialog(workspacesDirDialogOptions)
            .then( value => {
                if (!value) { return; }
                this.workspacesDir = value[0].fsPath;
                output.appendLine(`Workspaces directory: ${this.workspacesDir}`);
                this.workspaces = SettingsParser.workspacesFromDir(this.workspacesDir);
            });
        }
    }

    async trySetupAgain(): Promise<void | undefined> {
        await vscode.window.showInformationMessage(
            "Setup cancelled. Would you like to try again or manually setup Disroop Conan?",
            "Try again", "Manual setup")
            .then( value => {
                output.appendLine(`Try again opt: ${value}`);
                if (this.tryAgainCounter<=2) {
                    if (value === "Try again") { 
                        this.tryAgainCounter++;
                        this.initSetupFile();
                    } else {
                        this.generateDefaultConanSettingsFile();
                    }
                } else {
                    throw new Error("Disroop Conan: Setup of conan-settings.json unsuccessful!");
                }
            });
    }

    generateDefaultConanSettingsFile() {
        const out = { 
            settings:   new GeneralSettings().getJson(),
            profiles:   [new Profile().getJson()],
            workspaces: [new Workspace().getJson()]
        };
        this.writeConanJsonFile(out);
    }

    generateConanSettingsFile() {
        const out = {
            settings:   this.settings.getJson(),
            profiles:   Array.from(this.profiles.values()).map(
                        function (x) { return x.getJson(); }),
            workspaces: Array.from(this.workspaces.values()).map(
                        function (x) { return x.getJson(); })
        };
        this.writeConanJsonFile(out);
    }

    writeConanJsonFile(out:object) {
        const fs = require("fs");
        const outJson = JSON.stringify(out, null, 4);
        fs.writeFile(this.file, outJson, function (err:any) {
            if (err) {
                throw err;
            }
        });
    }
}