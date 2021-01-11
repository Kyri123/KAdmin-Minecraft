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
const globalinfos   = require('./../../app/src/global_infos')
const userHelper   = require('./../../app/src/sessions/helper')

router.route('/')

    .all((req,res)=>{
        global.user         = userHelper.getinfos(req.session.uid)
        let resp = ""
        res.render('pages/home', {
            icon        : "fas fa-tachometer-alt",
            pagename    : PANEL_LANG.pagename.home,
            page        : "home",
            resp        : resp,
            perm        : userHelper.permissions(req.session.uid),
            sinfos      : globalinfos.get()
        })
    })

module.exports = router;