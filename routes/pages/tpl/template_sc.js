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
const globalinfos       = require('./../../app/src/global_infos')


router.route('/')

    .all((req,res)=>{
        global.user         = userHelper.getinfos(req.session.uid)

        let sess = req.session
        let serverName  = req.baseUrl.split('/')[2]
        let userPerm    = userHelper.permissions(sess.uid)

        // Leite zu 401 wenn Rechte nicht gesetzt sind
        if(
            userPerm.server[serverName].is_server_admin === 0 &&
            userPerm.server[serverName].show === 0 &&
            userPerm.all.is_admin === 0
        ) {
            res.redirect("/401")
           return true
        }

        // Die eigentl. Seite
        else {
            let resp    = ""
            let serverData    = new serverClass(GET.cfg)
            let servCfg       = serverData.getConfig(serverName)

            // Render Seite
            res.render('pages/servercenter/serverCenter_backups', {
                icon                    : "fas fa-server",
                pagename                : servCfg.sessionName,
                page                    : "servercenter",
                subpage                 : "pagename",
                resp                    : resp,
                perm                    : userPerm,
                scfg                    : servCfg,
                servinfos               : serverData.getServerInfos(),
                sconfig                 : serverData.getConfig(),
                sclass                  : serverData,
                sinfos                  : globalinfos.get(),
                serverName              : serverName,
                sercerCenterAny         : globalUtil.safeFileReadSync([mainDir, '/public/json/sites/', 'serverCenterAny.cfg.json'], true),
                sercerCenterActions     : globalUtil.safeFileReadSync([mainDir, '/public/json/sites/', 'serverCenterActions.cfg.json'], true)
            })
        }
    })

module.exports = router;