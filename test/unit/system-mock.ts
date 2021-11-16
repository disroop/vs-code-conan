import { singleton } from "tsyringe";
@singleton()
export class SystemPluginMock{
    warningMessage:string | undefined;
    fileContent:string|undefined;
    filePath:string|undefined;
    command:string|undefined;
    sysCallWorking: boolean = false;
    
    setFile( content:string){
        this.fileContent = content;
    }
    
    getWorkspaceRootPath(){
        return 'root-workspace';
    }
    showWarningMessage( message:string){
        this.warningMessage = message;
    }
    readFile( file:string) : string{
        this.filePath = file;
        if(this.fileContent === undefined){
            throw new Error('define file content');
        }
        return this.fileContent;
    }

    createProgressWindow(){

    }
    stopProgressWindow(){
        
    }
    abortSysCall():boolean{
        return true;
    }

    isSysCallWorking():boolean{
        return this.sysCallWorking;
    }

    executeSysCall(command:string){
        this.command = command;
    }
}