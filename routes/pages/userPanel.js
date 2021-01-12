/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const express       = require('express')
const router        = express.Router()
const globalinfos   = require('./../../app/src/global_infos');
const userHelper   = require('./../../app/src/sessions/helper');

router.route('/')

   .all((req,res)=>{
       global.user     = userHelper.getinfos(req.session.uid)
       let GET         = req.query
       let POST        = req.body;
       let response    = "";
       let cookies     = req.cookies;
       let langStr     = (cookies.lang !== undefined) ?
          fs.existsSync(pathMod.join(mainDirWeb, "lang", cookies.lang)) ?
             cookies.lang : "de_de"
          : "de_de";
       let lang         = LANG[langStr];

       if(!userHelper.hasPermissions(req.session.uid, "userpanel/show")) {
          res.redirect("/401")
          return true
       }

       let topBtn = ''
      if(userHelper.hasPermissions(req.session.uid, "userpanel/show_codes")) topBtn =
         `<div class="d-sm-inline-block">
               <a href="#" class="btn btn-outline-success btn-icon-split rounded-0" data-toggle="modal" data-target="#addserver">
                   <span class="icon">
                       <i class="fas fa-plus" aria-hidden="true"></i>
                   </span>
               </a>
           </div>`

      res.render('pages/userpanel', {
         lang            : lang,
         page            : "userpanel",
         userID          : req.session.uid,
         perm            : userHelper.permissions(req.session.uid),
         response        : response,
         sinfos          : globalinfos.get(),
         topBtn          : topBtn,
         groups          : globalUtil.safeSendSQLSync('SELECT * FROM `user_group` ORDER BY `id`')
      })
   })

module.exports = router