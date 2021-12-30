import { singleton } from "tsyringe";
import { System } from "../../src/system/system";

@singleton()
export class SystemPluginFake implements System{

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
    readFile( file:string) : Promise<string> {
        this.filePath = file;
        return new Promise<string>((res,rej) => {
            if(this.fileContent !== undefined) { 
                res(this.fileContent);
            }else{
                rej("{}");
            }
        });
    }

    log(_message:string){
    }

    focusLog(){
    }
}