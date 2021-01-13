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

    .get((req,res)=>{
        let GET         = req.query
        let POST        = req.body
        let response    = ""
        let cookies     = req.cookies
        let langStr     = (cookies.lang !== undefined) ?
           fs.existsSync(pathMod.join(mainDirWeb, "lang", cookies.lang)) ?
              cookies.lang : "de_de"
           : "de_de"
        let lang         = LANG[langStr]

        res.render('pages/login', {
            page        : "login",
            response    : response,
            lang        : lang
        })
        return true
    })

    .post((req,res)=>{
        let GET         = req.query
        let POST        = req.body
        let response    = ""
        let cookies     = req.cookies
        let langStr     = (cookies.lang !== undefined) ?
           fs.existsSync(pathMod.join(mainDirWeb, "lang", cookies.lang)) ?
              cookies.lang : "de_de"
           : "de_de"
        let lang         = LANG[langStr]
        let sess        = req.session

        // Prüfe ob alle Pflichtfelder vorhanden sind
        if(
            POST.logger !== undefined &&
            POST.pw     !== undefined
        ) {
            POST.logger = htmlspecialchars(POST.logger.trim())
            POST.pw     = htmlspecialchars(POST.pw.trim())

            let sql             = 'SELECT * FROM users WHERE `username`=? OR (`email`=? AND `password`=?)'
            let result      = globalUtil.safeSendSQLSync(sql, POST.logger, POST.logger, md5(POST.pw))
            // Prüfe ob Account Exsistiert
            if(result.length > 0) {
                // Prüfe ob Account gebannt ist
                if(result[0].ban !== 1) {
                    // Prüfe Passwort
                    if(result[0].password === md5(POST.pw)) {
                        sess.uid    = result[0].id
                        req.session.save((err) => {})

                        let rndstring = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
                        if(POST.loggedin !== undefined) {
                            res.cookie('id', md5(sess.uid), { maxAge: (525600*60*10000), httpOnly: true })
                            res.cookie('validate', md5(rndstring), { maxAge: (525600*60*10000), httpOnly: true })
                            sql             = 'INSERT INTO `user_cookies` (`md5id`, `validate`, `userid`) VALUES (?, ?, ?)'
                            globalUtil.safeSendSQLSync(sql, md5(sess.uid), md5(rndstring), sess.uid)
                        }

                        res.redirect("/home")
                        return true
                    }
                    else {
                        response += alerter.rd(902, langStr)
                    }
                }
                else {
                    response += alerter.rd(901, langStr)
                }
            }
            else {
                response += alerter.rd(900, langStr)
            }
        }
        else {
            response += alerter.rd(100, langStr)
        }

        res.render('pages/login', {
            page        : "login",
            response    : response,
            lang        : lang
        })
        return true
    })

module.exports = router;