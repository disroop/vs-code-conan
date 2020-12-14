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

const ALL = "[all]";
export class CommandController {

    private state: AppState;
    private readonly executor: Executor = new Executor();
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext, state: AppState) {
        this.state = state;
        this.context = context;
        state.profiles.push(ALL);
        state.activeProfile = ALL;
    } 

    private install(profileToRun: any) {
        let conanfile = this.state.config.getConanFile(profileToRun);
        let buildFolder = this.state.config.getBuildFolder(profileToRun);
        let installArg = this.state.config.getInstallArg(profileToRun);
        let profile = this.state.config.getProfile(profileToRun);
        let installCommand = this.state.config.isWorkspace(profileToRun) ? "conan workspace install" : "conan install";
        const commad = `${installCommand} ${conanfile} --profile=${profile} ${installArg} --install-folder ${this.state.rootPath}/${buildFolder}`;
        this.executor.runCommand(commad, "installing");
    }

    private build(profileToBuild: any) {
        let conanfile = this.state.config.getConanFile(profileToBuild);
        let buildFolder = this.state.config.getBuildFolder(profileToBuild);
        let buildArg = this.state.config.getBuildArg(profileToBuild);
        const commad = `conan build ${conanfile} ${buildArg} --build-folder ${this.state.rootPath}/${buildFolder}`;
        this.executor.runCommand(commad, "building");
    }

    private create(profileToCreate: any) {
        let conanfile = this.state.config.getConanFile(profileToCreate);
        let profile = this.state.config.getProfile(profileToCreate);
        let createUser = this.state.config.getCreateUser(profileToCreate);
        let createChannel = this.state.config.getCreateChannel(profileToCreate);
        let createArg = this.state.config.getCreateArg(profileToCreate);
        const commad = `conan create ${conanfile} ${createUser}/${createChannel} ${createArg} --profile=${profile}`;
        this.executor.runCommand(commad, "creating a package");
    }

    registerInstallCommand() {
        const installCommand = 'vs-code-conan.install';
        let command = vscode.commands.registerCommand(installCommand, () => {
            if (this.state.activeProfile === ALL) {
                this.state.config.getAllNames().forEach(item => this.install(item));
            } else {
                this.install(this.state.activeProfile);
            }
        });
        this.context.subscriptions.push(command);
        return installCommand;
    }

    registerBuildCommand(): string {
        const buildCommand = 'vs-code-conan.build';
        let command = vscode.commands.registerCommand(buildCommand, () => {
            if (this.state.activeProfile === ALL) {
                this.state.config.getAllNames().forEach(item => {
                    if (!this.state.config.isWorkspace(item)) {this.build(item);}});
            } else {
                this.build(this.state.activeProfile);
            }

        });
        this.context.subscriptions.push(command);
        return buildCommand;
    }

    registerCreateCommand(): string {
        const createCommand = 'vs-code-conan.create';

        let command = vscode.commands.registerCommand(createCommand, () => {
            if (this.state.activeProfile === ALL) {
                this.state.config.getAllNames().forEach(item => {
                    if (!this.state.config.isWorkspace(item)){this.create(item);}});
            } else {
                this.create(this.state.activeProfile);
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
                        this.state.activeProfile = item.toString();
                        updateProfile(this.state);
                    }
                }
            };
            vscode.window.showQuickPick(this.state.profiles, options);
        });
        this.context.subscriptions.push(command);

        // create a new status bar item that we can now manage
        const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
        myStatusBarItem.command = myCommandId;
        updateProfile(this.state);

        function updateProfile(state: AppState) {
            myStatusBarItem.text = state.activeProfile;
            myStatusBarItem.show();
            //TODO: Refactor this
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
        this.context.subscriptions.push(command);
    }
}
