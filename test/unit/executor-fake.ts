import { Queue } from 'queue-typescript';
import { singleton } from "tsyringe";
import { Command,Executor } from '../../src/system/system';



@singleton()
export class ExecutorFake implements Executor {

    queue: Queue<Command>;
    command:string|undefined;
    constructor() {
        this.queue = new Queue<Command>();
    }
    
    processIsStillRunning():boolean {
        return false;
    }

    pushCommand(command: Command){
        this.command=command.executionCommand;
        this.queue.append(command);
    }

    executeShortCommand(command: string):string{
        if(command === "conan profile list"){
            return "default\ngcc";
        }
        return command;
    }
}
