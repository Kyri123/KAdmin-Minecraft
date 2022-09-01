/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSizeSync = exports.convertObject = exports.convertArray = exports.safeFileReadAllDirsWithoutFilesSync = exports.safeFileReadDirSync = exports.safeFileRenameSync = exports.safeFileReadSync = exports.safeFileCreateSync = exports.safeFileSaveSync = exports.safeFileMkdirSync = exports.safeFileRmSync = exports.checkValidatePath = exports.safeFileExsistsSync = exports.poisonNull = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const Math_1 = require("./Math");
/**
 * Prüft string auf unzulässige Zeichen (Pfad)
 * @param {string[]|string} paths Pfade
 * @return {boolean|array}
 */
function poisonNull(paths) {
    let bool = true;
    if (Array.isArray(paths)) {
        paths.forEach((val) => {
            if (val.indexOf('\0') !== -1)
                bool = false;
        });
    }
    else {
        bool = paths.indexOf('\0') === -1;
    }
    return bool;
}
exports.poisonNull = poisonNull;
/**
 * Gibt aus ob eine Datei exsistiert
 * @param {string[]} paths Pfade zur Datei
 * @return {boolean}
 */
function safeFileExsistsSync(paths) {
    // Prüfe Pfad
    if (poisonNull(paths)) {
        // Lege Pfad fest
        let filePath = path_1.default.join(...paths);
        if (checkValidatePath(filePath) === true) {
            return (0, fs_1.existsSync)(filePath);
        }
    }
    return false;
}
exports.safeFileExsistsSync = safeFileExsistsSync;
/**
 * Prüfe ob der Pfad erlaubt ist
 * @param {string} path Pfad der Geprüft werden soll
 * @return {boolean}
 */
function checkValidatePath(path) {
    return ((path.indexOf(CONFIG.app.servRoot) !== -1
        || path.indexOf(CONFIG.app.logRoot) !== -1
        || path.indexOf(CONFIG.app.pathBackup) !== -1
        || path.indexOf(`${mainDir}/public`) !== -1
        || path.indexOf(`${mainDir}/lang`) !== -1
        || path.indexOf(`${mainDir}/app/json`) !== -1
        || path.indexOf(`${mainDir}/app/data`) !== -1
        || path.indexOf(`${mainDir}/app/cmd`) !== -1
        || path.indexOf(`${mainDir}/app/config`) !== -1)
        && path.indexOf(`${mainDir}/app/config/mysql.json`) === -1);
}
exports.checkValidatePath = checkValidatePath;
/**
 * Entfernt eine Datei
 * @param {string[]} paths Pfade zur Datei
 * @return {boolean}
 */
function safeFileRmSync(paths) {
    // Prüfe Pfad
    if (poisonNull(paths)) {
        // Lege Pfad fest
        let filePath = path_1.default.join(...paths);
        // Datei Speichern
        try {
            if ((0, fs_1.existsSync)(filePath))
                (0, fs_1.rmSync)(filePath, { recursive: true });
            return true;
        }
        catch (e) {
            if (debug)
                console.log('[DEBUG_FAILED]', e);
        }
    }
    return false;
}
exports.safeFileRmSync = safeFileRmSync;
/**
 * Erstellt ein OrdnerPfad
 * @param {string[]} paths Pfade zur Datei
 * @return {boolean}
 */
function safeFileMkdirSync(paths) {
    // Prüfe Pfad
    if (poisonNull(paths)) {
        // Lege Pfad fest
        let filePath = path_1.default.join(...paths);
        if (checkValidatePath(filePath) === true) {
            // Datei Speichern
            try {
                (0, fs_1.mkdirSync)(filePath, { recursive: true });
                return (0, fs_1.existsSync)(filePath);
            }
            catch (e) {
                if (debug)
                    console.log('[DEBUG_FAILED]', e);
            }
        }
    }
    return false;
}
exports.safeFileMkdirSync = safeFileMkdirSync;
/**
 * Speichert sicher eine Datei
 * @param {string[]} paths Pfade zur Datei
 * @param {string} data Daten die Gespeichert werden sollen
 * @param {string} codierung File Codierung (Standart: utf-8)
 * @return {boolean}
 */
function safeFileSaveSync(paths, data, Encoding = 'utf8') {
    // Prüfe Pfad
    if (poisonNull(paths)) {
        // Lege Pfad fest
        let filePath = path_1.default.join(...paths);
        if (checkValidatePath(filePath) === true) {
            // Datei Speichern
            try {
                if (!(0, fs_1.existsSync)(path_1.default.dirname(filePath)))
                    (0, fs_1.mkdirSync)(path_1.default.dirname(filePath), { recursive: true });
                (0, fs_1.writeFileSync)(filePath, data, { encoding: Encoding });
                return true;
            }
            catch (e) {
                if (debug)
                    console.log('[DEBUG_FAILED]', e);
            }
        }
    }
    return false;
}
exports.safeFileSaveSync = safeFileSaveSync;
/**
 * Speichert sicher eine Datei
 * @param {string[]} paths Pfade zur Datei
 * @param {string} data Daten die Gespeichert werden sollen
 * @param {string} codierung File Codierung (Standart: utf-8)
 * @return {boolean}
 */
function safeFileCreateSync(paths, data = "", Encoding = 'utf8') {
    // Prüfe Pfad
    if (poisonNull(paths)) {
        // Lege Pfad fest
        let filePath = path_1.default.join(...paths);
        // Datei Speichern und Prüfen
        if (checkValidatePath(filePath) === true)
            if (!(0, fs_1.existsSync)(filePath))
                return safeFileSaveSync([filePath], data, Encoding);
    }
    return false;
}
exports.safeFileCreateSync = safeFileCreateSync;
/**
 * Speichert sicher eine Datei
 * @param {string[]} paths Pfade zur Datei
 * @param {boolean} json soll die Datei direkt zur JSON umgewandelt werden?
 * @param {string} codierung File Codierung (Standart: utf-8)
 * @return {boolean}
 */
function safeFileReadSync(paths, json = false, codierung = 'utf8') {
    // Prüfe Pfad
    if (poisonNull(paths)) {
        // Lege Pfad fest
        let filePath = path_1.default.join(...paths);
        if (checkValidatePath(filePath) === true && (0, fs_1.existsSync)(filePath)) {
            // Datei Speichern
            try {
                return json ? JSON.parse((0, fs_1.readFileSync)(filePath, codierung)) : (0, fs_1.readFileSync)(filePath, codierung);
            }
            catch (e) {
                if (debug)
                    console.log('[DEBUG_FAILED]', e);
            }
        }
    }
    return false;
}
exports.safeFileReadSync = safeFileReadSync;
/**
 * umbenennen/verschieben eines Ordner oder einer Datei
 * @param {string[]} paths Pfade zur Datei
 * @param {string[]} newpaths neue Pfade zur Datei
 * @return {boolean}
 */
function safeFileRenameSync(paths, newpaths) {
    // Prüfe Pfad
    if (poisonNull(paths) && poisonNull(newpaths)) {
        // Lege Pfad fest
        let filePath = path_1.default.join(...paths);
        let filePathNew = path_1.default.join(...newpaths);
        if (checkValidatePath(filePath) === true && (0, fs_1.existsSync)(filePath) && checkValidatePath(filePathNew)) {
            // Datei Speichern
            try {
                (0, fs_1.renameSync)(filePath, filePathNew);
                return true;
            }
            catch (e) {
                if (debug)
                    console.log('[DEBUG_FAILED]', e);
            }
        }
    }
    return false;
}
exports.safeFileRenameSync = safeFileRenameSync;
/**
 * Liest ein Verzeichnis aus
 * @param {string[]} paths Pfade zur Datei
 * @return {boolean|array}
 */
function safeFileReadDirSync(paths) {
    // Prüfe Pfad
    if (poisonNull(paths)) {
        // Lege Pfad fest
        let filePath = path_1.default.join(...paths);
        if (checkValidatePath(filePath) &&
            (0, fs_1.existsSync)(filePath)) {
            try {
                let dir = (0, fs_1.readdirSync)(filePath, { withFileTypes: true });
                let dirArray = [];
                dir.forEach(item => {
                    let fileName = item.name;
                    let fileExt = item.isFile() ? "." + fileName.split(".")[(fileName.split(".").length - 1)] : false;
                    if (fileExt) {
                        let namePure = item.isFile() ? fileName.replace(fileExt, "") : fileName;
                        let tPath = path_1.default.join(filePath, item.name);
                        dirArray.push({
                            "name": fileName,
                            "namePure": namePure,
                            "FileExt": item.isFile() ? "." + item.name.split(".")[(item.name.split(".").length - 1)] : false,
                            "totalPath": tPath,
                            "isDir": item.isDirectory(),
                            "isFile": item.isFile(),
                            "size": getSizeSync([tPath]),
                            "sizebit": getSizeSync([tPath], true)
                        });
                    }
                });
                return dirArray;
            }
            catch (e) {
                if (debug)
                    console.log('[DEBUG_FAILED]', e);
            }
        }
    }
    return false;
}
exports.safeFileReadDirSync = safeFileReadDirSync;
/**
 * Liest alle Ordner aus einem Verzeichnis
 * @param {string[]} paths Pfade zur Datei
 * @return {boolean|array}
 */
function safeFileReadAllDirsWithoutFilesSync(paths) {
    // Prüfe Pfad
    if (poisonNull(paths)) {
        // Lege Pfad fest
        let filePath = path_1.default.join(...paths);
        if (checkValidatePath(filePath) === true &&
            (0, fs_1.existsSync)(filePath)) {
            try {
                let RecursiveRead = function (FilePath, arr = []) {
                    let files = (0, fs_1.readdirSync)(FilePath);
                    for (const File of files) {
                        if ((0, fs_1.statSync)(path_1.default + "/" + File).isDirectory()) {
                            arr.push(path_1.default.join(FilePath, File));
                            RecursiveRead(path_1.default + "/" + File, arr);
                        }
                    }
                    return arr;
                };
                return RecursiveRead(filePath);
            }
            catch (e) {
                if (debug)
                    console.log('[DEBUG_FAILED]', e);
            }
        }
    }
    return false;
}
exports.safeFileReadAllDirsWithoutFilesSync = safeFileReadAllDirsWithoutFilesSync;
/**
 * convertiert Values in Types (Array vom POST)
 * @return {Array}
 * @param array
 */
function convertArray(array) {
    if (Array.isArray(array))
        array.forEach((key) => {
            if (Array.isArray(array[key])) {
                array[key] = convertArray(array[key]);
            }
            else if (typeof array[key] === "object") {
                array[key] = convertArray(array[key]);
            }
            else if (array[key] === 'false' || array[key] === false) {
                array[key] = false;
            }
            else if (array[key] === 'true' || array[key] === true) {
                array[key] = true;
            }
            else if (!isNaN(array[key])) {
                array[key] = parseInt(array[key], 10);
            }
        });
    return array;
}
exports.convertArray = convertArray;
/**
 * convertiert Values in Types (Object vom POST)
 * @param {Object} obj Post Array
 * @return {Object}
 */
function convertObject(obj) {
    if (typeof obj === "object")
        Object.keys(obj).forEach((key) => {
            if (Array.isArray(obj[key])) {
                obj[key] = convertArray(obj[key]);
            }
            else if (typeof obj[key] === "object") {
                obj[key] = convertObject(obj[key]);
            }
            else if (obj[key] === 'false' || obj[key] === false) {
                obj[key] = false;
            }
            else if (obj[key] === 'true' || obj[key] === true) {
                obj[key] = true;
            }
            else if (!isNaN(obj[key])) {
                obj[key] = parseInt(obj[key], 10);
            }
        });
    return obj;
}
exports.convertObject = convertObject;
/**
 * gibt die Größes einer Datei oder eines Ordners wieder
 * @param {string[]} paths Pfade zur Datei
 * @param {boolean} soll der return in Bit sein?
 * @return {string}
 */
function getSizeSync(paths, inBit = false) {
    // Prüfe Pfad
    if (poisonNull(paths)) {
        // Lege Pfad fest
        let filePath = path_1.default.join(...paths);
        if (checkValidatePath(filePath) === true &&
            (0, fs_1.existsSync)(filePath)) {
            const getAllFiles = function (dirPath, arr = []) {
                if (Array.isArray(arr)) {
                    let files = (0, fs_1.readdirSync)(dirPath);
                    files.forEach(function (file) {
                        let FilePath = path_1.default.join(dirPath + "/" + file);
                        if ((0, fs_1.statSync)(FilePath).isDirectory()) {
                            arr = getAllFiles(FilePath, arr);
                        }
                        else {
                            arr.push(path_1.default.join(FilePath, file));
                        }
                    });
                    return arr;
                }
                return [];
            };
            const getTotalSize = function (directoryPath) {
                const arrayOfFiles = getAllFiles(directoryPath);
                let totalSize = 0;
                arrayOfFiles.forEach(function (filePath) {
                    totalSize += (0, fs_1.statSync)(filePath).size;
                });
                return totalSize;
            };
            let bits = (0, fs_1.statSync)(filePath).isFile() ? (0, fs_1.statSync)(filePath).size : getTotalSize(filePath);
            return inBit ? bits : (0, Math_1.convertBytes)(bits);
        }
    }
    return (0, Math_1.convertBytes)(0);
}
exports.getSizeSync = getSizeSync;
//# sourceMappingURL=util.js.map