import { singleton } from "tsyringe";
import { URI } from "vscode-uri";
import { System } from "../../src/system/system";

@singleton()
export class SystemPluginFake implements System{

    warningMessage:string | undefined;
    fileContent:string|undefined;
    filePath:string|undefined;
    sysCallWorking: boolean = false;
    writeFileContent: string | undefined;
    writeFilePath: string | undefined;

    setFile( content:string){
        this.fileContent = content;
    }
    
    getWorkspaceRootPath():string {
        return '/root-workspace';
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

    findAllFilesInWorkspace(filename:string): Promise<URI[]>{
        var rootWorkspace = this.getWorkspaceRootPath();
        return new Promise<URI[]>((res,rej) => {
            if(filename !== undefined) { 
                let uri = URI.file(`${rootWorkspace}/${filename}`);
                res([uri]);
            }else{
                rej("{}");
            }
        });
    }

    writeFile(filepath: string, content: string): void{
        this.writeFileContent = content;
        this.writeFilePath = filepath;
    }

    showCreateTemplateDialog(_error:Error, _generateTemplate: ()=>any, _cancelfunction: ()=>any){

    }

}