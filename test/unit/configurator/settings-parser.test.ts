import { SettingsParser } from "../../../src/configurator/settings-parser";
import { System } from "../../../src/system/interface";
import { expect } from 'chai';
import { container } from 'tsyringe';
import { SystemPlugin } from "../../../src/system/plugin";
import { SystemPluginMock } from '../system-mock';


describe('SettingParser', () => {
    it('get profiles', () => {
        // We can mock a class at any level in the dependency tree without touching anything else
        container.registerInstance(SystemPlugin, new SystemPluginMock());

        const simpleDataSet = `{"profiles": [
            { 
                "name":"a", 
                "conanFile":"\${workspaceFolder}/a/conanfile.py",
                "profile":"\${workspaceFolder}/.infrastructure/conan_config/profiles/clang-apple-debug",
                "installArg": "--build=missing",
                "buildArg":"",
                "createUser": "disroop",
                "createChannel": "development",
                "createArg": "--build=missing" 
            }]}`;

        let parser = new SettingsParser(simpleDataSet);
        const profiles = parser.getProfiles();
        
        expect(profiles?.size).to.equal(1);
        expect(profiles?.has("a")).true;
        const a_value = profiles?.get("a");
        expect(a_value?.buildArg).to.equal("");
        expect(a_value?.buildFolder).to.equal("build/a");
        expect(a_value?.conanfilePath).to.equal("root-workspace/a/conanfile.py");
        expect(a_value?.buildArg).to.equal("");
        expect(a_value?.installArg).to.equal("--build=missing");
        expect(a_value?.createUser).to.equal("disroop");
        expect(a_value?.createChannel).to.equal("development");
        expect(a_value?.createArg).to.equal("--build=missing");
    });
});