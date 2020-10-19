
import { SettingsParser } from "./settings-parser";
import { Profile } from "./profile";
import { Workspace } from "./workspace";
export class Configurator {
    private file : string;
    private profiles: Map<string,Profile>;
    private workspaces: Map<string,Workspace>;

    constructor(file : string) {
        this.file = file;
        this.profiles = new Map<string,Profile>();
        this.workspaces = new Map<string,Workspace>();
    }

    checkUniqueName(names: string[]):boolean{
        return new Set(names).size !== names.length;
    }

    readFile(){
        let fs = require('fs');
        let data = fs.readFileSync(this.file);
        let obj = new SettingsParser(data);
        this.profiles = obj.convert();
        this.workspaces = obj.convertWs();
    }

    getConanFile(name : string): string{
        let conanFile = this.isWorkspace(name) ? this.workspaces.get(name)?.getConanWorkspace() : this.profiles.get(name)?.getConanFile();
        if(!conanFile){
            throw new Error("No profile found"); 
        }
        return conanFile;
    }

    getAllNames():string[]{
        let namesProfiles = Array.from(this.profiles.keys());
        let namesWs = Array.from(this.workspaces.keys());
        namesProfiles = namesProfiles.concat(namesWs);
        if(this.checkUniqueName(namesProfiles)){
            throw new Error("Duplication of names"); 
        }
        return namesProfiles;
    }
    
    getProfile(name : string):string{
        let profile = this.isWorkspace(name) ? this.workspaces.get(name)?.getProfile():this.profiles.get(name)?.getProfile();
        if(!profile) {
            throw new Error("No Profile found"); 
        }
        return profile;
    }

    isWorkspace(name:string):boolean{
        return this.workspaces.has(name);
    }

    getBuildFolder(name : string):string{
        let buildfolder =  this.isWorkspace(name) ? this.workspaces.get(name)?.getBuildFolder() : this.profiles.get(name)?.getBuildFolder();
        if(!buildfolder){
            throw new Error("No build folder found"); 
        }
        return buildfolder;
    }

    getInstallArg(name : string):string{
        let installArg = this.isWorkspace(name) ? this.workspaces.get(name)?.getArguments() : this.profiles.get(name)?.getInstallArguments();
        if(!installArg){
            throw new Error("No installArg found"); 
        }
        return installArg;
    }

    getBuildArg(name : string):string{
        let buildArg = this.profiles.get(name)?.getBuildArguments();
        if(!buildArg){
            throw new Error("No buildArg found"); 
        }
        return buildArg;
    }

    getCreateArg(name : string):string{
        let createArg = this.profiles.get(name)?.getCreateArguments();
        if(!createArg){
            throw new Error("No createArg found"); 
        }
        return createArg;
    }

    getCreateUser(name : string):string{
        let createUser = this.profiles.get(name)?.getCreateUser();
        if(!createUser){
            throw new Error("No createUser found"); 
        }
        return createUser;
    }

    getCreateChannel(name : string):string{
        let createChannel = this.profiles.get(name)?.getCreateChannel();
        if(!createChannel){
            throw new Error("No createChannel found"); 
        }
        return createChannel;
    }
}