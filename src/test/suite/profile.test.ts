import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import {Profile} from '../../configurator/profile';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Profile test1', () => {

        const profile = new Profile(
            "aName",
            "aConanFile",
            "aProfile",
            "aInstallArg",
            "aBuildArg",
            "aCreateArg",
            "aCreateUser",
            "aCreateChannel",
        );
        // vscode.workspace.rootPath
        assert.strictEqual(profile.getConanFile(), "aConanFile");
        assert.strictEqual(profile.getProfile(), "aProfile");
        assert.strictEqual(profile.getBuildFolder(), "build/aName");
        assert.strictEqual(profile.getInstallArguments(), "aInstallArg");
        assert.strictEqual(profile.getCreateArguments(), "aCreateArg");
        assert.strictEqual(profile.getCreateUser(), "aCreateUser");
        assert.strictEqual(profile.getCreateChannel(), "aCreateChannel");
    });

    test('Profile test2', () => {

        const profile = new Profile(
            "aName",
            "aConanFile",
            "aProfile",
            "aInstallArg",
            "aBuildArg",
            "aCreateArg",
            "aCreateUser",
            "aCreateChannel",
        );
        // vscode.workspace.rootPath
        assert.strictEqual(profile.getConanFile(), "aConanFile");
        assert.strictEqual(profile.getProfile(), "aProfile");
        assert.strictEqual(profile.getBuildFolder(), "build/aName");
        assert.strictEqual(profile.getInstallArguments(), "aInstallArg");
        assert.strictEqual(profile.getCreateArguments(), "aCreateArg");
        assert.strictEqual(profile.getCreateUser(), "aCreateUser");
        assert.strictEqual(profile.getCreateChannel(), "aCreateChannel");
    });
});
