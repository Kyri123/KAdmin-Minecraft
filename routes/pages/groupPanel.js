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

const topBtn    = `<div class="d-sm-inline-block">
                        <a href="#" class="btn btn-outline-success btn-icon-split rounded-0" onclick="$('#group').trigger('reset')" data-toggle="modal" data-target="#group">
                            <span class="icon">
                                <i class="fas fa-plus" aria-hidden="true"></i>
                            </span>
                        </a>
                    </div>`;

router.route('/')

    .all((req,res)=>{
        global.user         = userHelper.getinfos(req.session.uid);
        let resp        = "";

        if(!userHelper.hasPermissions(req.session.uid, "all/is_admin")) {
            res.redirect("/401");
            return true;
        }

        res.render('pages/grouppanel', {
            icon                : "fas fa-users",
            pagename            : PANEL_LANG.pagename.grouppanel,
            page                : "grouppanel",
            resp                : resp,
            perm                : userHelper.permissions(req.session.uid),
            sinfos              : globalinfos.get(),
            topBtn              : topBtn,
            defaultPermissions  : userHelper.defaultPermissions()
        });
    })

module.exports = router;