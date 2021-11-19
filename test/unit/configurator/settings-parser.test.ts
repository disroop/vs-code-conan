import { SettingsParser } from "../../../src/configurator/settings-parser";
import { expect } from 'chai';
import { container } from 'tsyringe';
import { SystemPluginMock } from '../system-mock';


describe('SettingParser', () => {
    it('get profiles', () => {
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

    it('non profile name',() => {
        const system = <SystemPluginMock>container.resolve("System");

        const simpleDataSet = `{"profiles": [
            { 
                "name":""
            }]}`;

        let parser = new SettingsParser(simpleDataSet);
        const profiles = parser.getProfiles();
        
        expect(profiles?.size).to.equal(0);
        expect(system.warningMessage?.length).above(0);
    });

    it('double profile name',() => {
        const system = <SystemPluginMock>container.resolve("System");

        const simpleDataSet = `{"profiles": [
            { 
                "name":"double"
            },
            { 
                "name":"double"
            }]}`;

        let parser = new SettingsParser(simpleDataSet);
        const profiles = parser.getProfiles();
        
        expect(profiles?.size).to.equal(1);
        expect(system.warningMessage?.length).above(0);
    });

    it('get workspace', () => {
        const simpleDataSet = `{"workspace": [
            { 
                "name":"ws-debug",
                "conanWs": "\${workspaceFolder}/.infrastructure/workspace/ws-linux.yml",
                "profile": "\${workspaceFolder}/.infrastructure/conan_config/profiles/clang-apple-debug",
                "arg": "--build=missing"
            }]}`;

            
        let parser = new SettingsParser(simpleDataSet);
        const workspaces = parser.getWorkspaces();
        
        expect(workspaces?.size).to.equal(1);
        expect(workspaces?.has("ws-debug")).true;
        const wsdebug = workspaces?.get("ws-debug");
        expect(wsdebug?.buildFolder).to.equal("build/ws-debug");
        expect(wsdebug?.conanworkspacePath).to.equal("root-workspace/.infrastructure/workspace/ws-linux.yml");
        expect(wsdebug?.arg).to.equal("--build=missing");
        expect(wsdebug?.profile).to.equal("root-workspace/.infrastructure/conan_config/profiles/clang-apple-debug");
    });

    it('non workspace name',() => {
        const system = <SystemPluginMock>container.resolve("System");
        const simpleDataSet = `{"workspace": [
            { 
                "name":""
            }]}`;

        let parser = new SettingsParser(simpleDataSet);
        const workspaces = parser.getWorkspaces();
        
        expect(workspaces?.size).to.equal(0);
        expect(system.warningMessage?.length).above(0);
    });

    it('douple workspace name',() => {
        const system = <SystemPluginMock>container.resolve("System");

        const simpleDataSet = `{"workspace": [
            { 
                "name":"double"
            },
            { 
                "name":"double"
            }]}`;

        let parser = new SettingsParser(simpleDataSet);
        const workspaces = parser.getWorkspaces();
        
        expect(workspaces?.size).to.equal(1);
        expect(system.warningMessage?.length).above(0);
    });
});
