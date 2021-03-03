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
const serverCommands        = require('./server/commands')
const shell                 = require('./server/shell')
const updater               = require('./updater')


module.exports = {
    /**
     * Startet alle Intervalle
     */
    startAll: async () => {
        setInterval(() => module.exports.backgroundUpdater(),           CONFIG.main.interval.backgroundUpdater)
        setInterval(() => module.exports.doReReadConfig(),              CONFIG.main.interval.doReReadConfig)
        setInterval(() => module.exports.getTraffic(),                  CONFIG.main.interval.getTraffic)
        setInterval(() => module.exports.getStateFromServers(),         CONFIG.main.interval.getStateFromServers)
        setInterval(() => module.exports.getVersionList(),              CONFIG.main.interval.getVersionList)
        setInterval(() => module.exports.doServerBackgrounder(),        CONFIG.main.interval.doServerBackgrounder)
        setInterval(() => module.exports.getChangelogList(),            CONFIG.main.interval.getChangelogList)
        setInterval(() => module.exports.getSpigotCraftbukkitList(),    CONFIG.main.interval.getSpigotCraftbukkitList)

        // on load
        if(!globalUtil.safeFileExsistsSync([mainDir, "public/json/serverInfos", "mcVersions.json"]))
            module.exports.getVersionList()
        if(!globalUtil.safeFileExsistsSync([mainDir, "public/json/serverInfos", "mcVersionsSpigot.json"]) || !globalUtil.safeFileExsistsSync([mainDir, "public/json/serverInfos", "mcVersionsCraftbukkit.json"]))
            module.exports.getSpigotCraftbukkitList()

        module.exports.getTraffic()
        module.exports.getStateFromServers()
        module.exports.getChangelogList()
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    getSpigotCraftbukkitList: () => {
        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}][DEBUG]\x1b[36m run > getSpigotCraftbukkitList`)
        shell.runSHELL(`screen -dmS kadmin-updateVersionLists bash -c "cd ${mainDir} && node updateVersionLists.js"`)
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    getVersionList: () => {
        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}][DEBUG]\x1b[36m run > getVersionList`)
        versionVanillaControler.getList()
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    getStateFromServers: () => {
        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}][DEBUG]\x1b[36m run > getStateFromServers`)
        server_state.getStateFromServers()
    },

    /**
     * Liest die Konfigurationen neu ein
     * @returns {Promise<void>}
     */
    doReReadConfig: () => {
        (async () => {
            // Lade Konfigurationen
            let pathConfigDir    = pathMod.join(mainDir, '/app/config/')
            fs.readdirSync(pathConfigDir).forEach(item => {
                if(item.includes(".json")) {
                    try {
                        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}][DEBUG]\x1b[36m Load: ${pathMod.join(pathConfigDir, item)}`)
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
                                if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}][DEBUG]\x1b[36m Load: ${langPath}/${file}`)
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

            if(Installed) {
                let pathFile    = pathMod.join(mainDir, '/app/json/panel/', 'changelog.json')
                try {
                    if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}][DEBUG]\x1b[36m Load: ${pathFile}`)
                    global.changelog                    = globalUtil.safeFileReadSync([pathFile], true)
                    if(typeof changelog === "boolean") {
                        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathFile} not found`)
                        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
                        process.exit(1)
                    }
                    changelog.reverse()
                }
                catch (e) {
                    if(debug) console.log('[DEBUG_FAILED]', e)
                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathFile} not found`)
                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
                    process.exit(1)
                }
            }
        })()
    },

    /**
     * Prüft nach neuer Panel Version
     */
    backgroundUpdater: () => {
        updater.check()
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    getTraffic: () => {
        (async () => {
            if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}][DEBUG]\x1b[36m run > getTraffic`)
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
        })()
    },


    /**
     * Führt hintergrund aktionen von Server aus Bsp.: Automatisches Update
     * @returns {Promise<void>}
     */
    doServerBackgrounder: () => {
        (async () => {
            if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}][DEBUG]\x1b[36m run > doServerBackgrounder`)
            let serverInfos     = globalInfos.get()

            if(serverInfos.servers_arr.length > 0) {
                serverInfos.servers_arr.forEach((val) => {
                    let serv = new serverClass(val[0])
                    if(serv.serverExsists()) {
                        let cfg = serv.getConfig()
                        // Auto Backup system
                        if(cfg.autoBackup) {
                            if(Date.now() > cfg.autoBackupNext) {
                                serverCommands.doBackup(val[0], cfg.autoBackupPara);
                                serv.writeConfig("autoBackupNext", (Date.now() + cfg.autoBackupInterval))
                                if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}][DEBUG]\x1b[36m run > doServerBackgrounder > autoBackup > ${val[0]}`)
                            }
                        }

                        // soll der Server laufen?
                        if(cfg.shouldRun && val[1].pid === 0) {
                            if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}][DEBUG]\x1b[36m run > doServerBackgrounder > Start > ${val[0]}`)
                            serverCommands.doStart(val[0], [])
                        }
                    }
                })
            }
        })()
    },

    /**
     * Hollt die liste aller versionen
     * @return {boolean|array}
     */
    getChangelogList() {
        (async () => {
            req("https://api.minecraft.kadmin-panel.de/changelog.json", (error, response, body) => {
                try {
                    if(!error && response.statusCode === 200)
                        globalUtil.safeFileSaveSync([mainDir, "app/json/panel", "changelog.json"], JSON.parse(JSON.stringify(body)))
                }
                catch (e) {
                    if(debug) console.log('[DEBUG_FAILED]', e)
                }
            })
            return false
        })()
    }
}
