

import { expect } from 'chai';
import { container} from 'tsyringe';
import { Configurator } from '../../../src/configurator/configurator';
import * as testconfig from "../utils";


describe('Configurator', () => {
    it('can read profiles', async () => {
        const configString = `{"profiles": [{ 
            "name":"a", 
            "conanFile":"\${workspaceFolder}/a/conanfile.py",
            "profile":"\${workspaceFolder}/.profile/a-profile",
            "installArg": "--build=missing",
            "buildArg":"test",
            "createUser": "disroop",
            "createChannel": "development",
            "createArg": "--build=missing" 
        },
        { 
            "name":"b", 
            "conanFile":"\${workspaceFolder}/b/conanfile.py",
            "profile":"\${workspaceFolder}/.profile/b-profile",
           "installArg": "",
           "buildArg":"",
           "createUser": "disroop",
           "createChannel": "development",
           "createArg": "" 
       }
       ]}`;
        await testconfig.loadConfig(configString);
        const configurator = container.resolve(Configurator);
        let names = configurator.getAllNames();
        expect(names).to.eql(["a", "b"]); 

        expect(configurator.getConan("a")).to.eql({path: "/root-workspace/a/conanfile.py",
            user: "disroop",
            channel: "development",
            installProfile: {build: "/root-workspace/.profile/a-profile", host: "/root-workspace/.profile/a-profile"},
            installArguments: "--build=missing",
            createArguments: "--build=missing",
            buildArguments: "test",
            buildFolder: "build/a",
            createProfile: {build: "/root-workspace/.profile/a-profile", host: "/root-workspace/.profile/a-profile"},
            installFolder: "build/a",
        }); 

        expect(configurator.getConan("b")).to.eql({path: "/root-workspace/b/conanfile.py",
            user: "disroop",
            channel: "development",
            installProfile: {build: "/root-workspace/.profile/b-profile", host: "/root-workspace/.profile/b-profile"},
            installArguments: "",
            createArguments: "",
            buildArguments: "",
            buildFolder: "build/b",
            createProfile: {build: "/root-workspace/.profile/b-profile", host: "/root-workspace/.profile/b-profile"},
            installFolder: "build/b",
        }); 

        expect(configurator.isWorkspace("a")).to.be.false;
        expect(configurator.isWorkspace("b")).to.be.false;
        
    });

    it('can read workspaces', async () => {
        const configString = `{"workspace": [
            { 
                "name":"ws-debug",
                "conanWs": "\${workspaceFolder}/workspace/ws-linux.yml",
                "profile": "\${workspaceFolder}/.profile/clang-apple-debug",
                "arg": "--build=missing"
            },
            { 
                "name":"ws-debug-2",
                "conanWs": "\${workspaceFolder}/workspace/ws-arm.yml",
                "profile": "\${workspaceFolder}/.profile/clang",
                "arg": "--build=missing"
            }
        ]}`;

        await testconfig.loadConfig(configString);
        const configurator = container.resolve(Configurator);
        let names = configurator.getAllNames();
        expect(names).to.eql(["ws-debug","ws-debug-2"]); 
        
        expect(configurator.getWorkspace("ws-debug")).to.eql({path: "/root-workspace/workspace/ws-linux.yml",
            installProfile: {build: "/root-workspace/.profile/clang-apple-debug", host: "/root-workspace/.profile/clang-apple-debug"},
            installArguments: "--build=missing",
            installFolder: "build/ws-debug",
        }); 

        expect(configurator.getWorkspace("ws-debug-2")).to.eql({path: "/root-workspace/workspace/ws-arm.yml",
            installProfile: {build: "/root-workspace/.profile/clang", host: "/root-workspace/.profile/clang"},
            installArguments: "--build=missing",
            installFolder: "build/ws-debug-2",
        }); 

        expect(configurator.isWorkspace("ws-debug")).to.be.true;
        expect(configurator.isWorkspace("ws-debug-2")).to.be.true;

    });

    it('can read duplication', async () => {
        const configString = `{"profiles": [{ 
                "name":"a", 
                "conanFile":"\${workspaceFolder}/a/conanfile.py",
                "profile":"\${workspaceFolder}/.profile/a-profile",
                "installArg": "--build=missing",
                "buildArg":"",
                "createUser": "disroop",
                "createChannel": "development",
                "createArg": "--build=missing" 
            }
            ],
            "workspace": [
            { 
                "name":"a",
                "conanWs": "\${workspaceFolder}/workspace/ws-arm.yml",
                "profile": "\${workspaceFolder}/.profile/clang",
                "arg": "--build=missing"
            }
        ]}`;

        await testconfig.loadConfig(configString);
        const configurator = container.resolve(Configurator);
        expect(() => configurator.getAllNames()).to.throw('Duplication of names in profile and workspace');
    });

    it('can read configuration by arguments', async () => {
        const configString = `{"profiles": [{ 
                "name":"a", 
                "conanFile":"\${workspaceFolder}/a/conanfile.py",
                "profile":"a-profile",
                "installArg": "--build=missing -if a/b/c -pr:b b -pr:h a",
                "buildArg":"",
                "createUser": "disroop",
                "createChannel": "development",
                "createArg": "--build=missing" 
            }
            ]}`;

        await testconfig.loadConfig(configString);
        const configurator = container.resolve(Configurator);
        let argument = configurator.getConan("a");

        expect(argument.installFolder).to.equal("a/b/c");
        expect(argument.installProfile.build).to.equal("b");
        expect(argument.installProfile.host).to.equal("a");
        expect(argument.createProfile?.build).to.equal("a-profile");
        expect(argument.createProfile?.host).to.equal("a-profile");
        
    });

    it('throws error on profile with profile-host/build in argument', async () => {
        const configString = `{"profiles": [{ 
                "name":"a", 
                "conanFile":"\${workspaceFolder}/a/conanfile.py",
                "profile":"a-profile",
                "installArg": "--build=missing -if a/b/c -pr c -pr:b b -pr:h a",
                "buildArg":"",
                "createUser": "disroop",
                "createChannel": "development",
                "createArg": "--build=missing" 
            }
            ]}`;

        await testconfig.loadConfig(configString);
        const configurator = container.resolve(Configurator);
        
        expect(() => configurator.getConan("a")).to.throw("Can't define profile with profile-host or profile-build.");
    });

    it('throws error on no workspace', () => {
        const configString = `{}`;

        testconfig.loadConfig(configString);
        const configurator = container.resolve(Configurator);
        
        expect(() => configurator.getWorkspace("a")).to.throw("No workspace found with this name a.");
        
    });

    it('throws error on no profile', async () => {
        const configString = `{}`;

        await testconfig.loadConfig(configString);
        const configurator = container.resolve(Configurator);
        
        expect(() => configurator.getConan("a")).to.throw("No profile found with this name a.");
        
    });

    it('can set default profiles', async () => {
        const configString = `{"profiles": [{ 
                "name":"a",
                "installArg": "--build=missing -pr:h a"
            }
            ]}`;

        await testconfig.loadConfig(configString);
        const configurator = container.resolve(Configurator);
        let argument = configurator.getConan("a");

        expect(argument.installProfile.build).to.equal("default");
        expect(argument.installProfile.host).to.equal("a");
        expect(argument.createProfile?.build).to.equal("default");
        expect(argument.createProfile?.host).to.equal("default");        
    });
});

