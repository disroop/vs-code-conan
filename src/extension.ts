import "reflect-metadata";
import * as vscode from 'vscode';
import { Configurator } from './configurator/configurator';
import { Generator } from './configurator/generator';
import { AppState, CommandController } from "./commands/vscode-control";
import { CommandView } from "./commands/vscode-view";
import { container } from "tsyringe";
import { SystemPlugin } from "./system/plugin";
import { ExecutorNodeJs } from "./system/node";

export function activate(context: vscode.ExtensionContext) {

    const errorSettingsFileNotFound = "Not able to find conan-settings.json file!";
    const system = new SystemPlugin();
    container.registerInstance("System", system);
    container.registerInstance("Executor", new ExecutorNodeJs());
    const rootPath: string = system.getWorkspaceRootPath();
    let commandController: CommandController;
    let barItems;

    

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Setup Conan Plugin",
    }, async (progress) => {
        //setupConanSettingsFileWatcher();
        progress.report({ message: `Loading Conan config` });
        try{
            const config = await loadConfig(rootPath);
            return registerUIElements(config);
        }catch(error){
            createTemplate(error);
        }
    });

    function setupConanSettingsFileWatcher() {
        const folder = vscode.workspace.workspaceFolders?.[0];
        if (folder) {
            //Could not use new RelativePath solution
            //https://github.com/disroop/vs-code-conan/issues/4#issuecomment-748337898
            const settingsFile = container.resolve(Configurator).file;
            let watcher = vscode.workspace.createFileSystemWatcher(settingsFile);
            watcher.onDidChange(onConanSettingChanged);
            watcher.onDidCreate(onConanSettingChanged);
            watcher.onDidDelete(onConanSettingChanged);
        } else {
            throw Error("Unexpected error");
        }

    }

    function registerUIElements(config: AppState) {
        commandController = new CommandController(context, config);
        let installCommand = commandController.registerInstallCommand();
        let buildCommand = commandController.registerBuildCommand();
        let createCommand = commandController.registerCreateCommand();
        let installButton = CommandView.registerInstallButton(installCommand);
        let buildButton = CommandView.registerBuildButton(buildCommand);
        let createButton = CommandView.registerCreateButton(createCommand);
        barItems = { install: installButton, build: buildButton, create: createButton };
        commandController.registerProfilePick(barItems);
    }

    async function onConanSettingChanged() {
        if (rootPath) {
            try {
                commandController.setState(await loadConfig(rootPath));
            }
            catch (error) {
                createTemplate(error);
            }

        }
    }

    async function loadConfig(workspaceFolderPath: string) {
        let settingsFile = <string> await vscode.workspace.getConfiguration(`disroopConan`).get('settingsFile');
        settingsFile = settingsFile.replace(`\${workspaceFolder}`,workspaceFolderPath);
        container.registerInstance(Configurator, new Configurator(settingsFile));
        container.registerInstance(Generator, new Generator(settingsFile));
        
        if (await system.fileExist(settingsFile)) {
            const config = container.resolve(Configurator);
            await config.update();
            setupConanSettingsFileWatcher();
            let profiles = config.getAllNames();
            let activeProfile = config.getAllNames()[0];
            return { rootPath: workspaceFolderPath, config: config, profiles: profiles, activeProfile: activeProfile };
        } else {
            throw Error(errorSettingsFileNotFound);
        }
    }

    function createTemplate(error: unknown) {
        if (error instanceof Error) {
            if (error.message === errorSettingsFileNotFound) {
                vscode.window.showInformationMessage(error.message, ...[`Create template`, `Cancel`]).then(selection => {
                    if(selection === "Create template"){
                        container.resolve(Generator).generateConfigTemplate();
                    }
                    else{
                        //TODO: Exit Plugin
                        console.log(`TODO Goodbye`);
                    }
                });
            }
            else {
                vscode.window.showErrorMessage(error.message);
            }
        }
        else {
            throw Error("Unexpected error");
        }

    }
}

export function deactivate() {
}
