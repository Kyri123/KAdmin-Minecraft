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

router.route('/')

   .post((req,res)=>{
      let POST        = req.body
      let FILES       = req.files
      console.log(FILES)

      // Löschen
      try {
         if(
            typeof POST.server    !== "undefined" &&
            typeof POST.path      !== "undefined" &&
            typeof POST.remove    !== "undefined"
         ) if(userHelper.hasPermissions(req.session.uid,`filebrowser/${fs.lstatSync(pathMod.join(POST.path)).isDirectory() ? "removeFolder" : "removeFiles"}`, POST.server)) {
            let serverData  = new serverClass(POST.server)
            res.render('ajax/json', {
               data: JSON.stringify({
                  "success": pathMod.join(POST.path).includes(POST.server) && pathMod.join(POST.path) !== serverData.getConfig().path
                     ? globalUtil.safeFileRmSync([POST.path])
                     : false
               })
            })
            return true
         }
      }
      catch (e) {
         if(debug) console.log(e)
      }

      // editFile
      if(
         typeof POST.server      !== "undefined" &&
         typeof POST.path        !== "undefined" &&
         typeof POST.data        !== "undefined" &&
         typeof POST.editfile    !== "undefined"
      ) if(userHelper.hasPermissions(req.session.uid,`filebrowser/editFiles`, POST.server)) {
         let serverData  = new serverClass(POST.server)
         res.render('ajax/json', {
            data: JSON.stringify({
               "success": pathMod.join(POST.path).includes(POST.server) && pathMod.join(POST.path) !== serverData.getConfig().path
                  ? globalUtil.safeFileSaveSync([POST.path], POST.data)
                  : false
            })
         })
         return true
      }

      // MKDir
      try {
         if(
            typeof POST.server    !== "undefined" &&
            typeof POST.path      !== "undefined" &&
            typeof POST.MKDir     !== "undefined"
         ) if(userHelper.hasPermissions(req.session.uid,`filebrowser/createFolder`, POST.server)) {
            let serverData  = new serverClass(POST.server)
            res.render('ajax/json', {
               data: JSON.stringify({
                  "success": pathMod.join(POST.path).includes(POST.server) && pathMod.join(POST.path) !== serverData.getConfig().path
                     ? fs.existsSync(pathMod.join(POST.path)) ? false : globalUtil.safeFileMkdirSync([POST.path])
                     : false
               })
            })
            return true
         }
      }
      catch (e) {
         if(debug) console.log(e)
      }

      // Move & rename
      try {
         if(
            typeof POST.server         !== "undefined" &&
            typeof POST.oldPath        !== "undefined" &&
            typeof POST.newPath        !== "undefined" &&
            typeof POST.action         !== "undefined" &&
            typeof POST.isFile         !== "undefined" &&
            typeof POST.moveandrename  !== "undefined"
         ) if(
            (
               userHelper.hasPermissions(req.session.uid,`filebrowser/renameFolder`, POST.server) ||
               userHelper.hasPermissions(req.session.uid,`filebrowser/moveFolder`, POST.server)
            ) && (
               POST.action === "move" ||
               POST.action === "rename"
            )
         ) {
            let newTotalPath  = POST.newPath.split("/")
            let isRename      = POST.oldPath.split("/").pop() !== newTotalPath.pop() || POST.action === "rename"

            let hasPerm       = isRename
               ? userHelper.hasPermissions(req.session.uid,`filebrowser/renameFolder`, POST.server)
               : userHelper.hasPermissions(req.session.uid,`filebrowser/moveFolder`, POST.server)


            if(hasPerm) {
               let validateNew
               let success

               if(POST.isFile) {
                  validateNew = isRename
                     ? fs.existsSync(pathMod.join(POST.oldPath)) && !fs.existsSync(pathMod.join(POST.newPath))
                     : fs.existsSync(pathMod.join(POST.oldPath)) && !fs.existsSync(pathMod.join(POST.newPath))
                  success     = pathMod.join(POST.oldPath).includes(POST.server) && pathMod.join(POST.newPath).includes(POST.server)
                     ? validateNew
                        ? globalUtil.safeFileRenameSync([POST.oldPath], [POST.newPath])
                        : false
                     : false
               }
               else {
                  validateNew = fs.existsSync(pathMod.join(POST.oldPath)) && !fs.existsSync(pathMod.join(POST.newPath))
                  success  = pathMod.join(POST.oldPath).includes(POST.server) && pathMod.join(POST.newPath).includes(POST.server)
                     ? validateNew
                        ? globalUtil.safeFileRenameSync([POST.oldPath], [POST.newPath])
                        : false
                     : false
               }

               res.render('ajax/json', {
                  data: JSON.stringify({
                     "success": success
                  })
               })
               return true
            }
         }
      }
      catch (e) {
         if(debug) console.log(e)
      }

      // MKDir
      try {
         if(
            typeof POST.server    !== "undefined" &&
            typeof POST.path      !== "undefined" &&
            typeof POST.MKDir     !== "undefined"
         ) if(userHelper.hasPermissions(req.session.uid,`filebrowser/createFolder`, POST.server)) {
            let serverData  = new serverClass(POST.server)
            res.render('ajax/json', {
               data: JSON.stringify({
                  "success": pathMod.join(POST.path).includes(POST.server) && pathMod.join(POST.path) !== serverData.getConfig().path
                     ? fs.existsSync(pathMod.join(POST.path)) ? false : globalUtil.safeFileMkdirSync([POST.path])
                     : false
               })
            })
            return true
         }
      }
      catch (e) {
         if(debug) console.log(e)
      }

      res.render('ajax/json', {
         data: `{"request":"failed"}`
      })
      return true
   })

   .get((req,res)=>{
      let GET         = req.query

      // Ordnerliste
      if(
         typeof GET.getList  !== "undefined" &&
         typeof GET.server   !== "undefined" &&
         typeof GET.path     !== "undefined"
      ) if(userHelper.hasPermissions(req.session.uid,`filebrowser/show`, GET.server)) {
         res.render('ajax/json', {
            data: pathMod.join(GET.path).includes(GET.server) ? JSON.stringify(globalUtil.safeFileReadDirSync([GET.path])) : false
         })
         return true
      }

      // Ordnerrecliste
      if(
         typeof GET.getDirList   !== "undefined" &&
         typeof GET.server       !== "undefined"
      ) if(userHelper.hasPermissions(req.session.uid,`filebrowser/show`, GET.server)) {
         let serverData  = new serverClass(GET.server)
         res.render('ajax/json', {
            data: JSON.stringify(globalUtil.safeFileReadAllDirsWithoutFilesSync([serverData.getConfig().path]))
         })
         return true
      }

      // getFile
      if(
         typeof GET.getFile      !== "undefined" &&
         typeof GET.server       !== "undefined" &&
         typeof GET.file         !== "undefined"
      ) if((userHelper.hasPermissions(req.session.uid,`filebrowser/editFiles`, GET.server) || userHelper.hasPermissions(req.session.uid,`filebrowser/showFiles`, GET.server)) && GET.file.includes(GET.server)) {
         res.render('ajax/json', {
            data: globalUtil.safeFileReadSync([GET.file])
         })
         return true
      }

      res.render('ajax/json', {
         data: `{"request":"failed"}`
      })
      return true
   })

module.exports = router;