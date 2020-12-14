// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { stat } from 'fs';
import * as vscode from 'vscode';
import { Configurator } from './configurator/configurator';
import { Executor } from './executor/executor';
import { AppState } from "./commands/control";
import { CommandController } from "./commands/control";
import { CommandView } from "./commands/view";



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	var commandController;
	var rootPath = vscode.workspace.rootPath;
	if (rootPath) {
		try {
			let state = loadconfig(rootPath);
			commandController = new CommandController(context,state);
			let installCommand = commandController.registerInstallCommand();
			let buildCommand = commandController.registerBuildCommand();
			let createCommand = commandController.registerCreateCommand();

			let installButton = CommandView.registerInstallButton(installCommand);
			let buildButton = CommandView.registerBuildButton(buildCommand);
			let createButton = CommandView.registerCreateButton(createCommand);
			let barItems = {install: installButton, build: buildButton, create: createButton};
			commandController.registerProfilePick(barItems);
		} catch (err) {
			vscode.window.showErrorMessage(err);
		}
	}


	function loadconfig(workspaceFolderPath: string) {
		let settingsFile = workspaceFolderPath + '/.vscode/conan-settings.json';
		const fs = require('fs');
		if (fs.existsSync(settingsFile)) {
			let config = new Configurator(settingsFile);
			config.readFile();
			let profiles = config.getAllNames();
			let activeProfile = config.getAllNames()[0];
			let state: AppState = { rootPath: workspaceFolderPath, config: config, profiles: profiles, activeProfile: activeProfile };
			return state;
		}
		else {
			throw new Error("Disroop Conan: No valid conan-settings.json file could be found!");
		}
	}
}


// this method is called when your extension is deactivated
export function deactivate() {
}
