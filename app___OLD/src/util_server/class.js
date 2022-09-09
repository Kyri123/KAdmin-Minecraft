/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
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
      this.cfgPath            = [mainDir, '/app___OLD/json/server/', `${this.server}.json`]
      this.defaultCfgPath     = [mainDir, '/app___OLD/json/server/template/', `default.json`]
      this.serverInfoPath     = [mainDir, '/public/json/server/', `${this.server}.json`]
      this.cfg                = {}

      if(poisonNull(this.server)) {
         let file        = safeFileReadSync(this.cfgPath, true)
         let dfile       = safeFileReadSync(this.defaultCfgPath, true)
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
      let file        = safeFileReadSync(this.cfgPath, true)
      let dfile       = safeFileReadSync(this.defaultCfgPath, true)
      let reloadCfg   = file !== false ? (
         dfile !== false ? array_replace_recursive(dfile, file)
            : file
      ) : false
      if(reloadCfg !== false) {
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
    * gibt aus ob dieser Server läuft ist
    * @return {boolean}
    */
   isrun() {
      if(this.serverExsists())
         return this.getServerInfos() !== false ? this.getServerInfos().pid !== 0 : false
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
      return safeFileReadSync(this.serverInfoPath, true)
   }

   /**
    * Speichert einen beliebigen Key in der CFG
    * @param {string} key Option
    * @param {any} value Wert
    * @return {boolean}
    */
   writeState( key, value) {
      if(this.serverExsists()) {
         try {
            let file = [mainDir, "public/server", `${this.server}.json`]
            let json = safeFileReadSync(file, true)
            return json !== false ? safeFileSaveSync(file, JSON.stringify(json)) : false
         }
         catch (e) {
            if(debug) console.log('[DEBUG_FAILED]', e)
         }
      }
      return false
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
            return safeFileSaveSync(this.cfgPath, JSON.stringify(this.cfg))
         }
         catch (e) {
            if(debug) console.log('[DEBUG_FAILED]', e)
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
            let saveData               = array_replace_recursive(config, cfg)
            saveData.autoBackupPara    = cfg.autoBackupPara
            return safeFileSaveSync(this.cfgPath, JSON.stringify(saveData))
         }
         catch (e) {
            if(debug) console.log('[DEBUG_FAILED]', e)
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
         if(!safeFileExsistsSync([path])) safeFileCreateSync([path])
         try {
            return safeFileSaveSync([path], prop)
         }
         catch (e) {
            if(debug) console.log('[DEBUG_FAILED]', e)
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
         let file    = safeFileReadSync([this.cfg.path, `server.properties`])
         if(file === false)
            file     = safeFileReadSync([mainDir, `/app/data/ini`, `server.properties`])
         if(file !== false)
            try {
               return ini.parse(file)
            }
            catch(e) {
               if(debug) console.log('[DEBUG_FAILED]', e)
            }
      }
      return false
   }
}