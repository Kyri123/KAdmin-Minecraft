/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const router                = require('express').Router()
const serverCommandsUtil    = require('./../../../app/src/background/server/commands_util')

router.route('/')

    .post((req,res)=>{
        let POST        = req.body

        // GET serverInfos
        if(
            POST.sendCommandToServer !== undefined &&
            POST.server !== undefined
        ) if(userHelper.hasPermissions(req.session.uid, "sendCommands", POST.server)) {
            res.render('ajax/json', {
                data: serverCommandsUtil.sendToScreen(POST.server, escape(POST.command.toString()))
            });
            return true;
        }

       res.render('ajax/json', {
          data: `{"request":"failed"}`
       })
       return true
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query;

        // Wenn keine Rechte zum abruf
        if(!userHelper.hasPermissions(req.session.uid, "show", GET.server)) return true;

        // GET serverInfos
        if(GET.getLogFormServer !== undefined && GET.server !== undefined) {
            let serverData  = new serverClass(GET.server)
            res.render('ajax/json', {
                data: safeFileReadSync([serverData.getConfig().pathLogs, "latest.log"])
            });
            return true;
        }

       res.render('ajax/json', {
          data: `{"request":"failed"}`
       })
       return true
    })

module.exports = router;