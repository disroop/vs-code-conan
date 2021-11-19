import { autoInjectable, container, inject } from 'tsyringe';
import {Configurator, WorkspaceArgument} from '../configurator/configurator';
import { Executor } from '../system/system';

@autoInjectable()
export class Commands{
    private config:Configurator;
    private executor:Executor;
    constructor(settingsFile:string,
        @inject("Executor") executor?:Executor){
        this.config = new Configurator(settingsFile);
        this.config.updateProfiles();
        if(executor){
            this.executor = executor;
        }
        else{
            throw Error("executor has to be defined!");
        }
    }
    install(idName:string){
        let installCommand = this.config.isWorkspace(idName) ? "conan workspace install" : "conan install";
        let argument : WorkspaceArgument;
        if(this.config.isWorkspace(idName)){
            argument = this.config.getWorkspace(idName);
        }
        else{
            argument = this.config.getConan(idName);
        }
        let conanfile = argument.path;
        let buildFolder = argument.installFolder;
        let installArg = argument.installArguments;
        let profile = argument.installProfile;
        let profileCommand = `--profile:build ${profile.build} --profile:host ${profile.host}`; 
        let installFolderArg = `--install-folder ${buildFolder}`;
        const stringCommand = `${installCommand} ${profileCommand} ${installArg} ${installFolderArg} ${conanfile}`;
        let command = { executionCommand: stringCommand, description: "installing" };
        this.executor.pushCommand(command);
    }
    
}