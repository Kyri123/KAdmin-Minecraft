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

      return false
   })

   .get((req,res)=>{
      let GET         = req.query

      if(
         typeof GET.getList  !== "undefined" &&
         typeof GET.server   !== "undefined" &&
         typeof GET.path     !== "undefined"
      ) if(userHelper.hasPermissions(req.session.uid,"filebrowser/show", GET.server)) {
         res.render('ajax/json', {
            data: pathMod.join(GET.path).includes(GET.server) ? JSON.stringify(globalUtil.safeFileReadDirSync([GET.path])) : false
         })
      }
      return false
   })

module.exports = router;