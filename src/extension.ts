// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Configurator} from './configurator/configurator';
import {Executor} from './executor/executor';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const ALL = "[all]";
    const executor = new Executor();
    const rootPath = vscode.workspace.rootPath;
    let activeProfile = ALL;
    let {config, profiles} = loadConfig(rootPath);
    // Update status bar item based on events around the active editor -> in the future checkif we can update on file change to
    const installSubprocessStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -101);
    installSubprocessStatusBarItem.text = "$(cloud-download)";
    installSubprocessStatusBarItem.tooltip = "conan install";
    installSubprocessStatusBarItem.command = registerInstallCommand();
    installSubprocessStatusBarItem.hide();

    const buildStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -102);
    buildStatusBarItem.text = "$(run)";
    buildStatusBarItem.tooltip = "conan build";
    buildStatusBarItem.command = registerBuildCommand();
    buildStatusBarItem.hide();

    const createStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -103);
    createStatusBarItem.text = "$(gift)";
    createStatusBarItem.tooltip = "conan create";
    createStatusBarItem.command = registerCreateCommand();
    createStatusBarItem.hide();

    registerProfilePick();

    function loadConfig(workspaceFolderPath: string | undefined) {
        let config = undefined;
        let profiles = undefined;
        let settingsFile = workspaceFolderPath + '/.vscode/conan-settings.json';
        const fs = require('fs');
        if (fs.existsSync(settingsFile)) {
            config = new Configurator(settingsFile);
            config.readFile();
            profiles = config.getAllNames();
            return {config, profiles};
        } else {
            vscode.window.showErrorMessage("Disroop Conan: No valid conan-settings.json file could be found!");
        }
        return {config, profiles};
    }

    function registerInstallCommand() {
        const installCommand = 'vs-code-conan.install';

        function install(config: any, profileToRun: any) {
            const conanfile = config.getConanFile(profileToRun);
            const buildFolder = config.getBuildFolder(profileToRun);
            let installArg = "";
            try {
                installArg = config.getInstallArg(profileToRun);
            } catch (error) {
            }

            let profile = config.getProfile(profileToRun);
            let installCommand = config.isWorkspace(profile) ? "conan workspace install" : "conan install";
            const command = `${installCommand} ${conanfile} --profile=${profile} ${installArg} --install-folder ${rootPath}/${buildFolder}`;
            executor.runCommand(command, `installing "${profileToRun}"`);
        }

        let command = vscode.commands.registerCommand(installCommand, () => {
            if (config && activeProfile) {
                if (activeProfile === ALL) {
                    config.getAllNames().forEach(item => install(config, item));
                } else {
                    install(config, activeProfile);
                }
            } else {
                vscode.window.showErrorMessage("Disroop Conan: It is not possible to install with no valid config!");
            }
        });
        context.subscriptions.push(command);
        return installCommand;
    }

    function registerBuildCommand(): string {
        const buildCommand = 'vs-code-conan.build';

        function build(config: any, profileToBuild: any) {
            const conanfile = config.getConanFile(profileToBuild);
            const buildFolder = config.getBuildFolder(profileToBuild);
            let buildArg = "";
            try {
                buildArg = config.getBuildArg(profileToBuild);
            } catch (error) {
            }
            const command = `conan build ${conanfile} ${buildArg} --build-folder ${rootPath}/${buildFolder}`;
            executor.runCommand(command, `building "${profileToBuild}"`);
        }

        let command = vscode.commands.registerCommand(buildCommand, () => {
            if (config && activeProfile && rootPath) {
                if (activeProfile === ALL) {
                    config.getAllNames().forEach(item => build(config, item));
                } else {
                    build(config, activeProfile);
                }
            } else {
                vscode.window.showErrorMessage("Disroop Conan: It is not possible to build with no valid config!");
            }
        });
        context.subscriptions.push(command);
        return buildCommand;
    }

    function registerCreateCommand(): string {
        const createCommand = 'vs-code-conan.create';

        function create(config: any, profileToCreate: any) {
            const conanfile = config.getConanFile(profileToCreate);
            const profile = config.getProfile(profileToCreate);
            const createUser = config.getCreateUser(profileToCreate);
            const createChannel = config.getCreateChannel(profileToCreate);
            let createArg = "";
            try {
                createArg = config.getCreateArg(profileToCreate);
            } catch (error) {
            }

            const command = `conan create ${conanfile} ${createUser}/${createChannel} ${createArg} --profile=${profile}`;
            executor.runCommand(command, `creating "${profileToCreate}"`);
        }

        let command = vscode.commands.registerCommand(createCommand, () => {
            if (config && activeProfile) {
                if (activeProfile === ALL) {
                    config.getAllNames().forEach(item => create(config, item));
                } else {
                    create(config, activeProfile);
                }
            } else {
                vscode.window.showErrorMessage("Disroop Conan: It is not possible to create a package with no valid config!");
            }
        });
        context.subscriptions.push(command);
        return createCommand;
    }

    function registerProfilePick() {
        const myCommandId = 'vs-code-conan.profilePick';

        let command = vscode.commands.registerCommand(myCommandId, () => {
            if (profiles && activeProfile) {
                let options = <vscode.QuickPickOptions>{
                    placeHolder: 'Choose your profile to build for conan',
                    //matchOnDescription: true,
                    onDidSelectItem: item => {
                        if (item) {
                            activeProfile = item.toString();
                            updateProfile();
                        }
                    }
                };
                const profilePicksList = [ALL].concat(profiles);
                vscode.window.showQuickPick(profilePicksList, options);
            }
        });
        context.subscriptions.push(command);

        // create a new status bar item that we can now manage
        const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
        myStatusBarItem.command = myCommandId;
        updateProfile();

        function updateProfile() {
            if (config && activeProfile) {
                myStatusBarItem.text = activeProfile;
                myStatusBarItem.show();
                //hier noch nicht ganz durchdacht
                if (config.isWorkspace(activeProfile)) {
                    installSubprocessStatusBarItem.show();
                    installSubprocessStatusBarItem.tooltip = "workspace install";
                    buildStatusBarItem.hide();
                    createStatusBarItem.hide();
                } else {
                    installSubprocessStatusBarItem.show();
                    installSubprocessStatusBarItem.tooltip = "conan install";
                    buildStatusBarItem.show();
                    createStatusBarItem.show();
                }
            }
        }

        context.subscriptions.push(command);
    }
}


// this method is called when your extension is deactivated
export function deactivate() {
}
