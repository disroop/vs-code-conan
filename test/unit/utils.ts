import { container } from "tsyringe";
import { Configurator } from "../../src/configurator/configurator";
import { SystemPluginFake } from "./system-fake";

export async function loadConfig(configcontent:string) {
    const system = <SystemPluginFake>container.resolve("System");
    system.setFile(configcontent);
    const config = container.resolve(Configurator);
    await(config.update());
}