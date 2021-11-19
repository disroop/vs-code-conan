import { autoInjectable, container, inject } from 'tsyringe';
import { systemDefaultPlatform } from 'vscode-test/out/util';
import {Configurator, WorkspaceArgument} from '../configurator/configurator';
import { Executor, System } from '../system/system';

@autoInjectable()
export class Commands{
    private config:Configurator;
    private executor:Executor;
    private system:System;
    constructor(){
        this.config=container.resolve(Configurator);
        this.executor = container.resolve("Executor");
        this.system = container.resolve("System");
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
        let workspacePath= this.system.getWorkspaceRootPath();
        let profileCommand = `--profile:build ${profile.build} --profile:host ${profile.host}`; 
        let installFolderArg = `--install-folder ${workspacePath}/${buildFolder}`;
        const stringCommand = `${installCommand} ${profileCommand} ${installArg} ${installFolderArg} ${conanfile}`;
        let command = { executionCommand: stringCommand, description: "installing" };
        this.executor.pushCommand(command);
    }
    
    build(idName: any) {
        let argument = this.config.getConan(idName);
        let conanfile = argument.path;
        let buildFolder = argument.buildFolder;
        let buildArg = argument.buildArguments;
        let workspacePath= this.system.getWorkspaceRootPath();
        let buildFolderArg = `--build-folder ${workspacePath}/${buildFolder}`;
        const stringCommand = `conan build ${buildArg} ${buildFolderArg} ${conanfile}`;
        let command = { executionCommand: stringCommand, description: "building" };
        this.executor.pushCommand(command);
    }

    create(profileToCreate: any) {
        let argument = this.config.getConan(profileToCreate);
        let conanfile = argument.path;
        let profile = argument.installProfile;
        let profileCommand = `--profile:build ${profile.build} --profile:host ${profile.host}`; 
        let createUser = argument.user;
        let createChannel = argument.channel;
        let createArg = argument.createArguments;
        const stringCommand = `conan create ${profileCommand} ${createArg} ${conanfile} ${createUser}/${createChannel}`;
        let command = { executionCommand: stringCommand, description: "creating a package" };
        this.executor.pushCommand(command);
    }
}