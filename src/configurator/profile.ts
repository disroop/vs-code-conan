
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
    public readonly buildFolder: string | undefined;

    constructor(name: string,
        profile: string | undefined,
        profileBuild: string | undefined,
        profileHost: string | undefined,
        @inject("System") system?: System) {

        this.buildFolder = "build/" + name;

        this.profile = BuildProfile.replaceWorkspaceFolder(system, profile);
        this.profileBuild = BuildProfile.replaceWorkspaceFolder(system, profileBuild);
        this.profileHost = BuildProfile.replaceWorkspaceFolder(system, profileHost);

    }
    static replaceWorkspaceFolder(system: System | undefined, source: string | undefined): string | undefined {
        if (source === undefined || system === undefined) {
            return undefined;
        }
        return source.replace("${workspaceFolder}", system.getWorkspaceRootPath()!);
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
        json: ProfileJson,
        @inject("System") system?: System) {

        super(json.name, json.profile, json.profileBuild, json.profileHost);

        this.installArg = BuildProfile.getDefaultValue(json.installArg, "");
        this.buildArg = BuildProfile.getDefaultValue(json.buildArg, "");
        this.createArg = BuildProfile.getDefaultValue(json.createArg, "");
        this.createUser = BuildProfile.getDefaultValue(json.createUser, "");
        this.createChannel = BuildProfile.getDefaultValue(json.createChannel, "");
        let conanfilePath = BuildProfile.getDefaultValue(json.conanFile, ".");
        this.conanfilePath = <string>BuildProfile.replaceWorkspaceFolder(system, conanfilePath);
    }
}

@autoInjectable()
export class Workspace extends BuildProfile {
    public readonly conanworkspacePath: string;
    public readonly arg: string;

    constructor(json: WorkspaceJson,
        @inject("System") system?: System) {
        super(json.name, json.profile, json.profileBuild, json.profileHost);
        let conanWs = BuildProfile.getDefaultValue(json.conanWs, ".");
        this.conanworkspacePath = <string>BuildProfile.replaceWorkspaceFolder(system, conanWs);
        this.arg = BuildProfile.getDefaultValue(json.arg, "");
    }
}