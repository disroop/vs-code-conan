import { singleton } from "tsyringe";
@singleton()
export class SystemPluginMock{
    warningMessage:string | undefined;
    
    getWorkspaceRootPath(){
        return 'root-workspace';
    }
    showWarningMessage( message:string){
        this.warningMessage = message;
    }
}