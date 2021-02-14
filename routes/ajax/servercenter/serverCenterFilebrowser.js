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
                  "success": pathMod.join(POST.path).includes(POST.server) && pathMod.join(POST.path) !== serverData.getINI().path
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
                  "success": pathMod.join(POST.path).includes(POST.server) && pathMod.join(POST.path) !== serverData.getINI().path
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

      res.render('ajax/json', {
         data: `{"request":"failed"}`
      })
      return true
   })

module.exports = router;