/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const router    = require('express').Router()

router.route('/')

    .get((req,res)=>{
        let GET         = req.query
        let POST        = req.body
        let response    = ""
        let cookies     = req.cookies

        let langStr     = (cookies.lang !== undefined) ?
           fs.existsSync(pathMod.join(mainDir, "lang", cookies.lang)) ?
              cookies.lang : "de_de"
           : "de_de"
        let lang         = LANG[langStr]

        res.render('pages/reg', {
            page        : "reg",
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
           fs.existsSync(pathMod.join(mainDir, "lang", cookies.lang)) ?
              cookies.lang : "de_de"
           : "de_de"
        let lang         = LANG[langStr]

        // Prüfe ob alle Pflichtfelder vorhanden sind
        if(
            POST.username !== undefined   &&
            POST.email    !== undefined   &&
            POST.pw1      !== undefined   &&
            POST.pw2      !== undefined   &&
            POST.code     !== undefined
        ) {
            POST.username   = htmlspecialchars(POST.username.trim())
            POST.email      = htmlspecialchars(POST.email.trim())
            POST.code       = htmlspecialchars(POST.code.trim())

            let sql             = 'SELECT * FROM users WHERE `username`=? OR `email`=?'
            let result      = globalUtil.safeSendSQLSync(sql, POST.username, POST.email)

            // Prüfe ob Benutzer in Kombination der Email bereits exsistiert
            if(result.length === 0) {
                // Prüfe länge des Benutzernamen
                if(POST.username.length > 6) {
                    // Prüfe Passwörter
                    if(
                        POST.pw1        === POST.pw2    &&
                        POST.pw1.length > 6             &&
                        POST.pw1.length > 6
                    ) {
                        // Wandel Passwört um
                        POST.pw1        = md5(htmlspecialchars(POST.pw1.trim()))
                        POST.pw2        = md5(htmlspecialchars(POST.pw2.trim()))

                        sql             = 'SELECT * FROM reg_code WHERE `used`=0 AND `code`=?'
                        let code_result = globalUtil.safeSendSQLSync(sql, POST.code)
                        if(code_result.length > 0) {
                            sql             = `INSERT INTO users (\`username\`, \`email\`, \`password\`, \`ban\`, \`registerdate\` ,\`rang\`) VALUES (?, ?, ?, '0', '${Date.now()}', '[${code_result[0].rang}]')`
                            if(globalUtil.safeSendSQLSync(sql, POST.username, POST.email, POST.pw1) !== false) {
                                sql         = 'UPDATE reg_code SET `used`=1 WHERE `code`=?'
                                result      = globalUtil.safeSendSQLSync(sql, POST.code)
                                response    += alerter.rd((result !== false ? 1000 : 2), langStr)
                            }
                            else {
                                response    += alerter.rd(2, langStr)
                            }
                        }
                        else {
                            response += alerter.rd(907, langStr)
                        }
                    }
                    else {
                        response += alerter.rd(906, langStr)
                    }
                }
                else {
                    response += alerter.rd(905, langStr)
                }
            }
            else {
                response += alerter.rd(100, langStr)
            }
        }
        else {
            response += alerter.rd(908, langStr)
        }

        res.render('pages/reg', {
            page        : "reg",
            response    : response,
            lang        : lang
        })
        return true
    })

module.exports = router;