import "reflect-metadata";
import { expect } from 'chai';
import { container } from 'tsyringe';
import { Profile, ProfileJson, Workspace, WorkspaceJson } from '../../../src/configurator/profile';
import { SystemPlugin } from '../../../src/system/plugin';
import { SystemPluginMock } from '../system-mock';

describe('Profile', () => {
    it('can be initialized', () => {

        const profileJson: ProfileJson = {
            "name": "aName",
            "conanFile": "aConanFile",
            "profile": "aProfile",
            "profileBuild": "aProfileBuild",
            "profileHost": "aProfileHost",
            "installArg": "aInstallArg",
            "buildArg": "aBuildArg",
            "createArg": "aCreateArg",
            "createUser": "aCreateUser",
            "createChannel": "aCreateChannel"
        };
        const profile = new Profile(profileJson);
        expect(profile.buildFolder).to.equal("build/aName");
        expect(profile.conanfilePath).to.equal("aConanFile");
        expect(profile.profile).to.equal("aProfile");
        expect(profile.profileBuild).to.equal("aProfileBuild");
        expect(profile.profileHost).to.equal("aProfileHost");
        expect(profile.installArg).to.equal("aInstallArg");
        expect(profile.buildArg).to.equal("aBuildArg");
        expect(profile.createArg).to.equal("aCreateArg");
        expect(profile.createUser).to.equal("aCreateUser");
        expect(profile.createChannel).to.equal("aCreateChannel");
    });

    it('can use default parameter', () => {
        const profileJson: ProfileJson = {
            "name": "default"
        };
        const profile = new Profile(profileJson);
        expect(profile.buildFolder).to.equal("build/default");
        expect(profile.conanfilePath).to.equal(".");
        expect(profile.profile).to.equal(undefined);
        expect(profile.profileBuild).to.equal(undefined);
        expect(profile.profileHost).to.equal(undefined);
        expect(profile.installArg).to.equal("");
        expect(profile.buildArg).to.equal("");
        expect(profile.createArg).to.equal("");
        expect(profile.createUser).to.equal("");
        expect(profile.createChannel).to.equal("");
    });

    it('can use workspace-folder', () => {
        const profileJson: ProfileJson = {
            "name": "test",
            "conanFile": "${workspaceFolder}/aConanFile",
            "profile": "${workspaceFolder}/aProfile",
            "profileBuild": "${workspaceFolder}/aProfileBuild",
            "profileHost": "${workspaceFolder}/aProfileHost",
        };
        const profile = new Profile(profileJson);
        expect(profile.buildFolder).to.equal("build/test");
        expect(profile.conanfilePath).to.equal("root-workspace/aConanFile");
        expect(profile.profile).to.equal("root-workspace/aProfile");
        expect(profile.profileBuild).to.equal("root-workspace/aProfileBuild");
        expect(profile.profileHost).to.equal("root-workspace/aProfileHost");
        expect(profile.installArg).to.equal("");
        expect(profile.buildArg).to.equal("");
        expect(profile.createArg).to.equal("");
        expect(profile.createUser).to.equal("");
        expect(profile.createChannel).to.equal("");
    });
});


describe('Workspace', () => {
    it('can be initialized', () => {
        const workspaceJson: WorkspaceJson = {
            "name": "test",
            "conanWs": "aConanWs",
            "profile": "aProfile",
            "profileBuild": "aProfileBuild",
            "profileHost": "aProfileHost",
            "arg":"aArg",
        };
        const workspace = new Workspace(workspaceJson);
        expect(workspace.buildFolder).to.equal("build/test");
        expect(workspace.conanworkspacePath).to.equal("aConanWs");
        expect(workspace.profile).to.equal("aProfile");
        expect(workspace.profileBuild).to.equal("aProfileBuild");
        expect(workspace.profileHost).to.equal("aProfileHost");
        expect(workspace.arg).to.equal("aArg");
    });

    it('can use default parameter', () => {
        const workspaceJson: WorkspaceJson = {
            "name": "test",
        };
        const workspace = new Workspace(workspaceJson);
        expect(workspace.buildFolder).to.equal("build/test");
        expect(workspace.conanworkspacePath).to.equal(".");
        expect(workspace.profile).to.equal(undefined);
        expect(workspace.profileBuild).to.equal(undefined);
        expect(workspace.profileHost).to.equal(undefined);
        expect(workspace.arg).to.equal("");
    });

    it('can use workspace-folder', () => {
        const workspaceJson: WorkspaceJson = {
            "name": "test",
            "conanWs": "${workspaceFolder}/path",
            "profile": "${workspaceFolder}/aProfile",
            "profileBuild": "${workspaceFolder}/aProfileBuild",
            "profileHost": "${workspaceFolder}/aProfileHost",
        };
        const workspace = new Workspace(workspaceJson);
        expect(workspace.buildFolder).to.equal("build/test");
        expect(workspace.conanworkspacePath).to.equal("root-workspace/path");
        expect(workspace.profile).to.equal("root-workspace/aProfile");
        expect(workspace.profileBuild).to.equal("root-workspace/aProfileBuild");
        expect(workspace.profileHost).to.equal("root-workspace/aProfileHost");
        expect(workspace.arg).to.equal("");
    });
});