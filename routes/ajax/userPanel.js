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

        // Wenn der Benutzer keine Rechte hat diese Seite aufzurufen
        if(!userHelper.hasPermissions(req.session.uid, "userpanel/show")) return true

        // Bannen/Entbannen
        if(POST.toggleUser !== undefined && userHelper.hasPermissions(req.session.uid, "userpanel/ban_user")) {
            let userInfos = userHelper.getinfos(POST.id)
            userHelper.writeinfos(POST.id, "ban", userInfos.ban === 1 ? 0 : 1)

            res.render('ajax/json', {
                data: JSON.stringify({
                    toggled: true,
                    ban: userInfos.ban === 1 ? 0 : 1,
                    alert: alerter.rd(userInfos.ban === 1 ? 1004 : 1005).replace("{user}", userInfos.username)
                })
            })
            return true
        }

        // Benutzer Löschen
        if(POST.deleteuser !== undefined && userHelper.hasPermissions(req.session.uid, "userpanel/delete_user")) {
            let userInfos = userHelper.getinfos(POST.uid)
            userHelper.removeUser(POST.uid)

            res.render('ajax/json', {
                data: JSON.stringify({
                    remove: true,
                    ban: userInfos.ban === 1 ? 0 : 1,
                    alert: alerter.rd(1006).replace("{user}", userInfos.username)
                })
            })
            return true
        }

        // Code Löschen
        if(POST.removeCode !== undefined && userHelper.hasPermissions(req.session.uid, "userpanel/delete_code")) {
            userHelper.removeCode(POST.id)

            res.render('ajax/json', {
                data: JSON.stringify({
                    remove: true,
                    alert: alerter.rd(1007)
                })
            })
            return true
        }

        // Code Erzeugen
        if(POST.addCode !== undefined && userHelper.hasPermissions(req.session.uid, "userpanel/create_code")) {
            let code = userHelper.createCode(POST.rank)

            res.render('ajax/json', {
                data: JSON.stringify({
                    added: true,
                    alert: alerter.rd(1008).replace("{code}", code)
                })
            })
            return true
        }

        // Gruppen zuweisen
        if(POST.setGroups !== undefined && userHelper.hasPermissions(req.session.uid, "all/is_admin")) {
            let alertcode   = 8
            let userInfos   = userHelper.getinfos(POST.uid)
            let groups      = POST.groups === undefined ? [] : Array.isArray(POST.groups) ? POST.groups : []
            groups.forEach((value, index) => groups[index] = parseInt(value))

            if(userInfos !== false) {
                alertcode   = userHelper.writeinfos(userInfos.id, "rang", JSON.stringify(groups)) !== false ? 1017 : alertcode
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

        // Wenn der Benutzer keine Rechte hat diese Seite aufzurufen
        if(!userHelper.hasPermissions(req.session.uid, "userpanel/show")) return true

        // Userlist
        if(GET.getuserlist) {
            res.render('ajax/json', {
                data: JSON.stringify({
                    userlist: globalUtil.safeSendSQLSync('SELECT `id`, `username`, `email`, `lastlogin`, `registerdate`, `rang`, `ban` FROM users')
                })
            })
            return true
        }

        // Codelist
        if(GET.getcodelist) {
            res.render('ajax/json', {
                data: JSON.stringify({
                    codelist: globalUtil.safeSendSQLSync(`SELECT * FROM \`reg_code\` WHERE \`used\`=0${!userHelper.hasPermissions(req.session.uid, "all/is_admin") ? ' AND `rang`=0' : ''}`)
                })
            })
            return true
        }
    })

module.exports = router;