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
       let response    = ""
       let cookies     = req.cookies
       let lang         = LANG[(cookies.lang !== undefined) ?
          fs.existsSync(pathMod.join(mainDir, "lang", cookies.lang)) ?
             cookies.lang : "de_de"
          : "de_de"]

        globalUtil.safeFileCreateSync([pathToInstallerJSON], '{"step":1,"installed":"false"}')
        try {
            global.installerJson   = globalUtil.safeFileReadSync([pathToInstallerJSON], true)
        }
        catch (e) {
            if(debug) console.log(e)
        }

        // Leite zum Schritt wenn dieser nicht 1 entspricht
        if(installerJson.step !== undefined) {
            if(parseInt(installerJson.step) !== 1) {
                res.redirect(`/step/${installerJson.step}`)
               return true
            }
        }

        // verarbeite input
        if(POST.send !== undefined) {
            let success     = false


            if(success) {
                res.redirect(`/step/${installerJson.step + 1}`)
               return true
            }
        }

        // Lade Standartseite
        res.render(`installer/step${installerJson.step}`, {
            lang           : lang,
            response       : response
        })
    })

module.exports = router;