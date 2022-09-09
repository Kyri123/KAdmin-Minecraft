import {ConfigManagerClass} from "../Helper/ConfigManager";
import {TaskManagerClass} from "../TaskManager/TaskManager";
import {AppStateClass} from "../Helper/AppState";
import {MariaDbManagerClass} from "../Helper/MariaDB";

declare global {
    var debug   : boolean;
    var mainDir   : string;

    // Helpers
    var ConfigManager: ConfigManagerClass;

    // Managers
    var TaskManager: TaskManagerClass
    var AppState: AppStateClass
    var MariaDbManager: MariaDbManagerClass

    // RESTAPI
    // @ts-ignore
    var ExpressServer: core.Express;
}

export {};
