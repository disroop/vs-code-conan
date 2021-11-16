import { container } from 'tsyringe';
import {Configurator, WorkspaceArgument} from '../configurator/configurator';
import { SystemPlugin } from '../system/plugin';

export class Commands{
    private config:Configurator;
    private sysCall:SysCallQueue;

    constructor(settingsFile:string){
        this.config = new Configurator(settingsFile);
        this.config.updateProfiles();
        this.sysCall = new SysCallQueue();
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
        let command = { executionCommand: stringCommand, info: "installing" };
        this.sysCall.pushCommand(command);
    }
    
}

//SysCallQueue
interface Command{
    executionCommand: string;
    info: string;
}

class SysCallQueue{
    sysCallQueue: Command[];
    private system: SystemPlugin;
    
    constructor(){
        this.system = container.resolve(SystemPlugin);
        this.sysCallQueue = [];
    }

    private pop(): Command | undefined {
      return this.sysCallQueue.shift();
    }

    pushCommand(command:Command){
        this.sysCallQueue.push(command);
        this.dequeueAndExecute();
    }

    clearQueue(){
        this.system.stopProgressWindow();
        this.system.abortSysCall();
        this.sysCallQueue = [];
    }

    private dequeueAndExecute(){
        if(!this.system.isSysCallWorking())
        {
            let command = this.sysCallQueue.pop();
            if(command){
                //Create Async Command
                this.system.createProgressWindow(command.info);
                this.system.executeSysCall(command.executionCommand);
                //WAIT TILL ASYNC Is finished
                this.system.stopProgressWindow();
                this.dequeueAndExecute();
            }
        }
    }
}