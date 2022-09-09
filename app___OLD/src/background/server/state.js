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
const pidusage      = require('pidusage')
const os            = require('os')


/**
 * Speichert Informationen in einer JSON oder in die MYSQL
 * @param {array} data - Daten die gespeichert werden
 * @param {string} name - Bezeichung der gespeicherten Daten (bsp server)
 * @param {{}} state - Daten zusätzlich gespeichert werden sollen (array.state)
 * @param {boolean} use_state - Soll state benutzt werden?
 */
function save(data, name, state, use_state = true) {
      // Todo X.X.X Stats
      // > state > use_state
      //data.push(state)
      safeFileSaveSync([mainDir, '/public/json/server', `${name}.json`], JSON.stringify(data))
}

module.exports = {
    getStateFromServers: async () => {
        let serverLocalPath     = `./app/json/server`
        let dirArray            = fs.readdirSync(serverLocalPath)
        // Scanne Instancen
        dirArray.forEach((ITEM) => {
            // Erstelle Abfrage wenn es eine .cfg Datei ist
            if (ITEM.includes(".json")) {

                let file               = pathMod.join(mainDir, '/public/json/server/')
                if(!safeFileExsistsSync([file])) safeFileMkdirSync([file])
                let name               = ITEM.replace(".json", "")
                let serverData         = new serverClass(name)
                let data               = serverData.getServerInfos() !== false
                   ? serverData.getServerInfos()
                   : {}
                let servCFG            = serverData.getConfig()
                let servINI            = serverData.getINI()
                let serverPath         = servCFG.path

                // Default werte
                data.aplayers          = 0
                data.players           = 0
                data.cpuUsage          = 0
                data.memory            = 0
                data.maxmemory         = servCFG.xmx
                data.elapsed           = 0
                data.epoch             = 0
                data.listening         = false
                data.online            = false
                data.cfg               = name
                data.ServerMap         = servINI["level-name"]
                data.ServerName        = servINI["motd"]
                data.connect           = `steam://connect/${ip.address()}:${servCFG.query}`
                data.is_installed      = safeFileExsistsSync([serverPath, servCFG.jar])
                data.is_installing     = safeFileExsistsSync([serverPath, "installing"])
                data.is_free           = true
                data.selfname          = servCFG.selfname
                data.icon              = safeFileExsistsSync([serverPath, "server-icon.png"])
                   ? `/serv/${name}/server-icon.png`
                   : "/img/logo/logo.png"
                data.isAction          = (
                    safeFileExsistsSync([serverPath, "backuprun"]) ||
                    safeFileExsistsSync([serverPath, "isplayin"])
                )

                // Runing infos
                data.run               = false
                data.steamcmd          = false
                data.cmd               = false
                data.pid               = 0
                data.ppid              = 0
                data.bin               = ""

                // BackupInfos
                let obj         = {},
                    scan        = safeFileReadDirSync([servCFG.pathBackup])
                obj.max         = servCFG.autoBackupMaxDirSize
                obj.maxCount    = servCFG.autoBackupMaxCount
                if(scan !== false) {
                    let fileCount = 0,
                        totalSize = 0
                    for(let item of scan) {
                        if(item.name.includes(".zip")) {
                            fileCount++
                            totalSize += item.sizebit
                        }
                    }
                    obj.maxis           = totalSize
                    obj.maxCountis      = fileCount
                }
                else {
                    obj.maxis           = 0
                    obj.maxCountis      = 0
                }

                data.backup = obj

                // More data
                data.aplayers          = 0
                data.aplayersarr       = []
                data.ping              = 0
                data.version           = servCFG.currversion === "0.0.0"
                   ? (data.version === undefined || data.version.trim() === ""
                     ? servCFG.currversion
                     : data.version
                   ) : servCFG.currversion

                // Alerts
                    data.alerts = []

                    // ist Server installiert
                    if(!data.is_installed)
                       data.alerts.push("3999")

                    // ist Server am installieren
                    if(data.is_installing)
                        data.alerts.push("3998")

                    // Soll server dauerhaft laufen
                    if(servCFG.shouldRun)
                        data.alerts.push("3995")

                    // Eula
                    let eula                = safeFileExsistsSync([serverPath, "eula.txt"]) === false
                        ? ""
                        : safeFileReadSync([serverPath, "eula.txt"])
                    if(!eula.includes("eula=true"))
                        data.alerts.push("3997")

                    // Sind keine Meldungen vorhanden
                    if(data.alerts.length === 0)
                        data.alerts.push("4000")

                findProcess('name', name)
                    .then(async function (list) {
                        if (list.length) {
                            let index = 0
                            for(let i in list) {
                                if(list[i].bin === "java") {
                                    index = i
                                    break
                                }
                            }
                            let pid     = list[index].pid
                            let ppid    = list[index].ppid
                            let cmd     = list[index].cmd
                            let bin     = list[index].bin
                            try {
                                let pidData = await pidusage(pid)
                                data.cpuUsage          = Math.round(pidData.cpu / os.cpus().length * 100) / 100
                                data.memory            = pidData.memory
                                data.elapsed           = pidData.elapsed
                                data.epoch             = pidData.timestamp
                            }
                            catch (e) {

                            }


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
                                     data.version        = data.isVanilla
                                        ? state.raw.vanilla.raw.version.name
                                        : state.raw.badrock.raw.version.name
                                     data.protocol       = data.isVanilla
                                        ? state.raw.vanilla.raw.version.protocol
                                        : state.raw.badrock.raw.version.protocol
                                     data.type           = "vanilla"
                                     if(data.isVanilla)
                                         if(state.raw.vanilla.raw.modinfo !== undefined) {
                                             data.type       = state.raw.vanilla.raw.modinfo.type
                                             data.modlist    = state.raw.vanilla.raw.modinfo.modList
                                         }

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