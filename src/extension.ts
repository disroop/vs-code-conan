import "reflect-metadata";
import * as vscode from 'vscode';
import {Configurator} from './configurator/configurator';
import {CommandController} from "./commands/vscode-control";
import {CommandView} from "./commands/vscode-view";
import { container } from "tsyringe";
import { SystemPlugin } from "./system/plugin";
import { ExecutorNodeJs } from "./system/node";

// TODO: könnte man z.b. auch so machen, dann muss man nicht mit strings im projekt arbeiten und
// konntest alles umbenennen und direkt referenzen drauf finden in der IDE.
export const systemInjectionToken : symbol = Symbol("System");
export const executorInjectionToken : symbol = Symbol("Executor");

export function activate(context: vscode.ExtensionContext) {

    const system = new SystemPlugin();
    container.registerInstance(systemInjectionToken,system);
    container.registerInstance(executorInjectionToken, new ExecutorNodeJs());
    const rootPath: string = system.getWorkspaceRootPath();
    // TODO: Evtl könnte man da mit der `Uri` classe von VsCode arbeiten anstatt string-concat.
    // Siehe hier: https://code.visualstudio.com/api/references/vscode-api#Uri
    // hab ich zwar noch nie verwendet, aber hätte wohl diese vorteile anstatt mit string-pfaden zu arbeiten:
    //
    //  - hast dann keine problem wenn `getWorkspaceRootPath` schon slashes im pfad hat (dann hast nicht doppel-slashes und so zeugs)
    //  - Weiss nicht ob das portabel ist (z.b. unter windows mit forward slashes).
    const settingsFile: string = rootPath+'/.vscode/conan-settings.json';
    const config = new Configurator(settingsFile);
    container.registerInstance(Configurator,config);

    let commandController: CommandController;
    let barItems;

    try {
        // Die umsetzung hier ist generell etwas fragil. Wieso: Du greifst über die verschachtelten
        // funktionen auf variablen vom ausseren context zu. So wies jetzt implementiert ist, kann
        // der typescript compiler nicht erkennen, ob die variablen schon initialisiert sind.
        //
        // D.h. angenommen `setupConanSettingsFileWatcher` würde schon initial `onConanSettingChanged`
        // triggeren, dann ist `commandController` noch undefiniert.
        //
        // ich würd empfehlen das umzustellen, damit der compiler erkennen kann, ob die variablen
        // die von den funktionen verwendet werden schon initialisiert sind oder nicht (gibt dir 
        // mehr sicherheit beim refactoren). Da gibts verschiede möglichkeiten:
        //
        // Die konstanten könntest z.b. den funktionen schon mitgeben (also z.b. den `commandController`
        // könntest dem `setupConanSettingsFileWatcher` schon mitgeben als argument und der gibt das dann
        // weiter). Alternative ist auch die verwendung von klassen.
        setupConanSettingsFileWatcher();

        let state = loadConfig(rootPath);
        commandController = new CommandController(context, state);

        let installCommand = commandController.registerInstallCommand();
        let buildCommand = commandController.registerBuildCommand();
        let createCommand = commandController.registerCreateCommand();
        let installButton = CommandView.registerInstallButton(installCommand);
        let buildButton = CommandView.registerBuildButton(buildCommand);
        let createButton = CommandView.registerCreateButton(createCommand);
        barItems = {install: installButton, build: buildButton, create: createButton};
        commandController.registerProfilePick(barItems);
    } catch (err) {
        let errormessage = "Error in Setup Plugin";
        if(err instanceof Error) {
            errormessage = (err as Error).message;
        }
        vscode.window.showErrorMessage(errormessage);
    }

    function setupConanSettingsFileWatcher() {
        const folder = vscode.workspace.workspaceFolders?.[0];
        if (folder) {
            //Could not use new RelativePath solution
            //https://github.com/disroop/vs-code-conan/issues/4#issuecomment-748337898
            let watcher = vscode.workspace.createFileSystemWatcher(settingsFile);
            // wieso brauchts das 3x?
            watcher.onDidChange(onConanSettingChanged);
            watcher.onDidCreate(onConanSettingChanged);
            watcher.onDidDelete(onConanSettingChanged);
        } else {
            throw new Error("Unexpected error");
        }
    }

    function onConanSettingChanged() {
        // ggf. ne logger library verwenden, dann kannst den log-lever besser von aussen steuern.
        console.log('onConanSettingChanged');
        if(rootPath) {
            commandController.setState(loadConfig(rootPath));
        }
    }

    function loadConfig(workspaceFolderPath: string) {
        // hier die type-definitions von node verwenden.
        // https://www.npmjs.com/package/@types/node
        const fs = require('fs');
        if (fs.existsSync(settingsFile)) {
            config.update();
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
