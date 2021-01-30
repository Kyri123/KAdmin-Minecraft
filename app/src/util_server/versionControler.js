/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"


const rq          = require("request")
const srq         = require("sync-request")
const download    = require("download")

module.exports = class versionControler {

   /**
    * Inizallisiert
    * @param {string|boolean} overwriteBaseURL
    */
   constructor(overwriteBaseURL = false) {
      this.versionUrl   = "https://launchermeta.mojang.com/mc/game/version_manifest.json"
      this.localUrl     = [mainDir, "public/json/serverInfos", "mcVersions.json"]
   }

   /**
    * Hollt die liste aller versionen
    * @return {boolean|array}
    */
   getList() {
      rq(this.versionUrl, (error, response, body) => {
         try {
            if(!error && response.statusCode === 200)
               globalUtil.safeFileSaveSync(this.localUrl, JSON.parse(JSON.stringify(body)))
         }
         catch (e) {
            if(debug) console.log(e)
         }
      })
      return false
   }

   /**
    * Hollt die liste aller versionen
    * @return {boolean|array}
    */
   readList() {
      return globalUtil.safeFileReadSync(this.localUrl, true)
   }

   /**
    * Hollt die DownloadURL über versionString
    * version {string} VersionsString
    * @return {boolean|string}
    */
   getVersionDownloadUrlVersionString(version) {
      let versions   = this.readList()
      if(versions !== false) {
         try {
            let versionUrl = false
            for(let item of versions.versions) {
               if(item.id === version) {
                  versionUrl = item.url
                  break
               }
            }
            if(versionUrl !== false) {
               let response      = srq('GET', versionUrl)
               return JSON.parse(response.getBody()).downloads.server.url
            }
         }
         catch (e) {
            if(debug) console.log(e)
         }
      }
      return false
   }

   /**
    * Hollt die DownloadURL über versionString
    * version {string} VersionsIndex
    * @return {boolean|string}
    */
   getVersionDownloadUrlVersionIndex(index) {
      let versions         = this.readList()
      if(versions !== false) {
         try {
            let versionUrl    = versions.versions[index].url
            let response      = srq('GET', versionUrl)
            return JSON.parse(response.getBody()).downloads.server.url
         }
         catch (e) {
            if(debug) console.log(e)
         }
      }
      return false
   }

   /**
    * Download Server
    * version {string} String/Index
    * path {string} Pfad wo es gespeichert werden soll
    * @return {boolean}
    */
   downloadServer(version, path) {
      let url  = false
      if(!isNaN(parseInt(version, 10))) {
         url  = this.getVersionDownloadUrlVersionIndex(version)
      }
      else if(typeof version === "string") {
         url  = this.getVersionDownloadUrlVersionString(version)
      }

      if(url !== false) {
         (async () => {
            path = pathMod.join(path)
            globalUtil.safeFileSaveSync([path.replace("server.jar", "installing")], "true")
            globalUtil.safeFileRmSync([path])
            download(url)
               .pipe(fs.createWriteStream(pathMod.join(path)))
               .on("close", () => {
                  globalUtil.safeFileRmSync([path.replace("server.jar", "installing")])
                  globalUtil.safeFileSaveSync([path.replace("server.jar", "eula.txt")], "eula=true")
               })
         })()
      }

      return url !== false
   }
}