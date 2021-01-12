/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const serverClass    = require('./../../app/src/util_server/class')

module.exports = {
    /**
     * Prüft ob der Server Exsistent ist (/XXX/:id)
     * @param req
     * @param res
     * @param next
     */
    isServerExsits: (req, res, next) => {
        let servername  = req.params.nameCONFIG
        let serverData  = new serverClass(servername)
        if(serverData.serverExsists()) {
            res.redirect("/home")
            return true
        }
        else {
            next()
        }
    }
}