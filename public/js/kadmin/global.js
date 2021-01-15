/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-ArkWIN/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-ArkWIN
 * *******************************************************************************************
 */
"use strict"

// hole Serverliste
getServerList()
getTraffic()
setInterval(() => {
    getServerList()
    getTraffic()
},5000)

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

function getServerList() {
    $.get('/ajax/serverCenterAny', {
        "getglobalinfos": true
    }, (data) => {
        let newServerList = ``
        data = JSON.parse(data)

        data.servers_arr.forEach((val, key) => {
            if (hasPermissions(globalvars.perm, "all/show_traffic")) {
                // Server
                $('#top_on').html(data.servercounter.on)
                $('#serverbadge').html(data.servercounter.on)
                $('#top_off').html(data.servercounter.off)
                $('#top_proc').html(data.servercounter.proc)
                $('#top_total').html(data.servercounter.total)
                $('#top_perc').css('width', `${data.servercounter.on / data.servercounter.total * 100}%`)
            }

            let stateColor                                       = "danger"
            if(!val[1].is_installed)                  stateColor = "warning"
            if(val[1].pid !== 0 && !val[1].online)    stateColor = "primary"
            if(val[1].pid !== 0 && val[1].online)     stateColor = "success"

            if(val[1].server === undefined && hasPermissions(globalvars.perm, "show", val[0])) newServerList += `
                <a href="/servercenter/${val[0]}/home" class="dropdown-item">
                    <i class="fas fa-server mr-2"></i> ${val[1].selfname.substring(0,22)}${val[1].selfname.length > 22 ? "..." : ""}
                    <span class="float-right text-sm text-${stateColor}"><b>${val[1].aplayers}</b>/<b>${val[1].players}</b></span>
                </a>
                <div class="dropdown-divider"></div>
            `
        })
        $('#serverlist').html(newServerList)
    })
}



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

