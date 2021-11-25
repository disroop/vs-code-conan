function getIndex(argumentList: Array<string>, parameter: string): number {
    let index = argumentList.indexOf(parameter);
    let lastIndex = argumentList.lastIndexOf(parameter);
    if (index === lastIndex) {
        return index;
    }
    // Anstatt String-Concat (nicht nur hier):
    // throw new Error("Same parameter in arguments is defined multiple times - " + parameter);

    // würd ich eher string-interpolation verwenden, so:
    throw new Error(`Same parameter in arguments is defined multiple times: ${parameter}.`);
}
function checkParameterValue(value: string | undefined) {
    if (value === undefined) {
        throw new Error("Parameter value does not exist!");

    }
    if (value.startsWith("-")) {
        throw new Error("Parameter can not start with -");

    }
}
export function stripArgument(argument: string, shortParameter: string, longParameter: string): { stripedArgument: string, foundValue: string | undefined } {
    let argumentList = argument.split(" ");
    // Wenn immer möglich würd ich "const" anstatt "let" nehmen.
    const indexShort = getIndex(argumentList, "-" + shortParameter);
    const indexLong = getIndex(argumentList, "--" + longParameter);
    if (indexShort > -1 && indexLong > -1) {
        // String-concat:
        // throw new Error("Same parameter (" + shortParameter + "/" + longParameter + ") in arguments multiple defined");
        
        // Dünkt mich leserlicher: String-interpolation:
        throw new Error(`Same parameter (${shortParameter}/${longParameter}) in arguments multiple defined`);
    }
    if (indexShort === -1 && indexLong === -1) {
        return { stripedArgument: argument, foundValue: undefined };
    }
    const argumentStartIndex = indexShort > -1 ? indexShort : indexLong;
    const value = argumentList[argumentStartIndex+1];
    checkParameterValue(value);

    argumentList = removeParameterFromList(argumentList, argumentStartIndex);
    argument = argumentList.join(" ");
    return { stripedArgument: argument, foundValue: value };
}


function removeParameterFromList(argumentList: string[], startArgument: number) {
    argumentList.splice(startArgument + 1, 1);
    argumentList.splice(startArgument, 1);
    return argumentList;
}

