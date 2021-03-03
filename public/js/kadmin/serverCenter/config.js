/*
* *******************************************************************************************
* @author:  Oliver Kaufmann (Kyri123)
* @copyright Copyright (c) 2019-2020, Oliver Kaufmann
* @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
* Github: https://github.com/Kyri123/KAdmin-Minecraft
* *******************************************************************************************
*/
"use strict"
let editor = {
    "#serverprop": CodeMirror.fromTextArea(document.getElementById("serverprop"), {
        lineNumbers: true,
        mode: "javascript",
        theme: "material"
    })
}

if (hasPermissions(globalvars.perm, "confg/server", varser.cfg)) $.get('/ajax/serverCenterConfig', {
    serverInis: true,
    ini: "server",
    server: vars.cfg
}, (data) => {
    editor["#serverprop"].setValue(data)
})

/**
 * Speicher Cfg
 * @return {boolean}
 */
function saveCfg() {
    $.post('/ajax/serverCenterConfig', $('#pills-server').serialize(), (data) => {
        try {
            data = JSON.parse(data)
            fireToast(data.success ? 1 : 19, data.success ? "success" : "error")
        } catch (e) {
            console.log(e)
            fireToast(19, "error")
        }
    });
    return false;
}

/**
 * Speicher Server Konfigurationen
 * @param {string} htmlID
 * @param {string} cfg
 * @return {boolean}
 */
function serverSave(htmlID, cfg) {
    $.post('/ajax/serverCenterConfig', {
        iniText: editor[htmlID].getValue(),
        cfg: cfg,
        server: true
    }, (data) => {
        try {
            data = JSON.parse(data)
            fireToast(data.success ? 1 : 19, data.success ? "success" : "error")
        } catch (e) {
            console.log(e)
            fireToast(19, "error")
        }
    })
    return false
}