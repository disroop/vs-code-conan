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
    let commandController: CommandController;
    let barItems;

    

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Setup Conan Plugin",
    }, async (progress) => {
        progress.report({ message: `Loading Conan config` });
        try{
            const config = await loadConfig();
            return registerUIElements(config);
        }catch(error){
            showcreateTemplateDialog(error);
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
        commandController.registerCreateTemplate(createTemplate);
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
        try {
                commandController.setState(await loadConfig());
            }
            catch (error) {
                vscode.window.showErrorMessage("Not able to load config of conan-settings.json");
                deactivate();
            }
    }

    async function loadConfig() {
        let settingsFile = <string> await vscode.workspace.getConfiguration(`disroopConan`).get('settingsFile');
        settingsFile = system.replaceWorkspaceRootPath(settingsFile)
        container.registerInstance(Configurator, new Configurator(settingsFile));
        container.registerInstance(Generator, new Generator(settingsFile));
        
        if (await system.fileExist(settingsFile)) {
            const config = container.resolve(Configurator);
            await config.update();
            setupConanSettingsFileWatcher();
            let profiles = config.getAllNames();
            let activeProfile = config.getAllNames()[0];
            return { config: config, profiles: profiles, activeProfile: activeProfile };
        } else {
            throw Error(errorSettingsFileNotFound);
        }
    }

    function showcreateTemplateDialog(error: unknown) {
        if (error instanceof Error) {
            if (error.message === errorSettingsFileNotFound) {
                system.showCreateTemplateDialog(error, createTemplate, deactivate);
            }
            else {
                vscode.window.showErrorMessage(error.message);
            }
        }
        else {
            throw Error("Unexpected error");
        }

    }

    async function createTemplate(){
        const config = container.resolve(Configurator);
        if(await system.fileExist(config.file)){
            system.showWarningMessage("Cant create a template settings.json, file already exist");
            
        }else{
            container.resolve(Generator).generateConfigTemplate();
        }
    }
}

export function deactivate() {
}
