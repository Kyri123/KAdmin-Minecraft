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
const serverClass       = require('./../../../app/src/util_server/class');
const ini               = require('ini')

router.route('/')

    .post((req,res)=>{
        let POST        = req.body;

        // Speicher Server
        if(POST.saveServer !== undefined && userHelper.hasPermissions(req.session.uid, "config/kadmin-mc", POST.cfg)) {
            let serverData  = new serverClass(POST.cfg);

            delete POST.saveServer;
            delete POST.cfg;

            // Wandel string in
            Object.keys(POST.cfgsend).forEach((key) => {
                if(!isNaN(POST.cfgsend[key])){
                    POST.cfgsend[key] = parseInt(POST.cfgsend[key], 10);
                }
                else if(POST.cfgsend[key] === 'false'){
                    POST.cfgsend[key] = false;
                }
                else if(POST.cfgsend[key] === 'true'){
                    POST.cfgsend[key] = true;
                }
            });

            res.render('ajax/json', {
                data: JSON.stringify({
                    alert: alerter.rd(serverData.saveConfig(POST.cfgsend) ? 1009 : 3).replace("{ini}", "KAdmin-Minecraft")
                })
            });
            return true;
        }

        // Server.Properties
        if(POST.server !== undefined) {
            let serverData  = new serverClass(POST.cfg);
            if(!userHelper.hasPermissions(req.session.uid, `config/server`, POST.cfg)) return true;

            res.render('ajax/json', {
                data: JSON.stringify({
                    alert: alerter.rd(serverData.saveINI(POST.iniText) ? 1009 : 3).replace("{ini}", "Server.Properties")
                })
            });
            return true;
        }
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query;

        // Wenn keine Rechte zum abruf
        if(!userHelper.hasPermissions(req.session.uid, "show", GET.server) || !userHelper.hasPermissions(req.session.uid, "config/show", GET.server)) return true;

        // GET serverInis
        if(GET.serverInis !== undefined) {
            let serverData  = new serverClass(GET.server);

            res.render('ajax/json', {
                data: serverData.getINI() !== false ? ini.stringify(serverData.getINI()) : 'failed'
            });
            return true;
        }
    })

module.exports = router;