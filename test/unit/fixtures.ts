import "reflect-metadata";
import { container } from "tsyringe";
import { Configurator } from "../../src/configurator/configurator";
import { ExecutorFake } from "./executor-fake";
import { SystemPluginFake } from "./system-fake";

export async function mochaGlobalSetup() {
    console.log("Register System Mocks");
    container.registerInstance("System", new SystemPluginFake());
    container.registerInstance("Executor", new ExecutorFake());
    container.registerInstance(Configurator,new Configurator("path"));
}