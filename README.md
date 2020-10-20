# Disroop vs-code-conan extension

The VsCode Conan extension helps with integrating conan into vscode.

## Features

- Install Conan packages
- Build Conan Packages
- Create Conan Packages
- Supports Multiple Profiles

### Install and build

To install and build your the conan package use the instal and the build button at the bottom!

![Build and install](images/installbuild.gif)

### Create

To create package use the create button at the bottom!

![Build and install](images/create.gif)

## Requirements

Conan needs to be installed

## Extension Settings

Set the settings in the `./vscode/conan-settings.json` file.

For example:

```json
{
    "profiles": [
        {
            "name":"linux",
            "conanFile": "${workspaceFolder}/conanfile.py",
            "profile":"clang-linux-debug",
            "installArg": "--build missing",
            "buildArg":"",
            "createUser": "disroop",
            "createChannel": "development",
            "createArg":"--build=missing"
        },
        {
            "name":"arm-debug",
            "conanFile": "${workspaceFolder}/conanfile.py",
            "profile":"arm-cortex-m4-debug",
            "installArg": "--build missing",
            "buildArg":"",
            "createUser": "disroop",
            "createChannel": "development",
            "createArg":"--build=missing"
        },
        {
            "name":"arm-release",
            "conanFile": "${workspaceFolder}/conanfile.py",
            "profile":"${workspaceFolder}/arm-cortex-m4-release",
            "installArg": "--build missing",
            "buildArg":"",
            "createUser": "disroop",
            "createChannel": "development",
            "createArg":"--build=missing"
        }
    ],
    "workspace":[
        {
            "name":"ws-arm",
            "conanWs": "${workspaceFolder}/conan-ws",
            "profile":"arm-cortex-m4-release",
            "Arg": "--build missing"
        }
    ]
}
```

## Release Notes

### 0.2.1

- bugfix: continue if profiles or workspace doesn't exist

### 0.2.0

- enable conan workspace install
- add tooltip hint over buttons

### 0.1.0

- use profile from workspace-folder

### 0.0.1

- Install Conan packages
- Build Conan Packages
- Create Conan Packages
- Supports Multiple Profiles
- Set conanFile parameter in settings