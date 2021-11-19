import { singleton } from "tsyringe";
import { System } from "../../src/system/system";

@singleton()
export class SystemPluginMock implements System{

    warningMessage:string | undefined;
    fileContent:string|undefined;
    filePath:string|undefined;
    sysCallWorking: boolean = false;
    
    constructor(){
    }

    setFile( content:string){
        this.fileContent = content;
    }
    
    getWorkspaceRootPath():string {
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

    log(_message:string){
    }

    focusLog(){
    }
}