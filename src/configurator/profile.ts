
// some other file
import "reflect-metadata";
import { autoInjectable, container, inject, injectAll } from "tsyringe";
import { System } from "../system/system";

export interface ConanProfile {
    name: string;
    profile?: string;
    profileBuild?: string;
    profileHost?: string;
}
export interface ProfileJson extends ConanProfile {
    conanFile?: string;
    installArg?: string;
    buildArg?: string;
    createArg?: string;
    createUser?: string;
    createChannel?: string;
}

export interface WorkspaceJson extends ConanProfile {
    conanWs?: string;
    arg?: string;
}

@autoInjectable()
export class BuildProfile {
    public readonly profile: string | undefined;
    public readonly profileHost: string | undefined;
    public readonly profileBuild: string | undefined;
    // besser: public readonly buildFolder: Uri | undefined;
    public readonly buildFolder: string | undefined;
    private readonly system:System;
    constructor(name: string,
        profile: string | undefined,
        profileBuild: string | undefined,
        profileHost: string | undefined) {

        this.system=container.resolve("System");
        // falls möglich auch hier wieder auf string-concats bei pfaden verzichten.
        this.buildFolder = "build/" + name;

        this.profile = this.maybeReplaceWorkspaceFolder(profile);
        this.profileBuild = this.maybeReplaceWorkspaceFolder(profileBuild);
        this.profileHost = this.maybeReplaceWorkspaceFolder(profileHost);

    }

    maybeReplaceWorkspaceFolder(source: string | undefined): string | undefined {
        if (source === undefined) {
            return undefined;
        }
        return this.replaceWorkspaceFolder(source);
    }

    // wenn du das auftrennst in eine "maybe" und non-maybe methode (oder wie man das auch immer 
    // nennen will), dann brauchst das casting nicht (siehst fehler besser).
    //
    // siehe: this.conanfilePath = <string>this.maybeReplaceWorkspaceFolder(conanfilePath);
    replaceWorkspaceFolder(source: string): string {
        return source.replace("${workspaceFolder}", this.system.getWorkspaceRootPath()!);
    }
    
    static getDefaultValue(value: string | undefined, defaultValue: string): string {
        if (value === undefined) {
            return defaultValue;
        }
        return value;
    }
}
@autoInjectable()
export class Profile extends BuildProfile {
    public readonly conanfilePath: string;
    public readonly installArg: string;
    public readonly buildArg: string;
    public readonly createArg: string;
    public readonly createUser: string;
    public readonly createChannel: string;


    constructor(
        json: ProfileJson) {

        super(json.name, json.profile, json.profileBuild, json.profileHost);

        this.installArg = BuildProfile.getDefaultValue(json.installArg, "");
        this.buildArg = BuildProfile.getDefaultValue(json.buildArg, "");
        this.createArg = BuildProfile.getDefaultValue(json.createArg, "");
        this.createUser = BuildProfile.getDefaultValue(json.createUser, "");
        this.createChannel = BuildProfile.getDefaultValue(json.createChannel, "");
        let conanfilePath = BuildProfile.getDefaultValue(json.conanFile, ".");
        
        // das casting <string> brauchts somit nicht mehr
        // ALT: this.conanfilePath = <string>this.maybeReplaceWorkspaceFolder(conanfilePath);
        // NEU (ohne <string>):
        this.conanfilePath = this.replaceWorkspaceFolder(conanfilePath);
    }
}

@autoInjectable()
export class Workspace extends BuildProfile {
    public readonly conanworkspacePath: string;
    public readonly arg: string;

    constructor(json: WorkspaceJson) {
        super(json.name, json.profile, json.profileBuild, json.profileHost);
        let conanWs = BuildProfile.getDefaultValue(json.conanWs, ".");
        this.conanworkspacePath = <string>this.maybeReplaceWorkspaceFolder(conanWs);
        this.arg = BuildProfile.getDefaultValue(json.arg, "");
    }
}