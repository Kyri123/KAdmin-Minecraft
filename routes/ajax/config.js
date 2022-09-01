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
const updater           = require("./../../app/src/background/updater")

router.route('/')

   .post((req,res) => {
      let POST        = req.body
      let sess        = req.session

      if(POST.savecfg !== undefined) {
         let mainPath            = pathMod.join(mainDir, "app/config")
         let path                = pathMod.join(mainPath, POST.cfgfile)
         let data                = convertObject(POST.cfg)
         let success, canWrite   = false
         let findDuplicates      = arr => arr.filter((item, index) => arr.indexOf(item) !== index)

         // wenn es nicht die app.json ist
         if(
            path.includes(".json") &&
            path.includes(mainPath) &&
            !path.includes("app.json")
         ) canWrite = true

         // wenn es die app.json ist
         if(
            path.includes(".json") &&
            path.includes(mainPath) &&
            path.includes("app.json")
         ) {
            let pathArray           = [
               pathMod.join(data.servRoot),
               pathMod.join(data.logRoot),
               pathMod.join(data.pathBackup)
            ]
            // prüfe ob es innerhalb des Panel ist und ob keine Pfade sich überschneiden
            if (
               pathArray[0].includes(mainDir) &&
               pathArray[1].includes(mainDir) &&
               pathArray[2].includes(mainDir) &&
               findDuplicates(pathArray).length === 0
            ) {
               try {
                  let serverDir = pathMod.join(mainDir, "app/json/server")

                  // Passe alle server An
                  fs.readdirSync(serverDir, {
                     withFileTypes: true
                  }).forEach(target => {
                     if (target.isFile()) {
                        let serverName = target.name.replace('.json', '')
                        let server = new serverClass(serverName)
                        if (server.serverExsists()) {
                           server.writeConfig("path", pathMod.join(data.servRoot, serverName))
                           server.writeConfig("pathBackup", pathMod.join(data.pathBackup, serverName))
                           server.writeConfig("pathLogs", pathMod.join(data.logRoot, serverName))
                        }
                     }
                  })
                  canWrite = true
               } catch (e) {
                  if (debug) console.log('[DEBUG_FAILED]', e)
               }
            }
         }

         // Speichern sofern erlaubt
         try {
            if(canWrite) {
               fs.writeFileSync(path, JSON.stringify(data), {
                  encoding: 'utf-8'
               })
               success = true
               global.needRestart = true
            }
         }
         catch (e) {
            if(debug) console.log('[DEBUG_FAILED]', e)
         }

         res.render('ajax/json', {
            data: JSON.stringify({success: success})
         })
         return true
      }


      res.render('ajax/json', {
         data: `{"request":"failed"}`
      })
      return true
   })

   .get((req,res) => {
   let GET         = req.query

   if(GET.fileList !== undefined) {
      try {
         let path  = pathMod.join(mainDir, "app/config")
         let scan  = fs.readdirSync(path)
         let array = []

         for(let item of scan) {
            let obj   = {}
            if(item !== "main.json" && item !== "mysql.json") {
               obj.name  = item
               obj.hash  = md5(item)
               obj.data  = JSON.parse(fs.readFileSync(pathMod.join(path, item), 'utf-8'))
               array.push(obj)
            }
         }

         res.render('ajax/json', {
            data: JSON.stringify(array)
         })
         return true
      }
      catch (e) {
        console.log(e)
      }
   }

      res.render('ajax/json', {
       data: `{"request":"failed"}`
      })
      return true
   })

module.exports = router;