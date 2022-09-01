import {AppConfig} from "./Config";
import {ConfigManagerClass} from "../App/Helper/ConfigManager";
import {TaskManagerClass} from "../App/TaskManager/TaskManager";
import {AppStateClass} from "../App/Helper/AppState";

declare global {
    var CONFIG  : AppConfig;
    var debug   : boolean;
    var mainDir   : string;


    // Helpers
    var ConfigManager: ConfigManagerClass;

    // Managers
    var TaskManager: TaskManagerClass
    var AppState: AppStateClass

    // RESTAPI
    // @ts-ignore
    var ExpressServer: core.Express;
}

export {};
