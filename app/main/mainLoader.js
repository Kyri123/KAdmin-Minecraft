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
global.LANG = {}
fs.readdirSync(pathLangDir).forEach(item => {
    let langPath                            = pathMod.join(pathLangDir, item)
    let pathInfo                            = fs.statSync(langPath)
    if(LANG[item] === undefined) LANG[item] = {}
    if(pathInfo.isDirectory())
        fs.readdirSync(langPath).forEach(file => {
            if(file.includes(".json")) {
                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${langPath}/${file}`)
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

// lese Changelog
if(Installed) {
    let pathFile    = pathMod.join(mainDir, '/app/json/panel/', 'changelog.json')
    try {
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${pathFile}`)
        global.changelog                    = globalUtil.safeFileReadSync([pathFile], true)
        if(typeof changelog === "boolean") {
            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathFile} not found`)
            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
            process.exit(1)
        }
        changelog.reverse()
    }
    catch (e) {
        if(debug) console.log(e)
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathFile} not found`)
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
        process.exit(1)
    }
}