// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { stat } from 'fs';
import * as vscode from 'vscode';
import { Configurator } from './configurator/configurator';
import { Executor } from './executor/executor';

interface AppState {
	rootPath: string;
	config: Configurator;
	activeProfile: string;
	profiles: string[];
}

interface StatusBarItems {
	install: vscode.StatusBarItem;
	build: vscode.StatusBarItem;
	create: vscode.StatusBarItem;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const executor = new Executor();
	var rootPath = vscode.workspace.rootPath;
	if (rootPath) {
		try {
			let state = loadconfig(rootPath);
			let installCommand = registerInstallCommand(context, state, executor);
			let buildCommand = registerBuildCommand(context, state, executor);
			let createCommand = registerCreateCommand(context, state, executor);

			let installButton = registerInstallButton(installCommand);
			let buildButton = regitsterBuildButton(buildCommand);
			let createButton = registerCreateButton(createCommand);
			let barItems = {install: installButton, build: buildButton, create: createButton};
			registerProfilePick(context, state, barItems);
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



function registerInstallButton(command: string) {
	let instalsubprocesstatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -101);
	instalsubprocesstatusBarItem.text = "$(cloud-download)";
	instalsubprocesstatusBarItem.tooltip = "conan install";
	instalsubprocesstatusBarItem.command = command;
	instalsubprocesstatusBarItem.hide();
	return instalsubprocesstatusBarItem;
}
function regitsterBuildButton(command: string) {
	let buildStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -102);
	buildStatusBarItem.text = "$(run)";
	buildStatusBarItem.tooltip = "conan build";
	buildStatusBarItem.command = command;
	buildStatusBarItem.hide();
	return buildStatusBarItem;
}
function registerCreateButton(command: string) {
	let createStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -103);
	createStatusBarItem.text = "$(gift)";
	createStatusBarItem.tooltip = "conan create";
	createStatusBarItem.command = command;
	createStatusBarItem.hide();
	return createStatusBarItem;
}


function registerInstallCommand(context: vscode.ExtensionContext, state: AppState, executor: Executor) {
	const installCommand = 'vs-code-conan.install';
	let command = vscode.commands.registerCommand(installCommand, () => {
		let conanfile = state.config.getConanFile(state.activeProfile);
		let buildFolder = state.config.getBuildFolder(state.activeProfile);
		let installArg = "";
		try {
			installArg = state.config.getInstallArg(state.activeProfile);
		} catch (error) {
			vscode.window.showErrorMessage("Not able to install: {error.message}")
		}

		let profile = state.config.getProfile(state.activeProfile);
		let installCommand = state.config.isWorkspace(state.activeProfile) ? "conan workspace install" : "conan install";
		var commad = `${installCommand} ${conanfile} --profile=${profile} ${installArg} --install-folder ${state.rootPath}/${buildFolder}`;
		executor.runCommand(commad, "installing");
	});
	context.subscriptions.push(command);
	return installCommand;
}

function registerBuildCommand(context: vscode.ExtensionContext, state: AppState, executor: Executor): string {
	const buildCommand = 'vs-code-conan.build';
	let command = vscode.commands.registerCommand(buildCommand, () => {
		let conanfile = state.config.getConanFile(state.activeProfile);
		let buildFolder = state.config.getBuildFolder(state.activeProfile);
		let buildArg = state.config.getBuildArg(state.activeProfile);
		var commad = `conan build ${conanfile} ${buildArg} --build-folder ${state.rootPath}/${buildFolder}`;
		executor.runCommand(commad, "building");
	});
	context.subscriptions.push(command);
	return buildCommand;
}

function registerCreateCommand(context: vscode.ExtensionContext, state: AppState, executor: Executor): string {
	const createCommand = 'vs-code-conan.create';
	let command = vscode.commands.registerCommand(createCommand, () => {
		let conanfile = state.config.getConanFile(state.activeProfile);
		let profile = state.config.getProfile(state.activeProfile);
		let createUser = state.config.getCreateUser(state.activeProfile);
		let createChannel = state.config.getCreateChannel(state.activeProfile);
		let createArg = state.config.getCreateArg(state.activeProfile);
		var commad = `conan create ${conanfile} ${createUser}/${createChannel} ${createArg} --profile=${profile}`;
		executor.runCommand(commad, "creating a package");
	});
	context.subscriptions.push(command);
	return createCommand;
}


function registerProfilePick(context: vscode.ExtensionContext, state: AppState, barItems: StatusBarItems) {
	const myCommandId = 'vs-code-conan.profilePick';

	let command = vscode.commands.registerCommand(myCommandId, () => {
		let options = <vscode.QuickPickOptions>{
			placeHolder: 'Choose your profile to build for conan',
			//matchOnDescription: true,
			onDidSelectItem: item => {
				if (item) {
					state.activeProfile = item.toString();
					updateProfile();
				}
			}
		};

		vscode.window.showQuickPick(state.profiles, options);
	});
	context.subscriptions.push(command);

	// create a new status bar item that we can now manage
	var myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
	myStatusBarItem.command = myCommandId;
	updateProfile();

	function updateProfile() {
		myStatusBarItem.text = state.activeProfile;
		myStatusBarItem.show();
		if (state.config.isWorkspace(state.activeProfile)) {
			barItems.install.show();
			barItems.install.tooltip = "workspace install";
			barItems.build.hide();
			barItems.create.hide();
		}
		else {
			barItems.install.show();
			barItems.install.tooltip = "conan install";
			barItems.build.show();
			barItems.create.show();
		}
	}
	context.subscriptions.push(command);
}

// this method is called when your extension is deactivated
export function deactivate() { }
