/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const CommandUtil           = require('./commands_util')
const serverUtil            = require('./util')
const serverCmd             = require('./cmd')
const serverClass           = require('./../../util_server/class')

module.exports = {
    /**
     * Installiert den Server
     * @param {string} server Server Name
     * @param {boolean} noAutoUpdate soll ein Automatisches Update ausgeführt werden
     * @param {boolean} validate Soll der server vorher Validiert werden
     * @param {boolean} alwaysStart Startet den Server wenn dieser abgestürtzt ist
     * @param {boolean} isBackground Wird es vom Server ausgeführt
     * @returns {boolean}
     */
    doStart: (server, noAutoUpdate = false, validate = false, alwaysStart = false, isBackground = false) => {
        let serverData  = new serverClass(server)


        let servConfig  = serverData.getConfig()
        let servInfos   = serverData.getServerInfos()

        if(serverData.serverExsists() && !servInfos.cmd) {
            let steamCMDPath        = pathMod.join(`${PANEL_CONFIG.steamCMDRoot}\\steamcmd.exe`)
            let serverPath          = pathMod.join(servConfig.path)

            // CMD Line
            let cmdFile             = pathMod.join(mainDir, '\\app\\cmd\\', `${isBackground ? md5(servConfig.pathLogs + "doUpdate") : server}.cmd`)
            let cmdCommand          = `@echo off\n`

            // Logmeldungen
            let actionResponse      = `[ ${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")} ]\n`
            actionResponse          += `${PANEL_LANG.logger.infoDoInstall}\n`
            actionResponse          += `${PANEL_LANG.logger.doStart}: ${server}\n`

            // Prüfe ob die Aktion frei ist und Server bereits läuft
            if(!servInfos.run) {
                // Prüfe ob ein update verfügbar ist (nur wenn --no-autoupdate nicht gesetzt ist)
                if(!noAutoUpdate || validate) {
                    if(serverData.isUpdateServer() || validate)     cmdCommand      += `${steamCMDPath} +login anonymous +force_install_dir "${serverPath}" +app_update ${PANEL_CONFIG.appID_server}${validate ? " Validate" : ""} +quit\n`
                    if(serverData.isUpdateServer())                 actionResponse  += `${PANEL_LANG.logger.doUpdateBeforeStart}\n`
                    if(validate)                                    actionResponse  += `${PANEL_LANG.logger.validate}\n`

                    if(!noAutoUpdate) {
                        let modUpdates  = serverData.checkModUpdates()
                        if(modUpdates !== false) {
                            actionResponse      += `${PANEL_LANG.logger.doStartUpdateMods}\n`
                            modUpdates.forEach((val) => {
                                actionResponse  += `${val}\n`
                            })
                            let opt = module.exports.doInstallMods(server, modUpdates, false, true)
                            cmdCommand  += `${steamCMDPath} +login anonymous +force_install_dir "${serverPath}"${opt.workshop_download_item} +quit\n`
                            cmdCommand  += opt.copys
                        }
                    }
                }

                // baue Mod optionen
                let startLine   = CommandUtil.getStartLine(server)

                actionResponse  += startLine
                cmdCommand      += startLine
                cmdCommand      += `timeout /T 10 /nobreak & del /f ${cmdFile} & exit`
            }
            else {
                actionResponse          += `${PANEL_LANG.logger.doStartNoAction}\n`
            }
            // Speichern und ausführen
            try {
                if (alwaysStart) serverData.writeConfig("shouldRun", true)
                if(!servInfos.cmd && !servInfos.run) {
                    globalUtil.safeFileSaveSync([cmdFile], cmdCommand)
                    serverCmd.runCMD(`start "[KAdmin-Minecraft] doStart ${server}" ${cmdFile}`)
                }
                globalUtil.safeFileSaveSync([mainDir, '/public/json/serveraction/', `action_${server}.log`], actionResponse)
            }
            catch (e) {
                if(debug) console.log(e)
            }
        }
        return false
    },

    /**
     * Installiert den Server
     * @param {string} server Server Name
     * @param {boolean} isBackground Wird es vom Server ausgeführt
     * @returns {boolean}
     */
    doInstallServer: (server, isBackground = false) => {
        let serverData  = new serverClass(server)

        let servConfig  = serverData.getConfig()
        let servInfos   = serverData.getServerInfos()
        if(serverData.serverExsists() && !servInfos.cmd) {
            let steamCMDPath        = pathMod.join(`${PANEL_CONFIG.steamCMDRoot}\\steamcmd.exe`)
            let serverPath          = pathMod.join(servConfig.path)
            
            // Logmeldungen
            let actionResponse      = `[ ${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")} ]\n`
            actionResponse          += `${PANEL_LANG.logger.infoDoInstall}\n`
            actionResponse          += `${PANEL_LANG.logger.doInstallServer}: ${server}\n`
            let cmdFile             = pathMod.join(mainDir, '\\app\\cmd\\', `${isBackground ? md5(servConfig.pathLogs + "doUpdate") : server}.cmd`)
            let cmdCommand          = `@echo off\n`

            // Prüfe ob der Server bereits installiert ist
            if(!servInfos.is_installed) {
                actionResponse += `${steamCMDPath} +login anonymous +force_install_dir "${serverPath}" +app_update ${PANEL_CONFIG.appID_server} validate +quit\n`

                // CMD Line
                cmdCommand  += `${steamCMDPath} +login anonymous +force_install_dir "${serverPath}" +app_update ${PANEL_CONFIG.appID_server} validate +quit\n`
                cmdCommand  += `timeout /T 10 /nobreak & del /f ${cmdFile} & exit`
            }
            else {
                actionResponse          += `${PANEL_LANG.logger.doInstallNoAction}\n`
            }

            // Speichern und ausführen
            try {
                if(!servInfos.is_installed && !servInfos.cmd) {
                    globalUtil.safeFileSaveSync([cmdFile], cmdCommand)
                    serverCmd.runCMD(`start "[KAdmin-Minecraft] doInstallServer ${server}" ${cmdFile}`)
                }
                globalUtil.safeFileSaveSync([mainDir, '/public/json/serveraction/', `action_${server}.log`], actionResponse)
            }
            catch (e) {
                if(debug) console.log(e)
            }
        }
        return false
    },

    /**
     * Updated den Server
     * @param {string} server Server Name
     * @param {boolean} validate soll der server Validate ausführen?
     * @param {boolean} warn soll über RCON gewarnt werden?
     * @param {boolean} isBackground Wird es vom Server ausgeführt
     * @returns {boolean}
     */
    doUpdateServer: (server, validate = false, warn = false, isBackground = false) => {
        let serverData  = new serverClass(server)

        let servConfig  = serverData.getConfig()
        let servInfos   = serverData.getServerInfos()
        if(serverData.serverExsists() && !servInfos.cmd) {
            let steamCMDPath        = pathMod.join(`${PANEL_CONFIG.steamCMDRoot}\\steamcmd.exe`)
            let serverPath          = pathMod.join(servConfig.path)
            let updateNeed          = serverData.isUpdateServer()

            // CMD Line
            let cmdFile             = pathMod.join(mainDir, '\\app\\cmd\\', `${isBackground ? md5(servConfig.pathLogs + "doUpdate") : server}.cmd`)
            let cmdCommand          = `@echo off\n`

            // Countdown
            if(serverData.online() && warn) {
                cmdCommand      += CommandUtil.stopCountDown(server)
            }
            else if(serverData.online() || servInfos.run) {
                if(servInfos.online) cmdCommand      += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "broadcast [KAdmin-Minecraft] ${PANEL_LANG.timers.stopCountDown['now']}"\n`
                if(servInfos.online) cmdCommand      += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "saveworld"\n`
                if(servInfos.online) cmdCommand      += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "doexit"\n`
                cmdCommand += `timeout /T 10 /nobreak\n`
                cmdCommand += `Taskkill /PID ${servInfos.pid} /F\n`
            }

            // Logmeldungen
            let actionResponse      = `[ ${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")} ]\n`
            actionResponse          += `${PANEL_LANG.logger.allg}\n`
            actionResponse          += `${PANEL_LANG.logger.doUpdateServer}: ${server}\n`

            // Logmeldungen
            if(updateNeed)  actionResponse += PANEL_LANG.logger.doUpdate + '\n'
            if(!updateNeed) actionResponse += PANEL_LANG.logger.doNoUpdate + '\n'
            if(validate)    actionResponse += PANEL_LANG.logger.validateUpdate + '\n'

            // Wird ein Update benötigt oder Validate ist gewollt dann führe dies zur CMD line hinzu
            if(updateNeed || validate)  cmdCommand  += `${steamCMDPath} +login anonymous +force_install_dir "${serverPath}" +app_update ${PANEL_CONFIG.appID_server}${validate ? " validate" : ""} +quit\n`

            // Prüfe Modupdates
            let modUpdates  = serverData.checkModUpdates()
            if(modUpdates !== false) {
                actionResponse      += `${PANEL_LANG.logger.doStartUpdateMods}\n`
                modUpdates.forEach((val) => {
                    actionResponse  += `${val}\n`
                })
                let opt = module.exports.doInstallMods(server, modUpdates, false, true)
                cmdCommand  += `${steamCMDPath} +login anonymous +force_install_dir "${serverPath}"${opt.workshop_download_item} +quit\n`
                cmdCommand  += opt.copys
                updateNeed = true
            }
            // Starte server wieder
            if(serverData.online()) {
                let startLine   = CommandUtil.getStartLine(server)
                actionResponse  += startLine
                cmdCommand      += startLine
            }

            // Beende CMDline und Update log
            cmdCommand  += `timeout /T 10 /nobreak & del /f ${cmdFile} & exit`
            if(serverUtil.checkSeverUpdate(server) || validate) actionResponse += `${steamCMDPath} +login anonymous +force_install_dir "${serverPath}" +app_update ${PANEL_CONFIG.appID_server}${validate ? " Validate" : ""} +quit\n`

            // Speichern und ausführen
            try {
                if (updateNeed || validate) {
                    globalUtil.safeFileSaveSync([cmdFile], cmdCommand)
                    serverCmd.runCMD(`start "[KAdmin-Minecraft] doUpdateServer  ${isBackground ? "Server" : server}" ${cmdFile}`)
                }
                if(!isBackground) globalUtil.safeFileSaveSync([mainDir, '/public/json/serveraction/', `action_${server}.log`], actionResponse)
            }
            catch (e) {
                if(debug) console.log(e)
            }
        }
        return false
    },

    /**
     * Updated den Server
     * @param {string} server Server Name
     * @param {int|array} modID ModID die installiert werden soll
     * @param {boolean} validate use validate on mods
     * @param {boolean} backAsString für Interne nutzungen
     * @param {boolean} isBackground Wird es vom Server ausgeführt
     * @returns {boolean}
     */
    doInstallMods: (server, modID, validate = false, backAsString = false, isBackground = false) => {
        let serverData  = new serverClass(server)

        let servConfig = serverData.getConfig(server)
        let servInfos  = serverData.getServerInfos(server)
        if(
           serverData.serverExsists() &&
           !servInfos.cmd &&
           servInfos.is_installed)
        {
            let steamCMDPath            = pathMod.join(`${PANEL_CONFIG.steamCMDRoot}\\steamcmd.exe`)
            let serverPath              = pathMod.join(servConfig.path)
            let cmdFile                 = globalUtil.checkValidatePath(pathMod.join(mainDir, '\\app\\cmd\\', `${isBackground ? md5(servConfig.pathLogs + "doUpdate") : server}.cmd`))
            let cmdCommand              = backAsString ? '' :`@echo off\n`
            let workshop_download_item  = ``
            let copys                   = ``

            // Logmeldungen
            let actionResponse          = `[ ${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")} ]\n`
            actionResponse              += `${PANEL_LANG.logger.allg}\n`
            actionResponse              += `${PANEL_LANG.logger.doInstallMods}: ${server}\n`
            actionResponse              += `${PANEL_LANG.logger.doUpdateMods}\n`
            if(validate) actionResponse += PANEL_LANG.logger.validate + '\n'

            // Wenn mehrere Mods Installiert werden sollen
            if(Array.isArray(modID)) {
                modID.forEach((val) => {
                    actionResponse              += `${val}\n`
                    workshop_download_item      +=  ` +workshop_download_item ${PANEL_CONFIG.appID} ${val}`

                    copys   += `if exist "${serverPath}\\steamapps\\workshop\\content\\${PANEL_CONFIG.appID}\\${val}\\modmeta.info" (\n`
                    copys   += `    ${mainDir}\\tools\\ArkModCopy\\ArkModCopy.exe "${serverPath}" "${serverPath}" "${val}"\n`
                    copys   += `    echo ${Math.round(Date.now()/1000)} > ${serverPath}\\ShooterGame\\Content\\Mods\\${val}.modtime\n`
                    copys   += `    echo ${val} - SUCCESS >> ${mainDir}\\public\\json\\serveraction\\action_${server}.log\n`
                    copys   += `    @RD /S /Q "${serverPath}\\steamapps\\workshop\\content\\${PANEL_CONFIG.appID}\\${val}"\n`
                    copys   += `) else (\n`
                    copys   += `  echo ${val} - FAILED >> ${mainDir}\\public\\json\\serveraction\\action_${server}.log\n`
                    copys   += `)\n`
                })
            }
            // Wenn nur eine Mod installiert werden soll
            else {
                actionResponse              += `${modID}\n`
                workshop_download_item      +=  `+workshop_download_item ${PANEL_CONFIG.appID} ${modID}`

                copys   += `if exist "${serverPath}\\steamapps\\workshop\\content\\${PANEL_CONFIG.appID}\\${modID}\\modmeta.info" (\n`
                copys   += `    ${mainDir}\\tools\\ArkModCopy\\ArkModCopy.exe "${serverPath}" "${serverPath}" "${modID}"\n`
                copys   += `    echo ${Math.round(Date.now()/1000)} > ${serverPath}\\ShooterGame\\Content\\Mods\\${modID}.modtime\n`
                copys   += `    echo ${modID} - SUCCESS >> ${mainDir}\\public\\json\\serveraction\\action_${server}.log\n`
                copys   += `    @RD /S /Q "${serverPath}\\steamapps\\workshop\\content\\${PANEL_CONFIG.appID}\\${modID}"\n`
                copys   += `) else (\n`
                copys   += `  echo ${modID} - FAILED >> ${mainDir}\\public\\json\\serveraction\\action_${server}.log\n`
                copys   += `)\n`
            }
            cmdCommand      += `${steamCMDPath} +login anonymous +force_install_dir "${serverPath}"${workshop_download_item}${validate ? " validate" : ""} +quit\n`
            cmdCommand      +=  copys
            actionResponse  += `${steamCMDPath} +login anonymous +force_install_dir "${serverPath}"${workshop_download_item}${validate ? " validate" : ""} +quit\n`

            // Leere CMD (für weitere freigaben usw.)
            cmdCommand  += `timeout /T 10 /nobreak & del /f ${cmdFile} & exit`

            // Speichern und ausführen
            try {
                globalUtil.safeFileSaveSync([cmdFile], cmdCommand)
                if(!backAsString) globalUtil.safeFileSaveSync([mainDir, '/public/json/serveraction/', `action_${server}.log`], actionResponse)
                return !backAsString ? serverCmd.runCMD(`start "[KAdmin-Minecraft] doInstallMods ${server}" ${cmdFile}`) :
                    {workshop_download_item: workshop_download_item, copys: copys}
            }
            catch (e) {
                if(debug) console.log(e)
            }
        }
        return false
    },

    /**
     * Beendet den Server insofern dieser Online ist
     * @param {string} server Server Name
     * @param {boolean} saveworld Soll die welt gespeichert werden?
     * @param {boolean} warn Sollen die Spieler gewant werden?
     * @param {boolean} isBackground Wird es vom Server ausgeführt
     * @return {boolean}
     */
    doStop: (server, saveworld = false, warn = false, isBackground = false) => {
        let serverData  = new serverClass(server)

        let servConfig = serverData.getConfig()
        let servInfos  = serverData.getServerInfos()

        if(serverData.serverExsists() && !servInfos.cmd) {
            // CMD Line
            let cmdFile             = pathMod.join(mainDir, '\\app\\cmd\\', `${isBackground ? md5(servConfig.pathLogs + "doUpdate") : server}.cmd`)
            let cmdCommand          = `@echo off\n`

            // Logmeldungen
            let actionResponse      = `[ ${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")} ]\n`
            actionResponse          += `${PANEL_LANG.logger.allg}\n`
            actionResponse          += `${PANEL_LANG.logger.doStop}: ${server}\n`

            // Countdown
            if(servInfos.online && warn) {
                cmdCommand                      += CommandUtil.stopCountDown(server, saveworld)
            }
            else if(servInfos.online || servInfos.run || servInfos.pid !== 0) {
                if(saveworld && servInfos.online) cmdCommand        += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "saveworld"\n`
                if(servInfos.online) cmdCommand                     += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "doexit"\n`
                cmdCommand += `timeout /T 10 /nobreak\n`
                cmdCommand += `Taskkill /PID ${servInfos.pid} /F\n`
            }
            else {
                actionResponse          += `${PANEL_LANG.logger.doStopNoAction}\n`
            }
            // Beende CMDline und Update log
            cmdCommand  += `timeout /T 10 /nobreak & del /f ${cmdFile} & exit`

            // Speichern und ausführen
            try {
                if (servConfig.shouldRun) serverUtilInfos.writeConfig(server, "shouldRun", false)
                if (servInfos.run) {
                    globalUtil.safeFileSaveSync([cmdFile], cmdCommand)
                    serverCmd.runCMD(`start "[KAdmin-Minecraft] doStop ${server}" ${cmdFile}`)
                }
                globalUtil.safeFileSaveSync([mainDir, '/public/json/serveraction/', `action_${server}.log`], actionResponse)
            }
            catch (e) {
                if(debug) console.log(e)
            }
        }
        return false
    },

    /**
     * Startet den server neu (ist dieser bereits offline wird dieser teil Ignoriert und direkt gestartet)
     * @param {string} server Server Name
     * @param {boolean} saveworld Soll die welt gespeichert werden?
     * @param {boolean} warn Sollen die Spieler gewant werden?
     * @param {boolean} validate Soll Validate angewand werden?
     * @param {boolean} noAutoUpdate soll NICHT nach Updates geprüft werden?
     * @param {boolean} alwaysStart Startet den Server wenn dieser abgestürtzt ist
     * @param {boolean} isBackground Wird es vom Server ausgeführt
     * @return {boolean}
     */
    doRestart: (server, saveworld = false, warn = false, validate = false, noAutoUpdate = false, alwaysStart = false, isBackground = false) => {
        let serverData  = new serverClass(server)

        let servConfig = serverData.getConfig()
        let servInfos  = serverData.getServerInfos()

        if(serverData.serverExsists() && !servInfos.cmd) {
            let steamCMDPath        = pathMod.join(`${PANEL_CONFIG.steamCMDRoot}\\steamcmd.exe`)
            let serverPath          = pathMod.join(servConfig.path)

            // CMD Line
            let cmdFile             = pathMod.join(mainDir, '\\app\\cmd\\', `${isBackground ? md5(servConfig.pathLogs + "doUpdate") : server}.cmd`)
            let cmdCommand          = `@echo off\n`

            // Logmeldungen
            let actionResponse      = `[ ${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")} ]\n`
            actionResponse          += `${PANEL_LANG.logger.allg}\n`
            actionResponse          += `${PANEL_LANG.logger.doRestart}: ${server}\n`

            // Countdown
            if(servInfos.online && warn) {
                cmdCommand                      += CommandUtil.stopCountDown(server, saveworld)
            }
            else if(servInfos.online || servInfos.run) {
                if(saveworld && servInfos.online) cmdCommand        += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "saveworld"\n`
                if(servInfos.online)cmdCommand                      += `node ${mainDir}\\rcon.js "rcon" "127.0.0.1" "${servConfig.rcon}" "${servConfig.ServerAdminPassword}" "doexit"\n`
                cmdCommand += `timeout /T 10 /nobreak\n`
                cmdCommand += `Taskkill /PID ${servInfos.pid} /F\n`
            }
            else {
                actionResponse          += `${PANEL_LANG.logger.doStopNoAction}\n`
            }

            // Prüfe ob ein update verfügbar ist (nur wenn --no-autoupdate nicht gesetzt ist)
            if(!noAutoUpdate || validate) {
                if(serverData.isUpdateServer() || validate)     cmdCommand      += `${steamCMDPath} +login anonymous +force_install_dir "${serverPath}" +app_update ${PANEL_CONFIG.appID_server}${validate ? " Validate" : ""} +quit\n`
                if(serverData.isUpdateServer())                 actionResponse  += `${PANEL_LANG.logger.doUpdateBeforeStart}\n`
                if(validate)                                    actionResponse  += `${PANEL_LANG.logger.validate}\n`
                if(!noAutoUpdate) {
                    let modUpdates  = serverData.checkModUpdates(server)
                    if(modUpdates !== false) {
                        actionResponse      += `${PANEL_LANG.logger.doStartUpdateMods}\n`
                        modUpdates.forEach((val) => {
                            actionResponse  += `${val}\n`
                        })
                        let opt = module.exports.doInstallMods(server, modUpdates, false, true)
                        cmdCommand  += `${steamCMDPath} +login anonymous +force_install_dir "${serverPath}"${opt.workshop_download_item} +quit\n`
                        cmdCommand  += opt.copys
                    }
                }
            }

            // baue Mod optionen
            let startLine   = CommandUtil.getStartLine(server)

            actionResponse  += startLine
            cmdCommand      += startLine

            // Beende CMDline und Update log
            cmdCommand  += `timeout /T 10 /nobreak & del /f ${cmdFile} & exit`

            // Speichern und ausführen
            try {
                if (alwaysStart) serverUtilInfos.writeConfig(server, "shouldRun", true)
                globalUtil.safeFileSaveSync([cmdFile], cmdCommand)
                globalUtil.safeFileSaveSync([mainDir, '/public/json/serveraction/', `action_${server}.log`], actionResponse)
                return serverCmd.runCMD(`start "[KAdmin-Minecraft] doRestart ${server}" ${cmdFile}`)
            }
            catch (e) {
                if(debug) console.log(e)
            }
        }
        return false
    },

    /**
     * Erstellt ein Backup von Konfig & Spielständen
     * @param {string} server Server Name
     * @param {boolean} isBackground Wird es vom Server ausgeführt
     * @return {boolean}
     */
    doBackup: (server, isBackground = false) => {
        let serverData  = new serverClass(server)

        let servConfig = serverData.getConfig()
        let servInfos  = serverData.getServerInfos()

        if(serverData.serverExsists() && !servInfos.cmd) {
            // vars
            let pathToZip           = pathMod.join(servConfig.path, '\\ShooterGame\\Saved')
            let backupPath          = pathMod.join(servConfig.pathBackup)
            let ZIP_name            = `${Date.now()}.zip`
            let canZIP              = globalUtil.safeFileExsistsSync([pathToZip]) && !globalUtil.safeFileExsistsSync([backupPath, ZIP_name])

            // CMD Line
            let cmdFile             = pathMod.join(mainDir, '\\app\\cmd\\', `${isBackground ? md5(servConfig.pathLogs + "doUpdate") : server}.cmd`)
            let cmdCommand          = `@echo off\n`

            // Logmeldungen
            let actionResponse      = `[ ${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")} ]\n`
            actionResponse          += `${PANEL_LANG.logger.allg}\n`
            actionResponse          += `${PANEL_LANG.logger.doBackup}: ${server}\n`

            // Prüfe ob Ordner exsistiert und mache davon ein Backup
            if(canZIP) {
                actionResponse          += `${PANEL_LANG.logger.doBackupThis}: ${Date.now()}.zip\n`
                if(!globalUtil.safeFileExsistsSync([backupPath])) globalUtil.safeFileMkdirSync([backupPath])
                cmdCommand              += `powershell -command "Add-Type -Assembly \\"System.IO.Compression.FileSystem\\" ;[System.IO.Compression.ZipFile]::CreateFromDirectory(\\"${pathToZip}\\", \\"${backupPath}\\${ZIP_name}\\") ;"\n`
            }
            else {
                actionResponse          += `${PANEL_LANG.logger.doNotBackup}\n`
            }

            // Beende CMDline und Update log
            cmdCommand                  += `timeout /T 10 /nobreak & del /f ${cmdFile} & exit`

            // Speichern und ausführen
            try {
                if(!isBackground) globalUtil.safeFileSaveSync([mainDir, '/public/json/serveraction/', `action_${server}.log`], actionResponse)
                if(canZIP) {
                    globalUtil.safeFileSaveSync([cmdFile], cmdCommand)
                    serverCmd.runCMD(`start "[KAdmin-Minecraft] doBackup ${isBackground ? "Server" : server}" ${cmdFile}`)
                }
            }
            catch (e) {
                if(debug) console.log(e)
            }
        }
        return false
    }
}