/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

module.exports = {
    /**
     * Wenn eingeloggt ist > weiter !> /login
     * @param req
     * @param res
     * @param next
     */
    isLoggedIn: (req, res, next) => {
        let sess =  req.session
        if(sess.uid !== undefined) {
            // Prüfe ob dieser gebannt ist
            let sql    = 'SELECT * FROM `users` WHERE `id`=?'
            let result = globalUtil.safeSendSQLSync(sql, sess.uid)
            if(result.length === 0) {
                module.exports.logout(req, res)
            }
            if(result[0].ban === 0) {
                next()
            }
            else {
                module.exports.logout(req, res)
            }
        }
        else {
            let cookies = req.cookies
            if(cookies.id !== undefined && cookies.validate !== undefined) {
                let sql    = 'SELECT * FROM `user_cookies` WHERE `md5id`=? AND `validate`=?'
                let result = globalUtil.safeSendSQLSync(sql, cookies.id, cookies.validate)
                if(result.length > 0) {
                    sess.uid = result[0].userid
                    req.session.save((err) => {})
                    // Prüfe ob dieser gebannt ist
                    sql    = 'SELECT * FROM `users` WHERE `id`=?'
                    result = globalUtil.safeSendSQLSync(sql, sess.uid)
                    if(result[0].ban === 0) {
                        next()
                    }
                    else {
                        module.exports.logout(req, res)
                    }
                }
                else {
                    res.redirect("/login")
                    return true
                }
            }
            else {
                res.redirect("/login")
                return true
            }
        }
    },

    /**
     * Wenn nicht eingeloggt ist > weiter !> Prüfe ob einloggen kann (Cookie) - /home !> weiter
     * @param req
     * @param res
     * @param next
     */
    isNotLoggedIn: (req, res, next) => {
        let sess =  req.session
        if(sess.uid === undefined) {
            let cookies = req.cookies
            if(cookies.id !== undefined && cookies.validate !== undefined) {
                let sql    = 'SELECT * FROM `user_cookies` WHERE `md5id`=? AND `validate`=?'
                let result = globalUtil.safeSendSQLSync(sql, cookies.id, cookies.validate)
                if(result.length > 0) {
                    sess.uid = result[0].userid
                    req.session.save((err) => {})
                    // Prüfe ob dieser gebannt ist
                    sql    = 'SELECT * FROM `users` WHERE `id`=?'
                    result = globalUtil.safeSendSQLSync(sql, sess.uid)
                    if(result[0].ban === 0) {
                        res.redirect("/home")
                        return true
                    }
                    else {
                        module.exports.logout(req, res)
                    }
                }
                else {
                    next()
                }
            }
            else {
                next()
            }
        }
        else {
            res.redirect("/home")
            return true
        }
    },

    /**
     * Wenn nicht eingeloggt ist > weiter !> Prüfe ob einloggen kann (Cookie) - /home !> weiter
     * @param req
     * @param res
     */
    logout: (req, res) => {
        let userid = req.session.uid
        req.session.destroy((err) => {
            if(err) {
                return console.log(err)
            }
            globalUtil.safeSendSQLSync('DELETE FROM `user_cookies` WHERE `userid`=?', userid)
            res.cookie('id', "", {maxAge: 0})
            res.cookie('validate', "", {maxAge: 0})
            res.redirect('/login')
            return true
        })
    },

    checkPerm: (perm) => {
        return function(req, res, next) {
            let userid = req.session.uid

            if(userHelper.hasPermissions(userid, perm)) {
                next()
            }
            else {
                res.redirect('/401')
            }
        }
    }
}