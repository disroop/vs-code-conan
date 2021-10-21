import {Profile, Workspace} from "./profile";
import { container } from "tsyringe";
import { SystemPlugin } from "../system/plugin";

export class SettingsParser {
    private readonly system;
    private isConverted: boolean;
    private rawJasonData: string;
    private profiles: Map<string, Profile> | undefined;
    private workspaces: Map<string, Workspace> | undefined;

    constructor(jsonData: string){
        this.system = container.resolve(SystemPlugin);
        this.rawJasonData = jsonData;
        this.isConverted = false;
        this.profiles = undefined;
    }

    update(){

    }

    getProfiles(): Map<string, Profile> | undefined{
        return this.profiles;
    }

    getWorkspaces(): Map<string, Profile> | undefined{
        return this.profiles;
    }

    static showWarningMessage(message:string){
        const system = container.resolve(SystemPlugin);
        system.showWarningMessage(message);
        
    }
    static convert(jsonData: string): Map<string, Profile> {
        interface ProfileObj {
            name: string;
            conanFile: string;
            profile: string;
            profileBuild: string;
            profileHost: string;
            installArg: string;
            buildArg: string;
            createArg: string;
            createUser: string;
            createChannel: string;
        }

        const jsonObj: { profiles: ProfileObj[] } = JSON.parse(jsonData);


        const profiles = new Map<string, Profile>();
        let counterNonValidSettings = 0;
        if (jsonObj.profiles) {
            jsonObj.profiles.forEach(function (profileJson) {
                if (profileJson.name !== undefined && profileJson.name.length > 0) {
                    if (!profiles.has(profileJson.name)) {
                        profiles.set(profileJson.name, new Profile(
                            profileJson.name,
                            profileJson.conanFile,
                            profileJson.profile,
                            profileJson.profileBuild,
                            profileJson.profileHost,
                            profileJson.installArg,
                            profileJson.buildArg,
                            profileJson.createArg,
                            profileJson.createUser,
                            profileJson.createChannel));
                    } else {
                        SettingsParser.showWarningMessage("Profile with name: " + profileJson.name + " already exist! Use first setting in settings.json.");
  
                    }
                } else {
                    counterNonValidSettings++;
                }
            });
            if (counterNonValidSettings > 0) {
                SettingsParser.showWarningMessage(counterNonValidSettings + " Not valid profiles: Profiles in settings.json with no correct name!");
            }
        }
        return new Map(profiles);
    }

    static convertWs(jsonData: string): Map<string, Workspace> {
        interface WorkspaceObj {
            name: string;
            conanWs: string;
            profile: string;
            profileBuild: string;
            profileHost: string;
            arg: string;
        }

        const jsonObj: { workspace: WorkspaceObj[] } = JSON.parse(jsonData);
        const workspaces = new Map<string, Workspace>();
        let counterNonValidSettings = 0;
        if (jsonObj.workspace) {
            jsonObj.workspace.forEach(function (workspaceJson) {
                if (workspaceJson.name !== undefined && workspaceJson.name.length > 0) {
                    if (!workspaces.has(workspaceJson.name)) {
                        let workspace = new Workspace(
                            workspaceJson.name,
                            workspaceJson.conanWs,
                            workspaceJson.profile,
                            workspaceJson.profileBuild,
                            workspaceJson.profileHost,
                            workspaceJson.arg);
                        workspaces.set(workspaceJson.name, workspace);
                    } else {
                        SettingsParser.showWarningMessage("Workspace with name: " + workspaceJson.name + " already exist! Use first setting in settings.json.");
                    }
                } else {
                    counterNonValidSettings++;
                }
            });
            if (counterNonValidSettings > 0) {
                SettingsParser.showWarningMessage(counterNonValidSettings + " Not valid workspaces: Workspaces in settings.json with no correct name!");
            }
        }
        return new Map(workspaces);
    }
}