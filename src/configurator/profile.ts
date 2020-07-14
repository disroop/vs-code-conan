export class Profile {
    private profile : string;
    private buildFolder: string;
    private installArg : string;
    private buildArg : string;
    private createArg : string;

    constructor(name : string = "default", 
                profile : string = "",
                installArg : string = "", 
                buildArg : string = "",
                createArg : string = "") {
        this.profile = profile;
        this.installArg = installArg;
        this.buildArg = buildArg;
        this.createArg = createArg;
        var buildFolder = "build/"+name;
        this.buildFolder = buildFolder;
    }

    getProfile():string{
        return this.profile;
    }

    getBuildFolder():string{
        return this.buildFolder;
    }
    
    getInstallArguments():string{
        return this.installArg;
    }

    getBuildArguments():string{
        return this.buildArg;
    }

    getCreateArguments():string{
        return this.createArg;
    }
}