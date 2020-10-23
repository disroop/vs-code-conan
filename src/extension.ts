// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Configurator } from './configurator/configurator';
import { config } from 'process';
import { Executor } from './executor/executor';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let rootPath = vscode.workspace.rootPath;
	let vscodepath = rootPath + '/.vscode';
	let settingsFile = vscodepath+'/conan-settings.json';
	const config = new Configurator(settingsFile);
	const executor = new Executor();
	config.readFile();
	var profiles = config.getAllNames();
	var activeProfile = config.getAllNames()[0];

	var instalsubprocesstatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -101);
	instalsubprocesstatusBarItem.text = "$(cloud-download)";
	instalsubprocesstatusBarItem.tooltip = "conan install";
	instalsubprocesstatusBarItem.command = registerInstallCommand();
	instalsubprocesstatusBarItem.hide();
	
	var buildStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -102);
	buildStatusBarItem.text = "$(run)";
	buildStatusBarItem.tooltip = "conan build";
	buildStatusBarItem.command = registerBuildCommand();
	buildStatusBarItem.hide();

	var createStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -103);
	createStatusBarItem.text = "$(gift)";
	createStatusBarItem.tooltip = "conan create";
	createStatusBarItem.command = registerCreateCommand();
	createStatusBarItem.hide();

	registerProfilePick();
	
	function registerInstallCommand() {
		const installCommand = 'vs-code-conan.install';
		let command = vscode.commands.registerCommand(installCommand, () => {
			let conanfile = config.getConanFile(activeProfile);
			let buildFolder = config.getBuildFolder(activeProfile);
			let installArg = "";
			try {
				installArg=config.getInstallArg(activeProfile);
			} catch (error) {
			}
			
			let profile = config.getProfile(activeProfile);		
			let installCommand = config.isWorkspace(activeProfile) ? "conan workspace install" : "conan install";
			var commad = `rm -rf ${rootPath}/${buildFolder} && mkdir -p ${rootPath}/${buildFolder} && ${installCommand} ${conanfile} --profile=${profile} ${installArg} --install-folder ${rootPath}/${buildFolder}`;
			executor.runCommand(commad, "installing");
		});
		context.subscriptions.push(command);
		return installCommand;
	}

	function registerBuildCommand():string {
		const buildCommand = 'vs-code-conan.build';
		let command = vscode.commands.registerCommand(buildCommand, () => {
			let conanfile = config.getConanFile(activeProfile);
			let buildFolder = config.getBuildFolder(activeProfile);
			let buildArg = "";
			try {
				buildArg=config.getBuildArg(activeProfile);
			} catch (error) {
			}	

			var commad = `conan build ${conanfile} ${buildArg} --build-folder ${rootPath}/${buildFolder}`;
			executor.runCommand(commad,"building");
		});
		context.subscriptions.push(command);
		return buildCommand;
	}

	function registerCreateCommand():string {
		const createCommand = 'vs-code-conan.create';
		let command = vscode.commands.registerCommand(createCommand, () => {
			let conanfile = config.getConanFile(activeProfile);
			let profile = config.getProfile(activeProfile);		
			let createUser = config.getCreateUser(activeProfile);
			let createChannel = config.getCreateChannel(activeProfile);
			let createArg = "";
			try {
				createArg=config.getCreateArg(activeProfile);
			} catch (error) {
			}	

			var commad = `conan create ${conanfile} ${createUser}/${createChannel} ${createArg} --profile=${profile}`;
			executor.runCommand(commad, "creating a package");
		});
		context.subscriptions.push(command);
		return createCommand;
	}

	
	function registerProfilePick() {
		const myCommandId = 'vs-code-conan.profilePick';
		
		let command =vscode.commands.registerCommand(myCommandId, () => {
			let options = <vscode.QuickPickOptions>{
				placeHolder: 'Choose your profile to build for conan',
				//matchOnDescription: true,
				onDidSelectItem: item => {
					if(item){
						activeProfile = item.toString();
						updateProfile();
					}
				}
			};
			vscode.window.showQuickPick(profiles, options);
		});
		context.subscriptions.push(command);

		// create a new status bar item that we can now manage
		var myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
		myStatusBarItem.command = myCommandId;
		updateProfile();

		function updateProfile() {
			myStatusBarItem.text = activeProfile;
			myStatusBarItem.show();
			if(config.isWorkspace(activeProfile)){
				instalsubprocesstatusBarItem.show();
				instalsubprocesstatusBarItem.tooltip = "workspace install";
				buildStatusBarItem.hide();
				createStatusBarItem.hide();
			}
			else{
				instalsubprocesstatusBarItem.show();
				instalsubprocesstatusBarItem.tooltip = "conan install";
				buildStatusBarItem.show();
				createStatusBarItem.show();
			}
		}
		context.subscriptions.push(command);
	}
}



// this method is called when your extension is deactivated
export function deactivate() {}
