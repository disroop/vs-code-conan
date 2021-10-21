
// some other file
import "reflect-metadata";

import { System } from "../system/interface";

export class Profile {
    public readonly profile: string;
    public readonly profileBuild: string;
    public readonly profileHost: string;
    public readonly buildFolder: string;
    public readonly installArg: string;
    public readonly buildArg: string;
    public readonly createArg: string;
    public readonly conanFile: string;
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
        this.profile = profile;
        this.profileBuild = profileBuild;
        this.profileHost = profileHost;
        this.installArg = installArg;
        this.buildArg = buildArg;
        this.createArg = createArg;
        this.createUser = createUser;
        this.createChannel = createChannel;
        this.buildFolder = "build/" + name;

        this.conanFile = conanFile.replace("${workspaceFolder}", system.getWorkspaceRootPath()!);
        if (profile.length > 0) {
            this.profile = profile.replace("${workspaceFolder}", system.getWorkspaceRootPath()!);
        }
        if (profileBuild.length > 0) {
            this.profileBuild = profileBuild.replace("${workspaceFolder}", system.getWorkspaceRootPath()!);
        }
        if (profileHost.length > 0) {
            this.profileHost = profileHost.replace("${workspaceFolder}", system.getWorkspaceRootPath()!);
        }
    }
}