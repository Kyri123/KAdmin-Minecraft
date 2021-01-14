/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const globalInfos           = require('./../global_infos')
const si                    = require('systeminformation')
const osu                   = require('node-os-utils')
const disk                  = require('check-disk-space')
const AA_util               = require('../util')
const req                   = require('request')
const server_state          = require('./server/state')


module.exports = {
    /**
     * Startet alle Intervalle
     */
    startAll: () => {
        setInterval(() => module.exports.backgroundUpdater(),           CONFIG.main.interval.backgroundUpdater)
        setInterval(() => module.exports.doReReadConfig(),              CONFIG.main.interval.doReReadConfig)
        setInterval(() => module.exports.getTraffic(),                  CONFIG.main.interval.getTraffic)
        setInterval(() => module.exports.getStateFromServers(),         CONFIG.main.interval.getStateFromServers)
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    getStateFromServers: () => {
        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getStateFromServers`)
        server_state.getStateFromServers()
    },

    /**
     * Liest die Konfigurationen neu ein
     * @returns {Promise<void>}
     */
    doReReadConfig: async () => {
        // Lade Konfigurationen
        let pathConfigDir    = pathMod.join(mainDir, '/app/config/')
        fs.readdirSync(pathConfigDir).forEach(item => {
            if(item.includes(".json")) {
                try {
                    CONFIG[item.replace(".json", "")]   = JSON.parse(fs.readFileSync(pathMod.join(pathConfigDir, item), 'utf8'))
                }
                catch (e) {
                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathConfigDir + item} cannot Loaded`)
                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
                    process.exit(1)
                }
            }
        })

        // Lade Sprachdatei(en)
        let pathLangDir    = pathMod.join(mainDir, '/lang/')
        fs.readdirSync(pathLangDir).forEach(item => {
            let langPath                            = pathMod.join(pathLangDir, item)
            let pathInfo                            = fs.statSync(langPath)
            if(LANG[item] === undefined) LANG[item] = {}
            if(pathInfo.isDirectory())
                fs.readdirSync(langPath).forEach(file => {
                    if(file.includes(".json")) {
                        try {
                            LANG[item][file.replace(".json", "")]   = JSON.parse(fs.readFileSync(pathMod.join(langPath, file), 'utf8'))
                        }
                        catch (e) {
                            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
                            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${langPath}/${file} cannot Loaded`)
                            process.exit(1)
                        }
                    }
                })
        })
    },

    /**
     * Prüft nach neuer Panel Version
     */
    backgroundUpdater: async () => {
        global.checkIsRunning = undefined
        var options = {
            url: `https://api.github.com/repos/Kyri123/KAdmin-Minecraft/branches/${panelBranch}`,
            headers: {
                'User-Agent': `KAdmin-Minecraft-Server AutoUpdater :: FROM: ${ip.address()}`
            },
            json: true
        }

        req.get(options, (err, res, api) => {
            if (err) {
                if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}] Auto-Updater: \x1b[91m${PANEL_LANG.updaterLOG.conErr}`)
            } else if (res.statusCode === 200) {
                // Prüfe SHA mit API
                if(!globalUtil.safeFileExsistsSync([mainDir, '/app/data/', 'sha.txt'])) globalUtil.safeFileSaveSync([mainDir, '/app/data/', 'sha.txt'], "false")
                fs.readFile(pathMod.join(mainDir, '/app/data/', 'sha.txt'), 'utf8', (err, data) => {
                    if (err === null) {
                        if (data === api.commit.sha) {
                            // kein Update
                            if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}] Auto-Updater: \x1b[32m${PANEL_LANG.updaterLOG.isUpToDate}`)
                        } else {
                            // Update verfügbar
                            if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}] Auto-Updater: \x1b[36m${PANEL_LANG.updaterLOG.isUpdate}`)
                            global.isUpdate = true
                            if(checkIsRunning === undefined) {
                                // Prüfe ob alle Aufgaben abgeschlossen sind && ob der Server mit startedWithUpdater gestartet wurde
                                if(process.argv.includes("startedWithUpdater")) checkIsRunning = setInterval(() => {
                                    let ServerInfos = globalInfos.get()
                                    let isFree      = true

                                    // gehe alle Server durch
                                    if(ServerInfos.servers_arr.length > 0) {
                                        ServerInfos.servers_arr.forEach((val) => {
                                            isFree = val[1].is_free
                                        })
                                    }

                                    // Wenn alles Frei ist beende den Server (startet durch die CMD sofort neu mit dem Updater
                                    if(isFree) {
                                        process.exit(2)
                                    }
                                }, 5000)
                                globalUtil.safeFileSaveSync([mainDir, '/app/data/', 'sha.txt'], api.commit.sha)
                            }
                            globalUtil.safeFileSaveSync([mainDir, '/app/data/', 'sha.txt'], api.commit.sha)
                        }
                    } else {
                        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}] Auto-Updater: \x1b[91m${PANEL_LANG.updaterLOG.noSha}`)
                    }
                })
            } else {
                // wenn keine verbindung zu Github-API besteht
                if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}] Auto-Updater: \x1b[91m${PANEL_LANG.updaterLOG.conErr}`)
            }
        })
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    getTraffic: async () => {
        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getTraffic`)
        osu.cpu.usage().then (cpuPercentage => {
            let disk_path = pathMod.join(globalUtil.safeFileExsistsSync([CONFIG.app.servRoot]) ? CONFIG.app.servRoot : mainDir)
            disk(disk_path).then((info) => {
                si.mem()
                   .then(mem => {
                       let ramPercentage = 100 - (mem.available / mem.total * 100)
                       let memPercentage = 100 - (info.free / info.size * 100)

                       let data = {
                           "cpu" : cpuPercentage.toFixed(2),
                           "ram" : ramPercentage.toFixed(2),
                           "ram_total" : AA_util.convertBytes(mem.total),
                           "ram_availble" : AA_util.convertBytes(mem.total - mem.available),
                           "mem" : memPercentage.toFixed(2),
                           "mem_total" : AA_util.convertBytes(info.size),
                           "mem_availble" : AA_util.convertBytes(info.size - info.free)
                       }

                       globalUtil.safeFileSaveSync([mainDir, '/public/json/serverInfos/', 'auslastung.json'], JSON.stringify(data))
                   })
            })
        })
    },
}