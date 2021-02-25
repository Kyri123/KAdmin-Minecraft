/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const { array_replace_recursive }   = require('locutus/php/array')
const globalInfos                   = require('./../global_infos')


module.exports = {
    /**
     * Prüft ob der Benutzer exsistiert
     * @param {int|string} uid Benutzer ID
     * @returns {boolean}
     */
    user_exsists: (uid) => {
        let result = globalUtil.safeSendSQLSync('SELECT * FROM `users` WHERE `id`=?', uid)
        return result !== false ? result.length > 0 : false
    },

    /**
     * Gibt alle Infomationen über einen Benutzer wieder
     * @param {int|string} uid Benutzer ID
     * @returns {boolean|array}
     */
    getinfos: (uid) => {
        if(module.exports.user_exsists(uid)) {
            let result = globalUtil.safeSendSQLSync('SELECT * FROM `users` WHERE `id`=?', uid)
            if(result !== false) if(result.length > 0) return result[0]
        }
        return false
    },

    /**
     * Schreibt informationen in die Datenbank
     * @param {int|string} uid Benutzer ID
     * @param {string} field Feldname
     * @param {int|string} data Information
     * @returns {boolean}
     */
    writeinfos: (uid, field, data) => {
        if(module.exports.user_exsists(uid)) {
            return globalUtil.safeSendSQLSync('UPDATE users SET ?? = ? WHERE \`id\` = ?', field, data, uid) !== false
        }
        return false
    },

    /**
     * Gibt die default Permission aus
     * @returns {array}
     */
    defaultPermissions: () => {
        let permissions         = globalUtil.safeFileReadSync([mainDir, '/app/json/permissions/', 'default.json'], true)
        let servers             = globalInfos.getServerList()

        for (const [key] of Object.entries(servers)) {
            try {
                let permissions_servers = globalUtil.safeFileReadSync([mainDir, '/app/json/permissions/', 'default_server.json'], true)
                permissions.server[key] = permissions_servers
            }
            catch (e) {
                if(debug) console.log(e)
            }
        }

        return permissions
    },

    /**
     * Gibt den Permission array eines Users aus
     * @param {int} uid Benutzer ID
     * @returns {any|{id: number}}
     */
    permissions: (uid) => {
        let result      = globalUtil.safeSendSQLSync('SELECT * FROM users WHERE `id`=?', uid)
        if(result.length > 0) {
            let permissions         = globalUtil.safeFileReadSync([mainDir, '/app/json/permissions/', 'default.json'], true)
            let groups              = JSON.parse(result[0].rang)
            let servers             = globalInfos.getServerList()

            for (const [key] of Object.entries(servers)) {
                try {
                    let permissions_servers = globalUtil.safeFileReadSync([mainDir, '/app/json/permissions/', 'default_server.json'], true)
                    permissions.server[key] = permissions_servers
                }
                catch (e) {
                    if(debug) console.log(e)
                }
            }

            groups.forEach((val) => {
                let group_result = globalUtil.safeSendSQLSync('SELECT * FROM user_group WHERE `id`=?', val)
                if(group_result !== false) {
                    if(group_result.length > 0) {
                        let groups_perm = JSON.parse(group_result[0].permissions)
                        permissions = array_replace_recursive(permissions, groups_perm)
                    }
                }
            })

            return permissions
        }
        else {
            return {"id":0}
        }
    },

    /**
     * Prüft ob der Nutzer die nötigen Rechte hat
     * @param {int} uid Benutzer ID
     * @param {string} perm Pfad (format: 'xxx/xxx/...')
     * @param {string|boolean} server wenn es serverechte sind -> Servername
     * @returns {any|{id: number}}
     */
    hasPermissions: (uid, perm, server = false) => {
        let userperm = module.exports.permissions(uid)
        if(typeof userperm.id === "undefined") {
            try {
                let permarr = server !== false ? userperm.server[server] !== undefined ? userperm.server[server] : false : userperm
                if(permarr === false) return false
                if(server !== false) if(permarr["is_server_admin"] === 1) return true
                if(userperm.all["is_admin"] === 1) return true

                let bool = false
                let needPerm    = perm.includes("/") ? perm.split('/') : [perm]
                needPerm.forEach((val) => {
                    if(permarr[val] !== undefined) {
                        permarr = permarr[val]
                        if(typeof permarr !== "object" && typeof permarr === "number") bool = parseInt(permarr) === 1
                    }
                })

                return bool
            }
            catch (e) {
                if(debug) console.log(e)
            }
        }
        return false
    },

    /**
     *
     * @param {int} uid
     *
     */
    setLoginTime: (uid) => {
        let result = globalUtil.safeSendSQLSync('UPDATE users SET `lastlogin` = ? WHERE `id` = ?', Date.now(), uid)
        return result !== false
    },

    /**
     * Entfernt einen User
     * @param {int|string} uid Benutzer ID
     * @returns {*}
     */
    removeUser: (uid) => {
        let result = globalUtil.safeSendSQLSync('DELETE FROM users WHERE `id` = ?', uid)
        return result !== false
    },

    /**
     * Erzeugt einen Register Code
     * @param {int|string} rank Rang (0 === Benutzer | 1 === Admin)
     * @returns {boolean|string}
     */
    createCode: (rank) => {
        rank = parseInt(rank)
        let rnd         = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7)
        let result      = globalUtil.safeSendSQLSync('INSERT INTO reg_code (code, used, rang) VALUES (?, 0, ?)', rnd, rank)
        return result !== false ? rnd : false
    },

    /**
     * Entfernt einen Register Code
     * @param {int|string} id ID des Codes
     * @returns {*}
     */
    removeCode: (id) => {
        let result = globalUtil.safeSendSQLSync('DELETE FROM reg_code WHERE `id` = ?', id)
        return result !== false
    },
}