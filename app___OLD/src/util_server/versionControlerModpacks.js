/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const srq         = require("sync-request")
const download    = require("download")
const unzip       = require("unzipper")
const shell       = require("./../background/server/shell")

module.exports = class versionControlerModpacks {

   /**
    * Inizallisiert
    * @param {string|boolean} overwriteBaseURL
    */
   constructor(overwriteBaseURL = false) {
      this.baseUrl      = "https://addons-ecs.forgesvc.net/api/v2"
   }

   /**
    * Gibt Informationen über ein Modpack aus
    * @param {int} modpackID ID vom Modpack
    * @return {boolean|string}
    */
   getModpackInfos(modpackID) {
      let resp       = false
      modpackID      = parseInt(modpackID)
      if(!isNaN(modpackID)) {
         try {
            // lese Allgemein Infos
            resp = JSON.parse(srq('GET', `${this.baseUrl}/addon/${modpackID}`, {
               json: true
            }).getBody())

            // lese Download links
            resp.dFiles    = []
            resp.dFiles.push(JSON.parse(srq('GET', `${this.baseUrl}/addon/${modpackID}/files`, {
               json: true
            }).getBody()))

            // wandel in String
            resp           = JSON.stringify(resp)
         }
         catch (e) {
            if(debug) console.log('[DEBUG_FAILED]', e)
         }
      }
      return resp
   }

   /**
    * Hollt die DownloadURL über versionString
    * @param {int} modpackID ID vom Modpack
    * @param {int} packID ID vom Pack
    * @return {boolean|string}
    */
   getDownloadUrl(modpackID, packID) {
      let resp       = false
      modpackID      = parseInt(modpackID)
      packID         = parseInt(packID)
      if(!isNaN(modpackID) && !isNaN(packID)) {
         try {
            // lese Allgemein Infos
            resp = srq('GET', `${this.baseUrl}/addon/${modpackID}/file/${packID}/download-url`).getBody()
         }
         catch (e) {
            if(debug) console.log('[DEBUG_FAILED]', e)
         }
      }
      return resp
   }

   /**
    * Download Server
    * modpackID {string} ModpackID
    * packID {string} PackID
    * server {string} Servername
    * @return {boolean}
    */
   InstallPack(modpackID, packID, server) {
      let serv    = new serverClass(server)
      let url     = this.getDownloadUrl(modpackID, packID).toString()

      if(url !== false && serv.serverExsists()) {
         let cfg  = serv.getConfig();

         (async () => {
            safeFileSaveSync([cfg.path, "installing"], "true")
            safeFileRmSync([cfg.path, "mods"])
            safeFileRmSync([cfg.path, "config"])
            safeFileRmSync([cfg.path, "journeymap"])
            safeFileRmSync([cfg.path, "libraries"])
            safeFileRmSync([cfg.path, "scripts"])
            safeFileRmSync([cfg.path, "modpack"])
            safeFileRmSync([cfg.path, "resources"])
            safeFileRmSync([cfg.path, "oresources"])
            safeFileRmSync([cfg.path, "fontfiles"])

            fs.readdir(pathMod.join(cfg.path), (err, files) =>
               files.forEach(file => {
                  if (
                     file.includes(".jar") ||
                     file.includes(".sh") ||
                     file.includes(".cmd") ||
                     file.includes(".bat") ||
                     file.includes(".pdf") ||
                     file.includes(".txt")
                  )
                     safeFileRmSync([cfg.path, file])
               })
            )

            fs.writeFileSync(pathMod.join(cfg.path, "modpack.zip"), await download(url))
            fs.createReadStream(pathMod.join(cfg.path, "modpack.zip"))
               .pipe(unzip.Extract({ path: pathMod.join(cfg.path)}))
               .on("close", () => {
                  fs.readdir(pathMod.join(cfg.path), (err, files) =>
                     files.forEach(file => {
                        if(file.toLowerCase().includes("forge") && !file.toLowerCase().includes("install"))
                           serv.writeConfig("jar", file)

                        if((file.toLowerCase().includes("install") || file.toLowerCase().includes("ftbserver")) && file.toLowerCase().includes(".sh"))
                           shell.runSHELL(`chmod 777 -R ${pathMod.join(cfg.path)} && cd ${pathMod.join(cfg.path)} && ./${file}`)
                     })
                  )

                  serv.writeConfig("currversion", "ModPack - " + modpackID)
                  safeFileRmSync([cfg.path, "modpack.zip"])
                  safeFileRmSync([cfg.path, "installing"])
                  safeFileSaveSync([cfg.path, "eula.txt"], "eula=true")
               })

         })()
         return true
      }
      return url !== false
   }
}