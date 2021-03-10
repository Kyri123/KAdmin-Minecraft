/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

/**
 * Wandelt Stamp in String
 * @param {int} stamp Input zeit (mit MS)
 * @param {string} format "d.m.y h:min:s.ms"
 * @return {string}
 */
function convertTime(stamp = 0, format = "d.m.y h:min") {
    // nehme jetztige Zeit wenn nichts anderes angegeben ist
    if(stamp === 0) stamp = Date.now()

    // Splite Zeitstring
    let ms = new Date(stamp).toISOString().split('.')[1].replace("Z", "")
    stamp = new Date(stamp).toISOString().split('.')[0]
    let date = stamp.split('T')[0].split('-')
    let time = stamp.split('T')[1].split(':')

    // Return & Replacer
    return format
        .replace("d", date[2])
        .replace("m", date[1])
        .replace("y", date[0])
        .replace("h", time[0])
        .replace("min", time[1])
        .replace("s", time[2])
        .replace("ms", ms)
}

/**
 * Copiert aus einem input
 * @param {string} id HTML ID (Format JQUERY '#XXX')
 */
function copythis(id) {
    var txt = document.getElementById(id)
    txt.select()
    txt.setSelectionRange(0, 99999)

    // Kopiere
    document.execCommand("copy")
}

/**
 * @param {int}     code            Code für den Alert (lang file)
 * @param {string}  custom_style    Style="XXX"
 * @param {int}     mb              Margin-Bottom
 * @param {boolean} closebtn        Soll der Schließen Button verwendet werden?
 * @param {int}     ml              Margin-Left
 * @param {int}     mr              Margin-Right
 * @param {int}     mt              Margin-Top
 * @param {boolean} alertform       FORM
 * @returns {string|undefined}      Undefined -> Code nicht vorhanden
 */
function alerter(code, custom_style = "", mb = 3, closebtn = false, ml = 0, mr = 0, mt = 0, alertform = false) {
    if(globalvars.alertlang[code] !== undefined) {
        let color   = code >= 1000 ? (code >= 2000 ? (code >= 3000 ? "info" : "warning") : "success") : "danger"
        let text    = globalvars.alertlang[code].text
        let title   = globalvars.alertlang[code].title

        return !alertform ?
            `<div class="callout callout-${color} mb-${mb} ml-${ml} mr-${mr} mt-${mt}" style="${custom_style}">
                <h5 class="text-${color}"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i> ${title}</h5>
                ${text}
            </div>` :
            `<div class="p-${mb} p-${ml} p-${mr} p-${mt}" style="${custom_style}">
                <h5 class="text-${color}"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i> ${title}</h5>
                ${text}
            </div>`
    }
    return undefined
}

/**
 * Prüft ob der Nutzer die nötigen Rechte hat
 * @param {int} permission Rechte array
 * @param {string} perm Pfad (format: 'xxx/xxx/...')
 * @param {string|boolean} server wenn es serverechte sind -> Servername
 * @return {boolean}
 */
function hasPermissions(permission ,perm, server = false) {
    let userperm = permission
    if(typeof userperm.id === "undefined") {
        try {
            let permarr = server !== false ? userperm.server[server] !== undefined ? userperm.server[server] : false : userperm
            if(permarr === false) return false

            if(server !== false) if(permarr.is_server_admin === 1) return true
            if(userperm.all.is_admin === 1) return true

            let bool        = false
            let needPerm    = perm.includes('/') ? perm.split('/') : [perm]
            needPerm.forEach((val) => {
                if(permarr[val] !== undefined) {
                    permarr = permarr[val]
                    if(typeof permarr !== "object" && typeof permarr === "number") bool = parseInt(permarr) === 1
                }
            })

            return bool
        }
        catch (e) {
            if(debug) console.log('[DEBUG_FAILED]', e)
        }
    }
    return false
}

/**
 * erstellt ein Loading
 * @param type
 * @return {string}
 */
function loading(type) {
    let args    = Object.values(arguments)
    if(type === "tr")
        return `<tr><td ${typeof args[1] !== "undefined" ? `colspan="${args[1]}"` : ""}><i class="fas fa-spinner fa-pulse"></i> <span class="pl-1">${globalvars.lang_arr.all.loading}</span></td></tr>`
    if(type === "FB")
        return `<div class="p-1 pl-2 pr-3 list-group-item border-left-0 bg-${typeof args[1] !== "undefined" ? args[1] : "dark"}"><i class="fas fa-spinner fa-pulse" aria-hidden="true"></i> ${globalvars.lang_arr.all.loading}</div>`
}
/**
 * erstellt ein Failed
 * @param type
 * @return {string}
 */
function failed(type) {
    let args    = Object.values(arguments)
    if(type === "tr")
        return `<tr><td class="text-danger" ${typeof args[1] !== "undefined" ? `colspan="${args[1]}"` : ""}><i class="fas fa-times"></i> <span class="pl-1">${globalvars.lang_arr.all.failed}</span></td></tr>`
    if(type === "FB")
        return `<div class="p-1 pl-2 pr-3 list-group-item border-left-0 text-danger bg-${typeof args[1] !== "undefined" ? args[1] : "dark"}"><i class="fas fa-times" aria-hidden="true"></i> ${globalvars.lang_arr.all.failed}</div>`
}

/**
 * setzt diverse eingaben in id
 * > Format: **#id~type~val** <br>
 * > type:
 *   - **txt** (.text(val))
 *   - **val** (.val(val))
 *   - **txt** (.html(val))
 *   - **checkbox** (.prop('checked', val === "true"))
 */
function setInModal() {
    Object.values(arguments).forEach((arg) => {
        let id      = arg.split('~')[0]
        let type    = arg.split('~')[1]
        let val     = arg.split('~')[2]

        if(type === "txt")      $(id).text(val)
        if(type === "val")      $(id).val(val)
        if(type === "htm")      $(id).html(val)
        if(type === "checkbox") $(id).prop('checked', val === "true")
    })
}

// Füge div funktionen hinzu
/**
 * Replaced von einem String den 1. string
 * @param {string[]} find Strings die ersetzt werden sollen
 * @param {string[]} replace Strings wodurch es ersetzt wird
 * @return {String}
 */
String.prototype.replaceArray = function(find, replace) {
    let replaceString = this
    let regex
    for (var i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], "g")
        replaceString = replaceString.replace(regex, replace[i])
    }
    return replaceString
}

/**
 * Replaced von einem String alles
 * @param {string[]} find Strings die ersetzt werden sollen
 * @param {string[]} replace Strings wodurch es ersetzt wird
 * @return {String}
 */
String.prototype.replaceAllArray = function (find, replace) {
    let replaceString = this
    let regex
    for (let i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], "g")
        replaceString = replaceString.replaceAll(regex, replace[i])
    }
    return replaceString
}

/**
 * sucht im String nach (Includes) als array
 * @param {string[]} find Strings die gesucht werden sollen
 * @return {String}
 */
String.prototype.includesArray = function (find) {
    for(let string of find)
        if(this.includes(string)) return true
    return false;
}

/**
 * gibt ein Datei ICON zurück
 * @param FileExt
 * @return {string}
 */
let icon = (FileExt) => {
    // Folder
    if(FileExt === false || FileExt === "false")
        return "fas fa-folder"

    // Java
    if(FileExt.includesArray([
        ".jar"
    ])) return "fab fa-java"

    // Code
    if(FileExt.includesArray([
        ".yml",
        ".json",
        ".properties",
        ".cfg",
        ".xml",
        ".recipe",
        ".zs"
    ])) return "far fa-file-code"

    // CSV
    if(FileExt.includesArray([
        ".csv"
    ])) return "fas fa-file-csv"

    // SH
    if(FileExt.includesArray([
        ".sh",
        ".cmd",
        ".bat",
        ".ps2"
    ])) return "fas fa-file-import"

    // TXT
    if(FileExt.includesArray([
        ".txt",
        ".log"
    ])) return "far fa-file-alt"

    // BAK
    if(FileExt.includesArray([
        ".bak"
    ])) return "fas fa-file-medical"

    // ZIP
    if(FileExt.includesArray([
        ".zip",
        ".tar",
        ".gz"
    ])) return "fas fa-file-archive"

    // PIC
    if(FileExt.includesArray([
        ".jpg",
        ".gif",
        ".png"
    ])) return "fas fa-file-image"

    //default
    return "fas fa-file"
}