import { container } from "tsyringe";
import { Configurator } from "../../src/configurator/configurator";
import { SystemPluginMock } from "./system-mock";

export function loadConfig(configcontent:string) {
    const system = <SystemPluginMock>container.resolve("System");
    system.setFile(configcontent);
    const config = container.resolve(Configurator);
    config.update();
}