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
const syncRequest           = require('sync-request')

module.exports = {
    /**
     * Installiert Update
     * @returns {void}
     */
    install: async () => {
        global.isUpdating   = true
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
        try {
            fs.writeFileSync(updateZipPath, await download(`https://github.com/Kyri123/KAdmin-Minecraft/archive/${CONFIG.updater.useBranch}.zip`))

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
                    })

                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[36mupdater remove tmp dir...`)
                    fs.rmSync(pathMod.join(mainDir, "tmp"), {recursive: true})

                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[36mupdater set CHMOD...`)
                    fs.chmod(pathMod.join(mainDir, "installer.sh"), 755)
                    fs.chmod(pathMod.join(mainDir, "updater.sh"), 755)
                    fs.chmod(pathMod.join(mainDir, "starter.sh"), 755)

                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[36mupdater close panel...`)
                    global.isUpdating   = false
                    global.needRestart  = true
                    process.exit()
                })
               .on("error", () => {
                   global.isUpdating   = false
               })
        }
        catch (e) {
            global.isUpdating   = false
            console.log('[DEBUG_FAILED]', e)
        }
    },

    /**
     * Prüft auf Updates
     */
    check: () => {
        let branch              = CONFIG.updater.useBranch
        let automaticInstall    = CONFIG.updater.automaticInstall

        // prüfe BranchBuild
        try {
            global.buildIDBranch = Buffer.from(JSON.parse(syncRequest('GET', `https://api.github.com/repos/Kyri123/KAdmin-Minecraft/contents/build?ref=${branch}`, {
                headers: {
                    'user-agent': 'KAdmin-Minecraft-Server AutoUpdater :: FROM: ${ip.address()}',
                },
            }).getBody().toString()).content, 'base64').toString('utf-8')
        } catch (e) {
            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[91mconnection error`)
            global.buildIDBranch    = false
        }
        global.isUpdate     = buildID !== buildIDBranch

        if(!isUpdate) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[32mno update`)
        if(isUpdate) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[32mupdate found`)

        if(global.checkIsRunning === undefined && isUpdate && automaticInstall) {
            global.checkIsRunning   = setInterval(() => {
                if(isUpdate) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[32mcheck for can Install`)
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
                    module.exports.install()
                    if(isUpdate) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[32mstart Installing`)
                    clearInterval(checkIsRunning)
                }
                else {
                    if(isUpdate) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}] Auto-Updater: \x1b[32mserver is blocked`)
                }
            }, 5000)
        }
        return isUpdate
    }
}