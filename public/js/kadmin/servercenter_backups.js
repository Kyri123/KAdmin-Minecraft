/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"
get()
setInterval(() => {
    get()
}, 5000)

function get() {
    $.get('/ajax/serverCenterAny', {
        "getserverinfos": true,
        "server": varser.cfg
    }, (server) => {
        let serverInfos = JSON.parse(server);
        $.get('/ajax/serverCenterBackups', {
            getDir          : true,
            server          : vars.cfg
        }, (server) => {
            server  = JSON.parse(server);
            let ktime   = ``
            let ktimes  = ``

            server.forEach((val) => {
                if(val.includes(".tar.gz")) {
                    let timeStamp   = val.replace(".tar.gz", "")
                    let time        = convertTime(parseInt(timeStamp))
                    let cktime      = time.split(" ")[0]

                    if(cktime !== ktime) {
                        ktime   = cktime
                        ktimes  = timeStamp

                        // Erstelle "Ordner"
                        if($(`#lc${ktimes}`).html() === undefined) $(`#backupList`).append(`
                        <li class="list-group-item rounded-0 main p-0" id="lcm${ktimes}">
                            <div class="d-flex">
                                <div class="p-2">
                                    <i class="fa fa-folder pr-2" aria-hidden="true"></i> ${ktime}
                                </div>
                                <div class="ml-auto p-0">
                                    <button style="height: 40px" class="btn btn-primary" data-toggle="collapse" onclick="$('#lc${ktimes}').toggle('slow', () => {})">
                                        <i class="fa fa-arrow-down pr-1" aria-hidden="true"></i> <span id="lcc${ktimes}">0</span>
                                    </button>
                                    <!--<span style="height: 40px" class="btn btn-danger">
                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                    </span>-->
                                </div>
                            </div>
                        </li>
    
                        <ul style="margin-bottom: -1px; background: rgba(0, 0, 0, 0.125);display:none" id="lc${ktimes}"></ul>`)
                    }

                    // Erstelle Items
                    if($(`#${timeStamp}`).html() === undefined) $(`#lc${ktimes}`).append(`<li class="list-group-item rounded-0 p-0" id="${timeStamp}">
                                <table style="width: 100%" class="p-0">
                                    <tbody>
                                        <tr>
                                            <td rowspan="2" class="p-0 pl-2 pr-2" style="width:30px"><i class="fas fa-file-archive text-lg" aria-hidden="true"></i></td>
                                            <td class="p-0">${time}</td>
                                            <td align="right" class="p-0">
                                                <div class="d-flex justify-content-end" id="btns${timeStamp}"></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </li>`)
                    $(`#lcc${ktimes}`).html($(`#lc${ktimes} li`).length)

                    // Erstelle Buttons
                    if(
                       $(`#${timeStamp}`).html() !== undefined &&
                       $(`#btns${timeStamp}`).html() !== undefined
                    )  $(`#btns${timeStamp}`).html(
                       `${serverInfos.pid === 0 && hasPermissions(globalvars.perm, "backups/playin", varser.cfg) ? `<a href="javascript:void();" onclick="setInModal('#filepi~val~${val}', '#filepititle~htm~${time}')" class="btn btn-info btn-sm" data-toggle="modal" data-target="#playinBackup">
                            <span class="icon text-white">
                                <i class="fas fa-play" aria-hidden="true"></i>
                            </span>
                        </a>` : ""}

                        ${hasPermissions(globalvars.perm, "backups/remove", varser.cfg) ? `<a href="javascript:void();" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#removeBackup" onclick="setInModal('#fileNameRemove~val~${val}', '#removeTitle~htm~${time}')">
                            <span class="icon text-white">
                                <i class="fa fa-trash" aria-hidden="true"></i>
                            </span>
                        </a>` : ""}`
                    )

                    if($(`#lc${ktimes} li`).length === 0) $(`#lcm${ktimes}`).remove()
                }
            })
        })
    })
}

function removeFile() {
    $.post('/ajax/serverCenterBackups' , $('#removeBackup').serialize(), (data) => {
        try {
            data    = JSON.parse(data)
            if(data.alert !== undefined) $('#all_resp').append(data.alert)
            $('#removeBackup').modal('hide')
            $('.modal-backdrop').remove()


            let id = $('#fileNameRemove').val().replace('.tar.gz', '')

            $(`#${id}`).remove()
            if($(`#lc${id} li`).length === 0) {
                $(`#lcm${id}`).remove()
                $(`#lc${id}`).remove()
            }
            if($(`#lcc${id}`) !== undefined) $(`#lcc${id}`).html($(`#lc${id} li`).length)
            get()
        }
        catch (e) {
            console.log(e)
        }
    });
    return false
}


function playthisin() {
    $.post('/ajax/serverCenterBackups' , $('#playinBackup').serialize(), (data) => {
        try {
            data    = JSON.parse(data)
            if(data.alert !== undefined) $('#all_resp').append(data.alert)
            $('#playinBackup').modal('hide')
            $('.modal-backdrop').remove()
        }
        catch (e) {
            console.log(e)
        }
    });
    return false
}