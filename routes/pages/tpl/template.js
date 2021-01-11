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

const topBtn    = ``

router.route('/')

    .all((req,res)=>{
        global.user         = userHelper.getinfos(req.session.uid)
        let resp        = ""

        res.render('pages/userpanel', {
            icon            : "fas fa-users",
            pagename        : PANEL_LANG.pagename.userpanel,
            page            : "grouppanel",
            resp            : resp,
            perm            : userHelper.permissions(req.session.uid),
            sinfos          : globalinfos.get(),
            new_email       : false,
            new_username    : false,
            topBtn          : topBtn
        })
    })

module.exports = router;