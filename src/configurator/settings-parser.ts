import {BuildProfile, ConanProfile, Profile, ProfileJson,Workspace, WorkspaceJson} from "./profile";

import { System } from "../system/system";
import { autoInjectable, container } from "tsyringe";

@autoInjectable()
export class SettingsParser {
    private profiles: Map<string, Profile> | undefined;
    private workspaces: Map<string, Workspace> | undefined;
    private system:System|undefined;
    constructor(jsonData: string){
        this.system=container.resolve("System");
        this.update(jsonData);
        
    }

    update(jsonData:string){
        this.profiles = this.parseProfile(jsonData);
        this.workspaces = this.parseWorkspace(jsonData);
    }

    private isParameterCorrectlyDefined(parameter: string):boolean {
        if(parameter.length>0){
            return true;
        }
        return false;
    }

    private isParameterNameAlreadyDefined(name: string, container: Map<string, BuildProfile>):boolean {
        if(container.has(name)){
            return false;
        }
        return true;
    }

    private checkProfile(profile:ConanProfile, profiles : Map<string, BuildProfile> ) : boolean{
        if(!this.isParameterCorrectlyDefined(profile.name)){
            this.showWarningMessage("Profile name has to be defined!, This Profile will be skipped!");
            return false;
        }
        if(!this.isParameterNameAlreadyDefined(profile.name,profiles)){
            this.showWarningMessage("Profile with name: " + profile.name + " already exist! Use first setting in settings.json.");
            return false;
        }
        return true;
    }
    
    private parseProfile(rawJson: string):Map<string, Profile>|undefined{
        const jsonObj: { profiles: ProfileJson[] } = JSON.parse(rawJson);
        if(!jsonObj.profiles){
            // Habs jetzt nicht im Detail angeschaut, aber ist das so eine art ein silent-fallback
            // wenn was in der Konfiguration (das "profiles") vergessen wurde? Falls ja: finde
            // ich nicht so schön, wenn es solches zeugs stillschweigend akzeptiert ohne user-feedback.
            return this.profiles;
        }
        let profiles = new Map<string, Profile>();
        for (let profile of jsonObj.profiles){
            if(this.checkProfile(profile,profiles)){
                profiles.set(profile.name,new Profile(profile));
            }
        }
        return profiles;
    }

    private parseWorkspace(rawJson: string):Map<string, Workspace> | undefined{
        const jsonObj: { workspace: WorkspaceJson[] } = JSON.parse(rawJson);
        if(!jsonObj.workspace){
            // Siehe oben.
            return this.workspaces;
        }
        let workspaces = new Map<string, Workspace>();
        for (let workspace of jsonObj.workspace){
            if(this.checkProfile(workspace,workspaces)){
                workspaces.set(workspace.name,new Workspace(workspace));
            }
        }
        return workspaces;
    }


    getProfiles(): Map<string, Profile> | undefined{
        return this.profiles;
    }

    getWorkspaces(): Map<string, Workspace> | undefined{
        return this.workspaces;
    }

    private showWarningMessage(message:string){
        if(this.system){
            this.system.showWarningMessage(message);
        }
        else{
            throw Error("System is not defined");
        }
    }
}
