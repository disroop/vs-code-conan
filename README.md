# Disroop vs-code-conan extension

The VsCode Conan extension helps with integrating conan into vscode


## Features

- Install Conan packages
- Build Conan Packages
- Create Conan Packages
- Supports Multiple Profiles

### Install and build
To install and build your the conan package use the instal and the build button at the bottom!

![Build and install](doc/buildinstall.gif)

## Requirements

Conan needs to be installed

## Extension Settings

Set the settings in the `./vscode/conan-settings.json` file.

For example:

```json
{
    "profiles": [
        {
            "name":"linux-debug",
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
            "profile":"arm-cortex-m4-release",
            "installArg": "--build missing",
            "buildArg":"",
            "createUser": "disroop",
            "createChannel": "development",
            "createArg":"--build=missing"
        }
    ]
}
```

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Test Release


-----------------------------------------------------------------------------------------------------------

## Working with Markdown


### For more information


**Enjoy!**
