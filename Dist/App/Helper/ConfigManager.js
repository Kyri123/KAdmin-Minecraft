"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = exports.ConfigManagerClass = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class ConfigManagerClass {
    // Configs
    Package = "package.json";
    ConfigRootPath = path_1.default.join(__dirname, "Config");
    Mysql = "mysql.json";
    App = "app.json";
    Updater = "updater.json";
    Main = "main.json";
    /**
     * try to load config json
     * @param path
     * @return true if file exists
     */
    static ReadJson(path) {
        try {
            return JSON.parse((0, fs_1.readFileSync)(path).toString());
        }
        catch (e) {
            console.log(`Cannot load config ${path}`);
        }
        return {};
    }
    get GetMysqlConfig() {
        return ConfigManagerClass.ReadJson(path_1.default.join(this.ConfigRootPath, this.Mysql));
    }
    get GetAppConfig() {
        return ConfigManagerClass.ReadJson(path_1.default.join(this.ConfigRootPath, this.Mysql));
    }
    get GetMainConfig() {
        return ConfigManagerClass.ReadJson(path_1.default.join(this.ConfigRootPath, this.Mysql));
    }
    get GetUpdaterConfig() {
        return ConfigManagerClass.ReadJson(path_1.default.join(this.ConfigRootPath, this.Mysql));
    }
    get GetPackageConfig() {
        return ConfigManagerClass.ReadJson(this.Package);
    }
}
exports.ConfigManagerClass = ConfigManagerClass;
if (global.ConfigManager === undefined) {
    global.ConfigManager = new ConfigManagerClass();
}
exports.ConfigManager = global.ConfigManager;
//# sourceMappingURL=ConfigManager.js.map