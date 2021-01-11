/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const querystring   = require('querystring')
const http          = require('http')

module.exports = {
    /**
     * Hole modliste von SteamAPI
     * @param {array} mods CMD command
     * @returns {boolean|array}
     */
    getModList: (mods) => {
        if (Array.isArray(mods)) {
            // Post Infos
            let post_data_obj = {
                itemcount: mods.length
            }

            mods.forEach((val, key) => {
                post_data_obj[`publishedfileids[${key}]`] = val
            })

            let post_data = querystring.stringify(post_data_obj)

            // Optionen
            let options = {
                host: 'api.steampowered.com',
                port: 80,
                path: '/ISteamRemoteStorage/GetPublishedFileDetails/v1/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(post_data)
                }
            }

            let data = ''
            let req = http.request(options, (res) =>  {
                res.setEncoding('utf8')
                res.on('data', (re) => {
                    data += re
                })
            })

            req.on('error', (e) => {
                if (debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m problem with request: ` + e.message)
            })

            req.on('close', () => {
                globalUtil.safeFileSaveSync([mainDir, '/public/json/steamAPI/', 'mods.json'], data)
            })

            req.write(post_data)
            req.end()
        }
    },
}