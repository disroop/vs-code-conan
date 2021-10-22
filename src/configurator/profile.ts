
// some other file
import "reflect-metadata";
import { container, injectable } from "tsyringe";

import { SystemPlugin } from "../system/plugin";

export interface ProfileJson {
    name: string;
    conanFile?: string;
    profile?: string;
    profileBuild?: string;
    profileHost?: string;
    installArg?: string;
    buildArg?: string;
    createArg?: string;
    createUser?: string;
    createChannel?: string;
}
@injectable()
class BuilProfile {
    public readonly profile: string | undefined;
    public readonly profileHost: string | undefined;
    public readonly profileBuild: string | undefined;
    public readonly buildFolder: string | undefined;

    constructor( name: string,
        profile: string,
        profileBuild: string,
        profileHost: string) {

        this.profile = profile;
        this.profileBuild = profileBuild;
        this.profileHost = profileHost;
        this.buildFolder = "build/" + name;

        this.profile = BuilProfile.replaceWorkspaceFolder(profile);
        this.profileBuild = BuilProfile.replaceWorkspaceFolder(profileBuild);
        this.profileHost = BuilProfile.replaceWorkspaceFolder(profileHost);

    }
    static replaceWorkspaceFolder(source: string) : string
    {
        const system = container.resolve(SystemPlugin);
        if(source.length > 0){
            return source.replace("${workspaceFolder}", system.getWorkspaceRootPath()!);
        }
        return "";
    }
    static getDefaultValue(value:string|undefined, defaultValue:string):string{
        if(value===undefined){
            return defaultValue;
        }
        return value;
    }
}
export class Profile extends BuilProfile {
    public readonly conanfilePath: string;
    public readonly installArg: string;
    public readonly buildArg: string;
    public readonly createArg: string;
    public readonly createUser: string;
    public readonly createChannel: string;


    constructor(
        json: ProfileJson) {
        
        let profile = BuilProfile.getDefaultValue(json.profile,"default");
        let profileHost = BuilProfile.getDefaultValue(json.profileHost,"default");
        let profileBuild = BuilProfile.getDefaultValue(json.profileBuild,"default");
        let conanfilePath = BuilProfile.getDefaultValue(json.conanFile,".");
        
        super(json.name, profile, profileBuild, profileHost);

        this.installArg = BuilProfile.getDefaultValue(json.installArg,"");
        this.buildArg = BuilProfile.getDefaultValue(json.buildArg,"");
        this.createArg = BuilProfile.getDefaultValue(json.createArg,"");
        this.createUser = BuilProfile.getDefaultValue(json.createUser,"");
        this.createChannel = BuilProfile.getDefaultValue(json.createChannel,"");
        this.conanfilePath = BuilProfile.replaceWorkspaceFolder(conanfilePath);
    }
}
export class Workspace extends BuilProfile {
    public readonly conanworkspacePath: string;
    public readonly arg: string;

    constructor(name: string = "default",
        conanWs: string = ".",
        profile: string = "",
        profileBuild: string = "",
        profileHost: string = "",
        arg: string = "") {
        
        super(name,profile,profileBuild,profileHost);
        
        this.conanworkspacePath = BuilProfile.replaceWorkspaceFolder(conanWs);

        this.arg = arg;
    }
}