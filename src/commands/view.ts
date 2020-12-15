import * as vscode from 'vscode';

export class CommandView {
    static registerInstallButton(command: string) {
        let installSubprocessStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -101);
        installSubprocessStatusBarItem.text = "$(cloud-download)";
        installSubprocessStatusBarItem.tooltip = "conan install";
        installSubprocessStatusBarItem.command = command;
        installSubprocessStatusBarItem.hide();
        return installSubprocessStatusBarItem;
    }

    static registerBuildButton(command: string) {
        let buildStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -102);
        buildStatusBarItem.text = "$(run)";
        buildStatusBarItem.tooltip = "conan build";
        buildStatusBarItem.command = command;
        buildStatusBarItem.hide();
        return buildStatusBarItem;
    }

    static registerCreateButton(command: string) {
        let createStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -103);
        createStatusBarItem.text = "$(gift)";
        createStatusBarItem.tooltip = "conan create";
        createStatusBarItem.command = command;
        createStatusBarItem.hide();
        return createStatusBarItem;
    }
}