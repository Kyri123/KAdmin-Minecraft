/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const express   = require('express')
const router    = express.Router()

router.route('/')

    .all((req,res)=>{
        let GET         = req.query
        let POST        = req.body
        let data        = {}
        let lang        = PANEL_LANG_OTHER.installer.ajax
        let langAll     = PANEL_LANG_OTHER.installer.langAll

        // Teste MySQL
        if(POST.testMySQL !== undefined) {

        }

        // Lade Standartseite
        res.render('ajax/json', {
               data : JSON.stringify(data),
        })
        return true
    })

module.exports = router;