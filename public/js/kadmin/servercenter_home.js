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
* Lade zyklisch Logs
*/
loadActionLog();
setInterval(() => {
    loadActionLog()
}, 200)

// Bestätige mit Enter Konsolenbefehle
$("#sendCommand").keypress((event) => {
   if (event.key === "Enter") {
      event.preventDefault()
      sendCommand()
   }
})

/**
 * Lade Aktionen LOG
 */
function loadActionLog() {
    $.get(`/logs/${vars.cfg}/latest.log`, {
       getLogFormServer: true,
       server: vars.cfg
   })
        .done(function(data) {
            let convLog = ``;
            if(data.includes('KAdmin-Minecraft ::')) {
                let convLog = `${globalvars.lang_arr.logger.notFound}`
                $('#actionlog').html(convLog)
            }
            else {
               let log  = [];
               let i    = 0
               for(let item of data.split('\n').reverse()) {
                  if(item.trim() !== "" && item.trim() !== ">")  {
                     let color = item.includes("server overloaded") || item.includes("/ERROR")
                        ? "red"
                        : item.includes("/WARN")
                           ? "yellow"
                           : item.includes("/INFO")
                              ? "info"
                              : item.includes("Done (")
                                 ? "blue"
                                 : "green"

                     item = JSON.stringify(item)
                     if(item[1] === ">")
                        item = item.replace("> ", "")

                     item = item
                        .replaceAll(`"`, "")
                        .replaceAll(`\\u001b`, "")
                        .replaceAll(`\\b`, "")
                        .replaceAll(`[39;0m`, "")
                        .replaceAll(`[33;1m`, "")
                        .replaceAll(`[K`, "")
                        .replaceAll(`[8D`, "")
                        .replaceAll(`\\r`, "")
                        .replaceAll(`[0;31;1m`, "")
                        .replaceAll(`[0;33;1m`, "")
                        .replaceAll(`[0;32;1m`, "")
                        .replaceAll(`[0;32;22m`, "")
                        .replaceAll(`\\tat `, "")
                        .replaceAll(`[?1000l`, "")
                        .replaceAll(`[?2004l`, "")
                        .replaceAll(`[?1h=`, "")
                        .replaceAll(`[?1l>`, "")
                        .replaceAll(`[?2004h`, "")
                        .replaceAll(`[?1l>>`, "")
                        .replaceAll(`<`, "&lt;")
                        .replaceAll(`>`, "&gt;")

                     if(item.trim() !== "" && item.trim() !== ">") {
                        log.push(`<span class="text-${color}">${item}</span>`)
                        i++
                     }
                  }
                  if(i > 199) break
               }
               $('#actionlog').html(log.join('<br />'))
            }
        })
        .fail(function() {
            let convLog = `<tbody><tr><td>${globalvars.lang_arr.logger.notFound}</td></tr></tbody>`
           $('#actionLogs').html(convLog)
        });
}

/**
 * Sende Serverbefehl
 */
function sendCommand() {
   let q = $('#sendCommand')
   let q2 = $('#sendCommandBtn')
    if(q.val() !== "") {
        $.post(`/ajax/ServerCenterHome`, {
            sendCommandToServer: true,
            server: vars.cfg,
            command: q.val()
        })
            .done(function (data) {
                q.val('')
                if (data === "true") {
                    q.toggleClass("is-valid", true)
                        .toggleClass("is-invalid", false)
                    q2
                        .toggleClass("btn-outline-light", false)
                        .toggleClass("btn-outline-danger", false)
                        .toggleClass("btn-outline-success", true)
                    fireToast(15)
                } else {
                    q
                        .toggleClass("is-valid", false)
                        .toggleClass("is-invalid", true)
                    q2
                        .toggleClass("btn-outline-light", false)
                        .toggleClass("btn-outline-danger", true)
                        .toggleClass("btn-outline-success", false)
                    fireToast(16, "error")
                }
            })
            .fail(() => {
                fireToast(16, "error")
            })
    }
    else {
        q
            .toggleClass("is-valid", false)
            .toggleClass("is-invalid", true)
        q2
            .toggleClass("btn-outline-light", false)
            .toggleClass("btn-outline-danger", true)
            .toggleClass("btn-outline-success", false)
        fireToast(16, "error")
    }
}