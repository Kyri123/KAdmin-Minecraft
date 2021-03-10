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

let load            = {
    text        : "Load ...",
    timeFrom    : "",
    date        : "01.01.1900",
    timeTo      : ""
}

const VUE_fileBrowserBrackups = new Vue({
    el      : '#fileBrowserBrackups',
    data    : {
        folders         : [load],
        files           : [],
        isLoading       : true,
        showSelected    : false,
        max             : vars.max !== 0 ? vars.max * 1e+6 : vars.max,
        maxis           : 0,
        maxfiles        : vars.maxfiles,
        maxfilesis      : 0
    }
})

/**
 * hole Backupliste und werte aus
 */
function get() {
    $.get('/ajax/serverCenterAny', {
        "getserverinfos": true,
        "server": varser.cfg
    }, (server) => {
        VUE_fileBrowserBrackups.files       = []
        VUE_fileBrowserBrackups.folders     = [load]
        VUE_fileBrowserBrackups.isLoading   = true
        let ktime           = ``
        let ktimes          = ``
        $.get('/ajax/serverCenterBackups', {
            getDir          : true,
            server          : vars.cfg
        }, (files) => {
            try {
                let fileDate    = JSON.parse(files)
                curFiles        = {}
                dirFrontend.html('')
                let latestSection = ''

                VUE_fileBrowserBrackups.files       = []
                VUE_fileBrowserBrackups.folders     = []
                VUE_fileBrowserBrackups.isLoading   = false

                let sizes = 0, fileCount = 0
                for(let file of fileDate) {
                    if(file.FileExt === ".zip") {
                        fileCount++
                        sizes += file.sizebit
                        let timeStamp   = file.namePure
                        let time        = convertTime(parseInt(timeStamp))
                        let cktime      = time.split(" ")[0]

                        if(cktime !== ktime) {
                            ktime           = cktime
                            ktimes          = timeStamp
                            latestSection   = cktime

                            VUE_fileBrowserBrackups.folders.push({
                               text        : cktime,
                               timeFrom    : 0,
                               date        : cktime,
                               timeTo      : 0
                           })
                        }

                        curFiles[cktime] = curFiles[cktime] === undefined ? [] : curFiles[cktime]
                        curFiles[cktime].push({
                            name        : file.name,
                            pureName    : convertTime(parseInt(file.namePure)),
                            sizeText    : file.size !== "n/a" ? file.size.includes("Bytes") ? "~1 KB" : file.size : "~1 KB",
                            icon        : icon(file.FileExt)
                        })
                    }
                }

                VUE_fileBrowserBrackups.maxfilesis  = fileCount
                VUE_fileBrowserBrackups.maxis       = sizes
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
    toggleAll(false)
    VUE_fileBrowserBrackups.files = curFiles[section]
}
get()


function playInBackup(file = undefined) {
    if(file !== undefined)
        swalWithBootstrapButtons .fire({
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
}


function removeFile(file = undefined) {
    if(file !== undefined)
        swalWithBootstrapButtons .fire({
            icon: 'question',
            text: file,
            title: `<strong>${globalvars.lang_arr["servercenter_backups"].sweet.remove.title}</strong>`,
            showCancelButton: true,
            confirmButtonText: `<i class="far fa-trash-alt"></i>`,
            cancelButtonText: `<i class="fas fa-times"></i>`,
        }).then((result) => {
            let cancel = true
            if (result.isConfirmed) {
                $.post("/ajax/serverCenterBackups", {
                    server      : vars.cfg,
                    file        : file,
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
}

$(document).ready(() => {
    setTimeout(() => $('.content-wrapper').attr("style", "min-height: 1750px"), 2000)

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

/**
 * Prüft alle Selektierten Dateien
 */
function checkSelects() {
    VUE_fileBrowserBrackups.showSelected = false
    $('*[data-picker="files"]').each(function() {
        if($(this).prop("checked")) VUE_fileBrowserBrackups.showSelected = true
    })
}

/**
 * Toggelt alle Selektierten Dateien
 */
function toggleAll(to) {
    $('*[data-picker="files"]').each(function() {
        $(this).prop("checked", to)
    })
    checkSelects()
}

/**
 * Download mehrere Dateien
 */
function multiDownload() {
    let tdl = document.createElement("a");
    tdl.style.display = 'none';
    document.body.appendChild(tdl)

    $('*[data-picker="files"]').each(function() {
        let self    = $(this)
        if(self.prop("checked")) {
            self.prop("checked", false)
            tdl.setAttribute( 'href', `/backup/${vars.cfg}/${self.data("file")}` )
            tdl.setAttribute( 'download', self.data("file"))
            tdl.setAttribute( 'target', '_blank')
            tdl.click()
        }
    })

    document.body.removeChild( tdl )
}

/**
 * Entfernt gewählte Dateien
 * @param file
 */
function removeAll() {
    let files = []
    $('*[data-picker="files"]').each(function() {
        let self    = $(this)
        if(self.prop("checked")) {
            files.push(self.data("file"))
        }
    })
    if(files.length !== 0)
        swalWithBootstrapButtons .fire({
            icon: 'question',
            text: `${files.join(" ; ")}`,
            title: `<strong>${globalvars.lang_arr["servercenter_backups"].sweet.remove.title}</strong>`,
            showCancelButton: true,
            confirmButtonText: `<i class="far fa-trash-alt"></i>`,
            cancelButtonText: `<i class="fas fa-times"></i>`,
        }).then((result) => {
            let cancel = true
            if (result.isConfirmed) {
                $.post("/ajax/serverCenterBackups", {
                    server: vars.cfg,
                    file: files,
                    remove: true
                })
                   .done((data) => {
                       try {
                           let success = JSON.parse(data).success
                           fireToast(success ? 39 : 38, success ? 'success' : 'error')
                           $('#FB_reload').click()
                       } catch (e) {
                           console.log(e)
                           fireToast(38, "error")
                       }
                   })
                   .fail(() => {
                       fireToast(38, "error")
                   })
                cancel = false
            }
            if(cancel) fireToast(38, "error")
        })
}