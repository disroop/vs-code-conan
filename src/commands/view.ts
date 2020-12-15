import * as vscode from 'vscode';


export class CommandView{
    static registerInstallButton(command: string) {
        let instalsubprocesstatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -101);
        instalsubprocesstatusBarItem.text = "$(cloud-download)";
        instalsubprocesstatusBarItem.tooltip = "conan install";
        instalsubprocesstatusBarItem.command = command;
        instalsubprocesstatusBarItem.hide();
        return instalsubprocesstatusBarItem;
    }
    static regitsterBuildButton(command: string) {
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