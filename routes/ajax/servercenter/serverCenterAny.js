/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const router                = require('express').Router()
const globalinfos           = require('./../../../app/src/global_infos')
const serverCommands        = require('./../../../app/src/background/server/commands')
const serverCommandsUtil    = require('./../../../app/src/background/server/commands_util')

router.route('/')

    .post((req,res)=>{
        let POST        = req.body;

        // Playeraction
        if(
            POST.sendPlayerAction !== undefined &&
            POST.command !== undefined &&
            userHelper.hasPermissions(req.session.uid, "sendCommands", POST.cfg)
        ) {
            res.render('ajax/json', {
                data: serverCommandsUtil.sendToScreen(POST.server, escape(POST.command.toString()))
            });
            return true;
        }

        // ModpackPicker
        if(
           POST.installModpack !== undefined &&
           POST.cfg !== undefined &&
           POST.modid !== undefined &&
           POST.fileid !== undefined &&
           userHelper.hasPermissions(req.session.uid, "versionpicker", POST.cfg)
        ) {
            let serv        = new serverClass(POST.cfg)

            if(serv.serverExsists()) {
                serv.writeState("is_installing", true)
                let modid   = parseInt(POST.modid)
                let succ    = versionControlerModpacks.InstallPack(modid, parseInt(POST.fileid), POST.cfg)
                if(succ) serv.writeConfig("currversion", modid)

                res.render('ajax/json', {
                    data: JSON.stringify({
                        success: succ
                    })
                });
                return true;
            }
        }

        // VersionPicker
        if(
           POST.installVersion !== undefined &&
           userHelper.hasPermissions(req.session.uid, "versionpicker", POST.cfg)
        ) {
            let serv        = new serverClass(POST.cfg)

            if(serv.serverExsists()) {
                let v       = POST.version.replace(".jar", "")
                let succ
                if(POST.type === "spigot") {
                    serv.writeState("is_installing", true)
                    succ    = versionSpigotControler.downloadServer(POST.version, `${serv.getConfig().path}/serverSpigot.jar`)
                    if(succ) serv.writeConfig("jar", "serverSpigot.jar")
                }
                else if(POST.type === "craftbukkit") {
                    serv.writeState("is_installing", true)
                    succ    = versionCraftbukkitControler.downloadServer(POST.version, `${serv.getConfig().path}/serverCraftbukkit.jar`)
                    if(succ) serv.writeConfig("jar", "serverCraftbukkit.jar")
                }
                else {
                    serv.writeState("is_installing", true)
                    v       = versionVanillaControler.readList().versions[POST.version].id
                    succ    = versionVanillaControler.downloadServer(POST.version, `${serv.getConfig().path}/server.jar`)
                    if(succ) serv.writeConfig("jar", "server.jar")
                }
                if(succ) serv.writeConfig("currversion", v)

                res.render('ajax/json', {
                    data: JSON.stringify({
                        alert: alerter.rd(succ ? 1018 : 3).replace("{v}", v)
                    })
                });
                return true;
            }
        }

        // Action Handle
        if(POST.actions !== undefined && POST.cfg !== undefined && userHelper.hasPermissions(req.session.uid, "actions", POST.cfg)) {
            if(POST.actions === "sendcommand") {
                let stop    = false
                let done    = false
                let para    = POST.para === undefined ? [] : POST.para

                // Server Installieren
                switch(POST.action) {
                    case "start":
                        done = serverCommands.doStart(POST.cfg, para)
                        break;
                    case "stop":
                        done = serverCommands.doStop(POST.cfg, para)
                        break;
                    case "backup":
                        done = serverCommands.doBackup(POST.cfg, para)
                        break;
                }

                if(done) {
                    res.render('ajax/json', {
                        data: `{"code":"1", "txt": "Install running"}`
                    });
                    return true;
                }

                if(!stop) res.render('ajax/json', {
                    data: `{"code":"404"}`
                });
            }
        }
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query;

        // GET Globale Infos
        if(GET.getglobalinfos !== undefined) {
            res.render('ajax/json', {
                data: JSON.stringify(globalinfos.get())
            });
            return true;
        }

        // Wenn keine Rechte zum abruf
        if(!userHelper.hasPermissions(req.session.uid, "show", GET.server)) return true;

        // GET serverInfos
        if(GET.getserverinfos !== undefined && GET.server !== undefined) {
            let serverData  = new serverClass(GET.server);
            res.render('ajax/json', {
                data: JSON.stringify(serverData.getServerInfos())
            });
            return true;
        }
    })

module.exports = router;