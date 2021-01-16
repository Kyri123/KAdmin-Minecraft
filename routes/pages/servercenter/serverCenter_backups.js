/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
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
      let GET           = req.query
      let POST          = req.body
      let response      = ""
      let cookies       = req.cookies
      let langStr       = (cookies.lang !== undefined) ?
       fs.existsSync(pathMod.join(mainDirWeb, "lang", cookies.lang)) ?
          cookies.lang : "de_de"
       : "de_de"
      let lang          = LANG[langStr]
      let serverName    = req.baseUrl.split('/')[2]

      // Leite zu 401 wenn Rechte nicht gesetzt sind
      if(!userHelper.hasPermissions(req.session.uid, "backups/show", serverName) || !userHelper.hasPermissions(req.session.uid, "show", serverName)) {
         res.redirect("/401");
         return true;
      }

      // Die eigentl. Seite

      let serverData    = new serverClass(serverName);
      let servCfg       = serverData.getConfig();
      let servIni       = serverData.getINI();

      // Render Seite
      res.render('pages/servercenter/serverCenter_backups', {
         userID                  : req.session.uid,
         page                    : "servercenter_backups",
         response                : response,
         lang                    : lang,
         perm                    : userHelper.permissions(req.session.uid),
         sinfos                  : globalinfos.get(),
         servini                 : servIni,
         servinfos               : serverData.getServerInfos(),
         servcfg                 : servCfg,
         sclass                  : serverData,
         serverName              : serverName
      });
    })

module.exports = router;