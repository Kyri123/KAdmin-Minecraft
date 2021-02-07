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
        let sess        = req.session

        // prüfe ob Benutzer Admin ist
        if(!userHelper.hasPermissions(sess.uid, "all/is_admin")) return true

        // Gruppe erstellen
        if(POST.add !== undefined) {
            let alertcode   = 100

            if(POST.group_name !== '') {
                let groupTest   = globalUtil.safeSendSQLSync('SELECT * FROM `user_group` WHERE `name`=?', POST.group_name)
                let perm        = JSON.stringify(POST.permissions) !== undefined ? JSON.stringify(POST.permissions) : "{}"

                if(groupTest !== false) alertcode   = 2
                if(groupTest !== false) if(groupTest.length === 0) {
                    alertcode   = globalUtil.safeSendSQLSync(
                        'INSERT INTO `user_group` (name, editform, time, permissions, canadd) VALUES (?, ?, ?, ?, \'[]\')' ,
                        POST.group_name,
                        sess.uid,
                        Date.now(),
                       perm.replaceAll('"on"', "1")
                    ) !== false ? 1014 : 2
                }
                else {
                    alertcode   = 6
                }
            }

            res.render('ajax/json', {
                data: JSON.stringify({
                    alert: alerter.rd(alertcode),
                    success: true
                })
            })
            return true
        }

        // Gruppe Entfernen
        if(POST.deletegroup !== undefined) {
            let alertcode   = 7

            // Superadmin darf nicht verändert werden
            if(parseInt(POST.gid) !== 1) {
                let groupTest = globalUtil.safeSendSQLSync('SELECT * FROM `user_group` WHERE `id`=?', POST.gid)
                if(groupTest !== false) if(groupTest.length !== 0) alertcode   = globalUtil.safeSendSQLSync(
                    'DELETE FROM `user_group` WHERE `id`=?' ,
                    POST.gid
                ) !== false ? 1015 : 2
            }

            res.render('ajax/json', {
                data: JSON.stringify({
                    alert: alerter.rd(alertcode),
                    success: true
                })
            })
            return true
        }

        // Gruppe Bearbeiten
        if(POST.edit !== undefined) {
            let alertcode   = 7

            // Superadmin darf nicht verändert werden
            if(parseInt(POST.gid) !== 1) {
                let groupTest   = globalUtil.safeSendSQLSync('SELECT * FROM `user_group` WHERE `id`=?', POST.editgroupid)
                let perm        = JSON.stringify(POST.permissions) !== undefined ? JSON.stringify(POST.permissions) : "{}"

                if(groupTest !== false)                             alertcode   = 2
                if(groupTest !== false) if(groupTest.length !== 0)  alertcode   = globalUtil.safeSendSQLSync(
                        'UPDATE `user_group` SET `name`=?,`editform`=?, `time`=?, `permissions`=? WHERE `id`=?' ,
                        POST.group_name,
                        sess.uid,
                        Date.now(),
                        perm.replaceAll('"on"', "1"),
                        POST.editgroupid
                    ) !== false ? 1016 : 2
            }

            res.render('ajax/json', {
                data: JSON.stringify({
                    alert: alerter.rd(alertcode),
                    success: true
                })
            })
            return true
        }
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query
        let sess        = req.session

        // prüfe ob Benutzer Admin ist
        if(!userHelper.hasPermissions(sess.uid, "all/is_admin")) return true

        // Userlist
        if(GET.getgrouplist) res.render('ajax/json', {
            data: JSON.stringify({
                grouplist: globalUtil.safeSendSQLSync('SELECT * FROM user_group')
            })
        })
        return true
    })

module.exports = router