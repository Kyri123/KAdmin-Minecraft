/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */



// Header
import {AppState} from "../../Src/App/Helper/AppState";
import {AppConfig_App, AppConfig_Main, AppConfig_MariaDB, AppConfig_Updater} from "../../Src/Types/Config";

console.log('\x1b[36m%s\x1b[0m', `-----------------------------------------------------------`)
console.log('\x1b[33m%s\x1b[0m', `                    [ KAdmin-Minecraft ] `)
console.log('\x1b[33m%s\x1b[0m', `                       Version: \x1b[36m${ConfigManager.GetPackageConfig.version}`)
console.log('\x1b[33m%s\x1b[0m', `                     Build: \x1b[36m${AppState.GetBuildId}`)
console.log('\x1b[33m%s\x1b[0m', `                    Entwickler: \x1b[36mKyri123`)
console.log('\x1b[33m%s\x1b[0m', `                        Branch: \x1b[36m${panelBranch}`)
console.log('\x1b[36m%s\x1b[0m', `-----------------------------------------------------------`)
console.log('\x1b[33m%s\x1b[0m', `  Github:  \x1b[36mhttps://github.com/Kyri123/KAdmin-Minecraft`)
console.log('\x1b[33m%s\x1b[0m', `  Discord: \x1b[36mhttps://discord.gg/uXxsqXD`)
console.log('\x1b[33m%s\x1b[0m', `  Trello:  \x1b[36mhttps://trello.com/b/qJfbqaoq/kadmin-minecraft`)
console.log('\x1b[36m%s\x1b[0m', `-----------------------------------------------------------`)

// Lade Konfigurationen
let pathConfigDir    = pathMod.join(mainDir, '/app___OLD/config/')
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