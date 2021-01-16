/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

// require Module
const Gamedig       = require('gamedig')
const ip            = require("ip")
const findProcess   = require('find-process')


/**
 * Speichert Informationen in einer JSON oder in die MYSQL
 * @param {boolean} mysql_status - Soll die Daten in der Datenbankl gespeichert werden
 * @param {array} data - Daten die gespeichert werden
 * @param {string} name - Bezeichung der gespeicherten Daten (bsp server)
 * @param {array} state - Daten zusätzlich gespeichert werden sollen (array.state)
 * @param {boolean} use_state - Soll state benutzt werden?
 */
function save(data, name, state, use_state = true) {
    // Schreibe in die Datenbank zu weiterverarbeitung
    /*let query_lf = `SELECT * FROM \`statistiken\` WHERE \`server\` = '${name}' ORDER BY \`time\``
    con.query(query_lf, (error, results) => {
        if(use_state) data.state = state
        if(!error) {
            // Wenn mehr als 999 Datensätze bestehen Updaten
            if(results.length > 999) {
                var update = `UPDATE \`statistiken\` SET \`time\` = '${Math.floor(Date.now() / 1000)}', \`serverinfo_json\` = '${JSON.stringify(data)}' WHERE \`id\` = '${results[0].id}'`
                con.query(update)
            }
            // Wenn mehr weniger 999 Datensätze bestehen Erstelle neue Datensätze
            else {
                var create = `INSERT INTO \`statistiken\` VALUES (null, '${Math.floor(Date.now() / 1000)}', '${JSON.stringify(data)}', '${name}');`
                con.query(create)
            }
        }
    });*/
    globalUtil.safeFileSaveSync([mainDir, '/public/json/server', `${name}.json`], JSON.stringify(data))
}

module.exports = {
    getStateFromServers: async () => {
        let serverLocalPath     = `./app/json/server`
        let dirArray            = fs.readdirSync(serverLocalPath)
        // Scanne Instancen
        dirArray.forEach((ITEM) => {
            // Erstelle Abfrage wenn es eine .cfg Datei ist
            if (ITEM.includes(".json")) {

                let file = pathMod.join(mainDir, '/public/json/server/')
                if(!globalUtil.safeFileExsistsSync([file])) globalUtil.safeFileMkdirSync([file])
                let name            = ITEM.replace(".json", "")
                let serverData      = new serverClass(name)
                let data            = serverData.getServerInfos() !== false ? serverData.getServerInfos() : {}
                let servCFG         = serverData.getConfig()
                let servINI         = serverData.getINI()
                let serverPath      = servCFG.path

                // Default werte
                data.aplayers       = 0
                data.players        = 0
                data.listening      = false
                data.online         = false
                data.cfg            = name
                data.ServerMap      = servINI["level-name"]
                data.ServerName     = servINI["motd"]
                data.connect        = `steam://connect/${ip.address()}:${servCFG.query}`
                data.is_installed   = globalUtil.safeFileExsistsSync([serverPath, servCFG.jar])
                data.is_free        = true
                data.selfname       = servCFG.selfname

                // Runing infos
                data.run            = false
                data.steamcmd       = false
                data.cmd            = false
                data.pid            = 0
                data.ppid           = 0
                data.bin            = ""

                // More data
                data.aplayers       = 0
                data.aplayersarr    = []
                data.ping           = 0
                data.version        = servCFG.currversion === "0.0.0"
                   ? (data.version === undefined || data.version.trim() === ""
                     ? servCFG.currversion
                     : data.version
                   ) : servCFG.currversion


                // Alerts
                data.alerts = []
                if(data.is_installed) {
                }
                else {
                    data.alerts.push("3999")
                }

                findProcess('port', servINI['server-port'])
                    .then(function (list) {
                        if (list.length) {
                            let pid     = list[0].pid
                            let ppid    = list[0].ppid
                            let cmd     = list[0].cmd
                            let bin     = list[0].bin

                             data.run            = true
                             data.cmd            = cmd
                             data.pid            = pid
                             data.ppid           = ppid
                             data.bin            = bin

                             Gamedig.query({
                                 type: 'minecraft',
                                 host: "127.0.0.1",
                                 port: servINI['server-port']
                             })
                                 .then((state) => {
                                     data.players        = state.maxplayers
                                     data.aplayers       = state.players.length
                                     data.aplayersarr    = state.players
                                     data.listening      = true
                                     data.online         = true
                                     data.cfg            = name
                                     data.ServerMap      = state.map
                                     data.ServerName     = state.name
                                     data.ping           = state.ping
                                     data.usePW          = state.ping
                                     data.isVanilla      = state.raw.badrock === undefined
                                     data.version        = data.isVanilla ? state.raw.vanilla.raw.version.name : state.raw.badrock.raw.version.name
                                     data.protocol       = data.isVanilla ? state.raw.vanilla.raw.version.protocol : state.raw.badrock.raw.version.protocol
                                     data.type           = "vanilla"
                                     if(data.isVanilla) {
                                         if(state.raw.vanilla.raw.modinfo !== undefined) {
                                             data.type       = state.raw.vanilla.raw.modinfo.type
                                             data.modlist    = state.raw.vanilla.raw.modinfo.modList
                                         }
                                     }

                                     // Hole Version
                                     var version_split = state.name.split("-")[1]
                                     version_split = version_split.replace(")", "")
                                     version_split = version_split.replace("(", "")
                                     version_split = version_split.replace(" ", "")
                                     version_split = version_split.replace("v", "")
                                     data.version = version_split

                                     // Speichern
                                     save(data, name, state)
                                 }).catch((error) => {
                                     // Speichern
                                     save(data, name, {})
                                 })
                        }
                        else {
                            // Speichern
                            save(data, name, {})
                        }
                    })
            }
        })
    }
};