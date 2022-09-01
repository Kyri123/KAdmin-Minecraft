/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const router            = require('express').Router()
const serverClass       = require('../../app/src/util_server/class')
const serverCommands    = require('../../app/src/background/server/commands')

router.route('/')

    .post((req,res)=>{
        let POST        = req.body

        // Erstellen & Bearbeiten eines Servers
        if((POST.action === 'edit' || POST.action === 'add') && userHelper.hasPermissions(req.session.uid, "servercontrolcenter/create")) {

            let createPerm      = userHelper.hasPermissions(req.session.uid, "servercontrolcenter/create")
            let editPerm        = userHelper.hasPermissions(req.session.uid, "servercontrolcenter/editServer")
            let forbidden       = safeFileReadSync([mainDir, "app/json/server/template", "forbidden.json"], true)
            let serverNameJSON  = undefined
            let sendedCfg       = POST.cfgsend

            // Erstellen
            if(POST.action === 'add' && createPerm) {
                let curr            = fs.readdirSync(pathMod.join(mainDir, '/app/json/server/'))
                let serverData      = safeFileReadSync([mainDir, "app/json/server/template", "default.json"], true)

                let serverName      = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7)
                serverNameJSON      = serverName + '.json'
                while (true) {
                    if (curr.includes(serverNameJSON)) {
                        serverName          = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7) + '.json'
                        serverNameJSON      = serverName + '.json'
                    } else {
                        break
                    }
                }

                // Erstelle Cfg
                for (const [key, value] of Object.entries(serverData)) {
                    if(forbidden[key]) {
                        serverData[key] = sendedCfg[key] || value
                    }
                }

                // Schreibe Daten
                serverData.path         = serverData.path.replace('{SERVERNAME}', serverName).replace('{SERVROOT}', CONFIG.app.servRoot)
                serverData.pathLogs     = serverData.pathLogs.replace('{SERVERNAME}', serverName).replace('{LOGROOT}', CONFIG.app.logRoot)
                serverData.pathBackup   = serverData.pathBackup.replace('{SERVERNAME}', serverName).replace('{BACKUPROOT}', CONFIG.app.pathBackup)

                serverData  = convertObject(serverData)
                res.render('ajax/json', {
                    data: JSON.stringify({
                        success : safeFileSaveSync([mainDir, '/app/json/server/', serverNameJSON], JSON.stringify(serverData)),
                        action  : POST.action
                    })
                })
                return true
            }

            // bearbeiten
            else if(POST.action === 'edit' && POST.targetServer && editPerm) {
                let serverData      = new serverClass(POST.targetServer)
                let curr            = serverData.getConfig()

                console.log(curr,sendedCfg)

                // Erstelle Cfg
                for (const [key, value] of Object.entries(curr)) {
                    if(forbidden[key] || key === 'selfname') {
                        curr[key] = sendedCfg[key] || value
                    }
                }

                curr  = convertObject(curr)

                console.log(curr)

                res.render('ajax/json', {
                    data: JSON.stringify({
                        success : serverData.saveConfig(curr),
                        action  : POST.action
                    })
                })
                return true
            }
        }


        // Lösche einen Servers
        if(POST.deleteserver !== undefined && userHelper.hasPermissions(req.session.uid, "servercontrolcenter/delete")) {
            // Erstelle default daten & Servername
            let serverName              = POST.cfg
            let serverData              = new serverClass(serverName)
            let serverInformationen     = serverData.getServerInfos(serverName)

            // fahre server runter wenn dieser noch online ist
            if(serverInformationen.pid !== 0) serverCommands.doStop(serverName, ['--hardstop'])

            // lösche alle Informationen
            try {
                if (safeFileExsistsSync([mainDir, '/public/json/server/', `${serverName}.json`]))               safeFileRmSync([mainDir, '/public/json/server/', `${serverName}.json`])
                if (safeFileExsistsSync([mainDir, '/public/json/serveraction/', `action_${serverName}.json`]))  safeFileRmSync([mainDir, '/public/json/serveraction/', `action_${serverName}.json`])

                res.render('ajax/json', {
                    data: JSON.stringify({
                        success: safeFileRmSync([mainDir, '/app/json/server/', `${serverName}.json`])
                    })
                })
                return true
            }
            catch (e) {
                if(debug) console.log('[DEBUG_FAILED]', e)
                res.render('ajax/json', {
                    data: JSON.stringify({
                        done: false,
                        alert: alerter.rd(4)
                    })
                })
                return true
            }
        }

        res.render('ajax/json', {
            data: `{"request":"failed"}`
        })
        return true
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query

        if(GET.type !== undefined && (
           userHelper.hasPermissions(req.session.uid, "servercontrolcenter/create") ||
           userHelper.hasPermissions(req.session.uid, "servercontrolcenter/editServer")
        )) {
            let type        = GET.type === 'add'
            let createPerm  = userHelper.hasPermissions(req.session.uid, "servercontrolcenter/create")
            let editPerm    = userHelper.hasPermissions(req.session.uid, "servercontrolcenter/editServer")

            let cfg         = {}
            let forbidden   = safeFileReadSync([mainDir, "app/json/server/template", "forbidden.json"], true)

            if(type && createPerm) {
                let defaultCfg      = safeFileReadSync([mainDir, "app/json/server/template", "default.json"], true)
                for (const [key, value] of Object.entries(defaultCfg))
                    if (
                       (forbidden[key] &&
                       key !== 'path' &&
                       key !== 'pathLogs' &&
                       key !== 'pathBackup') ||
                       key === 'selfname'
                    ) cfg[key]    = value
            }

            if(!type && editPerm && GET.serverCfg !== undefined) {
                let serverData      = new serverClass(GET.serverCfg)
                let currCfg         = serverData.getConfig()
                for (const [key, value] of Object.entries(currCfg))
                    if (
                       (forbidden[key] &&
                       key !== 'path' &&
                       key !== 'pathLogs' &&
                       key !== 'pathBackup') ||
                       key === 'selfname'
                    ) cfg[key]    = value
            }

            res.render('ajax/json', {
                data: JSON.stringify(cfg)
            })
            return true
        }

        res.render('ajax/json', {
            data: `{"request":"failed"}`
        })
        return true
    })

module.exports = router;