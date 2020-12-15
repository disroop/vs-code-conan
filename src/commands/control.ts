import { Configurator } from '../configurator/configurator';
import * as vscode from 'vscode';
import { Executor } from '../executor/executor';
import {StatusBarItem} from "vscode";


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
    private readonly executor: Executor = new Executor();
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext, state: AppState) {
        this._state = this.updateState(state);
        
        this.context = context;
        state.activeProfile = ALL;
    }
    
    private updateState(state: AppState):AppState{
        let _state: AppState = state;
        _state.profiles.push(ALL);
        return _state;
    }

    setState(state: AppState) {
        this._state = this.updateState(state);
    }

    private install(profileToRun: any) {
        let conanfile = this._state.config.getConanFile(profileToRun);
        let buildFolder = this._state.config.getBuildFolder(profileToRun);
        let installArg = this._state.config.getInstallArg(profileToRun);
        let profile = this._state.config.getProfile(profileToRun);
        let installCommand = this._state.config.isWorkspace(profileToRun) ? "conan workspace install" : "conan install";
        const commad = `${installCommand} ${conanfile} --profile=${profile} ${installArg} --install-folder ${this._state.rootPath}/${buildFolder}`;
        this.executor.runCommand(commad, "installing");
    }

    private build(profileToBuild: any) {
        let conanfile = this._state.config.getConanFile(profileToBuild);
        let buildFolder = this._state.config.getBuildFolder(profileToBuild);
        let buildArg = this._state.config.getBuildArg(profileToBuild);
        const commad = `conan build ${conanfile} ${buildArg} --build-folder ${this._state.rootPath}/${buildFolder}`;
        this.executor.runCommand(commad, "building");
    }

    private create(profileToCreate: any) {
        let conanfile = this._state.config.getConanFile(profileToCreate);
        let profile = this._state.config.getProfile(profileToCreate);
        let createUser = this._state.config.getCreateUser(profileToCreate);
        let createChannel = this._state.config.getCreateChannel(profileToCreate);
        let createArg = this._state.config.getCreateArg(profileToCreate);
        const commad = `conan create ${conanfile} ${createUser}/${createChannel} ${createArg} --profile=${profile}`;
        this.executor.runCommand(commad, "creating a package");
    }

    registerInstallCommand() {
        const installCommand = 'vs-code-conan.install';
        let command = vscode.commands.registerCommand(installCommand, () => {
            if (this._state.activeProfile === ALL) {
                this._state.config.getAllNames().forEach(item => this.install(item));
            } else {
                this.install(this._state.activeProfile);
            }
        });
        this.context.subscriptions.push(command);
        return installCommand;
    }

    registerBuildCommand(): string {
        const buildCommand = 'vs-code-conan.build';
        let command = vscode.commands.registerCommand(buildCommand, () => {
            if (this._state.activeProfile === ALL) {
                this._state.config.getAllNames().forEach(item => {
                    if (!this._state.config.isWorkspace(item)) {this.build(item);}});
            } else {
                this.build(this._state.activeProfile);
            }

        });
        this.context.subscriptions.push(command);
        return buildCommand;
    }

    registerCreateCommand(): string {
        const createCommand = 'vs-code-conan.create';

        let command = vscode.commands.registerCommand(createCommand, () => {
            if (this._state.activeProfile === ALL) {
                this._state.config.getAllNames().forEach(item => {
                    if (!this._state.config.isWorkspace(item)){this.create(item);}});
            } else {
                this.create(this._state.activeProfile);
            }
        });
        this.context.subscriptions.push(command);
        return createCommand;
    }


    registerProfilePick( barItems: StatusBarItems) {
        const myCommandId = 'vs-code-conan.profilePick';

        let command = vscode.commands.registerCommand(myCommandId, () => {
            let options = <vscode.QuickPickOptions>{
                placeHolder: 'Choose your profile to build for conan',
                //matchOnDescription: true,
                onDidSelectItem: item => {
                    if (item) {
                        this._state.activeProfile = item.toString();
                        CommandController.updateProfile(this._state, barItems, myStatusBarItem);
                    }
                }
            };
            vscode.window.showQuickPick(this._state.profiles, options);
        });
        this.context.subscriptions.push(command);

        // create a new status bar item that we can now manage
        const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
        myStatusBarItem.command = myCommandId;
        CommandController.updateProfile(this._state ,barItems, myStatusBarItem);

        this.context.subscriptions.push(command);
    }

    private static updateProfile(state: AppState, barItems: StatusBarItems, myStatusBarItem: StatusBarItem) {
        myStatusBarItem.text = state.activeProfile;
        myStatusBarItem.show();
        //TODO: Refactor this
        if (isWorkspace(state.activeProfile)) {
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

        function isWorkspace(activeProfile: string) {
            let onlyHasWorkspaces : boolean = state.config.isWorkspace(activeProfile);
            if(activeProfile === ALL){
                state.profiles.forEach(profile => {
                    if(!state.config.isWorkspace(profile))
                    {
                        return false;
                    }
                    onlyHasWorkspaces = true;
                });
            }
            return onlyHasWorkspaces;
        }
    }
}
