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
const serverClass       = require('./../../../app/src/util_server/class')
const unzip             = require("unzipper")

router.route('/')

    .post((req,res)=>{
        let POST            = req.body
        let FILES           = req.files

        // Upload
        try {
            if(
                typeof POST.server    !== "undefined" &&
                typeof POST.upload    !== "undefined" &&
                FILES
            ) if(userHelper.hasPermissions(req.session.uid,`backups/upload`, POST.server)) {
                let serverData      = new serverClass(POST.server)
                let serverCFG       = serverData.getConfig()
                let success         = true
                let file            = FILES['files[]']

                // lade Datei hoch
                try {
                    if(file.name.includes(".zip") && /^[0-9]+$/.test(file.name.replaceAll(".zip", ""))) {
                        let path = pathMod.join(serverCFG.pathBackup, file.name)
                        globalUtil.safeFileRmSync([path])
                        file.mv(pathMod.join(path))
                        success = true
                    }
                }
                catch (e) {
                    if(debug) console.log('[DEBUG_FAILED]', e)
                    success = false
                }

                res.render('ajax/json', {
                    data: JSON.stringify({
                        "success": success
                    })
                })
                return true
            }
        }
        catch (e) {
            if(debug) console.log('[DEBUG_FAILED]', e)
        }

        if(
            POST.server     !== undefined &&
            POST.file       !== undefined &&
            POST.remove     !== undefined
        ) if(userHelper.hasPermissions(req.session.uid, "backups/remove", POST.server)) {
            let serverData  = new serverClass(POST.server)
            let serverCFG   = serverData.getConfig()
            let success     = false
            try {
                if(Array.isArray(POST.file)) {
                    let tmpSuccess = true
                    for(let file of POST.file) {
                        if(!file.includes("/")) {
                            if (globalUtil.poisonNull(file) && !file.includes("..")) {
                                if (!globalUtil.safeFileRmSync([serverCFG.pathBackup, file]))
                                    tmpSuccess = false
                            }
                            else {
                                tmpSuccess = false
                            }
                        }
                        else {
                            tmpSuccess = false
                        }
                    }
                    success = tmpSuccess
                }
                else {
                    if (globalUtil.poisonNull(POST.file) && !POST.file.includes("..") && !POST.file.includes("/")) {
                        success = globalUtil.safeFileRmSync([serverCFG.pathBackup, POST.file])
                    }
                }
            }
            catch (e) {
                if(debug) console.log('[DEBUG_FAILED]', e)
            }

            res.render('ajax/json', {
                data: JSON.stringify({
                    success: success
                })
            })
            return
        }

        // Playin
        if(
            POST.server     !== undefined &&
            POST.file       !== undefined &&
            POST.playin     !== undefined
        ) if(userHelper.hasPermissions(req.session.uid, "backups/playin", POST.server)) {
            let serverData  = new serverClass(POST.server)
            let serverCFG   = serverData.getConfig()
            let success     = false
            try {
                if(globalUtil.poisonNull(POST.file) && !POST.file.includes("..") && !POST.file.includes("/") && !serverData.isrun()) {
                    if(globalUtil.safeFileMkdirSync([serverCFG.path, "tmp"]) && globalUtil.safeFileCreateSync([serverCFG.path, "isplayin"])) {
                        fs.createReadStream(pathMod.join(serverCFG.pathBackup, POST.file))
                            .pipe(unzip.Extract({path: pathMod.join(serverCFG.path, "tmp")}))
                            .on("close", () => {
                                let dirRead = fs.readdirSync(pathMod.join(serverCFG.path, "tmp"))

                                for(let file of dirRead) {
                                    globalUtil.safeFileRmSync([serverCFG.path, file])
                                    globalUtil.safeFileRenameSync([serverCFG.path, "tmp", file], [serverCFG.path, file])
                                }

                                globalUtil.safeFileRmSync([serverCFG.path, "tmp"])
                                globalUtil.safeFileRmSync([serverCFG.path, "isplayin"])
                            })
                        success = true
                    }
                }
            }
            catch (e) {
                if(debug) console.log('[DEBUG_FAILED]', e)
            }

            res.render('ajax/json', {
                data: JSON.stringify({
                    success: success
                })
            })
            return
        }


        res.render('ajax/json', {
            data: `{"request":"failed"}`
        })
        return true
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query
        GET.server      = htmlspecialchars(GET.server)

        // Wenn keine Rechte zum abruf
        if(!userHelper.hasPermissions(req.session.uid, "show", GET.server) || !userHelper.hasPermissions(req.session.uid, "backups/show", GET.server)) return true

        // GET serverInfos
        if(GET.getDir !== undefined && GET.server !== undefined) {
            let serverData  = new serverClass(GET.server)
            let CFG         = serverData.getConfig()
            if(globalUtil.safeFileExsistsSync([CFG.pathBackup]) && serverData.serverExsists()) {
                res.render('ajax/json', {
                    data: JSON.stringify(globalUtil.safeFileReadDirSync([CFG.pathBackup]))
                })
                return true
            }
        }

        res.render('ajax/json', {
            data: `{"request":"failed"}`
        })
        return true
    })

module.exports = router;