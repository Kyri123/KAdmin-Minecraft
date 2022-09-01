"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
let DoScan = function (FilePath) {
    let Files = (0, fs_1.readdirSync)(FilePath);
    for (const File of Files) {
        let FileP = path_1.default.join(FilePath, File);
        let State = (0, fs_1.lstatSync)(FileP);
        if (State.isDirectory()) {
            if (!File.endsWith('.map') && !File.includes("Default.js")) {
                require(FileP);
            }
        }
        else
            DoScan(FileP);
    }
};
require(path_1.default.join(__dirname, 'Routes', 'Default.js'));
DoScan(path_1.default.join(__dirname, 'Routes'));
//# sourceMappingURL=Router.js.map