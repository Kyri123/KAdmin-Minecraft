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
        if(POST.saveuser !== undefined) {
            let someChanges     = false
            let whatChanged     = ``
            let user            = userHelper.getinfos(req.session.uid)
            let cookies         = req.cookies
            let langStr         = (cookies.lang !== undefined) ?
               fs.existsSync(pathMod.join(mainDir, "lang", cookies.lang)) ?
                  cookies.lang : "de_de"
               : "de_de"
            let lang            = LANG[langStr]
            let resp

            // Speicher neuen Username
            if(user.username !== POST.username) {
                if(userHelper.writeinfos(req.session.uid, "username", POST.username)) {
                    someChanges     = true
                    whatChanged     += ` ${lang["usersettings"].username} `
                    user.username    = POST.username
                }
            }

            // Speicher neue E-Mail
            if(user.email !== POST.email) {
                if(userHelper.writeinfos(req.session.uid, "email", POST.email)) {
                    someChanges     = true
                    whatChanged     += ` ${lang["usersettings"].email} `
                    user.email       = POST.email
                }
            }

            // Speicher neues Passwort
            if(POST.pw1 !== "" && POST.pw2 !== "") {
                if(POST.pw1 === POST.pw2) {
                    if(userHelper.writeinfos(req.session.uid, "password", md5(POST.pw1))) {
                        someChanges = true
                        whatChanged += ` ${lang["usersettings"].pw} `
                    }
                }
                else {
                    resp    += alerter.rd(903, langStr)
                }
            }

            if(someChanges) {
                res.render('ajax/json', {
                    data: JSON.stringify({
                        what: whatChanged,
                        done: true,
                        alert: alerter.rd(1001, langStr).replace("{what}", whatChanged)
                    })
                })
                return true
            }
            else {
                res.render('ajax/json', {
                    data: JSON.stringify({
                        done: false,
                        alert: resp ? resp : alerter.rd(3000, langStr)
                    })
                })
                return true
            }
        }
    })

module.exports = router;