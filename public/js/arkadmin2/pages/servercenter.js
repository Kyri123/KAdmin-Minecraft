/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

let joinAdress = $('#btnJoin').attr('href')

// Server Status / Aktionen
getSCState()
setInterval(() => {
    getSCState()
}, 1000)

function getSCState() {
    $.get('/ajax/serverCenterAny', {
        "getserverinfos": true,
        "server": varser.cfg
    }, (data) => {
        let serverInfos = JSON.parse(data)
        console.log(serverInfos)
        let state_id = $('#state')
        let player_id = $('#player')
        let inhalt

        let stateColor                                                 = "danger"
        if(!serverInfos.is_installed)                       stateColor = "warning"
        if(serverInfos.pid !== 0 && !serverInfos.online)    stateColor = "primary"
        if(serverInfos.pid !== 0 && serverInfos.online)     stateColor = "success"
        if(serverInfos.cmd || serverInfos.steamcmd)         stateColor = "info"

        let stateText = varser.lang_arr.state[stateColor]

        //server IMG
        $('#serv_img').attr('class', `border-${stateColor}`)

        // Status
        if(state_id.html() !== stateText) state_id.html(stateText).attr('class',`description-header text-${stateColor}`)

        // Spieler
        if(stateColor === "success") {
            $('#btnJoin').attr('href', joinAdress).toggleClass("disabled", false)
            inhalt = `${serverInfos.aplayers} / ${serverInfos.players}`
            //inhalt = `<a href="#" data-toggle="modal" data-target="#playerlist_modal" class="btn btn-sm btn-primary">${serverInfos.aplayers} / ${serverInfos.players}</a>`
        }
        else {
            $('#btnJoin').attr('href', '').toggleClass("disabled", true)
            inhalt = `${serverInfos.aplayers} / ${serverInfos.players}`
        }
        if(player_id.html() !== inhalt) player_id.html(inhalt)

        // Action Card
        let css
        if(serverInfos.cmd) {
            inhalt = varser.lang_arr.serverCenterAny.actionClose
        }
        else {
            inhalt = hasPermissions(globalvars.perm, "actions", varser.cfg)
                ? `<a href="javascript:void()" class="small-box-footer btn btn-sm btn-success" data-toggle="modal" data-target="#action">${varser.lang_arr.serverCenterAny.actionFree}</a>`
                : varser.lang_arr.serverCenterAny.actionClose
        }
        css = 'success'
        if($('#actions').html() !== inhalt) $('#actions').html(inhalt).attr('class',`description-header text-${css}`);// Action Card -> Select

        // Alerts
        if(serverInfos.alerts !== undefined) {
            $.get('/json/steamAPI/mods.json', (mods) => {
                let modNeedUpdates      = []

                if(serverInfos.modNeedUpdates !== false) serverInfos.modNeedUpdates.forEach((val) => {
                    val     = parseInt(val).toString()
                    if(serverInfos.installedMods.includes(val) && !modNeedUpdates.includes(val)) modNeedUpdates.push(val)
                })

                let rplf                = []
                let tplt                = []
                mods.response.publishedfiledetails.forEach((val) => {
                    rplf.push(val.publishedfileid)
                    tplt.push(`<b>[${val.publishedfileid}]</b> ${val.title}`)
                })
                let list = []

                let counter = 0
                serverInfos.alerts.forEach((val) => {
                    if(!(val === "3997" && modNeedUpdates.length === 0)) {
                        list.push(alerter(val, "", 3, false, 3, 3, 3, true))
                        counter++
                    }
                })

                $(`#infoCounter`).html(counter)
                if(counter === 0) list.push(alerter(4000, "", 3, false, 3, 3, 3, true))

                $(`#AlertBody`).html(list.join('<hr class="m-0">')
                    .replace("{modu}", modNeedUpdates.join("</li><li>"))
                    .replace("{modi}", serverInfos.notInstalledMods.join("</li><li>"))
                    .replaceArray(rplf, tplt))
            })
        }
    })
}

$('#action').on('show.bs.modal', () => {
    // Selects
    $.get('/ajax/serverCenterAny', {
        "getserverinfos": true,
        "server": varser.cfg
    }, (data) => {
        let serverInfos = JSON.parse(data)
        $.get('/ajax/serverCenterAny', {
            "getscglobalinfos": true
        }, (datas) => {
            let sels    = JSON.parse(datas)[0].actions
            let selects = `<option value="">${varser.lang_arr.all.select_default}</option>`
            sels.forEach((val) => {
                if(!serverInfos.is_installed && val === "install") selects += `<option value="${val}">${varser.lang_arr.commands[val]}</option>`
                if(serverInfos.is_installed && val !== "install") selects += `<option value="${val}">${varser.lang_arr.commands[val]}</option>`
            })
            if($('#action_sel').html() !== selects) $('#action_sel').html(selects);// Action Card -> Select
        })
    })
})

// Sende Aktionen
$("#action_form").submit(() => {
    var valid = true

    // Ist alles OK
    if(valid) {
        $("#action_sel").toggleClass('is-invalid', false)
        $("#beta").toggleClass('is-invalid', false)

        // führe Aktion aus
        $.post(`/ajax/serverCenterAny`, $('#action_form').serialize())
            .done(function(data) {
                try {
                    data = JSON.parse(data)
                    if (data.code !== 404) {
                        $("#action_resp").html(data.msg)
                        $("#all_resp").html(data.msg)
                        $('#action').modal('hide')

                        $("#action_sel").prop('selectedIndex',0)
                        $('#actioninfo').toggleClass('d-none', true)
                        if(varser.expert) {
                            $('#custom_command').val('')
                            $("#forcethis").prop('checked', false)
                        }
                    }
                }
                catch (e) {
                    $('#action').modal('hide')
                }
            })
    }
    return false
})

$('#action_sel').change(() => {
    var action = $("#action_sel").val()
    $.get('/ajax/serverCenterAny', {
        "getscglobalinfos": true
    }, (datas) => {
        let parm    = JSON.parse(datas)[0].parameter
        let parmFormT0 = ``
        let parmFormT1 = ``
        parm.forEach((val) => {
            if(val.for.includes(action) && val.type === 0) parmFormT0 += `
            <div class="icheck-primary mb-3 col-md-6">
                <input type="checkbox" name="para[]" value="${val.parameter}" id="${val.id_js}">
                <label for="${val.id_js}">
                    ${globalvars.lang_arr.parameter[val.id_js]}
                </label>
            </div>`
        })
        parmForm = parmFormT0 + parmFormT1
        if($('#action_parm').html() !== parmForm) $('#action_parm').html(parmForm);// Action Card -> Select
    })
})

// von: https://gist.github.com/anazard/d42354f45e172519c0be3cead34fe869
// {
var $body = document.getElementsByTagName('body')[0]
var $btnCopy = document.getElementById('btnCopy')
var secretInfo = document.getElementById('secretInfo').innerHTML

var copyToClipboard = (secretInfo) => {
    var $tempInput = document.createElement('INPUT')
    $body.appendChild($tempInput)
    $tempInput.setAttribute('value', secretInfo)
    $tempInput.select()
    document.execCommand('copy')
    $body.removeChild($tempInput)
}

$btnCopy.addEventListener('click', (ev) => {
    copyToClipboard(secretInfo)
    alert("Kopiert: " + secretInfo)
})
// }
