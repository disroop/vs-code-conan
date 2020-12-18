import * as vscode from 'vscode';
import {Configurator} from './configurator/configurator';
import {CommandController} from "./commands/control";
import {CommandView} from "./commands/view";

export function activate(context: vscode.ExtensionContext) {

    let commandController: CommandController;
    let barItems;
    const rootPath: string | undefined = vscode.workspace.rootPath;

    function setupConanSettingsFileWatcher() {
        const folder = vscode.workspace.workspaceFolders?.[0];
        if (folder) {
            //Could not use new RelativePath solution
            //https://github.com/disroop/vs-code-conan/issues/4#issuecomment-748337898
            let watcher = vscode.workspace.createFileSystemWatcher('**/conan-settings.json');
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
        let settingsFile = workspaceFolderPath + '/.vscode/conan-settings.json';
        const fs = require('fs');
        if (fs.existsSync(settingsFile)) {
            let config = new Configurator(settingsFile);
            config.readFile();
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
