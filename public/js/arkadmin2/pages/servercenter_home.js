/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"
loadActionLog()
setInterval(() => {
    loadActionLog()
}, 2000)

function loadActionLog() {
    $.get(`/json/serveraction/action_${vars.cfg}.log`)
        .done(function(data) {
            let convLog = ``
            if(data.includes('ArkAdmin ::')) {
                let convLog = globalvars.lang_arr.logger.notFound
                if($('#actionLogs').html() !== convLog) $('#actionLogs').html(convLog)
            }
            else {
                $.get(`/json/steamAPI/mods.json`)
                    .done(function(json) {
                        let rplf                = []
                        let tplt                = []
                        json.response.publishedfiledetails.forEach((val) => {
                            rplf.push(val.publishedfileid)
                            tplt.push(`<b>[${val.publishedfileid}]</b> ${val.title}`)
                        })

                        let log = []
                        data.split('\n').forEach((val, key) => {
                            if(val !== "") log.push(`${val.replace("[CMD]", "<b>[CMD]</b>")}<br />`)
                        })
                        $('#actionlog').html('<tr><td class="p-2">' + log.join('</td></tr><tr><td class="p-2">')
                            .replaceArray(rplf, tplt)
                            .replace("FAILED", `<b class="text-danger">${globalvars.lang_arr.logger.FAILED}</b>`)
                            .replace("SUCCESS", `<b class="text-success">${globalvars.lang_arr.logger.SUCCESS}</b>`) + '</td></tr>')
                    })
                    .fail(function() {
                        data.split('\n').forEach((val) => {
                            if(val !== ""){
                                convLog += `${val}<br />`
                            }
                        })
                        if($('#actionlog').html() !== convLog) $('#actionlog').html(convLog)
                    })
            }
        })
        .fail(function() {
            let convLog = globalvars.lang_arr.logger.notFound
            if($('#actionLogs').html() !== convLog) $('#actionLogs').html(convLog)
        })
}