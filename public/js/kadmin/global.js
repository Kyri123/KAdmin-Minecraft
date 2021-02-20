/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"
let old_state = {}

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
        return `<div class="p-1 pl-2 pr-3 list-group-item border-left-0 bg-dark"><i class="fas fa-spinner fa-pulse" aria-hidden="true"></i> ${globalvars.lang_arr.all.loading}</div>`
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
        return `<div class="p-1 pl-2 pr-3 list-group-item border-left-0 text-danger bg-dark"><i class="fas fa-times" aria-hidden="true"></i> ${globalvars.lang_arr.all.failed}</div>`
}

// hole Serverliste zyklisch
getServerList()
getTraffic()
setInterval(() => {
    getServerList()
    getTraffic()
},2000)

/**
 * Update Traffic vom Server
 */
function getTraffic() {
    $.get('/json/serverInfos/auslastung.json', (data) => {
        if (hasPermissions(globalvars.perm, "all/show_traffic")) {

            // CPU
            $('#cpu').html(`${data.cpu} <small>%</small>`)
            $('#cpu_perc').css('width', `${data.cpu}%`)

            // Speicher
            $('#mem').html(`${data.mem_availble} / ${data.mem_total}`)
            $('#mem_perc').css('width', `${data.mem}%`)

            // RAM
            $('#ram').html(`${data.ram_availble} / ${data.ram_total}`)
            $('#ram_perc').css('width', `${data.ram}%`)
        }
    })
}

/**
 * hole Serverliste für Navigation oben
 */
function getServerList() {
    let servercount_on = 0
    $.get('/ajax/serverCenterAny', {
        "getglobalinfos": true
    }, (data) => {
        let newServerList = ``
        data = JSON.parse(data)

        data.servers_arr.forEach((val, key) => {
            if (hasPermissions(globalvars.perm, "all/show_traffic")) {
                // Server
                $('#top_on').html(data.servercounter.on)
                $('#top_off').html(data.servercounter.off)
                $('#top_proc').html(data.servercounter.proc)
                $('#top_total').html(data.servercounter.total)
                $('#top_perc').css('width', `${data.servercounter.on / data.servercounter.total * 100}%`)
            }

            let stateColor                                       = "danger"
            if(!val[1].is_installed)                  stateColor = "warning"
            if(val[1].pid !== 0 && !val[1].online)    stateColor = "primary"
            if(val[1].pid !== 0 && val[1].online)     stateColor = "success"
            if(val[1].is_installing)                  stateColor = "info"

            if(old_state[val[0]] === undefined) old_state[val[0]] = stateColor
            if(old_state[val[0]] !== stateColor) {
                fireToast(stateColor, "info", 10000, {
                    replace: [
                        ["{server}"],
                        [val[1].selfname]
                    ]
                })
                old_state[val[0]] = stateColor
            }

            if(val[1].server === undefined && hasPermissions(globalvars.perm, "show", val[0])) newServerList += `
                <a href="/servercenter/${val[0]}/home" class="dropdown-item">
                    <i class="fas fa-server mr-2"></i> ${val[1].selfname.substring(0,22)}${val[1].selfname.length > 22 ? "..." : ""}
                    <span class="float-right text-sm text-${stateColor}"><b>${val[1].aplayers}</b>/<b>${val[1].players}</b></span>
                </a>
                <div class="dropdown-divider"></div>
            `

            if(hasPermissions(globalvars.perm, "show", val[0]) && val[1].online) servercount_on++
            $('#serverbadge').html(servercount_on)
        })
        $('#serverlist').html(newServerList)
    })
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
