/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

$(document).ready(function() {
    let joinAdress  = $('#btnJoin').attr('href')
    let opList      = false
    let whiteList   = false
    let banList     = {}

    // Bestätige mit Enter suche von Modpacks
    $("#lfModPackInput").keypress((event) => {
        if (event.key === "Enter") {
            event.preventDefault()
            lfModPack()
        }
    })

    // Server Status / Aktionen
    $(`#modpackinfo`).html(alerter(3900, "", 3, false, 0, 0, 3))
    getSCState()
    setInterval(() => {
        // hole OP liste
            $.get(`/serv/${vars.cfg}/whitelist.json`, (data) => {
                try {
                    whiteList = data
                }
                catch (e) {}
            })
        // hole white liste
            $.get(`/serv/${vars.cfg}/ops.json`, (data) => {
                try {
                    opList = data
                }
                catch (e) {}
            })
        // hole Ban Liste
            $.get(`/serv/${vars.cfg}/banned-players.json`, (data) => {
                try {
                    banList.players = data
                }
                catch (e) {}
            })
            $.get(`/serv/${vars.cfg}/banned-ips.json`, (data) => {
                try {
                    banList.ips = data
                }
                catch (e) {}
            })
        // SC STATE
            getSCState()
    }, 1000)

    /**
     * Erstellt Informationen über den Server und trägt die Daten ins Frontend ein
     */
    function getSCState() {
        $.get('/ajax/serverCenterAny', {
            "getserverinfos": true,
            "server": varser.cfg
        }, (data) => {
            let serverInfos     = JSON.parse(data)
            let state_id        = $('#state')
            let player_id       = $('#player')
            let inhalt

            let stateColor                                                 = "danger"
            if(!serverInfos.is_installed)                       stateColor = "warning"
            if(serverInfos.pid !== 0 && !serverInfos.online)    stateColor = "primary"
            if(serverInfos.pid !== 0 && serverInfos.online)     stateColor = "success"
            if(serverInfos.is_installing)                       stateColor = "info"

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
                $('#version').html(version)

            //server IMG
                $('#serv_img')
                   .attr('class', `border-${stateColor}`)
                   .attr('src', serverInfos.icon)

            // Status
                if(state_id.html() !== stateText) state_id.html(stateText).attr('class',`description-header text-${stateColor}`)

            // Action Card
                let css
                if(stateColor === "warning" || stateColor === "info") {
                    inhalt = varser.lang_arr.servercenter_any.actionClose
                }
                else {
                    inhalt = hasPermissions(globalvars.perm, "actions", varser.cfg)
                        ? `<a href="javascript:void()" class="small-box-footer btn btn-sm btn-success" data-toggle="modal" data-target="#action">${varser.lang_arr.servercenter_any.actionFree}</a>`
                        : varser.lang_arr.servercenter_any.actionClose
                }
                css = 'success'
                if($('#actions').html() !== inhalt) $('#actions').html(inhalt).attr('class',`description-header text-${css}`);// Action Card -> Select

            // Spielerliste
                // Button & Anzeige
                if(stateColor === "success") {
                    $('#btnJoin').attr('href', joinAdress).toggleClass("disabled", false)
                    //inhalt = `${serverInfos.aplayers} / ${serverInfos.players}`
                    inhalt = hasPermissions(globalvars.perm, "showplayers", varser.cfg)
                       ? `<a href="#" data-toggle="modal" data-target="#playerlist_modal" class="btn btn-sm btn-primary">${serverInfos.aplayers} / ${serverInfos.players}</a>`
                       : `${serverInfos.aplayers} / ${serverInfos.players}`
                }
                else {
                    $('#btnJoin').attr('href', '').toggleClass("disabled", true)
                    inhalt = `${serverInfos.aplayers} / ${serverInfos.players}`
                }
                if(player_id.html() !== inhalt) player_id.html(inhalt)

                // Liste
                let playerlist  = ""
                let i           = 0
                serverInfos.aplayersarr.sort((a, b) => (a.name < b.name) ? 1 : -1)
                for(let item of serverInfos.aplayersarr) {
                    let isOP    = "false"
                    for(let op of opList)
                        if(op.uuid === item.id) isOP = "true"
                    //if(i % 2 === 0) playerlist  += `<tr>`
                    playerlist  += `
                            <tr>
                            <td style="width: 50%">
                                <div class="media">
                                    <img src="https://crafatar.com/renders/body/${item.id}" alt="User Avatar" class="mr-3 img-circle" style="height: 60px">
                                    <div class="media-body">
                                        <h3 class="dropdown-item-title text-bold">
                                            ${item.name}
                                            <a target="_blank" href="https://de.namemc.com/profile/${item.id}" class="float-right text-sm btn btn-sm btn-outline-info"><i class="fa fa-link" aria-hidden="true"></i></a>
                                            ${hasPermissions(globalvars.perm, "sendCommands", varser.cfg) ? `
                                                <button onclick="playeraction('${item.id}', '${item.name}', 'ban')" class="float-right text-sm btn btn-sm btn-outline-danger mr-1"><i class="fas fa-lock"></i></button>
                                                <button onclick="playeraction('${item.id}', '${item.name}', 'kick')" class="float-right text-sm btn btn-sm btn-outline-danger mr-1"><i class="fa fa-times"></i></button>
                                                <button onclick="playeraction('${item.id}', '${item.name}', 'op', '${isOP}')" class="float-right text-sm btn btn-sm btn-outline-primary mr-1">${isOP === "true" ? "<i class=\"fas fa-angle-double-down\"></i>" : "<i class=\"fas fa-angle-double-up\"></i>"}</button>
                                            ` : ""}
                                        </h3>
                                        <p class="text-sm m-0"><b>OP:</b> <span class="text-${isOP === "true" ? "success" : "danger"}">${globalvars.lang_arr["servercenter_any"].playermodal[isOP]}</span></p>
                                        <p class="text-sm m-0"><b>ID:</b> ${item.id}</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `
                    //if(i % 2 !== 1 && i === (serverInfos.aplayersarr.length - 1)) playerlist  += `<td style="width: 50%"></td>`
                    //if(i % 2 === 1 || i === (serverInfos.aplayersarr.length - 1)) playerlist  += `</tr>`
                    i++
                }
                $(`#playerlist`).html(playerlist)


            // Alerts
                if(serverInfos.alerts !== undefined) {
                    let list    = []
                    let counter = 0

                    serverInfos.alerts.forEach((val) => {
                        list.push(alerter(val, "", 3, false, 3, 3, 3, true))
                        if(val !== "4000") counter++
                    })

                    $(`#infoCounter`).html(counter)
                    $(`#AlertBody`).html(list.join('<hr class="m-0">'))
                }
                else {
                    let list    = []
                    let counter = 0
                    list.push(alerter("4000", "", 3, false, 3, 3, 3, true))
                    $(`#infoCounter`).html(counter)
                    $(`#AlertBody`).html(list.join('<hr class="m-0">'))
                }
        })
    }

    // Wenn Aktion Modal geöffnet wird
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
                        $('.modal-backdrop').remove()
                    }
                })
        }
        return false
    })

    // Parameter erstellen
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
        let $body               = document.getElementsByTagName('body')[0]
        let $btnCopy            = document.getElementById('btnCopy')
        let secretInfo          = document.getElementById('secretInfo').innerHTML

        const copyToClipboard   = (secretInfo) => {
            let $tempInput      = document.createElement('INPUT')
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

    /**
     * Erstellt Versionsliste & Modpack tool
     * @param qid ID der Quelle (Select)
     */
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
            $('#installvbtn').toggle(true)
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
            $('#installvbtn').toggle(true)
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
            $('#installvbtn').toggle(false)
            $('#vloading').toggle(true)
            $('#modpackpick').toggle(true)
            $('#vloading').toggle(false)
        }
    }

    /**
     * Sucht nach eingebenen Modpack
     */
    function lfModPack() {

        let input   = $('#lfModPackInput')
        let output  = $('#modpackinfos')
        let value   = parseInt(input.val())

        output.html(`
            <tr>
                <td colspan="3" class="text-center">
                    <i class="fas fa-spinner fa-pulse"></i>
                </td>
            </tr>
        `)

        if(!isNaN(value)) {
            $.post(`/ajax/all`, {
                GETModPackInfos : true,
                ID              : value,
            }, (data) => {
                let list = ""
                try {
                    if(data !== false) {
                        input.toggleClass('is-valid')
                        let modpack    = JSON.parse(data)

                        // is modpack in Queue
                        if(modpack.error === "in_queue") {
                            output.html(`<tr><td colspan="3" class="text-center text-danger">${varser.lang_arr.servercenter_any.versionpicker.queue}</td></tr>`)
                        }
                        else {
                            // werte Modpack infos aus
                            modpack.dFiles[0].sort((a, b) => (a.fileDate < b.fileDate) ? 1 : -1)
                            for(let item of modpack.dFiles[0])
                                if(item.serverPackFileId !== null) {
                                    let datestamp   = new Date(item.fileDate)
                                    datestamp       = parseInt(datestamp.getTime())
                                    list += `
                                        <tr>
                                            <td>${item.displayName}</td>
                                            <td>${convertTime(datestamp)}</td>
                                            <td align="center">
                                                <button type="button" class="btn btn-sm btn-outline-primary" id="ibtn${item.serverPackFileId}" onclick="installModpack('${value}', '${item.serverPackFileId}', '${vars.cfg}', this.id)">
                                                    <i class="fa fa-download"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `
                                }

                            let datestamp   = new Date(modpack.dateModified)
                            let cat         = []
                            for(let item of modpack.categories) {
                                cat.push(`<a href="${item.url}" target="_blank">${item.name}</a>`)
                            }
                            output.html(`
                                    <tr>
                                        <th colspan="3">
                                        <div class="media">
                                            <img src="${modpack.attachments[0].thumbnailUrl}" alt="User Avatar" class="mr-3 img-circle" style="height: 77px">
                                            <div class="media-body">
                                                <h3 class="dropdown-item-title">
                                                    ${modpack.name}
                                                    <a target="_blank" href="${modpack.websiteUrl}" class="float-right text-sm"><i class="fa fa-link"></i></a>
                                                </h3>
                                                <p class="text-sm"><b>${varser.lang_arr.servercenter_any.versionpicker.mp_cat}:</b> ${cat.join(" - ")}</p>
                                                <p class="text-sm text-muted mb-0"><i class="far fa-clock mr-1"></i> <b>${varser.lang_arr.servercenter_any.versionpicker.mp_lastupdate}:</b> ${convertTime(datestamp)}</p>
                                            </div>
                                        </div>
                                        </th>
                                    </tr>
                                `)
                            // baue liste
                            if(list === "") {
                                output.append(`<tr><td colspan="3" class="text-center text-danger">${varser.lang_arr.servercenter_any.versionpicker.mpnoserver}</td></tr>`)
                            }
                            else {
                                output.append(list)
                            }

                        }
                    }
                    else {
                        input.toggleClass('is-invalid')
                        output.html(`<tr><td colspan="3" class="text-center text-danger">${varser.lang_arr.servercenter_any.versionpicker.mpnotfound}</td></tr>`)
                    }
                }
                catch (e) {
                    input.toggleClass('is-invalid')
                    output.html(`<tr><td colspan="3" class="text-center text-danger">${varser.lang_arr.servercenter_any.versionpicker.mpnotfound}</td></tr>`)
                    console.log(e)
                }
            })
        }
        else {
            input.toggleClass('is-invalid')
            output.html(`
                <tr>
                    <td colspan="3" class="text-center text-danger">
                        ${varser.lang_arr.servercenter_any.versionpicker.mpnotfound}
                    </td>
                </tr>
           `)
        }
    }

    /**
     * Installiert eine gewählte Version
     * @param cfg
     * @return {boolean}
     */
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
            }
            catch (e) {
                console.log(e);
            }
        })
        return false;
    }

    /**
     * Sendet den Befehl ein Modpack zu Installieren
     * @param modid
     * @param fileid
     * @param server
     * @param btnid
     */
    function installModpack(modid, fileid, server, btnid) {
        let btn     = $(`#${btnid}`)
        btn
           .attr("class", "btn btn-sm btn-outline-info")
           .html(`<i class="fas fa-spinner fa-pulse"></i>`)

        // Sende an Server
        $.post('/ajax/serverCenterAny' , {
            installModpack  : true,
            cfg             : server,
            modid           : modid,
            fileid          : fileid
        }, (data) => {
            try {
                let info    = JSON.parse(data)
                if(info.success) {
                    btn
                       .attr("class", "btn btn-sm btn-outline-success")
                       .html(`<i class="fas fa-check"></i>`)
                }
                else {
                    btn
                       .attr("class", "btn btn-sm btn-outline-danger")
                       .html(`<i class="fas fa-times"></i>`)
                }
            }
            catch (e) {
                console.log(e)
                btn
                   .attr("class", "btn btn-sm btn-outline-danger")
                   .html(`<i class="fa fa-times"></i>`)
            }
        })
    }

    /**
     * Sende Spieleraktion an den die Serverkonsole
     * @param {string} uuid
     * @param {string} name
     * @param {string} action
     * @param {string} isop
     */
    function playeraction(uuid, name, action, isop = "false") {
        let command = ""

        if(action === "op") {
            command = `${isop === "false" ? "op" : "deop"} ${name}`
        }
        else if(action === "kick") {
            command = `kick ${name}`
        }
        else if(action === "ban") {
            command = `ban ${name}`
        }

        let postObj = {
            "sendPlayerAction"  : true,
            "command"           : command,
            "server"            : vars.cfg
        }
        $.post('/ajax/serverCenterAny', postObj, (data) => {
            // done
        })
    }
})