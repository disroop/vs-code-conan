import { URI } from "vscode-uri";

export interface System {
    getWorkspaceRootPath():string;

    showWarningMessage(message:string):void;

    readFile(filepath: string): Promise<string>;

    writeFile(filepath: string, content: string): void;

    log(message:string):void;

    focusLog():void;

    findAllFilesInWorkspace(filename:string): Promise<URI[]>;
    
}

export interface Command{
    executionCommand: string;
    description: string;
}

export interface Executor {

    processIsStillRunning():boolean ;

    pushCommand(command: Command):void;

    executeShortCommand(command: string): string;
}