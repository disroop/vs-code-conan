/* eslint-disable eqeqeq */
import {SettingsParser} from "./settings-parser";
import {BuildProfile, Profile, Workspace} from "./profile";
import {autoInjectable, container, singleton} from "tsyringe";
import {stripArgument} from "./argument-parser";
import {System} from "../system/system";

interface ConanProfile {
    build: string | undefined;
    host: string | undefined;
}
export interface WorkspaceArgument {
    installFolder: string | undefined;
    path: string;
    installProfile: ConanProfile;
    installArguments: string | undefined;
}
export interface ConanArgument extends WorkspaceArgument {
    buildFolder: string | undefined;
    user: string;
    channel: string;
    createProfile: ConanProfile | undefined;
    buildArguments: string | undefined;
    createArguments: string | undefined;
}

interface ProfileVariant {
    profileGeneric: string | undefined;
    profileSpecific: ConanProfile;
}
interface InstallArgumentsExtracted {
    installArg: string | undefined;
    profile: ProfileVariant;
    installFolder: string | undefined;
}

@singleton()
@autoInjectable()
export class Configurator {
    readonly file: string;
    private profiles: Map<string, Profile> | undefined;
    private workspaces: Map<string, Workspace> | undefined;
    private system:System;

    constructor(file: string) {
        this.file = file;
        this.system=container.resolve("System");
    }

    async update() {
        const data = await (this.system.readFile(this.file)).then(value => {
            return value;
        });
        let parser = new SettingsParser(data);
        this.profiles = parser.getProfiles();
        this.workspaces = parser.getWorkspaces();
    }

    private getConsoleProfile(strippedInstallArg: ProfileVariant, name: string): ConanProfile {
        let installProfile;
        if (strippedInstallArg.profileGeneric === undefined
            && strippedInstallArg.profileSpecific.build === undefined
            && strippedInstallArg.profileSpecific.host === undefined) {
            installProfile = this.getProfiles(name);
        }
        else {
            installProfile = Configurator.convertProfile(strippedInstallArg.profileGeneric, strippedInstallArg.profileSpecific);
        }
        return installProfile;
    }

    private static stripProfilesArg(argument: string): { argument: string, profile: ProfileVariant } {
        let argStripped = stripArgument(argument, "pr:b", "profile:build");
        let installBuildProfile = argStripped.foundValue;
        argStripped = stripArgument(argStripped.stripedArgument, "pr:h", "profile:host");
        let installHostProfile = argStripped.foundValue;
        argStripped = stripArgument(argStripped.stripedArgument, "pr", "profile");
        let profileGeneric = argStripped.foundValue;
        let profile: ProfileVariant = { profileGeneric, profileSpecific: { build: installBuildProfile, host: installHostProfile } };
        return { argument: argStripped.stripedArgument, profile };
    }

    private static stripInstallArg(profile: Profile | Workspace): InstallArgumentsExtracted {
        let installArgRaw;
        if(profile instanceof Profile){
            installArgRaw = profile.installArg;
        }
        else{
            installArgRaw = profile.arg;
        }
        let parsedProfile = Configurator.stripProfilesArg(installArgRaw);
        let installArg = stripArgument(parsedProfile.argument, "if", "install-folder");
        let installFolder = installArg.foundValue;
        let stripedArgument = installArg.stripedArgument;
        return { installArg: stripedArgument, profile: parsedProfile.profile, installFolder };
    }

    private static stripCreateArg(profile: Profile) {
        let parsedProfile = Configurator.stripProfilesArg(profile.createArg);
        return { createArg: parsedProfile.argument, profile: parsedProfile.profile };
    }

    private static stripBuildArg(profile: Profile) {
        let buildArg = stripArgument(profile.buildArg, "bf", "build-folder");
        return { buildArg: buildArg.stripedArgument, buildFolder: buildArg.foundValue };
    }

    private static appendKeysOfMap(array: Array<string>, map: Map<string, Profile | Workspace> | undefined): Array<string> {
        if (map) {
            array = array.concat(Array.from(map.keys()));
        }
        return array;
    }

    private static checkUniqueName(names: string[]): boolean {
        return new Set(names).size !== names.length;
    }

    private static convertProfile(profileGeneric: string | undefined, profileSpecific: ConanProfile) {
        if (profileGeneric && (profileSpecific.build || profileSpecific.host)) {
            throw new Error("Can't define profile with profile-host or profile-build.");
        }
        if (profileSpecific.build || profileSpecific.host) {
            let profileBuild = Configurator.replaceUndefinedDefault(profileSpecific.build);
            let profileHost = Configurator.replaceUndefinedDefault(profileSpecific.host);
            return { build: profileBuild, host: profileHost };
        }
        else {
            let profile = Configurator.replaceUndefinedDefault(profileGeneric);
            return { build: profile, host: profile };
        }
    }
    private getProfiles(name: string): ConanProfile {
        let profileConfig: BuildProfile = this.getProfileConfiguration(name);
        return Configurator.convertProfile(profileConfig.profile, { build: profileConfig.profileBuild, host: profileConfig.profileHost });
    }

    private getBuildFolder(name: string): string | undefined {
        let profileConfig: BuildProfile = this.getProfileConfiguration(name);
        return profileConfig.buildFolder;
    }

    private getProfileConfiguration(name: string) {
        let profileConfig:BuildProfile;
        if (this.profiles?.has(name)) {
            profileConfig = <BuildProfile>this.profiles.get(name);
        }
        else if (this.workspaces?.has(name)) {
            profileConfig = <BuildProfile>this.workspaces.get(name);
        }
        else {
            throw new Error("The profile configuration does not exist - " + name);
        }
        return profileConfig;
    }

    private static replaceUndefinedDefault(value: string | undefined): string {
        if (value === undefined) {
            return "default";
        }
        return value;
    }

    getWorkspace(name: string):WorkspaceArgument{
        let workspace = this.workspaces?.get(name);
        if (workspace) {
            let strippedInstallArgument = Configurator.stripInstallArg(workspace);
            let instProfile = this.getConsoleProfile(strippedInstallArgument.profile, name);
            let installFolder = strippedInstallArgument.installFolder ? strippedInstallArgument.installFolder : this.getBuildFolder(name);
            return {
                path: workspace.conanworkspacePath,
                installProfile: instProfile,
                installArguments: strippedInstallArgument.installArg,
                installFolder: installFolder
            };
        }
        throw Error("No workspace found with this name "+name+".");

    }
    getConan(name: string): ConanArgument {
        let profile = this.profiles?.get(name);
        if (profile) {
            let strippedInstallArg = Configurator.stripInstallArg(profile);
            let installProfile = this.getConsoleProfile(strippedInstallArg.profile, name);
            let strippedBuildArg = Configurator.stripBuildArg(profile);
            let strippedCreateArg = Configurator.stripCreateArg(profile);
            let createProfile = this.getConsoleProfile(strippedCreateArg.profile, name);
            let buildFolder = strippedBuildArg.buildFolder ? strippedBuildArg.buildFolder : this.getBuildFolder(name);
            let installFolder = strippedInstallArg.installFolder ? strippedInstallArg.installFolder : this.getBuildFolder(name);
            return {
                path: profile.conanfilePath,
                user: profile.createUser,
                channel: profile.createChannel,
                installProfile: installProfile,
                installArguments: strippedInstallArg.installArg,
                createArguments: strippedCreateArg.createArg,
                buildArguments: strippedBuildArg.buildArg,
                buildFolder: buildFolder,
                createProfile: createProfile,
                installFolder: installFolder
            };
        }
        throw Error("No profile found with this name "+name+".");

    }

    getAllNames(): string[] {
        let names: Array<string> = new Array<string>();
        names = Configurator.appendKeysOfMap(names, this.profiles);
        names = Configurator.appendKeysOfMap(names, this.workspaces);
        if (Configurator.checkUniqueName(names)) {
            throw new Error("Duplication of names in profile and workspace");
        }
        return names;
    }

    isWorkspace(name: string): boolean {
        if (this.workspaces){
            return this.workspaces.has(name);
        }
        return false;
    }
}
