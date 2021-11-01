import "reflect-metadata";
import { expect } from 'chai';
import { container } from 'tsyringe';
import { Configurator } from '../../../src/configurator/configurator';
import { SystemPlugin } from '../../../src/system/plugin';
import { SystemPluginMock } from '../system-mock';
interface ConanProfileConfig{
    conanfile:string;
    profile:string;
    installArgument:string;
    buildArgument:string;
    createUser:string;
    createChannel:string;
    createArgument:string;
    buildFolder:string;
}
interface ConanWorkspaceConfig{
    workspacePath:string;
    profile:string;
    arguments:string;
}
function checkConfigurationProfile(configurator:Configurator , name:string, exptected:ConanProfileConfig){
    expect(configurator.isWorkspace(name)).to.be.false;
    expect(configurator.getConanFile(name)).to.equal(exptected.conanfile);
    expect(configurator.getBuildArg(name)).to.equal(exptected.buildArgument);
    expect(configurator.getBuildFolder(name)).to.equal(exptected.buildFolder);
    expect(configurator.getCreateArg(name)).to.equal(exptected.createArgument);
    expect(configurator.getCreateChannel(name)).to.equal(exptected.createChannel);
    expect(configurator.getCreateUser(name)).to.equal(exptected.createUser);
    expect(configurator.getInstallArg(name)).to.equal(exptected.installArgument);
}
function checkConfigurationWorkspace(configurator:Configurator , name:string, exptected:ConanWorkspaceConfig){
    expect(configurator.isWorkspace(name)).to.be.true;
    expect(configurator.getConanFile(name)).to.equal(exptected.workspacePath);
    expect(configurator.getProfile(name)).to.equal(exptected.profile);
    expect(configurator.getInstallArg(name)).to.equal(exptected.arguments);
}
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
        
        checkConfigurationProfile(configurator,"a",{ conanfile:"root-workspace/a/conanfile.py",
            profile:"root-workspace/.profile/a-profile",
            installArgument:"--build=missing",
            buildArgument:"",
            createUser:"disroop",
            createChannel:"development",
            createArgument:"--build=missing",
            buildFolder:"build/a"});
       
        checkConfigurationProfile(configurator,"b",{ conanfile:"root-workspace/b/conanfile.py",
            profile:"root-workspace/.profile/b-profile",
            installArgument:"--build=missing",
            buildArgument:"",
            createUser:"disroop",
            createChannel:"development",
            createArgument:"--build=missing",
            buildFolder:"build/b"});
        
    });

    it('can read workspaces', () => {
        const filepath = "path";

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

        const system = container.resolve(SystemPluginMock);
        
        system.setFile(configString);
        // We can mock a class at any level in the dependency tree without touching anything else
        container.registerInstance(SystemPlugin,system);

        const configurator = new Configurator(filepath);
        let names = configurator.getAllNames();
        expect(names).to.eql(["ws-debug","ws-debug-2"]); 
        
        checkConfigurationWorkspace(configurator,"ws-debug-2",{ workspacePath:"root-workspace/workspace/ws-arm.yml",
            profile:"root-workspace/.profile/clang",
            arguments:"--build=missing"});
       
        
    });
});

