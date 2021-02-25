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
const userHelper        = require('./../../app/src/sessions/helper')

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
            res.render('ajax/json', {
                data: JSON.stringify({
                    success: userHelper.removeUser(POST.uid)
                })
            })
            return true
        }

        // Code Löschen
        if(POST.removeCode !== undefined && userHelper.hasPermissions(req.session.uid, "userpanel/delete_code")) {
            res.render('ajax/json', {
                data: JSON.stringify({
                    remove: userHelper.removeCode(POST.id) !== false,
                    alert: alerter.rd(1007)
                })
            })
            return true
        }

        // Code Erzeugen
        if(POST.addCode !== undefined && userHelper.hasPermissions(req.session.uid, "userpanel/create_code")) {
            let code = userHelper.createCode(POST.rank)
            console.log(code)

            res.render('ajax/json', {
                data: JSON.stringify({
                    success: code !== false
                })
            })
            return true
        }

        // Gruppen zuweisen
        if(POST.setGroups !== undefined && userHelper.hasPermissions(req.session.uid, "all/is_admin")) {
            let userInfos   = userHelper.getinfos(POST.uid)
            let groups      = POST.groups === undefined ? [] : Array.isArray(POST.groups) ? POST.groups : []
            groups.forEach((value, index) => groups[index] = parseInt(value))

            res.render('ajax/json', {
                data: JSON.stringify({
                    success: userHelper.writeinfos(userInfos.id, "rang", JSON.stringify(groups)) !== false
                })
            })
            return true
        }

        res.render('ajax/json', {
            data: `{"request":"failed"}`
        })
        return true
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query

        // Wenn der Benutzer keine Rechte hat diese Seite aufzurufen
        if(!userHelper.hasPermissions(req.session.uid, "userpanel/show")) return true

        // Userlist
        if(GET.getuserlist) {
            let userList = globalUtil.safeSendSQLSync('SELECT `id`, `username`, `email`, `lastlogin`, `registerdate`, `rang`, `ban` FROM users')
            let endList  = []

            for(let user of userList) {
                let ranks       = JSON.parse(user.rang)
                let item        = user
                item.groupinfo  = []

                for(let rank of ranks){
                    let groupinfo   = globalUtil.safeSendSQLSync('SELECT * FROM `user_group` WHERE `id`=?', rank)
                    if(groupinfo !== false)
                        item.groupinfo.push(groupinfo[0])
                }

                endList.push(item)
            }

            res.render('ajax/json', {
                data: JSON.stringify({
                    userlist: endList
                })
            })
            return true
        }

        // Codelist
        if(GET.getcodelist) {
            let codeList = globalUtil.safeSendSQLSync(`SELECT * FROM \`reg_code\` WHERE \`used\`=0${!userHelper.hasPermissions(req.session.uid, "all/is_admin") ? ' AND `rang`!=1' : ''}`)
            let endList  = []

            for(let code of codeList) {
                let groupinfo   = globalUtil.safeSendSQLSync('SELECT * FROM `user_group` WHERE `id`=?', code.rang)
                let item        = code
                item.groupinfo  = false
                if(groupinfo !== false)
                    item.groupinfo = groupinfo[0]
                    endList.push(item)
            }

            res.render('ajax/json', {
                data: JSON.stringify({
                    codelist: codeList
                })
            })
            return true
        }

        res.render('ajax/json', {
            data: `{"request":"failed"}`
        })
        return true
    })

module.exports = router;