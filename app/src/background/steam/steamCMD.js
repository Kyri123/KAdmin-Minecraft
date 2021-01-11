/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const cmd           = require('node-cmd')


module.exports = {
    /**
     * Führt steamCMD Command aus
     * @param {string} command CMD command
     * @param {boolean} doLog soll gelogt werden?
     * @param {string} doFile Pfad zum Log
     * @param {boolean} useCMDWindow Soll ein Fenster geöffnet werden oder nicht
     * @returns {boolean}
     */
    runCMD: (command, doLog = false, logFile = '', useCMDWindow = true) => {
        let steamCMDPath    = pathMod.join(PANEL_CONFIG.steamCMDRoot, 'steamcmd.exe')
        if(globalUtil.safeFileExsistsSync([steamCMDPath])) {
            let doThis = useCMDWindow ?
                `start ${steamCMDPath} +login anonymous ${command} +exit${!doLog ? '' : ` > ${logFile}`}` :
                `${steamCMDPath} +login anonymous ${command} +exit${!doLog ? '' : ` > ${logFile}`}`
            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m runSteamCMD > ${doThis}`)
            cmd.run(doThis)
            return true
        }
        return false
    },
}