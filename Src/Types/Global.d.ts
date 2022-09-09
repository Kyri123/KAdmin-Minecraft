import {ConfigManagerClass} from "../App/Helper/ConfigManager";
import {TaskManagerClass} from "../App/TaskManager/TaskManager";
import {AppStateClass} from "../App/Helper/AppState";
import {MariaDbManagerClass} from "../App/Helper/MariaDB";

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
