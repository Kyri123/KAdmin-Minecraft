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

router.route('/')

    .get((req,res)=>{
        res.render('pages/404', {pagename: PANEL_LANG.pagename.err404, page: "home", resp: ""})
    })

    .post((req,res)=>{
        res.render('pages/404', {pagename: PANEL_LANG.pagename.err404, page: "home", resp: ""})
    })

module.exports = router;