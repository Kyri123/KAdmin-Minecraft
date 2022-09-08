import {readFileSync} from "fs";
import path from "path";
import {EnvConfig} from "../../Types/Config";
import {poisonNull} from "../Functions/util";

export class ConfigManagerClass {
    // Configs
    private Package: string = "package.json"
    public ConfigRootPath: string = path.join(__dirname, "Config");

    /**
     * try to load config json
     * @param path
     * @return true if file exists
     */
    public static ReadJson(path: string): any {
        if(!poisonNull(path)) {
            try {
                return JSON.parse(readFileSync(path).toString());
            } catch (e) {
                console.log(`Cannot load config ${path}`)
            }
        }
        return {};
    }

    public get GetEnvConfig(): EnvConfig {
        return process.env as EnvConfig;
    }

    public get GetPackageConfig(): any {
        return ConfigManagerClass.ReadJson(this.Package);
    }
}

if (global.ConfigManager === undefined) {
    global.ConfigManager = new ConfigManagerClass();
}
export let ConfigManager = global.ConfigManager;