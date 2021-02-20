/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const router        = require('express').Router()
const globalinfos   = require('./../../app/src/global_infos');
const userHelper    = require('./../../app/src/sessions/helper');

router.route('/')

    .all((req,res)=>{
       let GET         = req.query
       let POST        = req.body
       let response    = ""
       let cookies     = req.cookies
       let langStr     = (cookies.lang !== undefined) ?
          fs.existsSync(pathMod.join(mainDir, "lang", cookies.lang)) ?
             cookies.lang : "de_de"
          : "de_de"
       let lang         = LANG[langStr]

        if(!userHelper.hasPermissions(req.session.uid, "servercontrolcenter/show")) {
            res.redirect("/401");
            return true;
        }

        res.render('pages/servercontrolcenter', {
           userID        : req.session.uid,
           page          : "servercontrolcenter",
           response      : response,
           lang          : lang,
           perm          : userHelper.permissions(req.session.uid),
           sinfos        : globalinfos.get()
        });
    })

module.exports = router;