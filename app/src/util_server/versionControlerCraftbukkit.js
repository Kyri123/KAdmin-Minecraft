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

module.exports = class versionCraftbukkitControler {

   /**
    * Inizallisiert
    * @param {string|boolean} overwriteBaseURL
    */
   constructor(overwriteBaseURL = false) {
      this.versionUrl   = "https://launchermeta.mojang.com/mc/game/version_manifest.json"
      this.downloadUrl  = "https://cdn.getbukkit.org/craftbukkit/craftbukkit-{version}.jar"
      this.downloadUrlRaw  = "https://cdn.getbukkit.org/craftbukkit/"
      this.localUrl     = [mainDir, "public/json/serverInfos", "mcVersionsCraftbukkit.json"]
   }

   /**
    * Hollt die liste aller versionen
    * @return {boolean|array}
    */
   getList() {
      (async () => {
         rq(this.versionUrl, (error, response, body) => {
            try {
               if(!error && response.statusCode === 200) {
                  let versionList   = JSON.parse(body)
                  let versions      = []
                  for(let item of versionList.versions) {
                     if(item.type === "release") {
                        let request    = srq('GET', this.downloadUrl.replace("{version}", item.id))
                        if(!request.getBody().toString().includes("RESTRICTED!")) {
                           versions.push(`craftbukkit-${item.id}.jar`)
                        }

                        if(item.id === "1.11.0") break;
                     }
                  }

                  versions.push("Craftbukkit-1.10.2-R0.1-SNAPSHOT-latest.jar")
                  versions.push("Craftbukkit-1.10-R0.1-SNAPSHOT-latest.jar")
                  versions.push("Craftbukkit-1.9.4-R0.1-SNAPSHOT-latest.jar")
                  versions.push("Craftbukkit-1.9.2-R0.1-SNAPSHOT-latest.jar")
                  versions.push("Craftbukkit-1.9-R0.1-SNAPSHOT-latest.jar")
                  versions.push("Craftbukkit-1.8.8-R0.1-SNAPSHOT-latest.jar")
                  versions.push("Craftbukkit-1.8.7-R0.1-SNAPSHOT-latest.jar")
                  versions.push("Craftbukkit-1.8.6-R0.1-SNAPSHOT-latest.jar")
                  versions.push("Craftbukkit-1.8.5-R0.1-SNAPSHOT-latest.jar")
                  versions.push("Craftbukkit-1.8.4-R0.1-SNAPSHOT-latest.jar")
                  versions.push("Craftbukkit-1.8.3-R0.1-SNAPSHOT-latest.jar")
                  versions.push("Craftbukkit-1.8-R0.1-SNAPSHOT-latest.jar")
                  versions.push("Craftbukkit-1.7.10-R0.1-20140808.005431-8.jar")
                  versions.push("Craftbukkit-1.7.9-R0.2-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.7.8-R0.1-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.7.5-R0.1-20140402.020013-12.jar")
                  versions.push("Craftbukkit-1.7.2-R0.4-20140216.012104-3.jar")
                  versions.push("Craftbukkit-1.6.4-R2.0.jar")
                  versions.push("Craftbukkit-1.6.2-R0.1-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.6.1-R0.1-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.5.2-R1.0.jar")
                  versions.push("Craftbukkit-1.5.1-R0.2-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.5-R0.1-20130317.180842-21.jar")
                  versions.push("Craftbukkit-1.4.7-R1.1-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.4.6-R0.4-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.4.5-R1.1-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.4.2-R0.3-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.3.2-R2.1-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.3.1-R2.1-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.2.5-R5.1-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.2.4-R1.1-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.2.3-R0.3-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.2.2-R0.1-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.1-R5-SNAPSHOT.jar")
                  versions.push("Craftbukkit-1.0.0-SNAPSHOT.jar")

                  globalUtil.safeFileSaveSync(this.localUrl, JSON.stringify(versions))
               }
            }
            catch (e) {
               if(debug) console.log(e)
            }
         })
         return false
      })()
   }

   /**
    * Hollt die liste aller versionen
    * @return {boolean|array}
    */
   readList() {
      return globalUtil.safeFileReadSync(this.localUrl, true)
   }

   /**
    * Download Server
    * version {string} VersionString
    * path {string} Pfad wo es gespeichert werden soll
    * @return {boolean}
    */
   downloadServer(version, path) {
      (async () => {
         globalUtil.safeFileRmSync([path])
         globalUtil.safeFileSaveSync([pathMod.join(path).replace("serverCraftbukkit.jar", "eula.txt")], "eula=true")
         download(this.downloadUrlRaw + version)
            .pipe(fs.createWriteStream(pathMod.join(path)))
      })()
      return true
   }
}