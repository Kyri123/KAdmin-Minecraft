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

    // Löschen von Dateien
    $('*[data-acceptDel="use"]').click((e) => {
        if(e.currentTarget.dataset.file !== undefined) swalWithBootstrapButtons .fire({
            icon: 'question',
            text: e.currentTarget.dataset.file,
            title: `<strong>${globalvars.lang_arr["servercenter_backups"].sweet.remove.title}</strong>`,
            showCancelButton: true,
            confirmButtonText: `<i class="far fa-trash-alt"></i>`,
            cancelButtonText: `<i class="fas fa-times"></i>`,
        }).then((result) => {
            let cancel = true
            if (result.isConfirmed) {
                $.post("/ajax/serverCenterBackups", {
                    server      : vars.cfg,
                    file        : e.currentTarget.dataset.file,
                    remove      : true
                })
                    .done((data) => {
                        try {
                            let success = JSON.parse(data).success
                            fireToast(success ? 22 : 21, success ? 'success' : 'error')
                            $('#FB_reload').click()
                        }
                        catch (e) {
                            console.log(e)
                            fireToast(21, "error")
                        }
                    })
                    .fail(() => {
                        fireToast(21, "error")
                    })
                cancel = false
            }
            if(cancel) fireToast(21, "error")
        })
    })

    // Einspielen von Backup
    $('*[data-playin="use"]').click((e) => {
        console.log(e)
        if(e.currentTarget.dataset.file !== undefined) swalWithBootstrapButtons .fire({
            icon: 'question',
            text: e.currentTarget.dataset.file,
            title: `<strong>${globalvars.lang_arr["servercenter_backups"].sweet.playin.title}</strong>`,
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-upload"></i>`,
            cancelButtonText: `<i class="fas fa-times"></i>`,
        }).then((result) => {
            let cancel = true
            if (result.isConfirmed) {
                $.post("/ajax/serverCenterBackups", {
                    server      : vars.cfg,
                    file        : e.currentTarget.dataset.file,
                    playin      : true
                })
                    .done((data) => {
                        try {
                            let success = JSON.parse(data).success
                            fireToast(success ? 24 : 23, success ? 'success' : 'error')
                        }
                        catch (e) {
                            console.log(e)
                            fireToast(23, "error")
                        }
                    })
                    .fail(() => {
                        fireToast(23, "error")
                    })
                cancel = false
            }
            if(cancel) fireToast(23, "error")
        })
    })
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

$(document).ready(() => {
    setInterval(() => $('.content-wrapper').attr("style", "min-height: 1750px"), 500)

    if(hasPermissions(globalvars.perm, "backups/upload", vars.cfg)) $('#FB_upload').click((e) => {
        swalWithBootstrapButtons.fire({
            icon: 'question',
            title: `<strong>${globalvars.lang_arr["servercenter_filebrowser"].sweet.upload.title}</strong>`,
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-file-upload"></i>`,
            cancelButtonText: `<i class="fas fa-times"></i>`,
            input: 'file',
            inputAttributes: {},
            inputValidator: (value) => {
                if (value === null)
                    return globalvars.lang_arr["servercenter_filebrowser"].sweet.upload.invalide
                if(!value.name.includes(".zip"))
                    return globalvars.lang_arr["servercenter_filebrowser"].sweet.upload.invalide
                if(!/^[0-9]+$/.test(value.name.replaceAll(".zip", "")))
                    return globalvars.lang_arr["servercenter_filebrowser"].sweet.upload.invalide
            },
            onBeforeOpen: () => {
                $(".swal2-file").change(function () {
                    let reader
                    let files = $('.swal2-file')[0].files
                    for(let i = 0; i < files.length; i++) {
                        reader = new FileReader()
                        reader.readAsDataURL($('.swal2-file')[0].files[i])
                    }
                });
            }
        }).then((file) => {
            if (file.isConfirmed) {
                if (file.value) {
                    // erstelle Form
                    let formData = new FormData()
                    let files = $('.swal2-file')[0].files
                    for(let i = 0; i < files.length; i++) {
                        formData.append("files[]", $('.swal2-file')[0].files[i])
                    }
                    formData.append("upload", true)
                    formData.append("server", vars.cfg)
                    fireToast(12, 'info')
                    // sende
                    $.ajax({
                        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                        method: 'post',
                        url: '/ajax/serverCenterBackups',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (resp) {
                            try {
                                let isSuccess = JSON.parse(resp).success
                                fireToast(isSuccess ? 3 : 2, isSuccess ? "success" : "error")
                                if(isSuccess) $('#FB_reload').click()
                            }
                            catch (e) {
                                fireToast(2, "error")
                                console.log(resp)
                            }
                        },
                        error: function() {
                            fireToast(2, 'error')
                            $('#FB_reload').click()
                        }
                    })
                }
                else {
                    fireToast(2, 'error')
                }
            }
            else {
                fireToast(2, 'error')
            }
        })
    })
})