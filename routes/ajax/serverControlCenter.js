/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
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

        // Erstellen eines neuen Servers
        if(POST.addserver !== undefined && userHelper.hasPermissions(req.session.uid, "servercontrolcenter/create")) {
            // Erstelle default daten & Servername
            let defaultJSON     = globalUtil.safeFileReadSync([mainDir, '/app/json/server/template/', 'default.json'], true)
            if(defaultJSON !== false) {
                let curr            = fs.readdirSync(pathMod.join(mainDir, '/app/json/server/'))
                let serverName      = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7)
                let serverNameJSON  = serverName + '.json'
                while (true) {
                    if(curr.includes(serverName)) {
                        serverName = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7) + '.json'
                        serverNameJSON = serverName + '.json'
                    }
                    else {
                        break
                    }
                }

                // Schreibe Daten
                defaultJSON.path        = defaultJSON.path.replace('{SERVERNAME}', serverName).replace('{SERVROOT}', CONFIG.app.servRoot)
                defaultJSON.pathLogs    = defaultJSON.pathLogs.replace('{SERVERNAME}', serverName).replace('{LOGROOT}', CONFIG.app.logRoot)
                defaultJSON.pathBackup  = defaultJSON.pathBackup.replace('{SERVERNAME}', serverName).replace('{BACKUPROOT}', CONFIG.app.pathBackup)
                defaultJSON.selfname    = POST.selfname

                // Erstelle Server
                try {
                    let bool = globalUtil.safeFileSaveSync([mainDir, '/app/json/server/', serverNameJSON], JSON.stringify(defaultJSON)) !== false
                    res.render('ajax/json', {
                        data: JSON.stringify({
                            added: bool,
                            alert: alerter.rd(bool ? 1002 : 3)
                        })
                    })
                    return true
                }
                catch (e) {
                    if(debug) console.log(e)
                    res.render('ajax/json', {
                        data: JSON.stringify({
                            done: false,
                            alert: alerter.rd(3)
                        })
                    })
                    return true
                }
            }
            else {
                if(debug) console.log(e)
                res.render('ajax/json', {
                    data: JSON.stringify({
                        done: false,
                        alert: alerter.rd(3)
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
            if(serverInformationen.pid !== 0) serverCommands.doStop(serverName, false,false)

            // lösche alle Informationen
            try {
                if (globalUtil.safeFileExsistsSync([mainDir, '/app/json/server/', `${serverName}.json`]))                  globalUtil.safeFileRmSync([mainDir, '/app/json/server/', `${serverName}.json`])
                if (globalUtil.safeFileExsistsSync([mainDir, '/public/json/server/', `${serverName}.json`]))               globalUtil.safeFileRmSync([mainDir, '/public/json/server/', `${serverName}.json`])
                if (globalUtil.safeFileExsistsSync([mainDir, '/public/json/serveraction/', `action_${serverName}.json`]))  globalUtil.safeFileRmSync([mainDir, '/public/json/serveraction/', `action_${serverName}.json`])

                res.render('ajax/json', {
                    data: JSON.stringify({
                        remove: true,
                        removed: serverName,
                        alert: alerter.rd(1003)
                    })
                })
                return true
            }
            catch (e) {
                if(debug) console.log(e)
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

        // Wenn keine Rechte zum abruf
        if(!userHelper.hasPermissions(req.session.uid, "servercontrolcenter/show")) return true


        res.render('ajax/json', {
            data: `{"request":"failed"}`
        })
        return true
    })

module.exports = router;