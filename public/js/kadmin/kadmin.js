/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-ArkWIN/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-ArkWIN
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
        let rnd     = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7)

        return !alertform ?
            `<div class="callout callout-${color} mb-${mb} ml-${ml} mr-${mr} mt-${mt}" style="${custom_style}" id="${rnd}">
                ${closebtn ? `<button type="button" class="close" onclick="$('#${rnd}').fadeOut()"><span aria-hidden="true">&times;</span></button>` : ""}
                <h5 class="text-${color}"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i> ${title}</h5>
                ${text}
            </div>` :
            `<div class="p-${mb} p-${ml} p-${mr} p-${mt}" style="${custom_style}" id="${rnd}">
                ${closebtn ? `<button type="button" class="close" onclick="$('#${rnd}').fadeOut()"><span aria-hidden="true">&times;</span></button>` : ""}
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
            if(debug) console.log(e)
        }
    }
    return false
}



String.prototype.replaceArray = function(find, replace) {
    var replaceString = this
    var regex
    for (var i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], "g")
        replaceString = replaceString.replace(regex, replace[i])
    }
    return replaceString
};