# Disroop vs-code-conan extension

The VsCode Conan extension helps with integrating conan into vscode.

## Features

- Install Conan packages
- Build Conan Packages
- Create Conan Packages
- Supports Multiple Profiles

### Install and build packages

To install and build your the conan package use the instal and the build button at the bottom!

![Build and install](images/installbuild.gif)

### Create Packages

To create package use the create button at the bottom!

![Build and install](images/create.gif)

### Install Workspace

To install a conan workspace use the install workspace button at the bottom!

![Build and install](images/workspace.gif)

## Requirements

Conan needs to be installed and currently only runs on linux (in the future windows will be supported).

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
            "arg": "--build missing"
        }
    ]
}
```

## Release Notes

### 0.3.1

- remove cleanup befor installing

### 0.3.0

- add progress window
- cancel conan process

### 0.2.2

- bugfix: workspace: enable profiles from workspace same as profile

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