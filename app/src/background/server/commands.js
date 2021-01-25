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
    * @param para {array}
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
    * @param para {array}
    * @return {boolean}
    */
   doBackup: (server, para) => {
      let serv       = new serverClass(server)
      if(serv.serverExsists()) {
         let servCFG = serv.getConfig()
         return serverShell.runSHELL(`${!globalUtil.safeFileExsistsSync([servCFG.pathBackup]) ? `mkdir ${servCFG.pathBackup} && ` : ""}tar -cvzpf ${servCFG.pathBackup}/${Date.now()}.tar.gz ${servCFG.path}/*`)
      }
   }
}