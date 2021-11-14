
// some other file
import "reflect-metadata";
import { container, injectable } from "tsyringe";

import { SystemPlugin } from "../system/plugin";

export interface ConanProfile{
    name: string;
    profile?: string;
    profileBuild?: string;
    profileHost?: string;
}
export interface ProfileJson extends ConanProfile{
    conanFile?: string;
    installArg?: string;
    buildArg?: string;
    createArg?: string;
    createUser?: string;
    createChannel?: string;
}

export interface WorkspaceJson extends ConanProfile{
    conanWs?: string;
    arg?: string;
}

@injectable()
export class BuildProfile {
    public readonly profile: string | undefined;
    public readonly profileHost: string | undefined;
    public readonly profileBuild: string | undefined;
    public readonly buildFolder: string | undefined;

    constructor( name: string,
        profile: string | undefined,
        profileBuild: string | undefined,
        profileHost: string | undefined) {

        this.buildFolder = "build/" + name;

        this.profile = BuildProfile.replaceWorkspaceFolder(profile);
        this.profileBuild = BuildProfile.replaceWorkspaceFolder(profileBuild);
        this.profileHost = BuildProfile.replaceWorkspaceFolder(profileHost);

    }
    static replaceWorkspaceFolder(source: string|undefined) : string|undefined
    {
        if(source === undefined){
            return undefined;
        }
        const system = container.resolve(SystemPlugin);
        return source.replace("${workspaceFolder}", system.getWorkspaceRootPath()!);
    }
    static getDefaultValue(value:string|undefined, defaultValue:string):string{
        if(value===undefined){
            return defaultValue;
        }
        return value;
    }
}
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

        this.installArg = BuildProfile.getDefaultValue(json.installArg,"");
        this.buildArg = BuildProfile.getDefaultValue(json.buildArg,"");
        this.createArg = BuildProfile.getDefaultValue(json.createArg,"");
        this.createUser = BuildProfile.getDefaultValue(json.createUser,"");
        this.createChannel = BuildProfile.getDefaultValue(json.createChannel,"");
        let conanfilePath = BuildProfile.getDefaultValue(json.conanFile,".");
        this.conanfilePath = <string>BuildProfile.replaceWorkspaceFolder(conanfilePath);
    }
}


export class Workspace extends BuildProfile {
    public readonly conanworkspacePath: string;
    public readonly arg: string;

    constructor(json:WorkspaceJson) {
        super(json.name,json.profile,json.profileBuild,json.profileHost);
        let conanWs = BuildProfile.getDefaultValue(json.conanWs,".");
        this.conanworkspacePath = <string>BuildProfile.replaceWorkspaceFolder(conanWs);
        this.arg = BuildProfile.getDefaultValue(json.arg,"");
    }
}