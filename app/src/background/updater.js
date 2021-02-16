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
const req                   = require('request')
const download              = require("download")
const unzip                 = require("unzipper")
const fse                   = require('fs-extra')

module.exports = {
    /**
     * Installiert Update
     * @param {string} url
     * @returns {Promise<void>}
     */
    install: async (url) => {
        let tmpPath         = pathMod.join(mainDir, "tmp")
        let updateZipPath   = pathMod.join(tmpPath, "update.zip")
        let branch          = CONFIG.updater.useBranch
        let removeFileArray = [
            "/app/config/app.json",
            "/app/config/mysql.json",
            "/app/config/updater.json",
            "/app/json/panel/changelog.json",
            "/public/json/serverInfos/mcVersionsCraftbukkit.json",
            "/public/json/serverInfos/mcVersionsSpigot.json",
            "/app/json/server/5c68f48w.json",
            "/app/json/server/5g28f48x.json"
        ]

        // Erstelle tmp Ordner
        if(!fs.existsSync(tmpPath)) {
            fs.mkdirSync(tmpPath, {recursive: true})
        }
        else {
            fs.rmSync(tmpPath, {recursive: true})
            fs.mkdirSync(tmpPath, {recursive: true})
        }

        // Lade runter
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[36mupdater download...`)
        fs.writeFileSync(updateZipPath, await download(url))

        // Entpacke Zip
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[36mupdater unzip...`)
        fs.createReadStream(updateZipPath)
            .pipe(unzip.Extract({ path: tmpPath}))
            .on("close", () => {
                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[36mupdater remove download...`)
                fs.rmSync(updateZipPath)

                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[36mupdater remove files...`)
                for(let file of removeFileArray) {
                    let filePath    = pathMod.join(mainDir, "tmp", `KAdmin-Minecraft-${branch}`, file)
                    if(fs.existsSync(filePath)) fs.rmSync(filePath, {recursive: true})
                }

                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[36mupdater copy update...`)
                fse.copySync(pathMod.join(mainDir, "tmp", `KAdmin-Minecraft-${branch}`), mainDir,{ overwrite: true }, (err) => {
                        if(debug && err) console.error(err)
                });

                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[36mupdater remove tmp dir...`)
                fs.rmSync(pathMod.join(mainDir, "tmp"), {recursive: true})

                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[36mupdater set CHMOD...`)
                fs.chmod(pathMod.join(mainDir, "installer.sh"), 755)
                fs.chmod(pathMod.join(mainDir, "updater.sh"), 755)
                fs.chmod(pathMod.join(mainDir, "starter.sh"), 755)

                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[36mupdater close panel...`)
                process.exit()
            })
    },

    /**
     * Prüft auf Updates
     */
    check: async () => {
        if(global.checkIsRunning === undefined) {
            global.checkIsRunning   = undefined
            let branch              = CONFIG.updater.useBranch
            let automaticInstall    = CONFIG.updater.automaticInstall
            let options             = {
                url: `https://api.github.com/repos/Kyri123/KAdmin-Minecraft/branches/${branch}`,
                headers: {
                    'User-Agent': `KAdmin-Minecraft-Server AutoUpdater :: FROM: ${ip.address()}`
                },
                json: true
            }

            req.get(options, (err, res, api) => {
                if (err) {
                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[91mconnection error`)
                } else if (res.statusCode === 200) {
                    // Prüfe SHA mit API
                    if(!globalUtil.safeFileExsistsSync([mainDir, '/app/data/', 'sha.txt'])) globalUtil.safeFileSaveSync([mainDir, '/app/data/', 'sha.txt'], "false")
                    fs.readFile(pathMod.join(mainDir, '/app/data/', 'sha.txt'), 'utf8', (err, data) => {
                        if (err === null) {
                            if (data === api.commit.sha) {
                                // kein Update
                                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[32mno update`)
                            } else {
                                // Update verfügbar
                                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[36mupdate found`)
                                global.isUpdate = true
                                if(checkIsRunning === undefined) {
                                    // Prüfe ob alle Aufgaben abgeschlossen sind && ob der Server mit startedWithUpdater gestartet wurde
                                    if(automaticInstall) global.checkIsRunning = setInterval(() => {
                                        let ServerInfos = globalInfos.get()
                                        let isFree      = true

                                        // gehe alle Server durch
                                        if(ServerInfos.servers_arr.length > 0) {
                                            ServerInfos.servers_arr.forEach((val) => {
                                                if(val[1].is_installing) isFree = false
                                            })
                                        }

                                        // Wenn alles Frei ist starte die Installation und beende Interval
                                        if(isFree) {
                                            module.exports.install(`https://github.com/Kyri123/KAdmin-Minecraft/archive/${branch}.zip`)
                                            clearInterval(checkIsRunning)
                                        }
                                    }, 5000)
                                    globalUtil.safeFileSaveSync([mainDir, '/app/data/', 'sha.txt'], api.commit.sha)
                                }
                                globalUtil.safeFileSaveSync([mainDir, '/app/data/', 'sha.txt'], api.commit.sha)
                            }
                        } else {
                            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[91msha error`)
                        }
                    })
                } else {
                    // wenn keine verbindung zu Github-API besteht
                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[91mconnection error`)
                }
            })
        }
    }
}