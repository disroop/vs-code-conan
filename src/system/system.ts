export interface System {
    getWorkspaceRootPath():string;

    showWarningMessage(message:string):void;

    readFile(filepath:string) : string;

    log(message:string):void;

    focusLog():void;
    
}