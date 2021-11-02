import { expect } from 'chai';
import { stripArgument } from '../../../src/configurator/argument-parser';
describe('ArgumentParser', () => {
    it('parse simple short argument', () => {
        let argument = "-if hello";
        let { stripedArgument, foundValue }= stripArgument(argument, "if", "install-folder");
        expect(stripedArgument).to.equal("");
        expect(foundValue).to.equal("hello");
    });

    it('parse simple long argument', () => {
        let argument = "--install-folder hello";
        let { stripedArgument, foundValue }= stripArgument(argument, "if", "install-folder");
        expect(stripedArgument).to.equal("");
        expect(foundValue).to.equal("hello");
    });

    it('parse not found argument', () => {
        let argument = "-bf a";
        let { stripedArgument, foundValue }= stripArgument(argument, "if", "install-folder");
        expect(stripedArgument).to.equal("-bf a");
        expect(foundValue).to.equal(undefined);
    });
    
    it('parse no parameter', () => {
        let argument = "-if";
        expect(() => stripArgument(argument, "if", "install-folder")).to.throw("Parameter value does not exist!");
    });

    it('parse double short', () => {
        let argument = "-if a -if a";
        expect(() => stripArgument(argument, "if", "install-folder")).to.throw("Same parameter in arguments is multiple defined - -if");
    });

    it('parse double short/long parameter', () => {
        let argument = "-if a --install-folder a";
        expect(() => stripArgument(argument, "if", "install-folder")).to.throw("Same parameter (if/install-folder) in arguments multiple defined");
    });

    it('parse parameter start with -a', () => {
        let argument = "-if -a -b a";
        expect(() => stripArgument(argument, "if", "install-folder")).to.throw("Parameter can not start with -");
    });
});