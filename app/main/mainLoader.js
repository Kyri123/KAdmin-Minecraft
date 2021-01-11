/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"
// Header
console.log('\x1b[36m%s\x1b[0m', `-----------------------------------------------------------`)
console.log('\x1b[33m%s\x1b[0m', `       ${Installed ? "       " : " "}      [ KAdmin-Minecraft${Installed ? "" : " - Installer"} ] `)
console.log('\x1b[33m%s\x1b[0m', `                    Version: \x1b[36m${panelVersion}`)
console.log('\x1b[33m%s\x1b[0m', `                 Entwickler: \x1b[36mKyri123`)
console.log('\x1b[33m%s\x1b[0m', `                     Branch: \x1b[36m${panelBranch}`)
console.log('\x1b[36m%s\x1b[0m', `-----------------------------------------------------------`)
console.log('\x1b[33m%s\x1b[0m', `    Github:  \x1b[36mhttps://github.com/Kyri123/KAdmin-Minecraft`)
console.log('\x1b[33m%s\x1b[0m', `    Discord: \x1b[36mhttps://discord.gg/uXxsqXD`)
console.log('\x1b[33m%s\x1b[0m', `    Trello:  \x1b[36mhttps://trello.com/b/HZFtQ2DZ/KAdmin-Minecraft`)
console.log('\x1b[36m%s\x1b[0m', `-----------------------------------------------------------`)

// Module
const fs        = require("fs")

// Lade Konfigurationen
let pathConfigDir    = pathMod.join(mainDir, '/app/config/')
global.CONFIG = []
fs.readdirSync(pathConfigDir).forEach(item => {
    if(item.includes(".json")) {
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${pathConfigDir + item}`)
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
global.LANG = []
fs.readdirSync(pathLangDir).forEach(item => {
    let langPath    = pathMod.join(pathLangDir, item)
    let pathInfo    = fs.statSync(langPath)
    if(stats.isDirectory())
        fs.readdirSync(item).forEach(file => {
            if(file.includes(".json")) {
                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${langPath}\\${file}`)
                try {
                    LANG[item.replace(".json", "")]   = JSON.parse(fs.readFileSync(pathMod.join(langPath, file), 'utf8'))
                }
                catch (e) {
                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${langPath}\\${file} cannot Loaded`)
                    process.exit(1)
                }
            }
        })
})