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
        let state_id = $('#state')
        let player_id = $('#player')
        let inhalt

        let stateColor                                                 = "danger"
        if(!serverInfos.is_installed)                       stateColor = "warning"
        if(serverInfos.pid !== 0 && !serverInfos.online)    stateColor = "primary"
        if(serverInfos.pid !== 0 && serverInfos.online)     stateColor = "success"

        let stateText = varser.lang_arr.forservers.state[stateColor]

        // Versionserfassung
        let version
        if(stateColor === "danger" || stateColor === "warning") {
            version = hasPermissions(globalvars.perm, "versionpicker", varser.cfg)
               ? `<a href="javascript:void()" class="small-box-footer btn btn-sm btn-success" data-toggle="modal" data-target="#versionpicker">${serverInfos.version}</a>`
               : serverInfos.version
        }
        else {
            version = serverInfos.version
        }
        if($('#version').html().trim().toUpperCase() !== version.trim().toUpperCase()) $('#version').html(version)

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
        if(stateColor === "warning") {
            inhalt = varser.lang_arr.servercenter_any.actionClose
        }
        else {
            inhalt = hasPermissions(globalvars.perm, "actions", varser.cfg)
                ? `<a href="javascript:void()" class="small-box-footer btn btn-sm btn-success" data-toggle="modal" data-target="#action">${varser.lang_arr.servercenter_any.actionFree}</a>`
                : varser.lang_arr.servercenter_any.actionClose
        }
        css = 'success'
        if($('#actions').html() !== inhalt) $('#actions').html(inhalt).attr('class',`description-header text-${css}`);// Action Card -> Select

        // Alerts
        /*if(serverInfos.alerts !== undefined) {
            $.get('/json/steamAPI/mods.json', (mods) => {
                let modNeedUpdates      = []
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
        }*/
    })
}

$('#action').on('show.bs.modal', () => {
    // Selects
    $.get('/json/sites/serverCenterActions.cfg.json' , (datas) => {
        let sels    = datas.actions
        let id      = "#action_sel"
        $(id).html(`<option value="">${varser.lang_arr.all.select_default}</option>`)
        sels.forEach(item => {
            $(id).append(`<option value="${item}">${varser.lang_arr.forservers.commands[item]}</option>`)
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
                        $('.modal-backdrop').remove()
                        $('.modal-backdrop').remove()

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
    $.get('/json/sites/serverCenterActions.cfg.json', (datas) => {
        let parm        = datas.parameter
        let parmFormT0  = ``
        let parmFormT1  = ``
        parm.forEach((val) => {
            if(val.for.includes(action) && val.type === 0) parmFormT0 += `
            <div class="icheck-primary mb-3 col-12">
                <input type="checkbox" name="para[]" value="${val.parameter}" id="${val.id_js}">
                <label for="${val.id_js}">
                    ${varser.lang_arr.forservers.parameter[val.id_js]}
                </label>
            </div>`
        })
        let parmForm = parmFormT0 + parmFormT1
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

function generateVersionList(qid) {
    let quelle      = $(`#${qid}`)
    let ziel        = $(`#vpick`)
    let zielList    = `<option>${globalvars.lang_arr["servercenter_any"].versionpicker.pick.pick}</option>`
    let lf          = quelle.val()
    ziel.html(zielList)

    $('#vloading').toggle(false)
    $('#versionpick').toggle(false)
    $('#modpackpick').toggle(false)

    // hole Versionsliste
    if(lf === "release" || lf === "snapshot") {
        $('#vloading').toggle(true)
        $.get('/json/serverInfos/mcVersions.json', (list) => {
            if(typeof list !== "undefined")
                for(let i in list.versions)
                    if(list.versions[i].type === lf)
                        ziel.append(`<option value="${i}">${list.versions[i].id}</option>`)
            $('#vloading').toggle(false)
            $('#versionpick').toggle(true)
        })
    }
    else if(lf === "spigot" || lf === "craftbukkit") {
        $('#vloading').toggle(true)
        $.get(`/json/serverInfos/${lf === "craftbukkit" ? 'mcVersionsCraftbukkit' : 'mcVersionsSpigot'}.json`, (list) => {
            if(typeof list !== "undefined")
                list.forEach(item => {
                    ziel.append(`<option value="${item}">${item}</option>`)
                })
            $('#vloading').toggle(false)
            $('#versionpick').toggle(true)
        })
    }

    // Modpacks
    else if(lf === "modpacks") {
        $('#vloading').toggle(true)
        $('#modpackpick').toggle(true)
        $('#vloading').toggle(false)
    }
}

function lfModPack() {

    let input   = $('#lfModPackInput')
    let output  = $('#modpackinfos')
    let value   = parseInt(input.val())

    output.html(`
        <tr>
            <td colspan="4" class="text-center">
                <i class="fas fa-spinner fa-pulse"></i>
            </td>
        </tr>
    `)

    if(!isNaN(value)) {
        $.post(`/ajax/all`, {
            GETModPackInfos : true,
            ID              : value,
        }, (data) => {
            console.log(data)
            let list = ""
            try {
                if(data !== false) {
                    input.toggleClass('is-valid')
                    let modpack    = JSON.parse(data)
                    console.log(JSON.stringify(modpack))

                    // is modpack in Queue
                    if(modpack.error === "in_queue") {
                        output.html(`
                            <tr>
                                <td colspan="4" class="text-center text-danger">
                                    ${varser.lang_arr.servercenter_any.versionpicker.queue}
                                </td>
                            </tr>
                       `)
                    }
                    else {

                        // werte Modpack infos aus
                        console.log(modpack)

                        output.html(`
                            <tr>
                                <td colspan="4" class="text-center text-danger">
                                    ${varser.lang_arr.servercenter_any.versionpicker.mpnoserver}
                                </td>
                            </tr>
                       `)

                        console.log(modpack.versions)

                        // baue liste
                        output.append(list)
                        if(list === "")
                            output.html(`
                            <tr>
                                <td colspan="4" class="text-center text-danger">
                                    ${varser.lang_arr.servercenter_any.versionpicker.mpnoserver}
                                </td>
                            </tr>
                       `)
                    }
                }
                else {
                    input.toggleClass('is-invalid')
                    output.html(`
                        <tr>
                            <td colspan="4" class="text-center text-danger">
                                ${varser.lang_arr.servercenter_any.versionpicker.mpnotfound}
                            </td>
                        </tr>
                   `)
                }
            }
            catch (e) {
                input.toggleClass('is-invalid')
                output.html(`
                    <tr>
                        <td colspan="4" class="text-center text-danger">
                            ${varser.lang_arr.servercenter_any.versionpicker.mpnotfound}
                        </td>
                    </tr>
               `)
               console.log(e)
            }
        })
    }
    else {
        input.toggleClass('is-invalid')
        output.html(`
            <tr>
                <td colspan="4" class="text-center text-danger">
                    ${varser.lang_arr.servercenter_any.versionpicker.mpnotfound}
                </td>
            </tr>
       `)
    }
}


function installVersion(cfg) {
    $.post('/ajax/serverCenterAny' , {
        installVersion  : true,
        cfg             : cfg,
        version         : $(`#vpick`).val(),
        type            : $(`#tpick`).val()
    }, (data) => {
        try {
            data    = JSON.parse(data);
            if(data.alert !== undefined) $('#all_resp').append(data.alert);
            $('#versionpicker').modal('hide')
            $('.modal-backdrop').remove()
            $('.modal-backdrop').remove()
        }
        catch (e) {
            console.log(e);
        }
    })
    return false;
}