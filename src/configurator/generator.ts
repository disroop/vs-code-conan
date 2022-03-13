import path = require("path");
import { autoInjectable, container, singleton } from "tsyringe";
import { URI } from "vscode-uri";
import { Commands } from "../commands/commands";
import { System } from "../system/system";
import { ProfileJson } from "./profile";
import { Utility } from "../utility";
@singleton()
@autoInjectable()
export class Generator {
    private readonly system: System;
    private readonly commands: Commands;
    private readonly utility: Utility;
    private configFile: string;

    constructor(outputFile: string) {
        this.system = container.resolve("System");
        this.commands = container.resolve(Commands);
        this.utility = container.resolve(Utility);
        this.configFile = outputFile;
    }

    async generateConfigTemplate() {
        let conanfilesPython = await this.system.findAllFilesInWorkspace("conanfile.py");
        let conanfilesText = await this.system.findAllFilesInWorkspace("conanfile.txt");
        let profilesList = this.commands.getAllProfiles();
        interface Config {
            profiles: ProfileJson[];
        }
        var config: Config = {} as Config;
        config.profiles = [];
        for (const profile of profilesList) {
            for (const conanfile of conanfilesPython) {
                let object: ProfileJson = this.createProfileJsonTemplate(profile, conanfile);
                config.profiles.push(object);
            }
            for (const conanfile of conanfilesText) {
                let object: ProfileJson = this.createProfileJsonTemplate(profile, conanfile);
                config.profiles.push(object);
            }
        }
        this.system.writeFile(this.configFile, JSON.stringify(config, null, 4));
    }

    private createProfileJsonTemplate(profile: string, conanfile: URI): ProfileJson {
        var parentDirectory = path.basename(path.dirname(conanfile.path));

        if (parentDirectory === "") {
            parentDirectory = "root";
        }
        var name = parentDirectory;
        if (conanfile.path.endsWith("txt")) {
            name += `-txt`;
        }
        if (profile !== "default") {
            name += `-${profile}`;
        }

        let conanfilePath = this.system.getRelativePathToWorkspace(conanfile.path);
        return {
            name: name,
            conanFile: conanfilePath,
            profile: profile,
            installArg: "",
            buildArg: "",
            createUser: "disroop",
            createChannel: "development",
            createArg: ""
        };
    }
}
