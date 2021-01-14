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
if(process.platform === "win32") {
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m OS is Windows or not supported`)
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
  process.exit(1)
}

const createError                     = require('http-errors')
const express                         = require('express')
const session                         = require('express-session')
const bodyParser                      = require('body-parser')
const cookieParser                    = require('cookie-parser')
const logger                          = require('morgan')
const uuid                            = require('uuid')
const helmet                          = require("helmet")
const backgroundRunner                = require('./app/src/background/backgroundRunner')
global.userHelper                     = require('./app/src/sessions/helper')
global.mainDir                        = __dirname
global.ip                             = require('ip')
global.md5                            = require('md5')
global.htmlspecialchars               = require('htmlspecialchars')
global.mysql                          = require('mysql')
global.pathMod                        = require('path')
global.fs                             = require('fs')
global.availableVersionPublic        = 0
global.availableVersionActiveevent   = 0
//global.mode                           = "dev"
global.panelVersion                   = "0.0.1"
global.buildID                        = "001.000"
global.isUpdate                       = false
global.globalUtil                     = require('./app/src/util')
global.Installed                      = true

// Modulealerter
require('./app/main/mainLoader.js')
global.alerter                        = require('./app/src/alert.js')
global.debug                          = CONFIG.main.useDebug

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

// lese Changelog
if(Installed) {
  let pathFile    = pathMod.join(mainDir, '/app/json/panel/', 'changelog.json')
  try {
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${pathFile}`)
    global.changelog                    = globalUtil.safeFileReadSync([pathFile], true)
    if(typeof changelog === "boolean") {
      console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathFile} not found`)
      console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
      process.exit(1)
    }
    changelog.reverse()
  }
  catch (e) {
    if(debug) console.log(e)
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathFile} not found`)
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
    process.exit(1)
  }
}

require('./app/main/sqlLoader.js')
let app         = express()

// view engine
app.set('views', pathMod.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(session({
  genid: () => {
    return uuid.v4()
  },
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
//app.use(logger(mode))
app.use(express.json())
app.use(express.urlencoded({extended: false }))
app.use(cookieParser())
app.use(express.static(pathMod.join(__dirname, 'public')))
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.hidePoweredBy())

// Routes
// Main
app.use('/', require(Installed ? './routes/index' : './routes/installer/index'))

// Error Handlers
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// process.env.PORT = Portuse für z.B. Plesk
let port = typeof process.env.PORT !== "undefined" ?
   parseInt(process.env.PORT, 10) : typeof CONFIG.app.port !== "undefined" ?
      parseInt(CONFIG.app.port, 10) : 80

app.listen(port, "0.0.0.0", ()=>{
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m${Installed ? "" : " follow Installer here:"} http://${ip.address()}:${CONFIG.app.port}/`)
})
module.exports = app

// Starte Intverall aufgaben
if(Installed) backgroundRunner.startAll()