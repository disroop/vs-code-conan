
// some other file
import "reflect-metadata";
import { autoInjectable, container } from "tsyringe";
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
    private readonly system:System;
    constructor(name: string,
        profile: string | undefined,
        profileBuild: string | undefined,
        profileHost: string | undefined) {

        this.system=container.resolve("System");
        this.buildFolder = "build/" + name;

        this.profile = this.replaceWorkspaceFolder(profile);
        this.profileBuild = this.replaceWorkspaceFolder(profileBuild);
        this.profileHost = this.replaceWorkspaceFolder(profileHost);

    }
    replaceWorkspaceFolder(source: string | undefined): string | undefined {
        if (source === undefined) {
            return undefined;
        }
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
        this.conanfilePath = <string>this.replaceWorkspaceFolder(conanfilePath);
    }
}

@autoInjectable()
export class Workspace extends BuildProfile {
    public readonly conanworkspacePath: string;
    public readonly arg: string;

    constructor(json: WorkspaceJson) {
        super(json.name, json.profile, json.profileBuild, json.profileHost);
        let conanWs = BuildProfile.getDefaultValue(json.conanWs, ".");
        this.conanworkspacePath = <string>this.replaceWorkspaceFolder(conanWs);
        this.arg = BuildProfile.getDefaultValue(json.arg, "");
    }
}