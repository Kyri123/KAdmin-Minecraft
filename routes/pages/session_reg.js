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
        res.render('pages/reg', {pagename: PANEL_LANG.pagename.reg, resp: ""})
    })

    .post((req,res)=>{
        let post        = req.body
        let response    = ""
        let sql

        // Prüfe ob alle Pflichtfelder vorhanden sind
        if(
            post.username !== undefined   &&
            post.email    !== undefined   &&
            post.pw1      !== undefined   &&
            post.pw2      !== undefined   &&
            post.code     !== undefined
        ) {
            post.username   = htmlspecialchars(post.username.trim())
            post.email      = htmlspecialchars(post.email.trim())
            post.code       = htmlspecialchars(post.code.trim())

            sql             = 'SELECT * FROM ArkAdmin_users WHERE `username`=? OR `email`=?'
            let result      = globalUtil.safeSendSQLSync(sql, post.username, post.email)

            // Prüfe ob Benutzer in Kombination der Email bereits exsistiert
            if(result.length === 0) {
                // Prüfe länge des Benutzernamen
                if(post.username.length > 6) {
                    // Prüfe Passwörter
                    if(
                        post.pw1        === post.pw2    &&
                        post.pw1.length > 6             &&
                        post.pw1.length > 6
                    ) {
                        // Wandel Passwört um
                        post.pw1        = md5(htmlspecialchars(post.pw1.trim()))
                        post.pw2        = md5(htmlspecialchars(post.pw2.trim()))

                        sql             = 'SELECT * FROM ArkAdmin_reg_code WHERE `used`=0 AND `code`=?'
                        let code_result = globalUtil.safeSendSQLSync(sql, post.code)
                        if(code_result.length > 0) {
                            sql             = `INSERT INTO ArkAdmin_users (\`username\`, \`email\`, \`password\`, \`ban\`, \`registerdate\` ,\`rang\`) VALUES (?, ?, ?, '0', '${Date.now()}', '${code_result[0].rang === "0" ? "[]" : "[1]"}')`
                            if(globalUtil.safeSendSQLSync(sql, post.username, post.email, post.pw1) !== false) {
                                sql         = 'UPDATE ArkAdmin_reg_code SET `used`=1 WHERE `code`=?'
                                result      = globalUtil.safeSendSQLSync(sql, post.code)
                                response    += alerter.rd(result !== false ? 1000 : 2)
                            }
                            else {
                                response    += alerter.rd(2)
                            }
                        }
                        else {
                            response += alerter.rd(907)
                        }
                    }
                    else {
                        response += alerter.rd(906)
                    }
                }
                else {
                    response += alerter.rd(905)
                }
            }
            else {
                response += alerter.rd(100)
            }
        }
        else {
            response += alerter.rd(908)
        }
        res.render('pages/reg', {pagename: PANEL_LANG.pagename.reg, resp: response})
    })

module.exports = router;