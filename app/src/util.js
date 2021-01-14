/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

module.exports = {
    /**
     * Konvertiert Bytes in KB/MB/GB/TB
     * @param {int} bytes
     * @returns {string}
     */
    convertBytes: (bytes) => {
        let sizes = ["Bytes", "KB", "MB", "GB", "TB"]
        if (bytes === 0) return "n/a"
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
        return i === 0 ? bytes + " " + sizes[i] : (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i]
    },

    /**
     *
     * Kovertiert ACF datei von Steam zu einem Array
     * @param {string} logPath Pfad zur Datei
     * @return {Promise<array|boolean>}
     */
    toAcfToArraySync: (logPath) => {
        if(globalUtil.safeFileExsistsSync([logPath])) {
            let file     = module.exports.safeFileReadSync([logPath])
            if(file !== false) {
                let rawFile  = file.toString()
                rawFile      = rawFile
                   .replace(/\n/g, '-n-')
                   .replace(/\r/g, '')
                   .replace(/\t/g, '-t-')
                   .replace(/(.*)"376030"-n-{(.*)/, `"376030"-n-{$2`) // Ark:SE DedServer
                   .replace(/"-t--t-"/g, '":"')
                   .replace(/-n-/g, '')
                   .replace(/(.*)-t--t-}-t-}}(.*)/, '$1-t--t-}-t-}}')
                   .replace(/}"/g, '},"')
                   .replace(/"{/g, '":{')
                   .replace(/-t-/g, '')
                   .replace(/""/g, '","')
                   .replace(/}"/g, '},"')
                   .replace(/"{/g, '":{')
                   .replace(/"description":",""pwdrequired"/g, '"pwdrequired"')
                   .replace(/"description":",""timeupdated"/g, '"timeupdated"')
                   .replace(/(.*)"346110":(.*)/, `"346110":$2`) // Ark:SE DedServer
                   .replace(/(.*)"maxnumfiles":"100"}}(.*)/, `$1"maxnumfiles":"100"}}`)
                try {
                    return JSON.parse(`{${rawFile}}`)
                }
                catch (e) {
                    if(debug) console.log(e)
                }
            }
        }
        return false
    },

    /**
     * Kovertiert ACF datei von Steam zu einem Array
     * @param {string} logPath Pfad zur Datei
     * @return {Promise<array|boolean>}
     */
    toAcfToArray: async (logPath) => {
        return new Promise(resolve => {
            if(globalUtil.safeFileExsistsSync([logPath])) {
                let file     = module.exports.safeFileReadSync([logPath])
                if(file !== false) {
                    let rawFile  = file.toString()
                    rawFile      = rawFile
                       .replace(/\n/g, '-n-')
                       .replace(/\r/g, '')
                       .replace(/\t/g, '-t-')
                       .replace(/(.*)"376030"-n-{(.*)/, `"376030"-n-{$2`) // Ark:SE DedServer
                       .replace(/"-t--t-"/g, '":"')
                       .replace(/-n-/g, '')
                       .replace(/(.*)-t--t-}-t-}}(.*)/, '$1-t--t-}-t-}}')
                       .replace(/}"/g, '},"')
                       .replace(/"{/g, '":{')
                       .replace(/-t-/g, '')
                       .replace(/""/g, '","')
                       .replace(/}"/g, '},"')
                       .replace(/"{/g, '":{')
                       .replace(/"description":",""pwdrequired"/g, '"pwdrequired"')
                       .replace(/"description":",""timeupdated"/g, '"timeupdated"')
                       .replace(/(.*)"346110":(.*)/, `"346110":$2`) // Ark:SE DedServer
                       .replace(/(.*)"maxnumfiles":"100"}}(.*)/, `$1"maxnumfiles":"100"}}`)
                    try {
                        resolve(JSON.parse(`{${rawFile}}`))
                    }
                    catch (e) {
                        if(debug) console.log(e)
                    }
                }
            }
            return resolve(false)
        })
    },

    /**
     * Prüft string auf unzulässige Zeichen (Pfad)
     * @param {string|any[]} paths Pfade
     * @return {boolean|array}
     */
    poisonNull(paths) {
        let bool = true
        if(Array.isArray()) {
            paths.forEach((val) => {
               if(val.indexOf('\0') !== -1) bool = false
            })
        }
        else {
            bool = paths.indexOf('\0') === -1
        }
        return bool
    },

    /**
     * Prüfe ob der Pfad erlaubt ist
     * @param {string} path Pfad der Geprüft werden soll
     * @return {boolean}
     */
    checkValidatePath(path) {
        return (
            (
                path.indexOf(CONFIG.app.servRoot)         !== -1
                || path.indexOf(CONFIG.app.logRoot)       !== -1
                || path.indexOf(CONFIG.app.pathBackup)    !== -1
                || path.indexOf(`${mainDir}/public`)      !== -1
                || path.indexOf(`${mainDir}/lang`)        !== -1
                || path.indexOf(`${mainDir}/app/json`)    !== -1
                || path.indexOf(`${mainDir}/app/data`)    !== -1
                || path.indexOf(`${mainDir}/app/cmd`)     !== -1
                || path.indexOf(`${mainDir}/app/config`)  !== -1
            )
            && path.indexOf(`${mainDir}/app/config/mysql.json`) === -1
        )
    },

    /**
     * Entfernt eine Datei
     * @param {string[]} paths Pfade zur Datei
     * @return {boolean}
     */
    safeFileRmSync(paths) {
        // Prüfe Pfad
        if(module.exports.poisonNull(paths)) {
            // Lege Pfad fest
            let filePath        = pathMod.join(...paths)

            if(module.exports.checkValidatePath(filePath) === true) {
                // Datei Speichern
                try {
                    fs.rmSync(filePath, {recursive: true})
                    return true
                }
                catch (e) {
                    if(debug) console.log(e)
                }
            }
        }
        return false
    },

    /**
     * Erstellt ein OrdnerPfad
     * @param {string[]} paths Pfade zur Datei
     * @return {boolean}
     */
    safeFileMkdirSync(paths) {
        // Prüfe Pfad
        if(module.exports.poisonNull(paths)) {
            // Lege Pfad fest
            let filePath        = pathMod.join(...paths)

            if(module.exports.checkValidatePath(filePath) === true) {
                // Datei Speichern
                try {
                    fs.mkdirSync(filePath, {recursive: true})
                    return true
                }
                catch (e) {
                    if(debug) console.log(e)
                }
            }
        }
        return false
    },

    /**
     * Speichert sicher eine Datei
     * @param {string[]} paths Pfade zur Datei
     * @param {string} data Daten die Gespeichert werden sollen
     * @param {string} codierung File Codierung (Standart: utf-8)
     * @return {boolean}
     */
    safeFileSaveSync(paths, data, codierung = 'utf8') {
        // Prüfe Pfad
        if(module.exports.poisonNull(paths)) {
            // Lege Pfad fest
            let filePath        = pathMod.join(...paths)

            if(module.exports.checkValidatePath(filePath) === true) {
                // Datei Speichern
                try {
                    if(!fs.existsSync(pathMod.dirname(filePath))) fs.mkdirSync(pathMod.dirname(filePath), {recursive: true})
                    fs.writeFileSync(filePath, data, codierung)
                    return true
                }
                catch (e) {
                    if(debug) console.log(e); console.log(e)
                }
            }
        }
        return false
    },

    /**
     * Speichert sicher eine Datei
     * @param {string[]} paths Pfade zur Datei
     * @param {string} data Daten die Gespeichert werden sollen
     * @param {string} codierung File Codierung (Standart: utf-8)
     * @return {boolean}
     */
    safeFileCreateSync(paths, data = "", codierung = 'utf8') {
        // Prüfe Pfad
        if(module.exports.poisonNull(paths)) {
            // Lege Pfad fest
            let filePath        = pathMod.join(...paths)

            // Datei Speichern und Prüfen
            if(module.exports.checkValidatePath(filePath) === true)
                if(!module.exports.safeFileExsistsSync([filePath]))
                    return module.exports.safeFileSaveSync([filePath], data, codierung)
        }
        return false
    },

    /**
     * Gibt aus ob eine Datei exsistiert
     * @param {string[]} paths Pfade zur Datei
     * @param {boolean} json JSON.parse(this)
     * @param {string} codierung Coodierung die Benutzt werden soll
     * @return {boolean}
     */
    safeFileExsistsSync(paths, json = false, codierung = 'utf8') {
        // Prüfe Pfad
        if(module.exports.poisonNull(paths)) {
            // Lege Pfad fest
            let filePath        = pathMod.join(...paths)

            if(module.exports.checkValidatePath(filePath) === true) {
                return fs.existsSync(filePath)
            }
        }
        return false
    },

    /**
     * Speichert sicher eine Datei
     * @param {string[]} paths Pfade zur Datei
     * @param {boolean} json soll die Datei direkt zur JSON umgewandelt werden?
     * @param {string} codierung File Codierung (Standart: utf-8)
     * @return {boolean}
     */
    safeFileReadSync(paths, json = false, codierung = 'utf8') {
        // Prüfe Pfad
        if(module.exports.poisonNull(paths)) {
            // Lege Pfad fest
            let filePath        = pathMod.join(...paths)

            if(module.exports.checkValidatePath(filePath) === true && fs.existsSync(filePath)) {
                // Datei Speichern
                try {
                    return json ? JSON.parse(fs.readFileSync(filePath, codierung)) : fs.readFileSync(filePath, codierung)
                }
                catch (e) {
                    if(debug) console.log(e)
                }
            }
        }
        return false
    },

    /**
     * Speichert sicher eine Datei
     * @param {string} sql SQL abfrage
     * @return {boolean|array}
     */
    safeSendSQLSync(sql) {
        let args = [].slice.call(arguments).slice(1)

        // Variablien escape etc.
        if(args.length > 0) {
            sql = mysql.format(sql, args)
        }

        try {
            // Abfrage senden
            return synccon.query(sql)
        }
        catch (e) {
            if(debug) console.log(e)
        }
        return false
    }
}