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
const serverClass       = require('../../../app___OLD/src/util_server/class');
const ini               = require('ini')

router.route('/')

    .post((req,res)=>{
        let POST        = req.body;

        // Speicher Server
        if(POST.saveServer !== undefined && userHelper.hasPermissions(req.session.uid, "config/kadmin-mc", POST.cfg)) {
            let serverData  = new serverClass(POST.cfg)
            let cfg         = safeFileReadSync([mainDir, "app___OLD/json/server/template", "default.json"], true)
            let forbidden   = safeFileReadSync([mainDir, "app___OLD/json/server/template", "forbidden.json"], true)
            let currCfg     = serverData.getConfig()
            let sendedCfg   = POST.cfgsend

            delete POST.saveServer
            delete POST.cfg

            // Erstelle Cfg
            for (const [key, value] of Object.entries(cfg)) {
                cfg[key] = currCfg[key]

                if(!forbidden[key]) {
                    if(!(key === 'extrajava' &&
                        (sendedCfg[key].toString().toLowerCase().includes('-xmx') || sendedCfg[key].toString().toLowerCase().includes('-xms'))
                    )) {
                        cfg[key] = sendedCfg[key]
                    }
                    else {
                        cfg[key] = currCfg[key]
                    }
                }

                if(key === "autoBackupPara")
                    if(cfg[key] === undefined) cfg[key] = []
            }

            // setzte alle Vars
            cfg = convertObject(cfg)

            res.render('ajax/json', {
                data: JSON.stringify({
                    success: serverData.saveConfig(cfg)
                })
            })
            return true
        }

        // Server.Properties
        if(POST.server !== undefined) {
            let serverData  = new serverClass(POST.cfg);
            if(!userHelper.hasPermissions(req.session.uid, `config/server`, POST.cfg)) return true;

            res.render('ajax/json', {
                data: JSON.stringify({
                    success: serverData.saveINI(POST.iniText)
                })
            })
            return true
        }

        res.render('ajax/json', {
            data: `{"request":"failed"}`
        })
        return true
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query
        if(GET.server === undefined) GET.server = ''

        // GET serverInis
        if(GET.serverInis !== undefined && userHelper.hasPermissions(req.session.uid, "show_kadmin", GET.server)) {
            let serverData  = new serverClass(GET.server)

            res.render('ajax/json', {
                data: serverData.getINI() !== false ? ini.stringify(serverData.getINI()) : 'failed'
            })
            return true
        }

        // GET serverCfg
        if(GET.serverCfg !== undefined && userHelper.hasPermissions(req.session.uid, "show_server", GET.server)) {
            let serverData  = new serverClass(GET.server)

            let cfg         = {}
            let forbidden   = safeFileReadSync([mainDir, "app___OLD/json/server/template", "forbidden.json"], true)
            let currCfg     = serverData.getConfig()

            for (const [key, value] of Object.entries(currCfg))
                if(!forbidden[key])
                    cfg[key] = currCfg[key]

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