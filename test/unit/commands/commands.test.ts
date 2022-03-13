import "reflect-metadata";
import { expect } from 'chai';
import { container } from 'tsyringe';
import { Commands } from "../../../src/commands/commands";
import { SystemPluginFake } from '../system-fake';
import { ExecutorFake } from '../executor-fake';
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
    it('can profile install', async () => {
        await testconfig.loadConfig(configStringProfile);
        const executor = <ExecutorFake>container.resolve("Executor");
        let commands = new Commands();
        commands.install("a");
        expect(executor.command).to.eql("conan install --profile:build ./.profile/a-profile --profile:host ./.profile/a-profile --build=missing --install-folder build/a ./a/conanfile.py"); 
    });
    it('can workspace install', async () => {
        await testconfig.loadConfig(configStringWorkspace);
        const executor = <ExecutorFake>container.resolve("Executor");

        let commands = new Commands();

        commands.install("ws-debug");
        expect(executor.command).to.eql("conan workspace install --profile:build ./.infrastructure/conan_config/profiles/clang-apple-debug --profile:host ./.infrastructure/conan_config/profiles/clang-apple-debug --build=missing --install-folder build/ws-debug ./.infrastructure/workspace/ws-linux.yml"); 
    });

    it('can build profile', async () => {
        await testconfig.loadConfig(configStringProfile);
        const executor = <ExecutorFake>container.resolve("Executor");

        let commands = new Commands();

        commands.build("a");
        expect(executor.command).to.eql("conan build test --build-folder build/a ./a/conanfile.py"); 
    });

    it('can create profile', async () => {
        await testconfig.loadConfig(configStringProfile);
        const executor = <ExecutorFake>container.resolve("Executor");

        let commands = new Commands();

        commands.create("a");
        expect(executor.command).to.eql("conan create --profile:build ./.profile/a-profile --profile:host ./.profile/a-profile --build=missing ./a/conanfile.py disroop/development"); 
    });

    it('can read all profiles', () => {
        let commands = new Commands();
        let profiles = commands.getAllProfiles();
        expect(profiles).to.eql([`default`, `gcc`]);
    });
});

