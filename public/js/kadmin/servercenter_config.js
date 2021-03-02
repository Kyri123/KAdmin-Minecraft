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

/*
function addToForm(type) {
    let rndID   = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 50);
    let toAdd   = `<tr id="${rndID}">
                        <td class="p-2" colspan="2">
                            <div class="input-group mb-0">
                                <input type="text" name="${type}[]" class="form-control form-control-sm">
                                <div class="input-group-append">
                                    <span onclick="$('#${rndID}').remove()" style="cursor:pointer" class="input-group-btn btn-danger pr-2 pl-2 pt-1 " id="basic-addon2"><i class="fa fa-times" aria-hidden="true"></i></span>
                                </div>
                            </div>
                        </td>
                    </tr>`;
    $(`#${type}`).after(toAdd);
}*/