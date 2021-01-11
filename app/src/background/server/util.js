/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const steamCMD              = require('./../steam/steamCMD')

module.exports = {
    /**
     * Schreib Global die verfügbaren Versionen
     * @param {string} branch Ark Brach
     * @returns {Promise<void>}
     */
    // läuft aller 5 Min im Background
    getAvailableVersion: async () => {
        let logPath     = `${PANEL_CONFIG.steamCMDRoot}\\appcache\\infolog.log`

        // Wandel acf to array
        globalUtil.toAcfToArray(logPath)
            .then((acfArray) => {
                // SteamCMD infoupdate
                steamCMD.runCMD(`+app_info_update 1 +app_info_print ${PANEL_CONFIG.appID_server}`, true, logPath, false)

                // schreibe Global
                global.availableVersionPublic          = acfArray !== false && acfArray[PANEL_CONFIG.appID_server] !== undefined ? acfArray[PANEL_CONFIG.appID_server].depots.branches["public"].buildid : false
                global.availableVersionActiveevent     = acfArray !== false && acfArray[PANEL_CONFIG.appID_server] !== undefined ? acfArray[PANEL_CONFIG.appID_server].depots.branches["activeevent"].buildid : false
                globalUtil.safeFileSaveSync([mainDir, '/public/json/steamAPI/', 'version.json'], JSON.stringify({availableVersionPublic:availableVersionPublic,availableVersionActiveevent:availableVersionActiveevent}))
            })
    },
}