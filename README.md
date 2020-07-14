# Disroop vs-code-conan extension

The VsCode Conan extension helps with integrating conan into vscode

## Features

- Install Conan packages
- Build Conan Packages
- Create Conan Packages
- Supports Multiple Profiles

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
            "profile":"clang-linux",
            "installArg": "--build missing",
            "buildArg":"",
            "createArg":"disroop/development" 
        },
        { 
            "name":"arm-debug", 
            "profile":"gcc-arm-debug",
            "installArg": "--build missing",
            "buildArg":"",
            "createArg":"disroop/development" 
        },
        { 
            "name":"arm-release", 
            "profile":"gcc-arm-release",
            "installArg": "--build missing",
            "buildArg":"",
            "createArg":"disroop/development" 
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
