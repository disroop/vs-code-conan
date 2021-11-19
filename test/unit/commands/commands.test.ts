import "reflect-metadata";
import { expect } from 'chai';
import { container } from 'tsyringe';
import { Commands } from "../../../src/commands/commands";
import { SystemPluginMock } from '../system-mock';
import { ExecutorMock } from '../executor-mock';
import { Configurator } from "../../../src/configurator/configurator";
import * as testconfig from "../utils";

const configStringProfile = `{"profiles": [{ 
    "name":"a", 
    "conanFile":"\${workspaceFolder}/a/conanfile.py",
    "profile":"\${workspaceFolder}/.profile/a-profile",
    "installArg": "--build=missing",
    "buildArg":"test",
    "createUser": "disroop",
    "createChannel": "development",
    "createArg": "--build=missing" 
}
]}`;
const configStringWorkspace = `{"workspace": [
    { 
        "name":"ws-debug",
        "conanWs": "\${workspaceFolder}/.infrastructure/workspace/ws-linux.yml",
        "profile": "\${workspaceFolder}/.infrastructure/conan_config/profiles/clang-apple-debug",
        "arg": "--build=missing"
    }]}`;

describe('Commands', () => {
    it('can profile install', () => {
        testconfig.loadConfig(configStringProfile);
        const executor = <ExecutorMock>container.resolve("Executor");
        let commands = new Commands();
        commands.install("a");
        expect(executor.command).to.eql("conan install --profile:build root-workspace/.profile/a-profile --profile:host root-workspace/.profile/a-profile --build=missing --install-folder build/a root-workspace/a/conanfile.py"); 
    });
    it('can workspace install', () => {
        testconfig.loadConfig(configStringWorkspace);
        const executor = <ExecutorMock>container.resolve("Executor");

        let commands = new Commands();

        commands.install("ws-debug");
        expect(executor.command).to.eql("conan workspace install --profile:build root-workspace/.infrastructure/conan_config/profiles/clang-apple-debug --profile:host root-workspace/.infrastructure/conan_config/profiles/clang-apple-debug --build=missing --install-folder build/ws-debug root-workspace/.infrastructure/workspace/ws-linux.yml"); 
    });

    it('can build profile', () => {
        testconfig.loadConfig(configStringProfile);
        const executor = <ExecutorMock>container.resolve("Executor");

        let commands = new Commands();

        commands.build("a");
        expect(executor.command).to.eql("conan build test --build-folder build/a root-workspace/a/conanfile.py"); 
    });

    it('can create profile', () => {
        testconfig.loadConfig(configStringProfile);
        const executor = <ExecutorMock>container.resolve("Executor");

        let commands = new Commands();

        commands.create("a");
        expect(executor.command).to.eql("conan create --profile:build root-workspace/.profile/a-profile --profile:host root-workspace/.profile/a-profile --build=missing root-workspace/a/conanfile.py disroop/development"); 
    });
});

