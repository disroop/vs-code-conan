/* eslint-disable eqeqeq */
import { SettingsParser } from "./settings-parser";
import { Profile, Workspace } from "./profile";

interface ProfileExtended {
    build: string | undefined;
    host: string | undefined;
}

export class Configurator {
    private readonly file: string;
    private profiles: Map<string, Profile> | undefined;
    private workspaces: Map<string, Workspace>| undefined;
    constructor(file: string) {
        this.file = file;
    }

    readFile() {
        let fs = require("fs");
        let data = fs.readFileSync(this.file);
        let parser = new SettingsParser(data);
        this.profiles = parser.getProfiles();
        this.workspaces = parser.getWorkspaces();
    }

    getConanFile(name: string): string {
        let conanFile = undefined;
        if (this.workspaces?.has(name)) {
            conanFile = this.workspaces.get(name)?.conanworkspacePath;
        }
        if (this.profiles?.has(name)) {
            conanFile = this.profiles.get(name)?.conanfilePath;
        }
        if (!conanFile) {
            throw new Error("No profile found");
        }
        return conanFile;
    }

    appendKeysOfMap(array: Array<string>, map : Map<string, Profile | Workspace> | undefined ): Array<string>{
        if (map) {
            array = array.concat(Array.from(map.keys()));
        }
        return array;
    }

    getAllNames(): string[] {
        let names : Array<string> = new Array<string>();
        names = this.appendKeysOfMap(names,this.profiles);
        names = this.appendKeysOfMap(names,this.workspaces);
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
        if (this.workspaces?.has(name)) {
            let ws = this.workspaces.get(name);
            if (ws == undefined) {
                throw new Error("Workspace not found");
            }
            profile = ws.profile;
            retVal = { build: ws.profileBuild, host: ws.profileHost };

        }
        else {
            let pr = this.profiles?.get(name);
            if (pr == undefined) {
                throw new Error("Profile not found");
            }
            profile = pr.profile;
            retVal = { build: pr.profileBuild, host: pr.profileHost };
        }
        return { profile, retVal };
    }

    isWorkspace(name: string): boolean {
        if (this.workspaces){
            return this.workspaces.has(name);
        }
        return false;
    }

    getBuildFolder(name: string): string {
        let buildFolder = this.workspaces?.has(name)
            ? this.workspaces.get(name)?.buildFolder
            : this.profiles?.get(name)?.buildFolder;
        if (!buildFolder) {
            throw new Error("No build folder found");
        }
        return buildFolder;
    }

    getInstallArg(name: string): string {
        let installArg = this.workspaces?.has(name)
            ? this.workspaces.get(name)?.arg
            : this.profiles?.get(name)?.installArg;
        if (!installArg) {
            installArg = "";
        }
        return installArg;
    }

    getBuildArg(name: string): string {
        let buildArg = this.profiles?.get(name)?.buildArg;
        if (!buildArg) {
            buildArg = "";
        }
        return buildArg;
    }

    getCreateArg(name: string): string {
        let createArg = this.profiles?.get(name)?.createArg;
        if (!createArg) {
            createArg = "";
        }
        return createArg;
    }

    getCreateUser(name: string): string {
        let createUser = this.profiles?.get(name)?.createUser;
        if (!createUser) {
            throw new Error("No createUser found");
        }
        return createUser;
    }

    getCreateChannel(name: string): string {
        let createChannel = this.profiles?.get(name)?.createChannel;
        if (!createChannel) {
            throw new Error("No createChannel found");
        }
        return createChannel;
    }
}
