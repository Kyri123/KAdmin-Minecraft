"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitGithub = exports.MakeRootPaths = exports.CheckOSAndNode = exports.OverwriteConsole = void 0;
const dateformat_1 = __importDefault(require("dateformat"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const util = __importStar(require("util"));
const util_1 = require("./util");
function OverwriteConsole() {
    // überschreibe console.log
    let logDir = path_1.default.join(__dirname, "latest_logs");
    let logFile = path_1.default.join(logDir, "current.log");
    // erstelle Log ordner & file (Überschreibe Console.log())
    if (fs.existsSync(logDir))
        fs.rmSync(logDir, { recursive: true });
    fs.mkdirSync(logDir);
    fs.writeFileSync(logFile, "");
    let logStream = fs.createWriteStream(logFile, { flags: 'w' });
    let logStdout = process.stdout;
    console.log = function () {
        logStdout.write(util.format(...arguments) + '\n');
        for (let i in arguments) {
            if (typeof arguments[i] === "string")
                arguments[i] = arguments[i]
                    .replaceAll('%s\x1b[0m', '')
                    .replaceAll('\x1b[30m', '')
                    .replaceAll('\x1b[31m', '')
                    .replaceAll('\x1b[32m', '')
                    .replaceAll('\x1b[33m', '')
                    .replaceAll('\x1b[34m', '')
                    .replaceAll('\x1b[35m', '')
                    .replaceAll('\x1b[36m', '');
        }
        logStream.write(util.format(...arguments) + '\n', () => logStream.emit("write"));
    };
}
exports.OverwriteConsole = OverwriteConsole;
function CheckOSAndNode() {
    // Prüfe NodeJS version
    if (parseInt(process.version.replaceAll(/[^0-9]/g, '').slice(0, 2)) < 17) {
        console.log('\x1b[33m%s\x1b[0m', `[${(0, dateformat_1.default)(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m NodeJS Version not supported (min 16.0.0) you use ${process.version}`);
        console.log('\x1b[33m%s\x1b[0m', `[${(0, dateformat_1.default)(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`);
        process.exit(1);
    }
    // Prüfe OS
    if (process.platform === "win32") {
        console.log('\x1b[33m%s\x1b[0m', `[${(0, dateformat_1.default)(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m OS is Windows or not supported`);
        console.log('\x1b[33m%s\x1b[0m', `[${(0, dateformat_1.default)(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`);
        process.exit(1);
    }
}
exports.CheckOSAndNode = CheckOSAndNode;
function MakeRootPaths() {
    (0, util_1.safeFileMkdirSync)([CONFIG.app.servRoot]);
    (0, util_1.safeFileMkdirSync)([CONFIG.app.logRoot]);
    (0, util_1.safeFileMkdirSync)([CONFIG.app.pathBackup]);
}
exports.MakeRootPaths = MakeRootPaths;
function InitGithub() {
    (0, util_1.safeFileMkdirSync)([CONFIG.app.servRoot]);
    (0, util_1.safeFileMkdirSync)([CONFIG.app.logRoot]);
    (0, util_1.safeFileMkdirSync)([CONFIG.app.pathBackup]);
}
exports.InitGithub = InitGithub;
//# sourceMappingURL=Init.js.map