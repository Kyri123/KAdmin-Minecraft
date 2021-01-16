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
}, 2000);

function loadActionLog() {
    $.get(`/ajax/ServerCenterHome`, {
       getLogFormServer: true,
       server: vars.cfg
   })
        .done(function(data) {
            let convLog = ``;
            if(data.includes('ArkAdmin ::')) {
                let convLog = `<tbody><tr><td>${globalvars.lang_arr.logger.notFound}</td></tr></tbody>`
                $('#actionlog').html(convLog)
            }
            else {
               let log = [];
               data.split('\n').reverse().forEach((val, key) => {
                   if(val !== "") log.push(`${val.replace("[CMD]", "<b>[CMD]</b>")}<br />`);
               });
               $('#actionlog').html('<tr><td class="p-2">' + log.join('</td></tr><tr><td class="p-2">'))
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