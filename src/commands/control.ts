import {Configurator, WorkspaceArgument} from '../configurator/configurator';
import * as vscode from 'vscode';
import {StatusBarItem} from 'vscode';
import {Executor} from '../system/executor';
import { container } from 'tsyringe';


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

const ALL = "[all]";

export class CommandController {

    private _state: AppState;
    private readonly executor: Executor = container.resolve(Executor);
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext, state: AppState) {
        this._state = this.updateState(state);

        this.context = context;
        state.activeProfile = ALL;
    }

    private updateState(state: AppState): AppState {
        let _state: AppState = state;
        _state.profiles.push(ALL);
        return _state;
    }

    setState(state: AppState) {
        this._state = this.updateState(state);
    }

    private install(profileToRun: any) {
        try {
            let installCommand = this._state.config.isWorkspace(profileToRun) ? "conan workspace install" : "conan install";
            let argument : WorkspaceArgument;
            if(this._state.config.isWorkspace(profileToRun)){
                argument = this._state.config.getConan(profileToRun);
            }
            else{
                argument = this._state.config.getWorkspace(profileToRun);
            }
            let conanfile = argument.path;
            let buildFolder = argument.installFolder;
            let installArg = argument.installArguments;
            let profile = argument.installProfile;
            let profileCommand = `--profile:build ${profile.build} --profile:host ${profile.host}`; 
            let installFolderArg = `--install-folder ${this._state.rootPath}/${buildFolder}`;
            const stringCommand = `${installCommand} ${conanfile} ${profileCommand} ${installArg} ${installFolderArg}`;
            let command = { executionCommand: stringCommand, description: "installing" };
            this.executor.pushCommand(command);
        } catch (err) {
            vscode.window.showErrorMessage("Install process canceled: " + err);
        }
    }

    private build(profileToBuild: any) {
        try {
            let argument = this._state.config.getConan(profileToBuild);
            let conanfile = argument.path;
            let buildFolder = argument.buildFolder;
            let buildArg = argument.buildArguments;
            let buildFolderArg = `--build-folder ${this._state.rootPath}/${buildFolder}`;
            const stringCommand = `conan build ${conanfile} ${buildArg} ${buildFolderArg}`;
            let command = { executionCommand: stringCommand, description: "building" };
            this.executor.pushCommand(command);
        } catch (err) {
            vscode.window.showErrorMessage("Create process canceled: " + err);
        }
    }

    private create(profileToCreate: any) {
        try {
            let argument = this._state.config.getConan(profileToCreate);
            let conanfile = argument.path;
            let profile = argument.installProfile;
            let profileCommand = `--profile:build ${profile.build} --profile:host ${profile.host}`; 
            let createUser = argument.user;
            let createChannel = argument.channel;
            let createArg = argument.createArguments;
            const stringCommand = `conan create ${conanfile} ${createUser}/${createChannel} ${createArg} ${profileCommand}`;
            let command = { executionCommand: stringCommand, description: "creating a package" };
            this.executor.pushCommand(command);
        } catch (err) {
            vscode.window.showErrorMessage("Create process canceled: " + err);
        }
    }

    registerInstallCommand() {
        const installCommand = 'vs-code-conan.install';
        let command = vscode.commands.registerCommand(installCommand, () => {
            if (!this.executor.processIsStillRunning()) {
                if (this._state.activeProfile === ALL) {
                    this._state.config.getAllNames().forEach(item => this.install(item));
                } else {
                    this.install(this._state.activeProfile);
                }
            } else {
                vscode.window.showWarningMessage("Process is already running - Install will not be processed!");
            }
        });
        this.context.subscriptions.push(command);
        return installCommand;
    }

    registerBuildCommand(): string {
        const buildCommand = 'vs-code-conan.build';
        let command = vscode.commands.registerCommand(buildCommand, () => {
            if (!this.executor.processIsStillRunning()) {
                if (this._state.activeProfile === ALL) {
                    this._state.config.getAllNames().forEach(item => {
                        if (!this._state.config.isWorkspace(item)) { this.build(item); }
                    });
                } else {
                    this.build(this._state.activeProfile);
                }
            } else {
                vscode.window.showWarningMessage("Process is already running - Build will not be processed!");
            }
        });
        this.context.subscriptions.push(command);
        return buildCommand;
    }

    registerCreateCommand(): string {
        const createCommand = 'vs-code-conan.create';

        let command = vscode.commands.registerCommand(createCommand, () => {
            if (!this.executor.processIsStillRunning()) {
                if (this._state.activeProfile === ALL) {
                    this._state.config.getAllNames().forEach(item => {
                        if (!this._state.config.isWorkspace(item)) { this.create(item); }
                    });
                } else {
                    this.create(this._state.activeProfile);
                }
            } else {
                vscode.window.showWarningMessage("Process is already running - Create will not be processed!");
            }
        });
        this.context.subscriptions.push(command);
        return createCommand;
    }


    registerProfilePick(barItems: StatusBarItems) {
        const myCommandId = 'vs-code-conan.profilePick';

        let command = vscode.commands.registerCommand(myCommandId, () => {
            let options = <vscode.QuickPickOptions>{
                placeHolder: 'Choose your profile to build for conan',
                //matchOnDescription: true,
                onDidSelectItem: item => {
                    if (item) {
                        this._state.activeProfile = item.toString();
                        CommandController.updateProfile(this._state, barItems, activeProfileStatusBarItem);
                    }
                }
            };
            vscode.window.showQuickPick(this._state.profiles, options);
        });
        this.context.subscriptions.push(command);

        // create a new status bar item that we can now manage
        const activeProfileStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
        activeProfileStatusBarItem.command = myCommandId;
        activeProfileStatusBarItem.tooltip = "Set the active conan setting";
        CommandController.updateProfile(this._state, barItems, activeProfileStatusBarItem);

        this.context.subscriptions.push(command);
    }

    private static updateProfile(state: AppState, barItems: StatusBarItems, activeProfileStatusBarItem: StatusBarItem) {
        activeProfileStatusBarItem.text = state.activeProfile;
        activeProfileStatusBarItem.show();
        //TODO: Refactor this
        if (isWorkspace(state.activeProfile)) {
            barItems.install.show();
            barItems.install.tooltip = "Run conan workspace install";
            barItems.build.hide();
            barItems.create.hide();
        }
        else {
            barItems.install.show();
            if (state.activeProfile === ALL) {
                barItems.install.tooltip = "Run conan install / conan workspace install";
            }else{
                barItems.install.tooltip = "Run conan install";
            }
            barItems.build.show();
            barItems.create.show();
        }

        function isWorkspace(activeProfile: string) {
            let onlyHasWorkspaces: boolean = state.config.isWorkspace(activeProfile);
            if (activeProfile === ALL) {
                onlyHasWorkspaces = true;
                for (let i = 0; i < state.profiles.length; i++) {
                    let currentProfile = state.profiles[i];
                    if (!state.config.isWorkspace(currentProfile) && currentProfile !== ALL) {
                        onlyHasWorkspaces = false;
                        break;
                    }
                }
            }
            return onlyHasWorkspaces;
        }
    }
}
