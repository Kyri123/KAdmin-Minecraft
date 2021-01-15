/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-ArkWIN/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-ArkWIN
 * *******************************************************************************************
 */
"use strict"
loadActionLog();
setInterval(() => {
    loadActionLog();
}, 2000);

function loadActionLog() {
    $.get(`/json/serveraction/action_${vars.cfg}.log`)
        .done(function(data) {
            let convLog = ``;
            if(data.includes('ArkAdmin ::')) {
                let convLog = `<tbody><tr><td>${globalvars.lang_arr.logger.notFound}</td></tr></tbody>`
                $('#actionlog').html(convLog)
            }
            else {
               let log = [];
               data.split('\n').forEach((val, key) => {
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