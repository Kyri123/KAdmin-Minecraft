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
        res.render('pages/login', {pagename: PANEL_LANG.pagename.login, resp: ""})
    })

    .post((req,res)=>{
        let post        = req.body
        let response    = ""

        // Prüfe ob alle Pflichtfelder vorhanden sind
        if(
            post.logger !== undefined &&
            post.pw     !== undefined
        ) {
            post.logger = htmlspecialchars(post.logger.trim())
            post.pw     = htmlspecialchars(post.pw.trim())

            sql             = 'SELECT * FROM ArkAdmin_users WHERE `username`=? OR (`email`=? AND `password`=?)'
            let result      = globalUtil.safeSendSQLSync(sql, post.logger, post.logger, md5(post.pw))
            // Prüfe ob Account Exsistiert
            if(result.length > 0) {
                // Prüfe ob Account gebannt ist
                if(result[0].ban !== 1) {
                    // Prüfe Passwort
                    if(result[0].password === md5(post.pw)) {
                        sess        = req.session
                        sess.uid    = result[0].id
                        req.session.save((err) => {})

                        let rndstring = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
                        if(post.loggedin !== undefined) {
                            res.cookie('id', md5(sess.uid), { maxAge: (525600*60*10000), httpOnly: true })
                            res.cookie('validate', md5(rndstring), { maxAge: (525600*60*10000), httpOnly: true })
                            sql             = 'INSERT INTO `ArkAdmin_user_cookies` (`md5id`, `validate`, `userid`) VALUES (?, ?, ?)'
                            globalUtil.safeSendSQLSync(sql, md5(sess.uid), md5(rndstring), sess.uid)
                        }

                        res.redirect("/home")
                    }
                    else {
                        response += alerter.rd(902)
                    }
                }
                else {
                    response += alerter.rd(901)
                }
            }
            else {
                response += alerter.rd(900)
            }
        }
        else {
            response += alerter.rd(100)
        }
        res.render('pages/login', {pagename: PANEL_LANG.pagename.reg, resp: response})
    })

module.exports = router;