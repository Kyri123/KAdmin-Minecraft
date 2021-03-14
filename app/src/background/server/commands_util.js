/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

//const rcon                  = require('rcon')
const shell                 = require('./shell')

module.exports = {

    /**
     * erzeugt die Startline für die Server
     * @param {string} server Server Name
     * @return {string|boolean}
     */
    getStartLine: (server) => {
        let serverData  = new serverClass(server)
        if(serverData.serverExsists()) {
            let servConfig      = serverData.getConfig()
            let serverPath      = servConfig.path
            let logPath         = servConfig.pathLogs + '/latest.log'
            if(!globalUtil.safeFileExsistsSync([logPath])) globalUtil.safeFileSaveSync([logPath], '')

            return `screen -dmS kadmin-${server} bash -c "cd ${serverPath} && java ${servConfig.extrajava} -Xmx${servConfig.xmx}m -Xms${servConfig.xms}m ${serverPath}/${servConfig.jar} nogui > ${logPath} && exit"`
        }
        return false
    },

    /**
     * sendet ein Befehl zum Screen
     * @param {string} server Server Name
     * @param {string} command
     * @param server
     */
    sendToScreen(server, command) {
        let serverData  = new serverClass(server)
        if(serverData.serverExsists() && shell.runSyncSHELL('screen -list').toString().includes(`.kadmin-${server}`)) {
            let info            = serverData.getServerInfos()
            command             = command
                .replaceAll("%20", " ")
                .replaceAll("%E4", "ä")
                .replaceAll("%F6", "ö")
                .replaceAll("%FC", "ü")
                .replaceAll("%C4", "Ä")
                .replaceAll("%D6", "Ö")
                .replaceAll("%DC", "Ü")
                .replaceAll("%C3", "{")
                .replaceAll("%3E", "}")
            return info.pid !== 0 ? shell.runSHELL(`screen -S kadmin-${server} -p 0 -X stuff "${command}^M"`) : false
        }
        return false
    },

    /**
     * CMD Util um Countdown script zu erzeugen
     * @param {string} server Server Name
     * @param {boolean} saveworld Soll Saveworld per RCON gesendet werden
     * @return {string|boolean}
     */
    stopCountDown: (server, saveworld = true) => {
        // Todo - OLD
        let serverData  = new serverClass(server)
        let servConfig  = serverData.getConfig()
        let servInfos   = serverData.getServerInfos()

        if(
           serverData.online() &&
           servConfig !== false &&
           servInfos !== false
        ) {
            let re = `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "broadcast [KAdmin-Minecraft] ${PANEL_LANG.timers.stopCountDown['30']}"\n`
            re += `timeout /T 900\n`
            re += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "broadcast [KAdmin-Minecraft] ${PANEL_LANG.timers.stopCountDown['15']}"\n`
            re += `timeout /T 300\n`
            re += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "broadcast [KAdmin-Minecraft] ${PANEL_LANG.timers.stopCountDown['10']}"\n`
            re += `timeout /T 300\n`
            re += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "broadcast [KAdmin-Minecraft] ${PANEL_LANG.timers.stopCountDown['5']}"\n`
            re += `timeout /T 60\n`
            re += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "broadcast [KAdmin-Minecraft] ${PANEL_LANG.timers.stopCountDown['4']}"\n`
            re += `timeout /T 60\n`
            re += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "broadcast [KAdmin-Minecraft] ${PANEL_LANG.timers.stopCountDown['3']}"\n`
            re += `timeout /T 60\n`
            re += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "broadcast [KAdmin-Minecraft] ${PANEL_LANG.timers.stopCountDown['2']}"\n`
            re += `timeout /T 60\n`
            re += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "broadcast [KAdmin-Minecraft] ${PANEL_LANG.timers.stopCountDown['1']}"\n`
            re += `timeout /T 60\n`
            re += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "broadcast [KAdmin-Minecraft] ${PANEL_LANG.timers.stopCountDown[(saveworld ? 'now' : 'nownos')]}"\n`
            if(saveworld) re += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "saveworld"\n`
            re += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "doexit"\n`
            re += `timeout /T 10\n`
            re += `Taskkill /PID ${servInfos.pid} /F\n`

            return re
        }
        return false
    },

    /**
     * TODO Sendet ein Commando an den Server (ViaRcon)
     * @param {string} server Name des Servers
     * @param {string} command Befehl der gesendet werden soll
     * @return {string|boolean}
     */
    sendRcon: (server, command) => {}
}