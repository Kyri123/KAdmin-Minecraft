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

router.route('*')
    .all((req,res)=>{
        if(userHelper.hasPermissions(req.session.uid, "show", req.baseUrl.split('/')[2])) {
            res.redirect(req.baseUrl + "/home")
            return true
        }
        else {
            res.redirect("/401")
            return true
        }
    })

module.exports = router;