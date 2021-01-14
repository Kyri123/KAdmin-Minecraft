/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-ArkWIN/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-ArkWIN
 * *******************************************************************************************
 */
"use strict"

const express           = require('express')
const router            = express.Router()
const globalinfos       = require('./../../../app/src/global_infos');
const serverClass       = require('./../../../app/src/util_server/class');


router.route('/')

    .all((req,res)=>{
        global.user         = userHelper.getinfos(req.session.uid);
        // DEFAULT ServerCenter
        let GET  = req.query;
        let sess = req.session;
        let serverName  = req.baseUrl.split('/')[2];
        let userPerm    = userHelper.permissions(sess.uid);

        if(!userHelper.hasPermissions(req.session.uid, "show", serverName)) {
            res.redirect("/401");
            return true;
        }

        let resp    = "";
        let serverData    = new serverClass(GET.cfg);
        let servCfg       = serverData.getConfig(serverName);

        // Render Seite
        res.render('pages/servercenter/serverCenter_home', {
            icon                    : "fas fa-server",
            pagename                : servCfg.sessionName,
            page                    : "servercenter",
            subpage                 : "home",
            resp                    : resp,
            perm                    : userPerm,
            scfg                    : servCfg,
            servinfos               : serverData.getServerInfos(),
            sconfig                 : serverData.getConfig(),
            sclass                  : serverData,
            sinfos                  : globalinfos.get(),
            serverName              : serverName,
            sercerCenterAny         : globalUtil.safeFileReadSync([mainDir, '/public/json/sites/', 'serverCenterAny.cfg.json'], true),
            sercerCenterActions     : globalUtil.safeFileReadSync([mainDir, '/public/json/sites/', 'serverCenterActions.cfg.json'], true),
        });
    })

module.exports = router;