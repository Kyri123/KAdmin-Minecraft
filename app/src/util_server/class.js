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
const ini                           = require('ini')

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

         if(this.cfg !== false) {
            this.cfg.path    = this.cfg.path
               .replace("{SERVROOT}", CONFIG.app.servRoot)
               .replace("{SERVERNAME}", this.server)

            this.cfg.pathLogs    = this.cfg.path
               .replace("{LOGROOT}", CONFIG.app.logRoot)
               .replace("{SERVERNAME}", this.server)

            this.cfg.pathBackup    = this.cfg.path
               .replace("{BACKUPROOT}", CONFIG.app.pathBackup)
               .replace("{SERVERNAME}", this.server)
         }

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
      if(reloadCfg !== false) {
         reloadCfg.path    = reloadCfg.path
            .replace("{SERVROOT}", CONFIG.app.servRoot)
            .replace("{SERVERNAME}", this.server)

         reloadCfg.pathLogs    = reloadCfg.path
            .replace("{LOGROOT}", CONFIG.app.logRoot)
            .replace("{SERVERNAME}", this.server)

         reloadCfg.pathBackup    = reloadCfg.path
            .replace("{BACKUPROOT}", CONFIG.app.pathBackup)
            .replace("{SERVERNAME}", this.server)

         this.cfg = reloadCfg
      }
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
            return globalUtil.safeFileSaveSync(this.cfgPath, JSON.stringify(this.cfg))
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
    * Speichert eine
    * @param {string} prop
    * @return {boolean}
    */
   saveINI(prop) {
      if(this.serverExsists()) {
         let path    = pathMod.join(this.cfg.path, `server.properties`)
         if(!globalUtil.safeFileExsistsSync([path])) globalUtil.safeFileCreateSync([path])
         try {
            return globalUtil.safeFileSaveSync([path], prop)
         }
         catch (e) {
            if(debug) console.log(e)
         }
      }
      return false
   }

   /**
    * Speichert eine Ini
    * @return {boolean}
    */
   getINI() {
      if(this.serverExsists()) {
         let file    = globalUtil.safeFileReadSync([this.cfg.path, `server.properties`])
         if(file === false)
            file     = globalUtil.safeFileReadSync([mainDir, `/app/data/ini`, `server.properties`])
         if(file !== false)
            try {
               return ini.parse(file)
            }
            catch(e) {
               if(debug) console.log(e)
            }
      }
      return false
   }
}