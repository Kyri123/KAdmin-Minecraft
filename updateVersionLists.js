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
global.panelVersion                   = ""
if(process.platform === "win32") {
   console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m OS is Windows or not supported`)
   console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
   process.exit(1)
}

global.mainDir                        = __dirname
global.debug                          = true
global.Installed                      = true
global.pathMod                        = require('path')
global.fs                             = require('fs')
global.globalUtil                     = require('./app/src/util')
global.versionSpigotControler         = require('./app/src/util_server/versionControlerSpigot')
global.versionSpigotControler         = new versionSpigotControler()
global.versionCraftbukkitControler    = require('./app/src/util_server/versionControlerCraftbukkit')
global.versionCraftbukkitControler    = new versionCraftbukkitControler()
require('./app/main/mainLoader.js')

versionSpigotControler.getList()
versionCraftbukkitControler.getList()