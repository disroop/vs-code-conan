

import { expect } from 'chai';
import { container } from 'tsyringe';
import { Generator } from '../../../src/configurator/generator';
import { SystemPluginFake } from '../system-fake';


describe('Generator', () => {
    it('writeFile', async () => {
        const generator = new Generator("OUTPUT");
        await generator.generateConfigTemplate();
        const system = <SystemPluginFake>container.resolve("System");
        let expectedJsonFile = `{
            "profiles":[
                {
                    "name":"root",
                    "conanFile":"\./conanfile.py",
                    "profile":"default",
                    "installArg":"",
                    "buildArg":"",
                    "createUser":"disroop",
                    "createChannel":"development",
                    "createArg":""
                },
                {
                    "name":"root-txt",
                    "conanFile":"\./conanfile.txt",
                    "profile":"default",
                    "installArg":"",
                    "buildArg":"",
                    "createUser":"disroop",
                    "createChannel":"development",
                    "createArg":""
                },
                {
                    "name":"root-gcc",
                    "conanFile":"\./conanfile.py",
                    "profile":"gcc",
                    "installArg":"",
                    "buildArg":"",
                    "createUser":"disroop",
                    "createChannel":"development",
                    "createArg":""
                },
                {
                    "name":"root-txt-gcc",
                    "conanFile":"\./conanfile.txt",
                    "profile":"gcc",
                    "installArg":"",
                    "buildArg":"",
                    "createUser":"disroop",
                    "createChannel":"development",
                    "createArg":""
                }
                ]}`;
        //Format String
        var jsonFormatted = JSON.stringify(JSON.parse(expectedJsonFile),null,4);
        expect(system.writeFileContent).to.equal(jsonFormatted);

    });
});

