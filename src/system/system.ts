export interface System {
    getWorkspaceRootPath():string;

    showWarningMessage(message:string):void;

    readFile(filepath:string) : string;

    log(message:string):void;

    focusLog():void;
    
}

export interface Command{
    executionCommand: string;
    description: string;
}

export interface Executor {

    processIsStillRunning():boolean ;

    pushCommand(command: Command):void;
}