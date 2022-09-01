/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const globalInfos           = require('./../global_infos')


module.exports = {
    /**
     * Startet alle Intervalle
     */
    startAll: () => {
        module.exports.removeDefaults()
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    removeDefaults: async () => {
        let serverInfos     = globalInfos.get()

        // Suche Mods zusammen
        if(serverInfos.servers_arr.length > 0) {
            serverInfos.servers_arr.forEach((val) => {
                let file = pathMod.join(`${val[1].pathLogs}.cmd`)
               if(safeFileExsistsSync([file])) safeFileRmSync([file])
            })
        }
    },
}