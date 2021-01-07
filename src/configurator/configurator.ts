/* eslint-disable eqeqeq */
import { SettingsParser } from "./settings-parser";
import { Profile } from "./profile";
import { Workspace } from "./workspace";

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
            ? this.workspaces.get(name)?.getConanWorkspace()
            : this.profiles.get(name)?.getConanFile();
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
}
