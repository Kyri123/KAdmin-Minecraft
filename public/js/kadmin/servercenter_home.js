/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"
loadActionLog();
setInterval(() => {
    loadActionLog();
}, 5000);

function loadActionLog() {
    $.get(`/ajax/ServerCenterHome`, {
       getLogFormServer: true,
       server: vars.cfg
   })
        .done(function(data) {
            let convLog = ``;
            if(data.includes('ArkAdmin ::')) {
                let convLog = `${globalvars.lang_arr.logger.notFound}`
                $('#actionlog').html(convLog)
            }
            else {
               let log  = [];
               let i    = 0
               for(let item of data.split('\n').reverse()) {
                  if(item.trim() !== "" && item.trim() !== ">")  {
                     let color = item.includes("server overloaded") || item.includes("ERROR")
                        ? "red"
                        : item.includes("WARN")
                           ? "yellow"
                           : item.includes("Done (")
                                 ? "blue"
                                 : "green"
                     log.push(`<span class="text-${color}">${item}</span>`)
                     i++
                  }
                  if(i > 99) break
               }
               $('#actionlog').html(log.join('<br />'))
            }
        })
        .fail(function() {
            let convLog = `<tbody><tr><td>${globalvars.lang_arr.logger.notFound}</td></tr></tbody>`
           $('#actionLogs').html(convLog)
        });
}

function sendCommand() {
   let q = $('#sendCommand')
   $.post(`/ajax/ServerCenterHome`, {
      sendCommandToServer: true,
      server: vars.cfg,
      command: q.val()
   })
      .done(function(data) {
         q.val('')
         if(data === "true") {
            q.toggleClass("is-valid", true)
            q.toggleClass("is-invalid", false)
         }
         else {
            q.toggleClass("is-valid", false)
            q.toggleClass("is-invalid", true)
         }
      })
}