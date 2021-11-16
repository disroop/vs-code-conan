function getIndex(argumentList: Array<string>, parameter: string): number {
    let index = argumentList.indexOf(parameter);
    let lastIndex = argumentList.lastIndexOf(parameter);
    if (index === lastIndex) {
        return index;
    }
    throw new Error("Same parameter in arguments is multiple defined - " + parameter);
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
    let indexShort = getIndex(argumentList, "-" + shortParameter);
    let indexLong = getIndex(argumentList, "--" + longParameter);
    if (indexShort > -1 && indexLong > -1) {
        throw new Error("Same parameter (" + shortParameter + "/" + longParameter + ") in arguments multiple defined");
    }
    if (indexShort === -1 && indexLong === -1) {
        return { stripedArgument: argument, foundValue: undefined };
    }
    let argumentStartIndex = indexShort > -1 ? indexShort : indexLong;
    let value = argumentList[argumentStartIndex+1];
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

