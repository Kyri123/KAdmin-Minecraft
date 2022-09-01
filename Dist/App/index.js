"use strict";
/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
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
const Init_1 = require("./Functions/Init");
const TaskManager_1 = require("./TaskManager/TaskManager");
const http = __importStar(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const uuid_1 = require("uuid");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const dateformat_1 = __importDefault(require("dateformat"));
const IpAddress = __importStar(require("ip-address"));
(0, Init_1.OverwriteConsole)();
(0, Init_1.CheckOSAndNode)();
(0, Init_1.MakeRootPaths)();
TaskManager_1.TaskManager.Init();
global.debug = CONFIG.app.useDebug || false;
// Express Konfig
// Init the ExpressServer
global.ExpressServer = (0, express_1.default)();
// View
ExpressServer.set('views', path_1.default.join(__dirname, 'views'));
ExpressServer.set('view engine', 'ejs');
// Statics
// Config ExpressServer
ExpressServer.use(body_parser_1.default.urlencoded({ extended: true }));
ExpressServer.use(express_1.default.json({ limit: '100mb' }));
ExpressServer.use((0, cors_1.default)({
    origin: true
}));
// Session
ExpressServer.use((0, express_session_1.default)({
    genid: () => {
        return (0, uuid_1.v4)();
    },
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true
}));
// andere Konfigs
ExpressServer.use((0, express_fileupload_1.default)({
    createParentPath: true
}));
ExpressServer.use((0, cors_1.default)());
ExpressServer.use((0, compression_1.default)());
ExpressServer.use(body_parser_1.default.json());
ExpressServer.use(body_parser_1.default.urlencoded({
    extended: true
}));
ExpressServer.use(express_1.default.json());
ExpressServer.use((0, cookie_parser_1.default)());
//ExpressServer.use(logger(mode))
// Hemlet
ExpressServer.use(helmet_1.default.ieNoOpen());
ExpressServer.use(helmet_1.default.noSniff());
ExpressServer.use(helmet_1.default.hidePoweredBy());
// Routes
// Main
require("./RestApi/Router");
/*
ExpressServer.use(require('../../routes'))
*/
// Error
ExpressServer.use(function (request, response, next) {
    // @ts-ignore
    response.locals.message = response.message;
    response.locals.error = response.app.get('env') === 'development' ? "" : {};
    response.status(Number(response.status || 500));
    response.render('error');
});
// process.env.PORT = Portuse für z.B. Plesk
let port = typeof process.env.PORT !== "undefined" ?
    parseInt(process.env.PORT, 10) : typeof CONFIG.app.port !== "undefined" ?
    parseInt(CONFIG.app.port.toString(), 10) : 80;
http.globalAgent.maxSockets = Infinity;
let httpServer = http.createServer(ExpressServer);
httpServer.listen(port)
    .on('listening', () => {
    console.log('\x1b[33m%s\x1b[0m', `[${(0, dateformat_1.default)(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36mhttp://${IpAddress.Address4}:${CONFIG.app.port}/`);
});
//# sourceMappingURL=index.js.map