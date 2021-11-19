import "reflect-metadata";
import { container } from "tsyringe";
import { Configurator } from "../../src/configurator/configurator";
import { ExecutorMock } from "./executor-mock";
import { SystemPluginMock } from "./system-mock";

export async function mochaGlobalSetup() {
    console.log("Register System Mocks");
    container.registerInstance("System", new SystemPluginMock());
    container.registerInstance("Executor", new ExecutorMock());
    container.registerInstance(Configurator,new Configurator("path"));
}