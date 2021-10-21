
// some other file
import "reflect-metadata";

import { System } from "../system/interface";

class BuilProfile {
    public readonly system: System;
    public readonly profile: string | undefined;
    public readonly profileHost: string | undefined;
    public readonly profileBuild: string | undefined;
    public readonly buildFolder: string | undefined;

    constructor(system: System,
        name: string,
        profile: string,
        profileBuild: string,
        profileHost: string) {

        this.system = system;
        this.profile = profile;
        this.profileBuild = profileBuild;
        this.profileHost = profileHost;
        this.buildFolder = "build/" + name;

        this.profile = this.replaceWorkspaceFolder(profile);
        this.profileBuild = this.replaceWorkspaceFolder(profileBuild);
        this.profileHost = this.replaceWorkspaceFolder(profileHost);

    }
    protected replaceWorkspaceFolder(source: string) : string
    {
        if(source.length > 0){
            return source.replace("${workspaceFolder}", this.system.getWorkspaceRootPath()!);
        }
        return "";
    }
}
export class Profile extends BuilProfile {
    public readonly conanfilePath: string;
    public readonly installArg: string;
    public readonly buildArg: string;
    public readonly createArg: string;
    public readonly createUser: string;
    public readonly createChannel: string;


    constructor(system: System,
        name: string = "default",
        conanFile: string = ".",
        profile: string = "",
        profileBuild: string = "",
        profileHost: string = "",
        installArg: string = "",
        buildArg: string = "",
        createArg: string = "",
        createUser: string = "",
        createChannel: string = "") {
        super(system,name,profile,profileBuild,profileHost);

        this.installArg = installArg;
        this.buildArg = buildArg;
        this.createArg = createArg;
        this.createUser = createUser;
        this.createChannel = createChannel;
        this.conanfilePath = this.replaceWorkspaceFolder(conanFile);
    }
}
export class Workspace extends BuilProfile {
    public readonly conanworkspacePath: string;
    public readonly arg: string;

    constructor(system: System,
        name: string = "default",
        conanWs: string = ".",
        profile: string = "",
        profileBuild: string = "",
        profileHost: string = "",
        arg: string = "") {
        
        super(system,name,profile,profileBuild,profileHost);
        
        this.conanworkspacePath = this.replaceWorkspaceFolder(conanWs);

        this.arg = arg;
    }
}