/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
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
                        safeFileRmSync([path])
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
                            if (poisonNull(file) && !file.includes("..")) {
                                if (!safeFileRmSync([serverCFG.pathBackup, file]))
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
                    if (poisonNull(POST.file) && !POST.file.includes("..") && !POST.file.includes("/")) {
                        success = safeFileRmSync([serverCFG.pathBackup, POST.file])
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
                if(poisonNull(POST.file) && !POST.file.includes("..") && !POST.file.includes("/") && !serverData.isrun()) {
                    if(safeFileMkdirSync([serverCFG.path, "tmp"]) && safeFileCreateSync([serverCFG.path, "isplayin"])) {
                        fs.createReadStream(pathMod.join(serverCFG.pathBackup, POST.file))
                            .pipe(unzip.Extract({path: pathMod.join(serverCFG.path, "tmp")}))
                            .on("close", () => {
                                let dirRead = fs.readdirSync(pathMod.join(serverCFG.path, "tmp"))

                                for(let file of dirRead) {
                                    safeFileRmSync([serverCFG.path, file])
                                    safeFileRenameSync([serverCFG.path, "tmp", file], [serverCFG.path, file])
                                }

                                safeFileRmSync([serverCFG.path, "tmp"])
                                safeFileRmSync([serverCFG.path, "isplayin"])
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
            if(safeFileExsistsSync([CFG.pathBackup]) && serverData.serverExsists()) {
                res.render('ajax/json', {
                    data: JSON.stringify(safeFileReadDirSync([CFG.pathBackup]))
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