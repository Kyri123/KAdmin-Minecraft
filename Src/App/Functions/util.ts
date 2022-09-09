/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

import path from "path";
import {existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync} from "fs";
import {convertBytes} from "./Math";
import {ConfigManager} from "../Helper/ConfigManager";

/**
 * Prüft string auf unzulässige Zeichen (Pfad)
 * @param {string[]|string} paths Pfade
 * @return {boolean|array}
 */
export function poisonNull(paths: string[]|string): boolean {
    let bool = true
    if(Array.isArray(paths)) {
        paths.forEach((val) => {
            if(val.indexOf('\0') !== -1) bool = false
        })
    }
    else {
        bool = paths.indexOf('\0') === -1
    }
    return bool
}

/**
 * Gibt aus ob eine Datei exsistiert
 * @param {string[]} paths Pfade zur Datei
 * @return {boolean}
 */
export function safeFileExsistsSync(paths: string[]) {
    // Prüfe Pfad
    if(poisonNull(paths)) {
        // Lege Pfad fest
        let filePath        = path.join(...paths)

        if(checkValidatePath(filePath) === true) {
            return existsSync(filePath)
        }
    }
    return false
}

/**
 * Prüfe ob der Pfad erlaubt ist
 * @param {string} path Pfad der Geprüft werden soll
 * @return {boolean}
 */
export function checkValidatePath(path: string) {
    return (
        (
            path.indexOf(ConfigManager.GetEnvConfig.Panel_ServerRootDir)         !== -1
            || path.indexOf(ConfigManager.GetEnvConfig.Panel_LogRootDir)       !== -1
            || path.indexOf(ConfigManager.GetEnvConfig.Panel_BackupRootDir)    !== -1
            || path.indexOf(`${mainDir}/public`)      !== -1
            || path.indexOf(`${mainDir}/lang`)        !== -1
            || path.indexOf(`${mainDir}/app/json`)    !== -1
            || path.indexOf(`${mainDir}/app/data`)    !== -1
            || path.indexOf(`${mainDir}/app/cmd`)     !== -1
            || path.indexOf(`${mainDir}/app/config`)  !== -1
        )
        && path.indexOf(`${mainDir}/app/config/mysql.json`) === -1
    )
}

/**
 * Entfernt eine Datei
 * @param {string[]} paths Pfade zur Datei
 * @return {boolean}
 */
export function safeFileRmSync(paths: string[]) {
    // Prüfe Pfad
    if(poisonNull(paths)) {
        // Lege Pfad fest
        let filePath        = path.join(...paths)

        // Datei Speichern
        try {
            if(existsSync(filePath)) rmSync(filePath, {recursive: true})
            return true
        }
        catch (e) {
            if(debug) console.log('[DEBUG_FAILED]', e)
        }
    }
    return false
}

/**
 * Erstellt ein OrdnerPfad
 * @param {string[]} paths Pfade zur Datei
 * @return {boolean}
 */
export function safeFileMkdirSync(paths: string[]) {
    // Prüfe Pfad
    if(poisonNull(paths)) {
        // Lege Pfad fest
        let filePath        = path.join(...paths)

        if(checkValidatePath(filePath) === true) {
            // Datei Speichern
            try {
                mkdirSync(filePath, {recursive: true})
                return existsSync(filePath)
            }
            catch (e) {
                if(debug) console.log('[DEBUG_FAILED]', e)
            }
        }
    }
    return false
}

/**
 * Speichert sicher eine Datei
 * @param {string[]} paths Pfade zur Datei
 * @param {string} data Daten die Gespeichert werden sollen
 * @param {string} codierung File Codierung (Standart: utf-8)
 * @return {boolean}
 */
export function safeFileSaveSync(paths: string[], data:string, Encoding: BufferEncoding = 'utf8') {
    // Prüfe Pfad
    if(poisonNull(paths)) {
        // Lege Pfad fest
        let filePath        = path.join(...paths)

        if(checkValidatePath(filePath) === true) {
            // Datei Speichern
            try {
                if(!existsSync(path.dirname(filePath))) mkdirSync(path.dirname(filePath), {recursive: true})
                writeFileSync(filePath, data, {encoding: Encoding})
                return true
            }
            catch (e) {
                if(debug) console.log('[DEBUG_FAILED]', e)
            }
        }
    }
    return false
}

/**
 * Speichert sicher eine Datei
 * @param {string[]} paths Pfade zur Datei
 * @param {string} data Daten die Gespeichert werden sollen
 * @param {string} codierung File Codierung (Standart: utf-8)
 * @return {boolean}
 */
export function safeFileCreateSync(paths: string[], data: string = "", Encoding: BufferEncoding = 'utf8') {
    // Prüfe Pfad
    if(poisonNull(paths)) {
        // Lege Pfad fest
        let filePath        = path.join(...paths)

        // Datei Speichern und Prüfen
        if(checkValidatePath(filePath) === true)
            if(!existsSync(filePath))
                return safeFileSaveSync([filePath], data, Encoding)
    }
    return false
}

/**
 * Speichert sicher eine Datei
 * @param {string[]} paths Pfade zur Datei
 * @param {boolean} json soll die Datei direkt zur JSON umgewandelt werden?
 * @param {string} codierung File Codierung (Standart: utf-8)
 * @return {boolean}
 */
export function safeFileReadSync(paths: string[], json = false, codierung: BufferEncoding = 'utf8') {
    // Prüfe Pfad
    if(poisonNull(paths)) {
        // Lege Pfad fest
        let filePath        = path.join(...paths)

        if(checkValidatePath(filePath) === true && existsSync(filePath)) {
            // Datei Speichern
            try {
                return json ? JSON.parse(readFileSync(filePath, codierung)) : readFileSync(filePath, codierung)
            }
            catch (e) {
                if(debug) console.log('[DEBUG_FAILED]', e)
            }
        }
    }
    return false
}

/**
 * umbenennen/verschieben eines Ordner oder einer Datei
 * @param {string[]} paths Pfade zur Datei
 * @param {string[]} newpaths neue Pfade zur Datei
 * @return {boolean}
 */
export function safeFileRenameSync(paths: string, newpaths: string) {
    // Prüfe Pfad
    if(poisonNull(paths) && poisonNull(newpaths)) {
        // Lege Pfad fest
        let filePath        = path.join(...paths)
        let filePathNew     = path.join(...newpaths)

        if(checkValidatePath(filePath) === true && existsSync(filePath) && checkValidatePath(filePathNew)) {
            // Datei Speichern
            try {
                renameSync(filePath, filePathNew)
                return true
            }
            catch (e) {
                if(debug) console.log('[DEBUG_FAILED]', e)
            }
        }
    }
    return false
}

/**
 * Liest ein Verzeichnis aus
 * @param {string[]} paths Pfade zur Datei
 * @return {boolean|array}
 */
export function safeFileReadDirSync(paths: string[]) {
    // Prüfe Pfad
    if(poisonNull(paths)) {
        // Lege Pfad fest
        let filePath        = path.join(...paths)

        if(
            checkValidatePath(filePath) &&
            existsSync(filePath)
        ) {
            try {
                let dir                 = readdirSync(filePath, {withFileTypes: true})
                let dirArray: any[]     = []
                dir.forEach(item => {
                    let fileName        = item.name
                    let fileExt         = item.isFile() ? "." + fileName.split(".")[(fileName.split(".").length - 1)] : false
                    
                    if(fileExt) {
                        let namePure = item.isFile() ? fileName.replace(fileExt, "") : fileName
                        let tPath = path.join(filePath, item.name)
                        dirArray.push({
                            "name": fileName,
                            "namePure": namePure,
                            "FileExt": item.isFile() ? "." + item.name.split(".")[(item.name.split(".").length - 1)] : false,
                            "totalPath": tPath,
                            "isDir": item.isDirectory(),
                            "isFile": item.isFile(),
                            "size": getSizeSync([tPath]),
                            "sizebit": getSizeSync([tPath], true)
                        })
                    }
                })
                return dirArray
            }
            catch (e) {
                if(debug) console.log('[DEBUG_FAILED]', e)
            }
        }
    }
    return false
}

/**
 * Liest alle Ordner aus einem Verzeichnis
 * @param {string[]} paths Pfade zur Datei
 * @return {boolean|array}
 */
export function safeFileReadAllDirsWithoutFilesSync(paths: string[]) {
    // Prüfe Pfad
    if(poisonNull(paths)) {
        // Lege Pfad fest
        let filePath        = path.join(...paths)

        if(
            checkValidatePath(filePath) === true &&
            existsSync(filePath)
        ) {
            try {
                let RecursiveRead = function(FilePath: string, arr: string[] = []): string[] {
                    let files = readdirSync(FilePath)

                    for(const File of files) {
                        if (statSync(path + "/" + File).isDirectory()) {
                            arr.push(path.join(FilePath, File))
                            RecursiveRead(path + "/" + File, arr)
                        }
                    }

                    return arr
                }
                return RecursiveRead(filePath)
            }
            catch (e) {
                if(debug) console.log('[DEBUG_FAILED]', e)
            }
        }
    }
    return false
}

/**
 * convertiert Values in Types (Array vom POST)
 * @return {Array}
 * @param array
 */
export function convertArray(array: any[]) {
    if(Array.isArray(array))
        array.forEach((key) => {
            if(Array.isArray(array[key])) {
                array[key] = convertArray(array[key])
            }
            else if(typeof array[key] === "object") {
                array[key] = convertArray(array[key])
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
}

/**
 * convertiert Values in Types (Object vom POST)
 * @param {Object} obj Post Array
 * @return {Object}
 */
export function convertObject(obj: Record<string, any>) {
    if(typeof obj === "object")
        Object.keys(obj).forEach((key) => {
            if(Array.isArray(obj[key])) {
                obj[key] = convertArray(obj[key])
            }
            else if(typeof obj[key] === "object") {
                obj[key] = convertObject(obj[key])
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
}

/**
 * gibt die Größes einer Datei oder eines Ordners wieder
 * @param {string[]} paths Pfade zur Datei
 * @param {boolean} soll der return in Bit sein?
 * @return {string}
 */
export function getSizeSync(paths: string[], inBit = false) {
    // Prüfe Pfad
    if(poisonNull(paths)) {
        // Lege Pfad fest
        let filePath = path.join(...paths)

        if (
            checkValidatePath(filePath) === true &&
            existsSync(filePath)
        ) {
            const getAllFiles = function (dirPath: string, arr: string[] = []): string[] {
                if (Array.isArray(arr)) {
                    let files = readdirSync(dirPath)

                    files.forEach(function (file: string) {
                        let FilePath: string = path.join(dirPath + "/" + file)
                        if (statSync(FilePath).isDirectory()) {
                            arr = getAllFiles(FilePath, arr)
                        } else {
                            arr.push(path.join(FilePath, file))
                        }
                    })

                    return arr
                }
                return [];
            }

            const getTotalSize = function (directoryPath: string) {
                const arrayOfFiles = getAllFiles(directoryPath)

                let totalSize = 0

                arrayOfFiles.forEach(function (filePath) {
                    totalSize += statSync(filePath).size
                })

                return totalSize
            }

            let bits    = statSync(filePath).isFile() ? statSync(filePath).size : getTotalSize(filePath)
            return inBit ? bits : convertBytes(bits)
        }
    }
    return convertBytes(0);
}