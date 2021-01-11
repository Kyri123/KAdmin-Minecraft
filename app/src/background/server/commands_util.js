/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const serverClass           = require('./../../util_server/class')
//const rcon                  = require('rcon')

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
            let logPath         = servConfig.pathLogs + '\\latest.log'
            if(!globalUtil.safeFileExsistsSync([logPath])) globalUtil.safeFileSaveSync([logPath], '')

            // baue Mod optionen
            let opt    = ''
            if(!servConfig.flags.includes(['crossplay', 'epiconly'])) if(servConfig.mods.length > 0) opt = `?GameModIds=${servConfig.mods.join(',')}`

            // baue custom Optionen
            if(servConfig.opt.length > 0) servConfig.opt.forEach((val) => {
                opt += `?${val}`
            })

            // TotalConversionMod
            if(parseInt(servConfig.TotalConversionMod) !== 0) opt += `?TotalConversionMod=${servConfig.TotalConversionMod}`

            // baue Flaggen
            let flags    = ''
            if(servConfig.flags.length > 0) servConfig.flags.forEach((val) => {
                flags += ` -${val}`
            })

            return `start ${serverPath}\\ShooterGame\\Binaries\\Win64\\ShooterGameServer.exe ${servConfig.serverMap}?listen?SessionName=${servConfig.sessionName}?AltSaveDirectoryName=${servConfig.AltSaveDirectoryName}?ServerAdminPassword=${servConfig.ServerAdminPassword}?Port=${servConfig.game}?QueryPort=${servConfig.query}?MaxPlayers=${servConfig.maxPlayers}?RCONEnabled=True?RCONPort${servConfig.rcon}${opt}${flags}\n`
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