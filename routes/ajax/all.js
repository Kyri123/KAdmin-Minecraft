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
const updater           = require("./../../app/src/background/updater")
const request           = require("sync-request")

router.route('/')

    .post((req,res) => {
        let POST        = req.body
        let sess        = req.session

        //Panel Menü
        if(
            POST.adminAction     !== undefined &&
            userHelper.hasPermissions(sess.uid, "all/is_admin")
        ) {
            // checkUpdate
            if(POST.adminAction === "checkUpdate") {
                updater.check()
                res.render('ajax/json', {
                    data: JSON.stringify({
                        code    : 34,
                        type    : "success"
                    })
                })
                return
            }

            // shutdown
            if(POST.adminAction === "shutdown") {
                updater.check()
                res.render('ajax/json', {
                    data: JSON.stringify({
                        code    : !isUpdating ? 36 : 37,
                        type    : !isUpdating ? "success" : "danger"
                    })
                })
                if(!isUpdating) setTimeout(() => process.exit(), 3000)
                return
            }

            // forceUpdate
            if(POST.adminAction === "forceUpdate" && isUpdate) {
                res.render('ajax/json', {
                    data: JSON.stringify({
                        code    : 35,
                        type    : "success"
                    })
                })
                updater.install()
                return
            }
        }

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

       res.render('ajax/json', {
          data: `{"request":"failed"}`
       })
       return true
    })

    .get((req,res) => {
        let GET         = req.query

        if(GET.getselfperm !== undefined) {
            res.render('ajax/json', {
                data: JSON.stringify(userHelper.permissions(req.session.uid))
            })
            return true
        }

        if(GET.getisupdate !== undefined) {
            res.render('ajax/json', {
                data: JSON.stringify({
                    "is_update"     : isUpdate,
                    "isUpdating"    : isUpdating,
                    "needRestart"   : needRestart
                })
            })
            return true
        }

        if(GET.request !== undefined) {
            let returnString = 'false'
            try {
                returnString = request('GET', GET.requestURL).getBody().toString()
            }
            catch (e) {
               if(debug) console.log()
            }
            res.render('ajax/json', {
                data: returnString
            })
            return true
        }

       res.render('ajax/json', {
          data: `{"request":"failed"}`
       })
       return true
    })

module.exports = router;