import { expect } from 'chai';
import { Profile, Workspace } from '../../../src/configurator/profile';
import { System } from "../../../src/system/interface";

class SystemPluginMock implements System{
    getWorkspaceRootPath(){
        return 'root-workspace';
    }
}

describe('Profile', () => {
    it('can be initialized', () => {
        const profile = new Profile(
            new SystemPluginMock(),
            "aName",
            "aConanFile",
            "aProfile",
            "aProfileBuild",
            "aProfileHost",
            "aInstallArg",
            "aBuildArg",
            "aCreateArg",
            "aCreateUser",
            "aCreateChannel");
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
        const profile = new Profile(new SystemPluginMock());
        expect(profile.buildFolder).to.equal("build/default");
        expect(profile.conanfilePath).to.equal(".");
        expect(profile.profile).to.equal("");
        expect(profile.profileBuild).to.equal("");
        expect(profile.profileHost).to.equal("");
        expect(profile.installArg).to.equal("");
        expect(profile.buildArg).to.equal("");
        expect(profile.createArg).to.equal("");
        expect(profile.createUser).to.equal("");
        expect(profile.createChannel).to.equal("");      
    });

    it('can use workspace-folder', () => {
        const profile = new Profile(new SystemPluginMock(), 
        "test",
        "${workspaceFolder}/aConanFile",
        "${workspaceFolder}/aProfile",
        "${workspaceFolder}/aProfileBuild",
        "${workspaceFolder}/aProfileHost",);
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
        const workspace = new Workspace(
            new SystemPluginMock(),
            "aName",
            "aConanWs",
            "aProfile",
            "aProfileBuild",
            "aProfileHost",
            "aArg");
        expect(workspace.buildFolder).to.equal("build/aName");
        expect(workspace.conanworkspacePath).to.equal("aConanWs");
        expect(workspace.profile).to.equal("aProfile");
        expect(workspace.profileBuild).to.equal("aProfileBuild");
        expect(workspace.profileHost).to.equal("aProfileHost");
        expect(workspace.arg).to.equal("aArg");
    });

    it('can use default parameter', () => {
        const workspace = new Workspace(new SystemPluginMock());
        expect(workspace.buildFolder).to.equal("build/default");
        expect(workspace.conanworkspacePath).to.equal(".");
        expect(workspace.profile).to.equal("");
        expect(workspace.profileBuild).to.equal("");
        expect(workspace.profileHost).to.equal("");
        expect(workspace.arg).to.equal("");    
    });

    it('can use workspace-folder', () => {
        const workspace = new Workspace(new SystemPluginMock(), 
        "test",
        "${workspaceFolder}/path",
        "${workspaceFolder}/aProfile",
        "${workspaceFolder}/aProfileBuild",
        "${workspaceFolder}/aProfileHost",);
        expect(workspace.buildFolder).to.equal("build/test");
        expect(workspace.conanworkspacePath).to.equal("root-workspace/path");
        expect(workspace.profile).to.equal("root-workspace/aProfile");
        expect(workspace.profileBuild).to.equal("root-workspace/aProfileBuild");
        expect(workspace.profileHost).to.equal("root-workspace/aProfileHost");
        expect(workspace.arg).to.equal("");     
    });
});