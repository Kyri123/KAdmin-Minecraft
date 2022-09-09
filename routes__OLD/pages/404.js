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

router.route('/')

    .all((req,res)=>{
       let GET         = req.query
       let POST        = req.body
       let response    = ""
       let cookies     = req.cookies
       let lang         = LANG[(cookies.lang !== undefined) ?
          fs.existsSync(pathMod.join(mainDir, "lang", cookies.lang)) ?
             cookies.lang : "de_de"
          : "de_de"]

       res.render('pages/404', {
          page        : "404",
          perm        : userHelper.permissions(req.session.uid),
          response    : "",
          lang        : lang
       })
    })

module.exports = router;