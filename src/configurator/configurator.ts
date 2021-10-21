/* eslint-disable eqeqeq */
import { SettingsParser } from "./settings-parser";
import { Profile, Workspace } from "./profile";

interface ProfileExtended {
    build: string | undefined;
    host: string | undefined;
}

export class Configurator {
    private readonly file: string;
    private profiles: Map<string, Profile> = new Map<string, Profile>();
    private workspaces: Map<string, Workspace> = new Map<string, Workspace>();

    constructor(file: string) {
        this.file = file;
    }

    readFile() {
        let fs = require("fs");
        let data = fs.readFileSync(this.file);
        this.profiles = SettingsParser.convert(data);
        this.workspaces = SettingsParser.convertWs(data);
    }

    getConanFile(name: string): string {
        let conanFile = this.isWorkspace(name)
            ? this.workspaces.get(name)?.conanworkspacePath
            : this.profiles.get(name)?.conanfilePath;
        if (!conanFile) {
            throw new Error("No profile found");
        }
        return conanFile;
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
            profile = ws.profile;
            retVal = { build: ws.profileBuild, host: ws.profileHost };

        }
        else {
            let pr = this.profiles.get(name);
            if (pr == undefined) {
                throw new Error("Profile not found");
            }
            profile = pr.profile;
            retVal = { build: pr.profileBuild, host: pr.profileHost };
        }
        return { profile, retVal };
    }

    isWorkspace(name: string): boolean {
        return this.workspaces.has(name);
    }

    getBuildFolder(name: string): string {
        let buildFolder = this.isWorkspace(name)
            ? this.workspaces.get(name)?.buildFolder
            : this.profiles.get(name)?.buildFolder;
        if (!buildFolder) {
            throw new Error("No build folder found");
        }
        return buildFolder;
    }

    getInstallArg(name: string): string {
        let installArg = this.isWorkspace(name)
            ? this.workspaces.get(name)?.arg
            : this.profiles.get(name)?.installArg;
        if (!installArg) {
            installArg = "";
        }
        return installArg;
    }

    getBuildArg(name: string): string {
        let buildArg = this.profiles.get(name)?.buildArg;
        if (!buildArg) {
            buildArg = "";
        }
        return buildArg;
    }

    getCreateArg(name: string): string {
        let createArg = this.profiles.get(name)?.createArg;
        if (!createArg) {
            createArg = "";
        }
        return createArg;
    }

    getCreateUser(name: string): string {
        let createUser = this.profiles.get(name)?.createUser;
        if (!createUser) {
            throw new Error("No createUser found");
        }
        return createUser;
    }

    getCreateChannel(name: string): string {
        let createChannel = this.profiles.get(name)?.createChannel;
        if (!createChannel) {
            throw new Error("No createChannel found");
        }
        return createChannel;
    }
}
