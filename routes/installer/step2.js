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
        let resp        = ""
        let lang        = PANEL_LANG_OTHER.installer.step2
        let langAll     = PANEL_LANG_OTHER.installer.langAll

        // Leite zum letzten oder 1. Schritt wenn der Schritt nicht freigegeben wurde
        if(installerJson.step !== undefined) {
            if(parseInt(installerJson.step) !== 2) {
                res.redirect(`/step/${installerJson.step}`)
               return true
            }
        }
        else
        {
            res.redirect(`/step/1`)
           return true
        }

        // verarbeite input
        if(POST.send !== undefined) {
            let success     = false


            if(success) {
                process.exit(1)
                return false
            }
        }

        // Lade Standartseite
        res.render(`installer/step${installerJson.step}`, {
            pagename    : lang.pagename,
            lang        : lang,
            langAll     : langAll,
            resp        : resp
        })
    })

module.exports = router;