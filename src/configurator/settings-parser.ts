import {Profile} from "./profile";
import * as vscode from 'vscode';
import {Workspace} from "./workspace";
import { GeneralSettings } from "./general-settings";
import { output } from "../extension";

export class SettingsParser {

    static convert(jsonData: string): Map<string, Profile> {
        interface ProfileObj {
            name: string;
            conanFile: string;
            profile: string;
            profileBuild: string;
            profileHost: string;
            installArg: string;
            buildArg: string;
            createArg: string;
            createUser: string;
            createChannel: string;
            enabled: boolean;
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
                            profileJson.profileBuild,
                            profileJson.profileHost,
                            profileJson.installArg,
                            profileJson.buildArg,
                            profileJson.createArg,
                            profileJson.createUser,
                            profileJson.createChannel,
                            profileJson.enabled));
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
            profileBuild: string;
            profileHost: string;
            arg: string;
            enabled: boolean;
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
                            workspaceJson.profileBuild,
                            workspaceJson.profileHost,
                            workspaceJson.arg,
                            workspaceJson.enabled);
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

    static readSettings(jsonData: string): GeneralSettings {
        interface GeneralSettingsObj {
            conanPath: string;
            profilesDir: string;
            workspacesDir: string;
            user: string;
            channel: string;
        }
        let generalSettings = new GeneralSettings();
        const jsonObj : { settings: GeneralSettingsObj } = JSON.parse(jsonData);
        if (jsonObj.settings) {
            generalSettings = new GeneralSettings(
                jsonObj.settings.conanPath,
                jsonObj.settings.profilesDir,
                jsonObj.settings.workspacesDir,
                jsonObj.settings.user,
                jsonObj.settings.channel
            );
        }
        return generalSettings;
    }

    static profilesFromDir(profilesDir: string): Map<string, Profile> {
        const fs = require('fs');
        const path = require('path');

        const profileDefaults =  {
            name: "",
            conanFile: path.join("${workspaceFolder}","conanfile.py"),
            profile: "",
            profileBuild: "",
            profileHost: "",
            installArg: "--build=missing",
            buildArg: "",
            createArg: "--build=missing",
            createUser: "default",
            createChannel: "development",
            enabled: true
        };

        const profiles = new Map<string, Profile>();
        output.appendLine(`Loading profiles from: ${profilesDir}`);
        console.log(`Loading profiles from: ${profilesDir}`);
        fs.readdirSync(profilesDir).forEach(function (profile_name: string) {
            output.appendLine(`Loading: ${profile_name}`);
            console.log(`Loading: ${profile_name}`);
            let profiles_path = path.join(profilesDir,profile_name);
            profiles.set(profile_name,
                new Profile(
                    profile_name,
                    profileDefaults.conanFile,
                    profiles_path,
                    profileDefaults.profileBuild,
                    profileDefaults.profileHost,
                    profileDefaults.installArg,
                    profileDefaults.buildArg,
                    profileDefaults.createArg,
                    profileDefaults.createUser,
                    profileDefaults.createChannel,
                    profileDefaults.enabled));
        });

        return profiles;
    }

    static workspacesFromDir(workspacesDir: string): Map<string, Workspace> {
        const fs = require('fs');
        const path = require('path');

        const workspaceDefaults =  {
            name: "",
            conanWs: ".",
            profile: "",
            profileBuild: "",
            profileHost: "",
            arg: "--build=missing",
            enabled: true
        };

        const yaml_re = /[.]y[a]?ml/;
        const workspaces = new Map<string, Workspace>();
        output.appendLine(`Loading workspaces from: ${workspacesDir}`);
        console.log(`Loading workspaces from: ${workspacesDir}`);
        fs.readdirSync(workspacesDir).forEach(function (workspace_name: string) {
            if (workspace_name.match(yaml_re)) {
                output.appendLine(`Loading: ${workspace_name}`);
                console.log(`Loading: ${workspace_name}`);
                let workspace_profile_path = path.join(workspacesDir,workspace_name);
                workspace_name = workspace_name.replace(yaml_re,"");
                workspaces.set(workspace_name,
                    new Workspace(
                        workspace_name,
                        workspaceDefaults.conanWs,
                        workspace_profile_path,
                        workspaceDefaults.profileBuild,
                        workspaceDefaults.profileHost,
                        workspaceDefaults.arg,
                        workspaceDefaults.enabled)
                    );
                }
            }
        );
        return workspaces;
    }
}