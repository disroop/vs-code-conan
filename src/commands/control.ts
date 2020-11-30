import { Configurator } from '../configurator/configurator';
import * as vscode from 'vscode';
import { Executor } from '../executor/executor';


export interface AppState {
	rootPath: string;
	config: Configurator;
	activeProfile: string;
	profiles: string[];
}

export interface StatusBarItems {
	install: vscode.StatusBarItem;
	build: vscode.StatusBarItem;
	create: vscode.StatusBarItem;
}

export class CommandController{
    static registerInstallCommand(context: vscode.ExtensionContext, state: AppState, executor: Executor) {
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
    
    static registerBuildCommand(context: vscode.ExtensionContext, state: AppState, executor: Executor): string {
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
    
    static registerCreateCommand(context: vscode.ExtensionContext, state: AppState, executor: Executor): string {
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
    
    
    static registerProfilePick(context: vscode.ExtensionContext, state: AppState, barItems: StatusBarItems) {
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
}