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
            "aName",
            "aConanFile",
            "aProfile",
            "aInstallArg",
            "aBuildArg",
            "aCreateArg",
            "aCreateUser",
            "aCreateChannel",
            "blub",
            "bla",
            new SystemPluginMock()
        );
        expect(profile.getConanFile()).to.equal("aConanFile");
    });
});