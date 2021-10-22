import {Profile, ProfileJson,Workspace} from "./profile";
import { container } from "tsyringe";
import { SystemPlugin } from "../system/plugin";
import { workspace } from "vscode";

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
        this.update(jsonData);
    }

    update(jsonData:string){
        this.profiles = this.convertProfile(jsonData);
    }

    private isParameterCorrectlyDefined(parameter: string):Boolean {
        if(parameter.length>0){
            return true;
        }
        return false;
    }

    private isParameterNameAlreadyDefined(name: string, container: Map<string, Profile | Workspace>):Boolean {
        if(container.has(name)){
            return false;
        }
        return true;
    }

    private convertProfile(rawJson:string) : Map<string, Profile>{
        const jsonObj: { profiles: ProfileJson[] } = JSON.parse(rawJson);

        let profiles = new Map<string, Profile>();
        for (let profile of jsonObj.profiles){
            if(!this.isParameterCorrectlyDefined(profile.name)){
                SettingsParser.showWarningMessage("Profile name has to be defined!, This Profile will be skipped!");
                continue;
            }
            if(!this.isParameterNameAlreadyDefined(profile.name,profiles)){
                SettingsParser.showWarningMessage("Profile with name: " + profile.name + " already exist! Use first setting in settings.json.");
                continue;
            }
            profiles.set(profile.name,new Profile(profile));
        }
        return profiles;
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
