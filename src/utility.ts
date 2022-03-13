
import { autoInjectable, container, singleton } from "tsyringe";
import { System } from "./system/system";

@singleton()
export class Utility {
    private system: System;

    constructor() {
        this.system = container.resolve("System");
    }

    replaceWorkspaceRootPath(filepath: string): string {
        if (filepath.startsWith(`\${workspaceFolder}`)) {
            filepath = filepath.replace(`\${workspaceFolder}`, "");
            filepath = this.system.getRelativePathToWorkspace(filepath);

        }
        return filepath;
    }
}