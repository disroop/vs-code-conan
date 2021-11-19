import "reflect-metadata";
import { container } from "tsyringe";
import { System } from "../../src/system/system";
import { ExecutorMock } from "./executor-mock";
import { SystemPluginMock } from "./system-mock";

export async function mochaGlobalSetup() {
    console.log("Register System Mocks");
    //container.register<System>("System", {useClass: SystemPluginMock});
    container.registerInstance("System", new SystemPluginMock());

    //container.registerInstance("Executor", {useClass: ExecutorMock});
}