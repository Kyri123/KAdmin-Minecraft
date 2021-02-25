/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

global.dateFormat                     = require('dateformat')
global.panelBranch                    = process.argv.includes("dev") ? "dev" : "master"

// Prüfe NodeJS version
if(parseInt(process.version.replaceAll(".", "").replaceAll("v", "")) < 1560) {
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m NodeJS Version not supported (min 15.6.0)`)
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
  process.exit(1)
}

// Prüfe OS
if(process.platform === "win32") {
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m OS is Windows or not supported`)
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
  process.exit(1)
}

const createError                     = require('http-errors')
const http                            = require('http')
const cors                            = require('cors')
const express                         = require('express')
const session                         = require('express-session')
const fileupload                      = require('express-fileupload')
const bodyParser                      = require('body-parser')
const cookieParser                    = require('cookie-parser')
const logger                          = require('morgan')
const uuid                            = require('uuid')
const helmet                          = require("helmet")
const compression                     = require("compression")
const backgroundRunner                = require('./app/src/background/backgroundRunner')
global.userHelper                     = require('./app/src/sessions/helper')
global.mainDir                        = __dirname
global.ip                             = require('ip')
global.md5                            = require('md5')
global.htmlspecialchars               = require('htmlspecialchars')
global.mysql                          = require('mysql')
global.pathMod                        = require('path')
global.fs                             = require('fs')
//global.mode                           = "dev"
global.panelVersion                   = "0.0.4"
global.buildID                        = "00004.00017"
global.isUpdate                       = false
global.globalUtil                     = require('./app/src/util')
global.Installed                      = true
global.serverClass                    = require('./app/src/util_server/class')

//version Controllers
global.versionVanillaControler        = require('./app/src/util_server/versionControler')
global.versionSpigotControler         = require('./app/src/util_server/versionControlerSpigot')
global.versionCraftbukkitControler    = require('./app/src/util_server/versionControlerCraftbukkit')
global.versionControlerModpacks       = require('./app/src/util_server/versionControlerModpacks')
global.versionVanillaControler        = new versionVanillaControler()
global.versionSpigotControler         = new versionSpigotControler()
global.versionCraftbukkitControler    = new versionCraftbukkitControler()
global.versionControlerModpacks       = new versionControlerModpacks()

// Modulealerter
require('./app/main/mainLoader.js')
global.alerter                        = require('./app/src/alert.js')
global.debug                          = CONFIG.main.useDebug

globalUtil.safeFileMkdirSync([CONFIG.app.servRoot])
globalUtil.safeFileMkdirSync([CONFIG.app.logRoot])
globalUtil.safeFileMkdirSync([CONFIG.app.pathBackup])


// Checking Installed
/*
global.pathToInstallerJSON  = pathMod.join(mainDir, '/app/json/panel/', 'installer.json')
global.installerJson       = []
console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[32m checking Panel is installed`)
try {
  global.installerJson   = globalUtil.safeFileReadSync([pathToInstallerJSON], true)
  global.Installed       = installerJson.installed.toLowerCase() === "true"
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]${Installed ? "\x1b[32m is Installed... load Panel" : "\x1b[31m not Installed... load Installer"}`)
}
catch (e) {
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m not Installed... load Installer`)
}
if(process.argv.includes("?forceInstalled")) Installed = true;*/

require('./app/main/sqlLoader.js')
let app         = express()

// Express Konfig
  // View
  app.set('views', pathMod.join(__dirname, 'views'))
  app.set('view engine', 'ejs')

  // Statics
  app.use(express.static(pathMod.join(__dirname, 'public')))
  app.use('/serv', express.static(pathMod.join(CONFIG.app.servRoot)))
  app.use('/logs', express.static(pathMod.join(CONFIG.app.logRoot)))
  app.use('/backup', express.static(pathMod.join(CONFIG.app.pathBackup)))

  // Session
  app.use(session({
    genid: () => {
      return uuid.v4()
    },
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true
  }))

  // andere Konfigs
  app.use(fileupload({
    createParentPath: true
  }))
  app.use(cors())
  app.use(compression())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(express.json())
  app.use(cookieParser())
  //app.use(logger(mode))

  // Hemlet
  app.use(helmet.ieNoOpen())
  app.use(helmet.noSniff())
  app.use(helmet.hidePoweredBy())

  // Routes
  // Main
  app.use(function (req, res, next) {
    if (! ('JSONResponse' in res) ) {
      return next();
    }

    res.set('Cache-Control', 'public, max-age=31557600');
    res.json(res.JSONResponse);
  })

  app.use(/*'/', require(Installed ? './routes/index' : './routes/installer/index')*/require('./routes/index'))

  // Error
  app.use(function(err, req, res, next) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
    res.render('error')
  })

// process.env.PORT = Portuse für z.B. Plesk
let port = typeof process.env.PORT !== "undefined" ?
   parseInt(process.env.PORT, 10) : typeof CONFIG.app.port !== "undefined" ?
      parseInt(CONFIG.app.port, 10) : 80

http.globalAgent.maxSockets = Infinity;

let httpServer = http.createServer(app)
httpServer.listen(port)
   .on('listening', () => {
     console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m${Installed ? "" : " follow Installer here:"} http://${ip.address()}:${CONFIG.app.port}/`)
   })

backgroundRunner.startAll()
module.exports = { app, httpServer }