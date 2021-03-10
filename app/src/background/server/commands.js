/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const CommandUtil           = require('./commands_util')
const serverShell           = require('./shell')

module.exports = {

   /**
    * Startet einen Server
    * @param server {string}
    * @param para {array} Parameters
    * <br>
    * - **--alwaysstart** (Server startet immer wenn dieser NICHT läuft) <br>
    * @return {boolean}
    */
   doStart: (server, para) => {
      let serv       = new serverClass(server)
      if(serv.serverExsists()) {
         let info       = serv.getServerInfos()
         let startLine  = CommandUtil.getStartLine(server)

         if(info.pid === 0) {
            if(para.includes("--alwaysstart")) serv.writeConfig("shouldRun", true)
            return serverShell.runSHELL(startLine)
         }
         return false
      }
   },

   /**
    * Stoppt einen Server
    * @param server {string}
    * @param para {array} Parameters
    * <br>
    * - **--hardstop** (Beendet mit kill) <br>
    * @return {boolean}
    */
   doStop: (server, para) => {
      let serv       = new serverClass(server)
      if(serv.serverExsists()) {
         let info       = serv.getServerInfos()

         if(info.pid !== 0) {
            serv.writeConfig("shouldRun", false)
            if(para.includes("--hardstop")) {
               //serverShell.runSHELL(`kill ${info.ppid}`)
               return serverShell.runSHELL(`kill ${info.pid}`)
            }
            else {
               return CommandUtil.sendToScreen(server, "stop")
            }
         }
         return false
      }
   },

   /**
    * Erstellt ein Backup vom Server
    * @param server {string}
    * @param para {array} Parameters
    * <br>
    * - **Derzeit keine Parameter**
    */
   doBackup: function(server, para) {
      let serv       = new serverClass(server)
      if(serv.serverExsists()) {
         let servCFG          = serv.getConfig()
         let servINI          = serv.getINI()
         let zipPath          = pathMod.join(servCFG.pathBackup, `${Date.now()}.zip`)
         let backuprun        = pathMod.join(servCFG.pathBackup, `backuprun`)
         let paths            = []
         globalUtil.safeFileMkdirSync([servCFG.pathBackup])

         if(!para.includes('--onlyworld'))
            if(globalUtil.safeFileExsistsSync([servCFG.path]))
               paths.push("./")

         if(para.includes('--onlyworld')) {
            if(globalUtil.safeFileExsistsSync([servCFG.path, servINI['level-name']]))
               paths.push(`./${servINI['level-name']}`)
            if(globalUtil.safeFileExsistsSync([servCFG.path, servINI['level-name'] + "_nether"]))
               paths.push(`./${servINI['level-name']}_nether`)
            if(globalUtil.safeFileExsistsSync([servCFG.path, servINI['level-name'] + "_the_end"]))
               paths.push(`./${servINI['level-name']}_the_end`)
         }

         if(para.includes('--onlyworld') && para.includes('--withmods')) {
            if (globalUtil.safeFileExsistsSync([servCFG.path, "mods"]))
               paths.push("./mods")
            if (globalUtil.safeFileExsistsSync([servCFG.path, "config"]))
               paths.push("./config")
         }

         if(para.includes('--onlyworld') && para.includes('--witplugins'))
            if(globalUtil.safeFileExsistsSync([servCFG.path, "plugins"]))
               paths.push("./plugins")

         if(
            !globalUtil.checkValidatePath(servCFG.path) ||
            !globalUtil.checkValidatePath(servCFG.pathBackup)
         ) return false

         if(globalUtil.safeFileCreateSync([backuprun]) && paths.length !== 0) {
            // prüfe backupverzeichnis
            let checkBackupPath = function () {
            let haveRm          = false

            let maxSize   = servCFG.autoBackupMaxDirSize
            let maxCount  = servCFG.autoBackupMaxCount
            if(maxCount !== 0 || maxSize !== 0) {
               maxSize              = maxSize * 1e+6
               let backupDirInfos   = globalUtil.safeFileReadDirSync([servCFG.pathBackup])
               let totalSize        = 0
               let totalCount       = 0
               let oldestFile       = false
               for(let file of backupDirInfos) {
                  if(file.FileExt === ".zip") {
                     let backupTime = parseInt(file.namePure, 10)
                     // finde Ältestes Backup
                     if (backupTime < oldestFile || oldestFile === false)
                        oldestFile = backupTime
                     // zähle Backups
                     totalCount++
                     // erfasse TotalSize
                     totalSize += file.sizebit
                  }
               }

               if(oldestFile !== false)
                  if(
                     (maxCount !== 0 && maxCount <= totalCount) ||
                     (maxSize !== 0 && maxSize <= totalSize)
                  ) {
                     globalUtil.safeFileRmSync([servCFG.pathBackup, `${oldestFile}.zip`])
                     haveRm = true
                  }
               }

               if(haveRm) checkBackupPath()
               return true
            }

            if(checkBackupPath()) {
               serverShell.runSHELL(`cd ${servCFG.path} && zip -9 -r ${zipPath} ${paths.join(" ")} && rm ${backuprun}`)
               return true
            }
         }

         return false
      }
   }
}