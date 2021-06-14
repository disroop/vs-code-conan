import * as vscode from 'vscode';
import {Configurator} from './configurator/configurator';
import {CommandController} from "./commands/control";
import {CommandView} from "./commands/view";

export const output = vscode.window.createOutputChannel("conan");

export function activate(context: vscode.ExtensionContext) {

    let commandController: CommandController;
    let barItems;
    const rootPath: string | undefined = vscode.workspace.rootPath;
    let watcher: vscode.FileSystemWatcher;
    const settingsFile: string = rootPath+'/.vscode/conan-settings.json';

    function setupConanSettingsFileWatcher() {
        const folder = vscode.workspace.workspaceFolders?.[0];
        if (folder) {
            //Could not use new RelativePath solution
            //https://github.com/disroop/vs-code-conan/issues/4#issuecomment-748337898
            watcher = vscode.workspace.createFileSystemWatcher(settingsFile);
            watcher.onDidChange(onConanSettingChanged);
            watcher.onDidCreate(onConanSettingChanged);
            watcher.onDidDelete(onConanSettingDeleted);
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

    function onConanSettingDeleted() {
        console.log('onConanSettingDeleted');
        if(rootPath) {
            vscode.window.showInformationMessage(
                "Conan settings have been deleted would you like to perform the setup?",
                "Yes","No").then( value => {
                    if (!value) { return; }
                    else if (value === "Yes") {
                        commandController.setState(loadConfigAfterDeletion(rootPath));
                    }
                }
            );
        }
        watcher.dispose();
    }

    if (rootPath) {
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
            vscode.window.showErrorMessage(err);
        }
    }

    function loadConfig(workspaceFolderPath: string) {
        const fs = require('fs');
        let config = new Configurator(settingsFile);
        try {
            if (!fs.existsSync(settingsFile)) {
                config.initSetupFile();
            } else {
                config.readFile();
            }
            return returnConfigInterface(config,workspaceFolderPath);
        } catch {
            throw new Error("Disroop Conan: No valid conan-settings.json file could be found!");
        }
    }

    function loadConfigAfterDeletion(workspaceFolderPath: string) {
        setupConanSettingsFileWatcher();
        return loadConfig(workspaceFolderPath);
    }

    function returnConfigInterface(config:Configurator,workspaceFolderPath:string) {
        return {
            rootPath:       workspaceFolderPath,
            config:         config,
            profiles:       config.getAllEnabledNames(),
            activeProfile:  config.getAllEnabledNames()[0]
        };
    }
}

export function deactivate() {
}
