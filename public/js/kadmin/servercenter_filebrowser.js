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

getPath(vars.defaultPath)

/**
 * generiert den Filebrowser
 * @param path
 */
function getPath(path) {
    $('*[data-acceptDel="use"]').off("click")
    dirArray        = {}

    $('#FB_removeFolder').toggle(path !== vars.defaultPath)

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
                $('#FB_move')           .attr("data-path", path).data("path", path)


                let listDir     = []
                let list        = []

                // setzte .. wenn erlaubt
                if(pathbefore.includes(vars.cfg))
                    listDir.push(`<button type="button" onClick="getPath('${pathbefore}')" data-js="goback" class="p-1 pl-4 pr-3 list-group-item list-group-item-action"><i class="fas fa-folder" aria-hidden="true"></i> ..</button>`)

                let fileArr     = JSON.parse(files)

                // sotiere nach Ordner & Größe
                fileArr.sort((a, b) => {
                    return a.isFile - b.isFile || b.sizebit - a.sizebit
                })

                for(let file of fileArr) {

                    let icon = () => {
                        if(file.FileExt === false || file.FileExt === "false") return "fas fa-folder"
                        switch (file.FileExt) {
                            case ".jar":
                                return "fab fa-java"
                            case ".yml":
                            case ".json":
                            case ".properties":
                            case ".cfg":
                            case ".xml":
                                return "far fa-file-code"
                            case ".sh":
                                return "fa fa-terminal"
                            case ".txt":
                            case ".log":
                                return "far fa-file-alt"
                            case ".zip":
                            case ".tar":
                            case ".gz":
                                return "fas fa-file-archive"
                            case ".jpg":
                            case ".gif":
                            case ".png":
                                return "fas fa-file-image"
                            case ".bak":
                                return "fas fa-file-lock"
                            default:
                               return "fas fa-file"
                        }
                    }

                    if(file.isFile)     list.push(`
                    <div class="p-0 pl-4 list-group-item border-left-0">
                        <div class="d-flex">
                            <div class="pt-1 pb-1">
                                <i class="${icon()}" aria-hidden="true"></i> 
                                ${file.name}
                            </div>
                            <div class="btn-group btn-group-sm ml-auto">
                                <span class="pr-3 text-sm pt-1 pb-1"><b>${file.size !== "n/a" ? file.size.includes("Bytes") ? "~1 KB" : file.size : "~1 KB"}</b></span>
                                <button type="button" class="rounded-0 btn btn-outline-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    ${globalvars.lang_arr["servercenter_filebrowser"].options.actions}
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    ${ hasPermissions(globalvars.perm, "filebrowser/execFiles", vars.cfg) && (file.FileExt.includes(".sh") || file.FileExt.includes(".jar"))
                                       ? `<a class="dropdown-item" href="javascript:void(0)"><i class="fas fa-file-import"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.exec}</a>` : ""
                                    }
                                    ${ hasPermissions(globalvars.perm, "filebrowser/showFiles", vars.cfg) && (file.FileExt.includes(".log") || file.FileExt.includes(".properties") || file.FileExt.includes(".xml") || file.FileExt.includes(".cfg") || file.FileExt.includes(".txt") || file.FileExt.includes(".json"))
                                       ? `<a class="dropdown-item" href="javascript:void(0)"><i class="far fa-eye"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.show}</a>` : ""
                                    }
                                    ${ hasPermissions(globalvars.perm, "filebrowser/editFiles", vars.cfg) && (file.FileExt.includes(".log") || file.FileExt.includes(".properties") || file.FileExt.includes(".xml") || file.FileExt.includes(".cfg") || file.FileExt.includes(".txt") || file.FileExt.includes(".json"))
                                       ? `<a class="dropdown-item" href="javascript:void(0)"><i class="fas fa-edit"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.edit}</a>` : ""
                                    }
                                    ${ hasPermissions(globalvars.perm, "filebrowser/renameFiles", vars.cfg)
                                       ? `<a class="dropdown-item" href="javascript:void(0)"><i class="fas fa-file-signature"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.rename}</a>` : ""
                                    }
                                    ${ hasPermissions(globalvars.perm, "filebrowser/moveFiles", vars.cfg)
                                       ? `<a class="dropdown-item" href="javascript:void(0)"><i class="fas fa-arrows-alt"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.move}</a>` : ""
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
                                        <i class="fas fa-folder" aria-hidden="true"></i> 
                                        ${file.name}
                                    </div>
                                    <div class="pt-1 pb-1 ml-auto">
                                        <span class="text-sm"><b>${file.size !== "n/a" ? file.size.includes("Bytes") ? "~1 KB" : file.size : "~1 KB"}</b></span>
                                    </div>
                                </div>
                            </button>`)
                        dirArray[file.totalPath] = `${file.name} (${file.size !== "n/a" ? file.size.includes("Bytes") ? "~1 KB" : file.size : "~1 KB"})`
                    }
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
            icon: 'info',
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
                           swalWithBootstrapButtons.fire(
                              success ? globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.success_title : globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.error_title,
                              success ? globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.success_text  : globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.cancel_text,
                              success ? 'success' : 'error'
                           )
                           $(e.currentTarget.dataset.tohome === "no" ? '#FB_reload' : '#FB_tohome').click()
                       }
                       catch (e) {
                           console.log(e)
                           swalWithBootstrapButtons.fire(
                              globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.error_title,
                              globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.cancel_text,
                              'error'
                           )
                       }
                   })
                   .fail(() => {
                       swalWithBootstrapButtons.fire(
                          globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.error_title,
                          globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.cancel_text,
                          'error'
                       )
                   })
                cancel = false
            }
            if(cancel) swalWithBootstrapButtons.fire(
               globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.cancel_title,
               globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.cancel_text,
               'error'
            )
        })
    })

    // Entfernen von Unterordnern
    $('#FB_removeFolderIn').click((e) => {
        if(e.currentTarget.dataset.path !== undefined) swalWithBootstrapButtons .fire({
            icon: 'info',
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
                           swalWithBootstrapButtons.fire(
                              success ? globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.success_title : globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.error_title,
                              success ? globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.success_text  : globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.cancel_text,
                              success ? 'success' : 'error'
                           )
                           $('#FB_reload').click()
                       }
                       catch (e) {
                           console.log(e)
                           swalWithBootstrapButtons.fire(
                              globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.error_title,
                              globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.cancel_text,
                              'error'
                           )
                       }
                   })
                   .fail(() => {
                       swalWithBootstrapButtons.fire(
                          globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.error_title,
                          globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.cancel_text,
                          'error'
                       )
                   })
                cancel = false
            }
            if(cancel) swalWithBootstrapButtons.fire(
               globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.cancel_title,
               globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.cancel_text,
               'error'
            )
        })
    })

    // Create File
    $('#FB_addFolder').click((e) => {
        if(e.currentTarget.dataset.path !== undefined) swalWithBootstrapButtons .fire({
            icon: 'info',
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
                           swalWithBootstrapButtons.fire(
                              success ? globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.success_title : globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.error_title,
                              success ? globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.success_text  : globalvars.lang_arr["servercenter_filebrowser"].sweet.remove.cancel_text,
                              success ? 'success' : 'error'
                           )
                           $('#FB_reload').click()
                       }
                       catch (e) {
                           console.log(e)
                           swalWithBootstrapButtons.fire(
                              globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.error_title,
                              globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.cancel_text,
                              'error'
                           )
                       }
                   })
                   .fail(() => {
                       swalWithBootstrapButtons.fire(
                          globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.error_title,
                          globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.cancel_text,
                          'error'
                       )
                   })
                cancel = false
            }
            if(cancel) swalWithBootstrapButtons.fire(
               globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.cancel_title,
               globalvars.lang_arr["servercenter_filebrowser"].sweet.mkdir.cancel_text,
               'error'
            )
        })
    })
}

$(document).ready(() => setInterval(() => $('.content-wrapper').attr("style", "min-height: 1750px")), 500)