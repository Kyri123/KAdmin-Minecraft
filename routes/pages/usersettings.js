/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const express       = require('express')
const router        = express.Router()
const globalinfos   = require('./../../app/src/global_infos');
const userHelper   = require('./../../app/src/sessions/helper');

router.route('/')

    .all((req,res)=>{
       let GET         = req.query
       let POST        = req.body;
       let response    = "";
       let cookies     = req.cookies;
       let langStr     = (cookies.lang !== undefined) ?
          fs.existsSync(pathMod.join(mainDirWeb, "lang", cookies.lang)) ?
             cookies.lang : "de_de"
          : "de_de";
       let lang         = LANG[langStr];

        res.render('pages/usersettings', {
            lang            : lang,
            userID          : req.session.uid,
            perm            : userHelper.permissions(req.session.uid),
            page            : "usersettings",
            response        : response,
            sinfos          : globalinfos.get(),
        });
    })

module.exports = router;