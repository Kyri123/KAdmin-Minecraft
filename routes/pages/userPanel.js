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
        let resp        = ""

        if(!userHelper.hasPermissions(req.session.uid, "userpanel/show")) {
            res.redirect("/401")
            return true
        }

        let topBtn = ''
        if(userHelper.hasPermissions(req.session.uid, "userpanel/show_codes")) topBtn =
            `<div class="d-sm-inline-block">
                <a href="#" class="btn btn-outline-success btn-icon-split rounded-0" data-toggle="modal" data-target="#addserver">
                    <span class="icon">
                        <i class="fas fa-plus" aria-hidden="true"></i>
                    </span>
                </a>
            </div>`

        res.render('pages/userpanel', {
            userID          : req.session.uid,
            icon            : "fas fa-user",
            pagename        : PANEL_LANG.pagename.userpanel,
            page            : "userpanel",
            resp            : resp,
            perm            : userHelper.permissions(req.session.uid),
            sinfos          : globalinfos.get(),
            new_email       : false,
            new_username    : false,
            topBtn          : topBtn,
            groups          : globalUtil.safeSendSQLSync('SELECT * FROM `arkadmin_user_group` ORDER BY `id`')
        })
    })

module.exports = router;