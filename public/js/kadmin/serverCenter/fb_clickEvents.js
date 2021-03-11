/*
* *******************************************************************************************
* @author:  Oliver Kaufmann (Kyri123)
* @copyright Copyright (c) 2019-2020, Oliver Kaufmann
* @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
* Github: https://github.com/Kyri123/KAdmin-Minecraft
* *******************************************************************************************
*/
"use strict"

/**
 * läd alle ClickEvents neu
 */
function reloadClickEvents() {
    // Entfernen von Dateien
    $('*[data-acceptDel="use"],#FB_removeFolder').click((e) => {
        if(e.currentTarget.dataset.path !== undefined) swalWithBootstrapButtons .fire({
            icon: 'question',
            text: e.currentTarget.dataset.path,
            title: `<strong>${globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.title}</strong>`,
            showCancelButton: true,
            confirmButtonText: `<i class="far fa-trash-alt"></i>`,
            cancelButtonText: `<i class="fas fa-times"></i>`,
        }).then((result) => {
            let cancel = true
            if (result.isConfirmed) {
                $.post("/ajax/serverCenterFilebrowser", {
                    server      : vars.cfg,
                    path        : e.currentTarget.dataset.path,
                    remove      : true
                })
                   .done((data) => {
                       try {
                           let success = JSON.parse(data).success
                           fireToast(success ? 5 : 4, success ? 'success' : 'error')
                           $(e.currentTarget.dataset.tohome === "no" ? '#FB_reload' : '#FB_tohome').click()
                       }
                       catch (e) {
                           console.log(e)
                           fireToast(4, "error")
                       }
                   })
                   .fail(() => {
                       fireToast(4, "error")
                   })
                cancel = false
            }
            if(cancel) fireToast(4, "error")
        })
    })

    // Entfernen von Unterordnern
    $('#FB_removeFolderIn').click((e) => {
        if(e.currentTarget.dataset.path !== undefined) swalWithBootstrapButtons .fire({
            icon: 'question',
            title: `<strong>${globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.titleArray}</strong>`,
            showCancelButton: true,
            confirmButtonText: `<i class="far fa-trash-alt"></i>`,
            cancelButtonText: `<i class="fas fa-times"></i>`,
            input: 'select',
            inputOptions: dirArray
        }).then((result) => {
            let cancel = true
            if (result.isConfirmed) {
                $.post("/ajax/serverCenterFilebrowser", {
                    server      : vars.cfg,
                    path        : result.value,
                    remove      : true
                })
                   .done((data) => {
                       try {
                           let success = JSON.parse(data).success
                           fireToast(success ? 5 : 4, success ? 'success' : 'error')
                           $('#FB_reload').click()
                       }
                       catch (e) {
                           console.log(e)
                           fireToast(4, "error")
                       }
                   })
                   .fail(() => {
                       fireToast(4, "error")
                   })
                cancel = false
            }
            if(cancel) fireToast(4, "error")
        })
    })

    // Create Folder
    $('#FB_addFolder').click((e) => {
        if(e.currentTarget.dataset.path !== undefined) swalWithBootstrapButtons .fire({
            icon: 'question',
            title: `<strong>${globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.title}</strong>`,
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-save"></i>`,
            cancelButtonText: `<i class="fas fa-times"></i>`,
            input: 'text',
            inputValidator: (value) => {
                let re = /^([a-zA-Z0-9][^*/><?\|:\s]*)$/

                if (!value || !re.test(value))
                    return globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.invalide
            }
        }).then((result) => {
            let cancel = true
            if (result.isConfirmed) {
                $.post("/ajax/serverCenterFilebrowser", {
                    server      : vars.cfg,
                    path        : `${e.currentTarget.dataset.path}/${result.value}`,
                    MKDir       : true
                })
                   .done((data) => {
                       try {
                           let success = JSON.parse(data).success
                           fireToast(success ? 7 : 6, success ? 'success' : 'error')
                           swalWithBootstrapButtons.fire(
                              success ? globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.success_title : globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.error_title,
                              success ? globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.success_text  : globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.cancel_text,
                              success ? 'success' : 'error'
                           )
                           $('#FB_reload').click()
                       }
                       catch (e) {
                           console.log(e)
                           fireToast(6, 'error')
                       }
                   })
                   .fail(() => {
                       fireToast(6, 'error')
                   })
                cancel = false
            }
            if(cancel) fireToast(6, 'error')
        })
    })

    // moveFiles/Folders
    $('*[data-move="use"],#FB_moveFolder').click((e) => {
        if(e.currentTarget.dataset.path !== undefined) swalWithBootstrapButtons .fire({
            icon: 'question',
            title: `<strong>${globalvars.lang_arr["servercenter_filebrowser"].sweet.move.title}</strong>`,
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-save"></i>`,
            cancelButtonText: `<i class="fas fa-times"></i>`,
            input: 'select',
            inputOptions: dirlistSweet
        }).then((result) => {
            let cancel = true
            if (result.isConfirmed) {
                $.post("/ajax/serverCenterFilebrowser", {
                    server          : vars.cfg,
                    oldPath         : `${e.currentTarget.dataset.path}`,
                    newPath         : `${result.value}/${e.currentTarget.dataset.path.split("/").pop()}`,
                    moveandrename   : true,
                    action          : "move",
                    isFile          : e.currentTarget.dataset.isfile === "yes"
                })
                   .done((data) => {
                       try {
                           let success = JSON.parse(data).success
                           fireToast(success ? 9 : 8, success ? 'success' : 'error')
                           if(e.currentTarget.dataset.isfile === "yes") $('#FB_reload').click()
                           if(e.currentTarget.dataset.isfile === "no") getPath(`${result.value}/${e.currentTarget.dataset.path.split("/").pop()}`)
                       }
                       catch (e) {
                           console.log(e)
                           fireToast(8, 'error')
                       }
                   })
                   .fail(() => {
                       fireToast(8, 'error')
                   })
                cancel = false
            }
            if(cancel) fireToast(8, 'error')
        })
    })

    // rename
    $('*[data-rename="use"],#FB_renameFolder').click((e) => {
        if(e.currentTarget.dataset.path !== undefined) swalWithBootstrapButtons .fire({
            icon: 'question',
            title: `<strong>${globalvars.lang_arr["servercenter_filebrowser"].sweet.rename.title}</strong>`,
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-save"></i>`,
            cancelButtonText: `<i class="fas fa-times"></i>`,
            input: 'text',
            inputValue: e.currentTarget.dataset.filename,
            inputValidator: (value) => {
                let re = /^([a-zA-Z0-9][^*/><?\|:\s]*)$/

                if (!value || !re.test(value))
                    return globalvars.lang_arr["servercenter_filebrowser"].sweet.rename.invalide
            }
        }).then((result) => {
            let cancel = true
            if (result.isConfirmed) {
                let filePath   = e.currentTarget.dataset.path.split("/")
                filePath.pop()
                $.post("/ajax/serverCenterFilebrowser", {
                    server          : vars.cfg,
                    oldPath         : `${e.currentTarget.dataset.path}`,
                    newPath         : `${filePath.join("/")}/${result.value}`,
                    moveandrename   : true,
                    action          : "rename",
                    isFile          : e.currentTarget.dataset.isfile === "yes"
                })
                   .done((data) => {
                       try {
                           let success = JSON.parse(data).success
                           fireToast(success ? 11 : 10, success ? 'success' : 'error')
                           if(e.currentTarget.dataset.isfile === "yes") $('#FB_reload').click()
                           if(e.currentTarget.dataset.isfile === "no") getPath(`${filePath.join("/")}/${result.value}`)
                       }
                       catch (e) {
                           console.log(e)
                           fireToast(11, 'error')
                       }
                   })
                   .fail(() => {
                       fireToast(11, 'error')
                   })
                cancel = false
            }
            if(cancel) fireToast(11, 'error')
        })
    })

    // upload
    $('#FB_upload').click((e) => {
        if(e.currentTarget.dataset.path !== undefined) swalWithBootstrapButtons .fire({
            icon: 'question',
            title: `<strong>${globalvars.lang_arr["servercenter_filebrowser"].sweet.upload.title}</strong>`,
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-file-upload"></i>`,
            cancelButtonText: `<i class="fas fa-times"></i>`,
            input: 'file',
            inputAttributes: {
                'multiple': 'multiple'
            },
            inputValidator: (value) => {
                if (value === null)
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
                    formData.append("path", e.currentTarget.dataset.path)
                    fireToast(12, 'info')
                    // sende
                    $.ajax({
                        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                        method: 'post',
                        url: '/ajax/serverCenterFilebrowser',
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
}

async function showeditmodal(onlyread, element, file) {
    let clickedElement  = $(`#${element}`)
    let oldHTMClicked   = clickedElement.html()
    let textarea        = $(`#editshow_area`)
    let acceptBTN       = $(`#editshow_accept`)
    let modal           = $(`#editshow`)
    let h5              = $(`#editshow_h5`)

    // setzte Elemente und Attribute
    editor.setOption('readOnly', !onlyread)
    acceptBTN.toggle(onlyread)
    clickedElement.html('<i class="fas fa-spinner fa-pulse"></i>')
    h5.html(globalvars.lang_arr["servercenter_filebrowser"][!onlyread ? 'show_modal' : 'edit_modal'])

    $.get("/ajax/serverCenterFilebrowser", {
        getFile     : true,
        server      : vars.cfg,
        file        : file
    }, (data) => {
        if(data !== "false" && data !== '{"request":"failed"}') {
            textarea.data('file', file)
            clickedElement.html(oldHTMClicked)
            modal.modal('show')
            editor.setValue(data)
        }
        else {
            clickedElement.html(oldHTMClicked)
        }
    })
}

function sendedit() {
    let acceptBTN       = $(`#editshow_accept`)
    let oldHTMClicked   = acceptBTN.html()
    let filePath        = $(`#editshow_area`).data().file
    let send            = editor.getValue()
    let modal           = $(`#editshow`)

    // setzte Elemente und Attribute
    acceptBTN.html('<i class="fas fa-spinner fa-pulse"></i>')

    $.post("/ajax/serverCenterFilebrowser", {
        server          : vars.cfg,
        path            : filePath,
        data            : send,
        editfile        : true
    })
       .done((data) => {
           modal.modal('toggle', false)
           acceptBTN.html(oldHTMClicked)
           try {
               let success = JSON.parse(data).success
               fireToast(success ? 1 : 0, success ? 'success' : 'error')
               $('#FB_reload').click()
           }
           catch (e) {
               fireToast(0, "error")
           }
       })
       .fail(() => {
           fireToast(0, "error")
       })
}

$(document).ready(() => setInterval(() => $('.content-wrapper').attr("style", "min-height: 1750px")), 500)