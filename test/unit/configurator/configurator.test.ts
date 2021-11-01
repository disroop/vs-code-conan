import "reflect-metadata";
import { expect } from 'chai';
import { container } from 'tsyringe';
import { Configurator } from '../../../src/configurator/configurator';
import { SystemPlugin } from '../../../src/system/plugin';
import { SystemPluginMock } from '../system-mock';


describe('Configurator', () => {
    it('can read profiles', () => {
        const filepath = "path";

        const configString = `{"profiles": [{ 
            "name":"a", 
            "conanFile":"\${workspaceFolder}/a/conanfile.py",
            "profile":"\${workspaceFolder}/.profile/a-profile",
            "installArg": "--build=missing",
            "buildArg":"",
            "createUser": "disroop",
            "createChannel": "development",
            "createArg": "--build=missing" 
        },
        { 
            "name":"b", 
            "conanFile":"\${workspaceFolder}/b/conanfile.py",
            "profile":"\${workspaceFolder}/.profile/b-profile",
            "installArg": "--build=missing",
            "buildArg":"",
            "createUser": "disroop",
            "createChannel": "development",
            "createArg": "--build=missing" 
        }
        ]}`;

        const system = container.resolve(SystemPluginMock);
        
        system.setFile(configString);
        // We can mock a class at any level in the dependency tree without touching anything else
        container.registerInstance(SystemPlugin,system);

        const configurator = new Configurator(filepath);
        let names = configurator.getAllNames();
        expect(names).to.eql(["a", "b"]); 
        
    });

    
});

