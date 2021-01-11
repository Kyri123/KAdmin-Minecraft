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
const userHelper   = require('./../../app/src/sessions/helper')

router.route('/')

    .post((req,res)=>{
        let POST        = req.body
        if(POST.saveuser !== undefined) {
            let someChanges = false
            let whatChanged = ``
            let new_username
            let new_email

            // Speicher neuen Username
            if(user.username !== POST.username) {
                if(userHelper.writeinfos(req.session.uid, "username", POST.username)) {
                    someChanges     = true
                    whatChanged     += ` ${PANEL_LANG.usersettings.username} `
                    user.username    = POST.username
                }
            }

            // Speicher neue E-Mail
            if(user.email !== POST.email) {
                if(userHelper.writeinfos(req.session.uid, "email", POST.email)) {
                    someChanges     = true
                    whatChanged     += ` ${PANEL_LANG.usersettings.email} `
                    user.email       = POST.email
                }
            }

            // Speicher neues Passwort
            if(POST.pw1 !== "" && POST.pw2 !== "") {
                if(POST.pw1 === POST.pw2) {
                    if(userHelper.writeinfos(req.session.uid, "password", md5(POST.pw1))) {
                        someChanges = true
                        whatChanged += ` ${PANEL_LANG.usersettings.pw} `
                    }
                }
                else {
                    resp    += alerter.rd(903)
                }
            }

            if(someChanges) {
                res.render('ajax/json', {
                    data: JSON.stringify({
                        what: whatChanged,
                        done: true,
                        alert: alerter.rd(1001).replace("{what}", whatChanged)
                    })
                })
                return true
            }
            else {
                res.render('ajax/json', {
                    data: JSON.stringify({
                        done: false,
                        alert: alerter.rd(3000)
                    })
                })
                return true
            }
        }
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query
        res.render('ajax/json', {
            data: JSON.stringify({
                done: false
            })
        })
        return true
    })

module.exports = router;