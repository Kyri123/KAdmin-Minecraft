import {readFileSync} from "fs";
import path from "path";
import {AppConfig_App, AppConfig_Main, AppConfig_MariaDB, AppConfig_Updater} from "../../Types/Config";

export class ConfigManagerClass {
    // Configs
    private Package: string = "package.json"

    private ConfigRootPath: string = path.join(__dirname, "Config");
    private Mysql: string = "mysql.json"
    private App: string = "app.json"
    private Updater: string = "updater.json"
    private Main: string = "main.json"

    /**
     * try to load config json
     * @param path
     * @return true if file exists
     */
    public static ReadJson(path: string): any {
        try {
            return JSON.parse(readFileSync(path).toString());
        } catch (e) {
            console.log(`Cannot load config ${path}`)
        }
        return {};
    }

    public get GetMysqlConfig(): AppConfig_MariaDB {
        return ConfigManagerClass.ReadJson(path.join(this.ConfigRootPath, this.Mysql));
    }

    public get GetAppConfig(): AppConfig_App {
        return ConfigManagerClass.ReadJson(path.join(this.ConfigRootPath, this.Mysql));
    }

    public get GetMainConfig(): AppConfig_Main {
        return ConfigManagerClass.ReadJson(path.join(this.ConfigRootPath, this.Mysql));
    }

    public get GetUpdaterConfig(): AppConfig_Updater {
        return ConfigManagerClass.ReadJson(path.join(this.ConfigRootPath, this.Mysql));
    }

    public get GetPackageConfig(): any {
        return ConfigManagerClass.ReadJson(this.Package);
    }

}

if (global.ConfigManager === undefined) {
    global.ConfigManager = new ConfigManagerClass();
}
export let ConfigManager = global.ConfigManager;