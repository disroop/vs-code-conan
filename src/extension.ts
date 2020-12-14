import * as vscode from 'vscode';
import {Configurator} from './configurator/configurator';
import {CommandController} from "./commands/control";
import {CommandView} from "./commands/view";

export function activate(context: vscode.ExtensionContext) {

    let commandController: CommandController;
    let barItems;
    const rootPath: string | undefined = vscode.workspace.rootPath;

    function setupConanSettingsFileWatcher() {
        const uri = vscode.window.activeTextEditor!.document.uri;
        let watcher = vscode.workspace.createFileSystemWatcher(
            new vscode.RelativePattern(
                vscode.workspace.getWorkspaceFolder(uri)!,
                '.vscode/conan-settings.json'
            ),
            false,
            false,
            false
        );

        watcher.onDidChange(onConanSettingChanged);
        watcher.onDidCreate(onConanSettingChanged);
    }

    function onConanSettingChanged() {
        console.log('onConanSettingChanged');
        commandController.setState(loadConfig(rootPath));
    }

    if (rootPath) {
        try {
            setupConanSettingsFileWatcher();
            let state = loadConfig(rootPath);
            commandController = new CommandController(context, state);
            commandController.state = state;
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
