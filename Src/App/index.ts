/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */

import {ConfigManager, ConfigManagerClass} from "./Helper/ConfigManager";

require('dotenv').config()

import {CheckOSAndNode, MakeRootPaths, OverwriteConsole} from "./Functions/Init";
import {TaskManager} from "./TaskManager/TaskManager";
import * as http from "http";
import helmet from "helmet";
import express, {NextFunction} from 'express';
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import {v4 as uuidv4} from 'uuid';
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import dateFormat from "dateformat";
import {Logging} from "./Functions/Logging";
const Ip = require("ip");

global.mainDir = path.join("..", __dirname);

OverwriteConsole();
CheckOSAndNode();
MakeRootPaths();
TaskManager.Init();

global.debug                          = ConfigManager.GetEnvConfig.Dev_UseDebug || false

// Express Konfig
// Init the ExpressServer
global.ExpressServer = express();

// View
ExpressServer.set('views', path.join(__dirname, 'views'))
ExpressServer.set('view engine', 'ejs')

// Statics
// Config ExpressServer
ExpressServer.use(bodyParser.urlencoded({ extended: true }));
ExpressServer.use(express.json({ limit: '100mb' }));
ExpressServer.use(cors({
  origin: true
}))

// Session
ExpressServer.use(session({
  genid: () => {
    return uuidv4()
  },
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: true
}))

// andere Konfigs
ExpressServer.use(fileUpload({
  createParentPath: true
}))
ExpressServer.use(cors())
ExpressServer.use(compression())
ExpressServer.use(bodyParser.json())
ExpressServer.use(bodyParser.urlencoded({
  extended: true
}))
ExpressServer.use(express.json())
ExpressServer.use(cookieParser())
//ExpressServer.use(logger(mode))

// Hemlet
ExpressServer.use(helmet.ieNoOpen())
ExpressServer.use(helmet.noSniff())
ExpressServer.use(helmet.hidePoweredBy())

// Routes
// Main
require("./Routes/Router");
/*
ExpressServer.use(require('../../routes'))
*/

// Error
ExpressServer.use(function (request: express.Request, response: express.Response, next: NextFunction) {
  // @ts-ignore
  response.locals.message = response.message
  response.locals.error = response.app.get('env') === 'development' ? "" : {}

  response.status(Number(response.status || 500))
  response.render('error')
})


http.globalAgent.maxSockets = Infinity;
let httpServer = http.createServer(ExpressServer)
httpServer.listen(ConfigManager.GetEnvConfig.Panel_WebPort)
   .on('listening', async () => {
     Logging(`http://${Ip.address()}:${ConfigManager.GetEnvConfig.Panel_WebPort}/`, "Info");
   })