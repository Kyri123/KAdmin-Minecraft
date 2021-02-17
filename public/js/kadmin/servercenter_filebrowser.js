/*
* *******************************************************************************************
* @author:  Oliver Kaufmann (Kyri123)
* @copyright Copyright (c) 2019-2020, Oliver Kaufmann
* @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
* Github: https://github.com/Kyri123/KAdmin-Minecraft
* *******************************************************************************************
*/
"use strict"

let filesFrontend   = $('#FB_fileList')
let dirFrontend     = $('#FB_folderList')
let dirArray        = {}

filesFrontend.html(loading("FB"))
dirFrontend.html(loading("FB"))

let dirlist         = []
let dirlistSweet    = []
setInterval(() => {
    $.get("/ajax/serverCenterFilebrowser", {
        getDirList  : true,
        server      : vars.cfg
    }, (files) => {
        dirlist = JSON.parse(files)
        if(dirlist.length !== $('#quicklist option').length + 1) {
            $('#quicklist').html(`<option value="${vars.defaultPath}">/</option>`)
            for(let item of dirlist)
                $('#quicklist').append(`<option value="${item}">${item.replace(vars.defaultPath, "")}</option>`)
        }
        dirlistSweet = []
        dirlistSweet[vars.defaultPath] = "/"
        for(let item of dirlist) {
            dirlistSweet[item] = item.replace(vars.defaultPath, "")
        }
    })
}, 1000)

getPath(vars.defaultPath)

/**
 * generiert den Filebrowser
 * @param path
 */
function getPath(path) {
    $('*[data-acceptDel="use"]').off("click")
    dirArray        = {}

    $('#FB_removeFolder').toggle(path !== vars.defaultPath)
    $('#FB_moveFolder').toggle(path !== vars.defaultPath)
    $('#FB_renameFolder').toggle(path !== vars.defaultPath)

    let pathbefore  = path.split("/")
    pathbefore.pop()
    pathbefore      = pathbefore.join("/")

    if(path.includes(vars.cfg)) {
        filesFrontend.html(loading("FB"))
        //dirFrontend.html(loading("FB"))
        $.get("/ajax/serverCenterFilebrowser", {
            getList     : true,
            server      : vars.cfg,
            path        : path
        }, (files) => {
            try {
                // leere Dir list und letzte Ordner
                let pathSplit   = path.split("/")
                $('#FB_currDir')        .html(pathSplit[(pathSplit.length - 1)])
                $('#FB_totalDir')       .html(`<i class="fas fa-folder-open" aria-hidden="true"></i> ${path.replace(vars.defaultPath, "") === "" ? `/` : path.replace(vars.defaultPath, "")}`)
                $('#FB_reload')         .attr("data-path", path).data("path", path)
                $('#FB_removeFolderIn') .attr("data-path", path).data("path", path)
                $('#FB_removeFolder')   .attr("data-path", path).data("path", path)
                $('#FB_addFolder')      .attr("data-path", path).data("path", path)
                $('#FB_moveFolder')     .attr("data-path", path).data("path", path)
                $('#FB_renameFolder')   .attr("data-path", path).data("path", path)


                let listDir     = []
                let list        = []

                // setzte .. wenn erlaubt
                if(pathbefore.includes(vars.cfg))
                    listDir.push(`<button type="button" onClick="getPath('${pathbefore}')" data-js="goback" class="p-1 pl-4 pr-3 list-group-item list-group-item-action"><i class="fas fa-folder" aria-hidden="true"></i> ..</button>`)

                let fileArr     = JSON.parse(files)

                // sotiere nach Ordner & Größe
                fileArr.sort((a, b) => {
                    return a.isFile - b.isFile || b.sizebit - a.sizebit
                    //return a.isFile - b.isFile || b.sizebit - a.sizebit
                })

                let i = 0
                for(let file of fileArr) {
                    let editArray   = [
                        ".log",
                        ".properties",
                        ".xml",
                        ".cfg",
                        ".txt",
                        ".json",
                        ".recipe",
                        ".csv",
                        ".zs"
                    ]

                    if(file.isFile)     list.push(`
                    <div class="p-0 pl-4 list-group-item border-left-0">
                        <div class="d-flex">
                            <div class="pt-1 pb-1">
                                <i class="${icon(file.FileExt)}" aria-hidden="true"></i> 
                                ${file.name}
                            </div>
                            <div class="btn-group btn-group-sm ml-auto">
                                <span class="pr-3 text-sm pt-1 pb-1"><b>${file.size !== "n/a" ? file.size.includes("Bytes") ? "~1 KB" : file.size : "~1 KB"}</b></span>
                                <button type="button" class="rounded-0 btn btn-outline-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    ${globalvars.lang_arr["servercenter_filebrowser"].options.actions}
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    ${ hasPermissions(globalvars.perm, "filebrowser/execFiles", vars.cfg) && (file.FileExt.includes(".sh") || file.FileExt.includes(".jar"))
                                       ? `<a class="dropdown-item disabled" href="javascript:void(0)"><i class="fas fa-file-import"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.exec}</a>` : ""
                                    }
                                    ${ hasPermissions(globalvars.perm, "filebrowser/showFiles", vars.cfg) && file.FileExt.includesArray(editArray)
                                       ? `<a class="dropdown-item" href="javascript:void(0)" id="show_${i}" onclick="showeditmodal(false, this.id, '${file.totalPath}')"><i class="far fa-eye"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.show}</a>` : ""
                                    }
                                    ${ hasPermissions(globalvars.perm, "filebrowser/editFiles", vars.cfg) && file.FileExt.includesArray(editArray)
                                       ? `<a class="dropdown-item" href="javascript:void(0)" id="edit_${i}" onclick="showeditmodal(true, this.id, '${file.totalPath}')"><i class="fas fa-edit"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.edit}</a>` : ""
                                    }
                                    ${ hasPermissions(globalvars.perm, "filebrowser/renameFiles", vars.cfg)
                                       ? `<a class="dropdown-item" href="javascript:void(0)" data-rename="use" data-isfile="yes" data-path="${file.totalPath}"><i class="fas fa-file-signature"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.rename}</a>` : ""
                                    }
                                    ${ hasPermissions(globalvars.perm, "filebrowser/moveFiles", vars.cfg)
                                       ? `<a class="dropdown-item" href="javascript:void(0)" data-move="use" data-isfile="yes" data-path="${file.totalPath}"><i class="fas fa-arrows-alt"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.move}</a>` : ""
                                    }
                                    ${ hasPermissions(globalvars.perm, "filebrowser/downloadFiles", vars.cfg)
                                       ? `<a class="dropdown-item" href="${file.totalPath.replace(vars.defaultPath, `/serv/${vars.cfg}`)}" download=""><i class="fas fa-file-download"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.download}</a>` : ""
                                    }
                                    ${ hasPermissions(globalvars.perm, "filebrowser/removeFiles", vars.cfg)
                                       ? `    <div class="dropdown-divider"></div>
                                              <a class="dropdown-item text-danger" href="javascript:void(0)" data-acceptDel="use" data-tohome="no" data-path="${file.totalPath}"><i class="far fa-trash-alt" data-path="${file.totalPath}"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.remove}</a>` : ""
                                    }
                                    <!--<a class="dropdown-item text-info disabled" href="javascript:void(0)"><i class="fas fa-info-circle"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.info}</a>-->
                                </div>
                            </div>
                        </div>
                    </div>
                    `)

                    if(file.isDir) {
                        listDir.push(`
                            <button type="button" onClick="getPath('${file.totalPath}')" class="p-0 pl-4 pr-1 list-group-item list-group-item-action">
                                <div class="d-flex">
                                    <div class="pt-1 pb-1">
                                        <i class="${icon(file.FileExt)}" aria-hidden="true"></i> 
                                        ${file.name}
                                    </div>
                                    <div class="pt-1 pb-1 ml-auto">
                                        <span class="text-sm"><b>${file.size !== "n/a" ? file.size.includes("Bytes") ? "~1 KB" : file.size : "~1 KB"}</b></span>
                                    </div>
                                </div>
                            </button>`)
                        dirArray[file.totalPath] = `${file.name} (${file.size !== "n/a" ? file.size.includes("Bytes") ? "~1 KB" : file.size : "~1 KB"})`
                    }
                    i++
                }

                if(list.length === 0)
                    list.push(`<div class="p-1 pl-4 pr-3 list-group-item border-left-0"><i class="fas fa-exclamation"></i> ${globalvars.lang_arr["servercenter_filebrowser"].noFileFound}</div>`)
                if(listDir.length === 0 || (listDir.length === 1 && listDir[0].includes("data-js")))
                    listDir.push(`<div class="p-1 pl-4 pr-3 list-group-item"><i class="fas fa-exclamation"></i> ${globalvars.lang_arr["servercenter_filebrowser"].noDirFound}</div>`)

                filesFrontend.html(list.join(""))
                dirFrontend.html(listDir.join(""))
                reloadClickEvents()
            }
            catch (e) {
                console.log(e)
                filesFrontend.html(failed("FB"))
                dirFrontend.html(failed("FB"))
            }
        })
    }
}

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
                           fireModal(success ? 3 : 2, success ? 'success' : 'error')
                           $(e.currentTarget.dataset.tohome === "no" ? '#FB_reload' : '#FB_tohome').click()
                       }
                       catch (e) {
                           console.log(e)
                           fireModal(2, "error")
                       }
                   })
                   .fail(() => {
                       fireModal(2, "error")
                   })
                cancel = false
            }
            if(cancel) fireModal(2, "error")
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
                           fireModal(success ? 3 : 2, success ? 'success' : 'error')
                           $('#FB_reload').click()
                       }
                       catch (e) {
                           console.log(e)
                           fireModal(2, "error")
                       }
                   })
                   .fail(() => {
                       fireModal(2, "error")
                   })
                cancel = false
            }
            if(cancel) fireModal(2, "error")
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
                           fireModal(success ? 0 : 1, success ? 'success' : 'error')
                           swalWithBootstrapButtons.fire(
                              success ? globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.success_title : globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.error_title,
                              success ? globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.success_text  : globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.cancel_text,
                              success ? 'success' : 'error'
                           )
                           $('#FB_reload').click()
                       }
                       catch (e) {
                           console.log(e)
                           fireModal(0, 'error')
                       }
                   })
                   .fail(() => {
                       fireModal(0, 'error')
                   })
                cancel = false
            }
            if(cancel) fireModal(0, 'error')
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
                           fireModal(success ? 5 : 4, success ? 'success' : 'error')
                           if(e.currentTarget.dataset.isfile === "yes") $('#FB_reload').click()
                           if(e.currentTarget.dataset.isfile === "no") getPath(`${result.value}/${e.currentTarget.dataset.path.split("/").pop()}`)
                       }
                       catch (e) {
                           console.log(e)
                           fireModal(4, 'error')
                       }
                   })
                   .fail(() => {
                       fireModal(4, 'error')
                   })
                cancel = false
            }
            if(cancel) fireModal(4, 'error')
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
                           fireModal(success ? 7 : 6, success ? 'success' : 'error')
                           if(e.currentTarget.dataset.isfile === "yes") $('#FB_reload').click()
                           if(e.currentTarget.dataset.isfile === "no") getPath(`${filePath.join("/")}/${result.value}`)
                       }
                       catch (e) {
                           console.log(e)
                           fireModal(6, 'error')
                       }
                   })
                   .fail(() => {
                       fireModal(6, 'error')
                   })
                cancel = false
            }
            if(cancel) fireModal(6, 'error')
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
                    fireModal(6, 'error')
                    // sende
                    $.ajax({
                        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                        method: 'post',
                        url: '/ajax/serverCenterFilebrowser',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (resp) {
                            fireModal(6)
                        },
                        error: function() {
                            fireModal(6, 'error')
                        }
                    })
                }
                else {
                    fireModal(6, 'error')
                }
            }
            else {
                fireModal(6, 'error')
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
    acceptBTN.toggle(onlyread)
    textarea.attr("readonly", !onlyread)
    clickedElement.html('<i class="fas fa-spinner fa-pulse"></i>')
    h5.html(globalvars.lang_arr["servercenter_filebrowser"][!onlyread ? 'show_modal' : 'edit_modal'])

    $.get("/ajax/serverCenterFilebrowser", {
        getFile     : true,
        server      : vars.cfg,
        file        : file
    }, (data) => {
        if(data !== "false" && data !== '{"request":"failed"}') {
            textarea.data('file', file)
            textarea.html(data)
            clickedElement.html(oldHTMClicked)
            modal.modal('show')
        }
        else {
            clickedElement.html(oldHTMClicked)
        }
    })
}

function sendedit() {
    let textarea        = $(`#editshow_area`)
    let acceptBTN       = $(`#editshow_accept`)
    let oldHTMClicked   = acceptBTN.html()
    let filePath        = textarea.data().file
    let send            = textarea.html()
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