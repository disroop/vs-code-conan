import { expect } from 'chai';
import { Profile } from '../../../src/configurator/profile';
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
        expect(profile.conanFile).to.equal("aConanFile");
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
        expect(profile.conanFile).to.equal(".");
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
        expect(profile.conanFile).to.equal("root-workspace/aConanFile");
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