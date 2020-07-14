// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Configurator } from './configurator/configurator';
import { config } from 'process';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let rootPath = vscode.workspace.rootPath;
	let vscodepath = rootPath + '/.vscode';
	let settingsFile = vscodepath+'/conan-settings.json';
	const config = new Configurator(settingsFile);
	
	config.readFile();
	var profiles = config.getAllProfileNames();
	var activeProfile = profiles[0];

	registerProfilePick();
	

	var installStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -101);
	installStatusBarItem.text = "$(cloud-download)";
	installStatusBarItem.command = registerInstallCommand();
	installStatusBarItem.show();

	var buildStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -102);
	buildStatusBarItem.text = "$(run)";
	buildStatusBarItem.command = registerBuildCommand();
	buildStatusBarItem.show();

	var createStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -103);
	createStatusBarItem.text = "$(gift)";
	createStatusBarItem.command = registerCreateCommand();
	createStatusBarItem.show();

	

    
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vs-code-conan" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vs-code-conan.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vs-code-conan!');
	});

	

	context.subscriptions.push(disposable);

	function registerInstallCommand() {
		const installCommand = 'conan.install';
		vscode.commands.registerCommand(installCommand, () => {
			let buildFolder = config.getBuildFolder(activeProfile);
			let installArg = "";
			try {
				installArg=config.getInstallArg(activeProfile);
			} catch (error) {
			}
			
			let profile = config.getProfile(activeProfile);		

			var commad = `rm -rf ${rootPath}/${buildFolder} && mkdir -p ${rootPath}/${buildFolder} && conan install ${rootPath} --profile=${profile} ${installArg} --install-folder ${rootPath}/${buildFolder}`;
			executeCommand(commad);
		});
		return installCommand;
	}

	function registerBuildCommand():string {
		const buildCommand = 'conan.build';
		vscode.commands.registerCommand(buildCommand, () => {
			let buildFolder = config.getBuildFolder(activeProfile);
			let buildArg = "";
			try {
				buildArg=config.getBuildArg(activeProfile);
			} catch (error) {
			}	

			var commad = `conan build ${rootPath} ${buildArg} --build-folder ${rootPath}/${buildFolder} && ln -nfs ${rootPath}/${buildFolder}/compile_commands.json ${rootPath}/compile_commands.json`;
			executeCommand(commad);
		});
		return buildCommand;
	}

	function registerCreateCommand():string {
		const createCommand = 'conan.create';
		vscode.commands.registerCommand(createCommand, () => {
			let buildFolder = config.getBuildFolder(activeProfile);
			let createArg = "";
			try {
				createArg=config.getCreateArg(activeProfile);
			} catch (error) {
			}	

			var commad = `conan create ${rootPath} ${createArg}`;
			executeCommand(commad);
		});
		return createCommand;
	}

	function executeCommand(commad: string) {
		const { spawn } = require("child_process");
		const output = vscode.window.createOutputChannel("conan");
		output.clear();
		output.append(`command: ${commad}\n`);
		const ls = spawn("sh", ['-c', commad], { stdio: 'pipe' });

		ls.stdout.on("data", (data: string) => {
			output.append(`conan: ${data}`);

		});
		ls.stderr.on("data", (data: any) => {
			output.append(`stderr: ${data}`);
		});

		ls.on('error', (error: { message: any; }) => {
			output.append(`error: ${error.message}`);
		});

		ls.on("close", (code: any) => {
			output.append(`child process exited with code ${code}`);
		});
		output.show();
	}

	function registerProfilePick() {
		const myCommandId = 'sample.showSelectionCount';
		
		vscode.commands.registerCommand(myCommandId, () => {
			let options = <vscode.QuickPickOptions>{
				placeHolder: 'Type a line number or a piece of code to navigate to',
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

		// create a new status bar item that we can now manage
		var myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
		myStatusBarItem.command = myCommandId;
		updateProfile();

		function updateProfile() {
			myStatusBarItem.text = activeProfile;
			myStatusBarItem.show();
		}
	}
}



// this method is called when your extension is deactivated
export function deactivate() {}
