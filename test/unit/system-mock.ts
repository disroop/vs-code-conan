import { singleton } from "tsyringe";
@singleton()
export class SystemPluginMock{
    warningMessage:string | undefined;
    fileContent:string|undefined;
    filePath:string|undefined;
    
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
}