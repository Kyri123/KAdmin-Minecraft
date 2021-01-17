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

module.exports = class versionSpigotControler {

   /**
    * Inizallisiert
    * @param {string|boolean} overwriteBaseURL
    */
   constructor(overwriteBaseURL = false) {
      this.versionUrl      = "https://launchermeta.mojang.com/mc/game/version_manifest.json"
      this.downloadUrl     = "https://cdn.getbukkit.org/spigot/spigot-{version}.jar"
      this.downloadUrlRaw  = "https://cdn.getbukkit.org/spigot/"
      this.localUrl        = [mainDir, "public/json/serverInfos", "mcVersionsSpigot.json"]
   }

   /**
    * Hollt die liste aller versionen
    * @return {boolean|array}
    */
   async getList() {
      rq(this.versionUrl, (error, response, body) => {
         try {
            if(!error && response.statusCode === 200) {
               let versionList   = JSON.parse(body)
               let versions      = []
               for(let item of versionList.versions) {
                  if(item.type === "release") {
                     let request    = srq('GET', this.downloadUrl.replace("{version}", item.id))
                     if(!request.getBody().toString().includes("RESTRICTED!")) {
                        versions.push(`spigot-${item.id}.jar`)
                     }

                     if(item.id === "1.11.0") break;
                  }
               }

               versions.push("spigot-1.10.2-R0.1-SNAPSHOT-latest.jar")
               versions.push("spigot-1.10-R0.1-SNAPSHOT-latest.jar")
               versions.push("spigot-1.9.4-R0.1-SNAPSHOT-latest.jar")
               versions.push("spigot-1.9.2-R0.1-SNAPSHOT-latest.jar")
               versions.push("spigot-1.9-R0.1-SNAPSHOT-latest.jar")
               versions.push("spigot-1.8.8-R0.1-SNAPSHOT-latest.jar")
               versions.push("spigot-1.8.7-R0.1-SNAPSHOT-latest.jar")
               versions.push("spigot-1.8.6-R0.1-SNAPSHOT-latest.jar")
               versions.push("spigot-1.8.5-R0.1-SNAPSHOT-latest.jar")
               versions.push("spigot-1.8.4-R0.1-SNAPSHOT-latest.jar")
               versions.push("spigot-1.8.3-R0.1-SNAPSHOT-latest.jar")
               versions.push("spigot-1.8-R0.1-SNAPSHOT-latest.jar")
               versions.push("spigot-1.7.10-SNAPSHOT-b1657.jar")
               versions.push("spigot-1.7.9-R0.2-SNAPSHOT.jar")
               versions.push("spigot-1.7.8-R0.1-SNAPSHOT.jar")
               versions.push("spigot-1.7.5-R0.1-SNAPSHOT-1387.jar")
               versions.push("spigot-1.7.2-R0.4-SNAPSHOT-1339.jar")
               versions.push("spigot-1.6.4-R2.1-SNAPSHOT.jar")
               versions.push("spigot-1.6.2-R1.1-SNAPSHOT.jar")
               versions.push("spigot-1.5.2-R1.1-SNAPSHOT.jar")
               versions.push("spigot-1.5.1-R0.1-SNAPSHOT.jar")
               versions.push("spigot-1.4.7-R1.1-SNAPSHOT.jar")
               versions.push("spigot-1.4.6-R0.4-SNAPSHOT.jar")

               globalUtil.safeFileSaveSync(this.localUrl, JSON.stringify(versions))
            }
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
    * Download Server
    * version {string} VersionString
    * path {string} Pfad wo es gespeichert werden soll
    * @return {boolean}
    */
   downloadServer(version, path) {
      (async () => {
         globalUtil.safeFileRmSync([path])
         globalUtil.safeFileSaveSync([pathMod.join(path).replace("serverSpigot.jar", "eula.txt")], "eula=true")
         download(this.downloadUrlRaw + version.replace("Spigot", "spigot"))
               .pipe(fs.createWriteStream(pathMod.join(path)))
      })()
      return true
   }
}