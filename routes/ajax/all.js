/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const express           = require('express')
const router            = express.Router()

router.route('/')

    .post((req,res)=>{
        let POST        = req.body

        // lese ein Verzeichnis aus
        if(
           POST.getDirArray     !== undefined &&
           POST.dirPath         !== undefined
        ) {
            let dirPath     = Array.isArray(POST.dirPath) ? POST.dirPath : [POST.dirPath]

            res.render('ajax/json', {
                data: JSON.stringify(globalUtil.safeFileReadDirSync(dirPath))
            })
            return true
        }
    })

module.exports = router;