/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const { array_replace_recursive }   = require('locutus/php/array')

/**
 * Informationen für einen Server
 */
module.exports = class serverClass {

   /**
    * Inizallisiert einen Server
    * @param {string} servername
    */
   constructor(servername) {
      // Erstelle this Vars
      this.exsists            = false
      this.server             = servername
      this.cfgPath            = [mainDir, '/app/json/server/', `${this.server}.json`]
      this.defaultCfgPath     = [mainDir, '/app/json/server/template/', `default.json`]
      this.serverInfoPath     = [mainDir, '/public/json/server/', `${this.server}.json`]
      this.cfg                = {}

      if(globalUtil.poisonNull(this.server)) {
         let file        = globalUtil.safeFileReadSync(this.cfgPath, true)
         let dfile       = globalUtil.safeFileReadSync(this.defaultCfgPath, true)
         this.cfg        = file !== false ? (
            dfile !== false ? array_replace_recursive(dfile, file)
               : file
         ) : false
         this.exsists    = this.cfg !== false
      }
   }

   /**
    * gibt aus ob dieser Server existiert
    * @return {boolean}
    */
   cfgReload() {
      let file        = globalUtil.safeFileReadSync(this.cfgPath, true)
      let dfile       = globalUtil.safeFileReadSync(this.defaultCfgPath, true)
      let reloadCfg   = file !== false ? (
         dfile !== false ? array_replace_recursive(dfile, file)
            : file
      ) : false
      if(reloadCfg !== false) this.cfg = reloadCfg
   }

   /**
    * gibt aus ob dieser Server existiert
    * @return {boolean}
    */
   serverExsists() {
      return this.exsists
   }

   /**
    * gibt aus ob dieser Server online ist
    * @return {boolean}
    */
   online() {
      if(this.serverExsists())
         return this.getServerInfos() !== false ? this.getServerInfos().online : false
      return false
   }


   /**
    * gibt die Konfiguration aus
    * @return {object}
    */
   getConfig() {
      if(this.serverExsists()) {
         this.cfgReload()
         return this.cfg
      }
   }

   /**
    * Bekomme alle Serverinforamtionen von diesen Server
    * @return {object}
    */
   getServerInfos() {
      return globalUtil.safeFileReadSync(this.serverInfoPath, true)
   }

   /**
    * Speichert einen beliebigen Key in der CFG
    * @param {string} key Option
    * @param {any} value Wert
    * @return {boolean}
    */
   writeConfig( key, value) {
      if(this.serverExsists() && typeof this.cfg[key] !== "undefined") {
         this.cfg[key] = value
         try {
            return globalUtil.safeFileSaveSync(this.cfgPath, JSON.stringify(config))
         }
         catch (e) {
            if(debug) console.log(e)
         }
      }
      return false
   }

   /**
    * Speichert eine Definierte CFG
    * @param {object} cfg Wert
    * @return {boolean}
    */
   saveConfig(cfg) {
      let config  = this.cfg
      if(this.serverExsists()) {
         try {
            let saveData    = array_replace_recursive(config, cfg)
            if(cfg.mods     !== undefined)  saveData.mods   = cfg.mods
            if(cfg.opt      !== undefined)  saveData.opt    = cfg.opt
            if(cfg.flags    !== undefined)  saveData.flags  = cfg.flags
            return globalUtil.safeFileSaveSync(this.cfgPath, JSON.stringify(saveData))
         }
         catch (e) {
            if(debug) console.log(e)
         }
      }
      return false
   }

   /**
    * Speichert eine Ini
    * @param {string} iniName
    * @param {object} ini
    * @return {boolean}
    */
   saveINI(ini, iniName) {
      if(this.serverExsists()) {
         let path    = pathMod.join(this.cfg.path, '\\ShooterGame\\Saved\\Config\\WindowsServer', `${iniName}.ini`)
         if(!globalUtil.safeFileExsistsSync([path])) globalUtil.safeFileCreateSync([path])
         try {
            return globalUtil.safeFileSaveSync([path,`${iniName}.ini`], JSON.stringify(ini))
         }
         catch (e) {
            if(debug) console.log(e)
         }
      }
      return false
   }

   /**
    * Speichert eine Ini
    * @param {string} iniName
    * @return {boolean}
    */
   getINI(iniName) {
      if(this.serverExsists()) {
         let file            = globalUtil.safeFileReadSync([this.cfg.path, '\\ShooterGame\\Saved\\Config\\WindowsServer', `${iniName}.ini`])
         let default_file    = globalUtil.safeFileReadSync([mainDir, '/app/data/ini/', `${GET.ini}.ini`])
         return file !== false ? file : default_file !== false ? default_file : false
      }
      return false
   }

   /**
    * Erhalte die derzeitige Version des Servers
    * @return {boolean}
    */
   getCurrVersion() {
      let servConfig = this.getConfig()
      if(this.serverExsists()) {
         let serverPath          = servConfig.path
         let manifestFile        = `${serverPath}\\steamapps\\appmanifest_${PANEL_CONFIG.appID_server}.acf`
         let manifestArray       = globalUtil.toAcfToArraySync(manifestFile)
         return manifestArray    !== false ? manifestArray.AppState.buildid : false
      }
      return false
   }

   /**
    * Prüfe alle Mods ob diese ein Update brauchen
    * @returns {array|boolean} mods die ein Update brauchen
    */
   isUpdateServer() {
      let servConfig = this.getConfig()
      if(
         this.serverExsists() &&
         availableVersionActiveevent !== 0 &&
         availableVersionPublic !== 0
      ) {
         return this.getCurrVersion() < (servConfig.branch === "activeevent" ? availableVersionActiveevent : availableVersionPublic)
      }
      return false
   }

   /**
    * prüfe ModUpdates
    * @return {boolean|array}
    */
   checkModUpdates() {
      let servConfig = this.getConfig()

      if(this.serverExsists()) {
         let modsNeedUpdate      = []
         let API                 = false
         try {
            let json             = globalUtil.safeFileReadSync([mainDir, '/public/json/steamAPI/', 'mods.json'], true)
            API                  = json !== false ? json.response.publishedfiledetails : false
         }
         catch (e) {
            if(debug) console.log(e)
         }

         if(servConfig.MapModID !== 0)                                                                               servConfig.mods.push(servConfig.MapModID)
         if(parseInt(servConfig.TotalConversionMod) !== 0 && parseInt(servConfig.TotalConversionMod) !== 111111111)  servConfig.mods.push(servConfig.TotalConversionMod)

         if(servConfig.mods.length > 0) {
            servConfig.mods.forEach((modid) => {
               let KEY = false
               if(API !== false) API.forEach((val, key) => {
                  if(parseInt(val.publishedfileid) === parseInt(modid)) KEY = key
               })

               if(
                  KEY !== false &&
                  globalUtil.safeFileExsistsSync([servConfig.path, '\\ShooterGame\\Content\\Mods\\', `${modid}.modtime`])
               ) {
                  let modtime     = parseInt(globalUtil.safeFileReadSync([servConfig.path, '\\ShooterGame\\Content\\Mods\\', `${modid}.modtime`]))
                  let API_UPDATE  = API[KEY].time_updated
                  if(API_UPDATE > modtime) modsNeedUpdate.push(modid)
               }
               else if(
                  !globalUtil.safeFileExsistsSync([servConfig.path, '\\ShooterGame\\Content\\Mods\\', `${modid}.mod`])      ||
                  !globalUtil.safeFileExsistsSync([servConfig.path, '\\ShooterGame\\Content\\Mods\\', `${modid}.modtime`])  ||
                  !globalUtil.safeFileExsistsSync([servConfig.path, '\\ShooterGame\\Content\\Mods\\', modid])
               ) {
                  modsNeedUpdate.push(modid)
               }
            })

            return modsNeedUpdate.length > 0 ? modsNeedUpdate : false
         }
      }

      return false
   }
}