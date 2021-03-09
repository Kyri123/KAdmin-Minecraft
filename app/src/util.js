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
     * Gibt aus ob eine Datei exsistiert
     * @param {string[]} paths Pfade zur Datei
     * @return {boolean}
     */
    safeFileExsistsSync(paths) {
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

            // Datei Speichern
            try {
                if(fs.existsSync(filePath)) fs.rmSync(filePath, {recursive: true})
                return true
            }
            catch (e) {
                if(debug) console.log('[DEBUG_FAILED]', e)
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
                    return fs.existsSync(filePath)
                }
                catch (e) {
                    if(debug) console.log('[DEBUG_FAILED]', e)
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
                    if(debug) console.log('[DEBUG_FAILED]', e)
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
                if(!fs.existsSync([filePath]))
                    return module.exports.safeFileSaveSync([filePath], data, codierung)
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
                    if(debug) console.log('[DEBUG_FAILED]', e)
                }
            }
        }
        return false
    },

    /**
     * umbenennen/verschieben eines Ordner oder einer Datei
     * @param {string[]} paths Pfade zur Datei
     * @param {string[]} newpaths neue Pfade zur Datei
     * @return {boolean}
     */
    safeFileRenameSync(paths, newpaths) {
        // Prüfe Pfad
        if(module.exports.poisonNull(paths) && module.exports.poisonNull(newpaths)) {
            // Lege Pfad fest
            let filePath        = pathMod.join(...paths)
            let filePathNew     = pathMod.join(...newpaths)

            if(module.exports.checkValidatePath(filePath) === true && fs.existsSync(filePath) && module.exports.checkValidatePath(filePathNew)) {
                // Datei Speichern
                try {
                    fs.renameSync(filePath, filePathNew)
                    return true
                }
                catch (e) {
                    if(debug) console.log('[DEBUG_FAILED]', e)
                }
            }
        }
        return false
    },

    /**
     * Liest ein Verzeichnis aus
     * @param {string[]} paths Pfade zur Datei
     * @return {boolean|array}
     */
    safeFileReadDirSync(paths) {
        // Prüfe Pfad
        if(module.exports.poisonNull(paths)) {
            // Lege Pfad fest
            let filePath        = pathMod.join(...paths)

            if(
               module.exports.checkValidatePath(filePath) === true &&
               fs.existsSync(filePath)
            ) {
                try {
                    let dir       = fs.readdirSync(filePath, {withFileTypes: true})
                    let dirArray  = []
                    dir.forEach(item => {
                        let fileName        = item.name
                        let fileExt         = item.isFile() ? "." + fileName.split(".")[(fileName.split(".").length - 1)] : false
                        let namePure        = item.isFile() ? fileName.replace(fileExt, "") : fileName
                        let tPath           = pathMod.join(filePath, item.name)
                        dirArray.push({
                            "name"      : fileName,
                            "namePure"  : namePure,
                            "FileExt"   : item.isFile() ? "." + item.name.split(".")[(item.name.split(".").length - 1)] : false,
                            "totalPath" : tPath,
                            "isDir"     : item.isDirectory(),
                            "isFile"    : item.isFile(),
                            "size"      : module.exports.getSizeSync([tPath]),
                            "sizebit"   : module.exports.getSizeSync([tPath], true)
                        })
                    })
                    return dirArray
                }
                catch (e) {
                    if(debug) console.log('[DEBUG_FAILED]', e)
                }
            }
        }
        return false
    },

    /**
     * Liest alle Ordner aus einem Verzeichnis
     * @param {string[]} paths Pfade zur Datei
     * @return {boolean|array}
     */
    safeFileReadAllDirsWithoutFilesSync(paths) {
        // Prüfe Pfad
        if(module.exports.poisonNull(paths)) {
            // Lege Pfad fest
            let filePath        = pathMod.join(...paths)

            if(
               module.exports.checkValidatePath(filePath) === true &&
               fs.existsSync(filePath)
            ) {
                try {
                    let func        = (path, arr = []) => {
                        let files = fs.readdirSync(path)

                        files.forEach(function(file) {
                            if (fs.statSync(path + "/" + file).isDirectory()) {
                                arr.push(pathMod.join(path + "/" + file))
                                func(path + "/" + file, arr)
                            }
                        })

                        return arr
                    }
                    return func(filePath)
                }
                catch (e) {
                    if(debug) console.log('[DEBUG_FAILED]', e)
                }
            }
        }
        return false
    },

    /**
     * convertiert Values in Types (Array vom POST)
     * @param {Array} obj Post Array
     * @return {Array}
     */
    convertArray(array) {
        if(Array.isArray(array))
            array.forEach((key) => {
                if(Array.isArray(array[key])) {
                    array[key] = module.exports.convertArray(array[key])
                }
                else if(typeof array[key] === "object") {
                    array[key] = module.exports.convertArray(array[key])
                }
                else if(array[key] === 'false' || array[key] === false) {
                    array[key] = false
                }
                else if(array[key] === 'true' || array[key] === true) {
                    array[key] = true
                }
                else if(!isNaN(array[key])) {
                    array[key] = parseInt(array[key], 10)
                }
            })
        return array
    },

    /**
     * convertiert Values in Types (Object vom POST)
     * @param {Object} obj Post Array
     * @return {Object}
     */
    convertObject(obj) {
        if(typeof obj === "object")
            Object.keys(obj).forEach((key) => {
                if(Array.isArray(obj[key])) {
                    obj[key] = module.exports.convertArray(obj[key])
                }
                else if(typeof obj[key] === "object") {
                    obj[key] = module.exports.convertObject(obj[key])
                }
                else if(obj[key] === 'false' || obj[key] === false) {
                    obj[key] = false
                }
                else if(obj[key] === 'true' || obj[key] === true) {
                    obj[key] = true
                }
                else if(!isNaN(obj[key])) {
                    obj[key] = parseInt(obj[key], 10)
                }
            })
        return obj
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
            if(debug) console.log('[DEBUG_FAILED]', e)
        }
        return false
    },

    /**
     * gibt die Größes einer Datei oder eines Ordners wieder
     * @param {string[]} paths Pfade zur Datei
     * @param {boolean} soll der return in Bit sein?
     * @return {string}
     */
    getSizeSync(paths, inBit = false) {
        // Prüfe Pfad
        if(module.exports.poisonNull(paths)) {
            // Lege Pfad fest
            let filePath = pathMod.join(...paths)

            if (
               module.exports.checkValidatePath(filePath) === true &&
               fs.existsSync(filePath)
            ) {
                const getAllFiles = function (dirPath, arr = []) {
                    if (Array.isArray(arr)) {
                        let files = fs.readdirSync(dirPath)

                        files.forEach(function (file) {
                            let path = pathMod.join(dirPath + "/" + file)
                            if (fs.statSync(path).isDirectory()) {
                                arr = getAllFiles(path, arr)
                            } else {
                                arr.push(pathMod.join(dirPath, file))
                            }
                        })

                        return arr
                    }
                }

                const getTotalSize = function (directoryPath) {
                    const arrayOfFiles = getAllFiles(directoryPath)

                    let totalSize = 0

                    arrayOfFiles.forEach(function (filePath) {
                        totalSize += fs.statSync(filePath).size
                    })

                    return totalSize
                }

                let bits    = fs.statSync(filePath).isFile() ? fs.statSync(filePath).size : getTotalSize(filePath)
                return inBit ? bits : module.exports.convertBytes(bits)
            }
        }
    }
}