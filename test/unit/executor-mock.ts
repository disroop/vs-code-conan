import { Queue } from 'queue-typescript';
import { singleton } from "tsyringe";
import { Command } from '../../src/system/executor';



@singleton()
export class ExecutorMock {

    queue: Queue<Command>;
    constructor() {
        this.queue = new Queue<Command>();
    }
    
    processIsStillRunning():boolean {
        return false;
    }

    pushCommand(command: Command){
        this.queue.append(command);
    }
}
