import {BuildProfile, ConanProfile, Profile, ProfileJson,Workspace, WorkspaceJson} from "./profile";
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
        this.profiles = this.convertArrays<ProfileJson,Profile>(jsonData,Profile);
        this.workspaces = this.convertArrays<WorkspaceJson,Workspace>(jsonData,Workspace);
    }

    private isParameterCorrectlyDefined(parameter: string):Boolean {
        if(parameter.length>0){
            return true;
        }
        return false;
    }

    private isParameterNameAlreadyDefined(name: string, container: Map<string, BuildProfile>):Boolean {
        if(container.has(name)){
            return false;
        }
        return true;
    }

    private convertArrays<JsonType extends ConanProfile, Type extends BuildProfile>(rawJson:string, type: { new(json:ConanProfile): Type;} ) : Map<string, Type>{
        const jsonObj: { profiles: JsonType[] } = JSON.parse(rawJson);

        let profiles = new Map<string, Type>();
        for (let profile of jsonObj.profiles){
            if(!this.isParameterCorrectlyDefined(profile.name)){
                SettingsParser.showWarningMessage("Profile name has to be defined!, This Profile will be skipped!");
                continue;
            }
            if(!this.isParameterNameAlreadyDefined(profile.name,profiles)){
                SettingsParser.showWarningMessage("Profile with name: " + profile.name + " already exist! Use first setting in settings.json.");
                continue;
            }
            
            profiles.set(profile.name,new type(profile));
        }
        return profiles;
    }


    getProfiles(): Map<string, Profile> | undefined{
        return this.profiles;
    }

    getWorkspaces(): Map<string, Workspace> | undefined{
        return this.workspaces;
    }

    static showWarningMessage(message:string){
        const system = container.resolve(SystemPlugin);
        system.showWarningMessage(message);
        
    }
}
