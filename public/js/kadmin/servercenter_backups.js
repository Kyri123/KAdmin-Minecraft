/*
* *******************************************************************************************
* @author:  Oliver Kaufmann (Kyri123)
* @copyright Copyright (c) 2019-2020, Oliver Kaufmann
* @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
* Github: https://github.com/Kyri123/KAdmin-Minecraft
* *******************************************************************************************
*/
"use strict"

let filesFrontend   = $('#BAK_fileList')
let dirFrontend     = $('#BAK_folderList')
let curFiles        = {}

/**
 * hole Backupliste und werte aus
 */
function get() {
    filesFrontend.html(loading("FB"))
    dirFrontend.html(loading("FB", "secondary"))
    $.get('/ajax/serverCenterAny', {
        "getserverinfos": true,
        "server": varser.cfg
    }, (server) => {
        let ktime           = ``
        let ktimes          = ``
        let serverInfos     = JSON.parse(server)
        $.get('/ajax/serverCenterBackups', {
            getDir          : true,
            server          : vars.cfg
        }, (files) => {
            try {
                let fileDate    = JSON.parse(files)
                curFiles        = {}
                dirFrontend.html('')
                let latestSection = ''
                for(let file of fileDate) {
                    if(file.FileExt === ".zip") {
                        let timeStamp   = file.namePure
                        let time        = convertTime(parseInt(timeStamp))
                        let cktime      = time.split(" ")[0]

                        if(cktime !== ktime) {
                            ktime           = cktime
                            ktimes          = timeStamp
                            latestSection   = cktime

                            dirFrontend.append(`<div type="button" onClick="getSection('${cktime}')" class="p-0 pl-2 pr-1 list-group-item bg-secondary">
                                <div class="d-flex">
                                    <div class="pt-1 pb-1">
                                        <i class="fas fa-folder" aria-hidden="true"></i> 
                                        ${cktime}
                                    </div>
                                </div>
                            </div>`)
                        }

                        if(curFiles[ktime] === undefined) curFiles[ktime] = []
                        curFiles[ktime].push(`
                        <div class="p-0 pl-4 list-group-item border-left-0 bg-dark">
                            <div class="d-flex">
                                <div class="pt-1 pb-1">
                                    <i class="${icon(file.FileExt)}" aria-hidden="true"></i> 
                                    ${convertTime(parseInt(file.namePure))}
                                </div>
                                <div class="btn-group btn-group-sm ml-auto">
                                    <span class="pr-3 text-sm pt-1 pb-1"><b>${file.size !== "n/a" ? file.size.includes("Bytes") ? "~1 KB" : file.size : "~1 KB"}</b></span>
                                    <button type="button" class="rounded-0 btn btn-outline-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        ${globalvars.lang_arr["servercenter_filebrowser"].options.actions}
                                    </button>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        ${ hasPermissions(globalvars.perm, "backups/download", vars.cfg)
                                           ? `<a class="dropdown-item" href="/backup/${vars.cfg}/${file.name}" download><i class="fas fa-download"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.download}</a>` : ""
                                        }
                                        ${ hasPermissions(globalvars.perm, "backups/playin", vars.cfg)
                                           ? `<a class="dropdown-item" href="javascript:void(0)" data-playin="use" data-file="${file.name}"><i class="fas fa-upload"></i> ${globalvars.lang_arr["servercenter_backups"].modal.playin}</a>` : ""
                                        }
                                        ${ hasPermissions(globalvars.perm, "backups/remove", vars.cfg)
                                            ? `    <div class="dropdown-divider"></div>
                                                   <a class="dropdown-item text-danger" href="javascript:void(0)" data-acceptDel="use" data-file="${file.name}"><i class="far fa-trash-alt"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.remove}</a>` : ""
                                        }
                                        <!--<a class="dropdown-item text-info disabled" href="javascript:void(0)"><i class="fas fa-info-circle"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.info}</a>-->
                                    </div>
                                </div>
                            </div>
                        </div>`)
                    }
                }
                getSection(latestSection)
            }
            catch (e) {
                console.log(e)
                filesFrontend.html(failed("FB"))
                dirFrontend.html(failed("FB", "secondary"))
            }
        })
    })
}

function getSection(section) {
    filesFrontend.html(curFiles[section])
}

get()

/**
 * Sendet den Befehl eine Datei zu entfernen
 */
function removeFile() {
    let sert        = $('#removeBackup').serialize()
    let sertArray   = $('#removeBackup').serializeArray()
    // Todo: check path

    $.post('/ajax/serverCenterBackups' , sert, (data) => {
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
    })
}

/**
 * Spielt ein Backup ein
 */
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
    })
}