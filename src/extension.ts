import "reflect-metadata";
import * as vscode from 'vscode';
import {Configurator} from './configurator/configurator';
import {CommandController} from "./commands/vscode-control";
import {CommandView} from "./commands/vscode-view";
import { container } from "tsyringe";
import { SystemPlugin } from "./system/plugin";
import { ExecutorNodeJs } from "./system/node";

export function activate(context: vscode.ExtensionContext) {

    const system = new SystemPlugin();
    container.registerInstance("System",system);
    container.registerInstance("Executor", new ExecutorNodeJs());
    const rootPath: string = system.getWorkspaceRootPath();
    const settingsFile: string = rootPath+'/.vscode/conan-settings.json';
    const config = new Configurator(settingsFile);
    container.registerInstance(Configurator,config);

    let commandController: CommandController;
    let barItems;

    try {
        setupConanSettingsFileWatcher();
        let state = loadConfig(rootPath);
        commandController = new CommandController(context, state);
        let installCommand = commandController.registerInstallCommand();
        let buildCommand = commandController.registerBuildCommand();
        let createCommand = commandController.registerCreateCommand();
        let installButton = CommandView.registerInstallButton(installCommand);
        let buildButton = CommandView.registerBuildButton(buildCommand);
        let createButton = CommandView.registerCreateButton(createCommand);
        barItems = {install: installButton, build: buildButton, create: createButton};
        commandController.registerProfilePick(barItems);
    } catch (err) {
        let errormessage = "Error in Setup Plugin";
        if(err instanceof Error) {
            errormessage = (err as Error).message;
        }
        vscode.window.showErrorMessage(errormessage);
    }

    function setupConanSettingsFileWatcher() {
        const folder = vscode.workspace.workspaceFolders?.[0];
        if (folder) {
            //Could not use new RelativePath solution
            //https://github.com/disroop/vs-code-conan/issues/4#issuecomment-748337898
            let watcher = vscode.workspace.createFileSystemWatcher(settingsFile);
            watcher.onDidChange(onConanSettingChanged);
            watcher.onDidCreate(onConanSettingChanged);
            watcher.onDidDelete(onConanSettingChanged);
        } else {
            throw new Error("Unexpected error");
        }

    }

    function onConanSettingChanged() {
        console.log('onConanSettingChanged');
        if(rootPath) {
            commandController.setState(loadConfig(rootPath));
        }
    }

    function loadConfig(workspaceFolderPath: string) {
        const fs = require('fs');
        if (fs.existsSync(settingsFile)) {
            config.update();
            let profiles = config.getAllNames();
            let activeProfile = config.getAllNames()[0];
            return {rootPath: workspaceFolderPath, config: config, profiles: profiles, activeProfile: activeProfile};
        } else {
            throw new Error("Disroop Conan: No valid conan-settings.json file could be found!");
        }
    }
}

export function deactivate() {
}
