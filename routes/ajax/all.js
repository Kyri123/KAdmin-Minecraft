/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const router            = require('express').Router()
const srq               = require("sync-request")

router.route('/')

    .post((req,res) => {
        let POST        = req.body

        // lese ein Verzeichnis aus
        if(
           POST.getDirArray     !== undefined &&
           POST.dirPath         !== undefined
        ) {
            let dirPath     = Array.isArray(POST.dirPath) ? POST.dirPath : [POST.dirPath]

            res.render('ajax/json', {
                data: JSON.stringify(globalUtil.safeFileReadDirSync([dirPath]))
            })
            return true
        }

       // getModpackInfos
       if(
          POST.GETModPackInfos   !== undefined &&
          POST.ID                !== undefined
       ) {
          res.render('ajax/json', {
             data: versionControlerModpacks.getModpackInfos(parseInt(POST.ID))
          })
          return true
       }
    })

    .get((req,res) => {
        let GET         = req.query

        if(GET.getselfperm !== undefined) {
            res.render('ajax/json', {
                data: JSON.stringify(userHelper.permissions(req.session.uid))
            })
            return true
        }
    })

module.exports = router;