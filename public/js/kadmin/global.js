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

// Panel Menü
const VUE_panelMenue = new Vue({
    el          : "#panel_menue",
    data        : {
        is_update : globalvars.isUpdate,
    }
})

setInterval(() => {VUE_panelMenue.is_update = globalvars.isUpdate}, 1000)

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
// Traffic
const VUE_traffic = new Vue({
    el          : "#traffics",
    data        : {
        cpu         : "",
        cpu_perc    : `0%`,
        ram         : "",
        ram_perc    : `0%`,
        mem         : "",
        mem_perc    : `0%`,
        serv_perc   : `0%`,
        serv_on     : "0",
        serv_off    : "0",
        serv_proc   : "0",
        serv_total  : "0"
    }
})

function getTraffic() {
    $.get('/json/serverInfos/auslastung.json', (data) => {
        if (hasPermissions(globalvars.perm, "all/show_traffic")) {

            // CPU
            VUE_traffic.cpu         = `${data.cpu}`
            VUE_traffic.cpu_perc    = `${data.cpu}%`

            // Speicher
            VUE_traffic.mem         = `${data.mem_availble} / ${data.mem_total}`
            VUE_traffic.mem_perc    = `${data.mem}%`

            // RAM
            VUE_traffic.ram         = `${data.ram_availble} / ${data.ram_total}`
            VUE_traffic.ram_perc    = `${data.ram}%`
        }
    })
}

// Vue Serverlist
const VUE_serverlist = new Vue({
    el      : '#serverlist',
    data    : {
        serverlist  : [],
        serverOn    : 0
    }
})

/**
 * hole Serverliste für Navigation oben
 */
function getServerList() {
    let servercount_on = 0
    $.get('/ajax/serverCenterAny', {
        "getglobalinfos": true
    }, (data) => {
        let newServerList = []
        data = JSON.parse(data)

        data.servers_arr.forEach((val, key) => {
            let server = {}
            if (hasPermissions(globalvars.perm, "all/show_traffic")) {
                // Server
                VUE_traffic.serv_on     = data.servercounter.on
                VUE_traffic.serv_off    = data.servercounter.off
                VUE_traffic.serv_proc   = data.servercounter.proc
                VUE_traffic.serv_total  = data.servercounter.total
                VUE_traffic.serv_perc   = `${data.servercounter.on / data.servercounter.total * 100}%`
            }

            let                                                              stateColor  = "danger"
            if(!val[1].is_installed)                                         stateColor  = "warning"
            if(val[1].pid !== 0 && val[1].online)                            stateColor  = "success"
            if((val[1].pid !== 0 && !val[1].online) || val[1].isAction)      stateColor  = "primary"
            if(val[1].is_installing)                                         stateColor  = "info"

            if(old_state[val[0]] === undefined) old_state[val[0]] = stateColor
            if(old_state[val[0]] !== stateColor) {
                fireToast(stateColor, "info", {
                    replace: [
                        ["{server}"],
                        [val[1].selfname]
                    ]
                })
                old_state[val[0]] = stateColor
            }

            server.name             = val[0]
            server.url              = `/servercenter/${val[0]}/home`
            server.class            = `float-right text-sm text-${stateColor}`
            server.selfname         = `${val[1].selfname.substring(0,22)}${val[1].selfname.length > 22 ? "..." : ""}`
            server.playerCountIS    = val[1].aplayers
            server.playerCountMAX   = val[1].players

            newServerList.push(server)

            /*if(val[1].server === undefined && hasPermissions(globalvars.perm, "show", val[0])) newServerList += `
            <span>
                <a href="/servercenter/${val[0]}/home" class="dropdown-item">
                    <i class="fas fa-server mr-2"></i> ${val[1].selfname.substring(0,22)}${val[1].selfname.length > 22 ? "..." : ""}
                    <span class="float-right text-sm text-${stateColor}"><b>${val[1].aplayers}</b>/<b>${val[1].players}</b></span>
                </a>
                <div class="dropdown-divider"></div>
            </span>
            `*/

            if(hasPermissions(globalvars.perm, "show", val[0]) && val[1].online) servercount_on++
        })
        VUE_serverlist.serverlist   = newServerList
        VUE_serverlist.serverOn     = servercount_on
        //$('#serverlist').html(newServerList)
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
