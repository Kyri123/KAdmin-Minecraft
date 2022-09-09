/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

// Module
const mysql     = require("mysql")
const MySql     = require('sync-mysql')

// Lade MySQL
if(Installed) {
    if(CONFIG.mysql !== undefined) {
        let mysql_config = CONFIG.mysql

        global.con = mysql.createConnection({
            host:       mysql_config.dbhost,
            user:       mysql_config.dbuser,
            password:   mysql_config.dbpass,
            database:   mysql_config.dbbase
        })

        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m MySQL connecting...`)
        con.connect((err) => {
            if (err) {
                if(debug) console.log('[DEBUG_FAILED]', err)
                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m cannot connect to MariaDB`)
                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
                process.exit(1)
            }
        })

        global.synccon = new MySql({
            host:       mysql_config.dbhost,
            user:       mysql_config.dbuser,
            password:   mysql_config.dbpass,
            database:   mysql_config.dbbase
        })
    }
    else {
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m mysql.json not found or loaded`)
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
        process.exit(1)
    }
}