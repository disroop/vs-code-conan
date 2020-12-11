import {Profile} from "./profile";
import * as vscode from 'vscode';
import {Workspace} from "./workspace";

export class SettingsParser {

    static convert(jsonData: string): Map<string, Profile> {
        interface ProfileObj {
            name: string;
            conanFile: string;
            profile: string;
            installArg: string;
            buildArg: string;
            createArg: string;
            createUser: string;
            createChannel: string;
        }

        const jsonObj: { profiles: ProfileObj[] } = JSON.parse(jsonData);
        const profiles = new Map<string, Profile>();
        let counterNonValidSettings = 0;
        if (jsonObj.profiles) {
            jsonObj.profiles.forEach(function (profileJson) {
                if (profileJson.name !== undefined && profileJson.name.length > 0) {
                    if (!profiles.has(profileJson.name)) {
                        profiles.set(profileJson.name, new Profile(
                            profileJson.name,
                            profileJson.conanFile,
                            profileJson.profile,
                            profileJson.installArg,
                            profileJson.buildArg,
                            profileJson.createArg,
                            profileJson.createUser,
                            profileJson.createChannel));
                    } else {
                        vscode.window.showWarningMessage("Profile with name: " + profileJson.name + " already exist! Use first setting in settings.json.");
                    }
                } else {
                    counterNonValidSettings++;
                }
            });
            if (counterNonValidSettings > 0) {
                vscode.window.showWarningMessage(counterNonValidSettings + " Not valid profiles: Profiles in settings.json with no correct name!");
            }
        }
        return new Map(profiles);
    }

    static convertWs(jsonData: string): Map<string, Workspace> {
        interface WorkspaceObj {
            name: string;
            conanWs: string;
            profile: string;
            arg: string;
        }

        const jsonObj: { workspace: WorkspaceObj[] } = JSON.parse(jsonData);
        const workspaces = new Map<string, Workspace>();
        let counterNonValidSettings = 0;
        if (jsonObj.workspace) {
            jsonObj.workspace.forEach(function (workspaceJson) {
                if (workspaceJson.name !== undefined && workspaceJson.name.length > 0) {
                    if (!workspaces.has(workspaceJson.name)) {
                        let workspace = new Workspace(workspaceJson.name,
                            workspaceJson.conanWs,
                            workspaceJson.profile,
                            workspaceJson.arg);
                        workspaces.set(workspaceJson.name, workspace);
                    } else {
                        vscode.window.showWarningMessage("Workspace with name: " + workspaceJson.name + " already exist! Use first setting in settings.json.");
                    }
                } else {
                    counterNonValidSettings++;
                }
            });
            if (counterNonValidSettings > 0) {
                vscode.window.showWarningMessage(counterNonValidSettings + " Not valid workspaces: Workspaces in settings.json with no correct name!");
            }
        }
        return new Map(workspaces);
    }
}