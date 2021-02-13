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

filesFrontend.html(loading("FB"))
dirFrontend.html(loading("FB"))

getPath(vars.defaultPath)

/**
 * generiert den Filebrowser
 * @param path
 */
function getPath(path) {
    $('*[data-acceptDel="use"]').off("click")

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
                $('#FB_currDir').html(pathSplit[(pathSplit.length - 1)])
                $('#FB_totalDir').html(`<i class="fas fa-folder-open" aria-hidden="true"></i> ${path.replace(vars.defaultPath, "") === "" ? "/" : path.replace(vars.defaultPath, "")}`)
                $('#FB_reload').data("path", path)
                $('#FB_removeFolderIn').data("path", path)
                $('#FB_removeFolder').data("path", path)

                let listDir     = []
                let list        = []

                // setzte .. wenn erlaubt
                if(pathbefore.includes(vars.cfg))
                    listDir.push(`<button type="button" onClick="getPath('${pathbefore}')" data-js="goback" class="p-1 pl-4 pr-3 list-group-item list-group-item-action"><i class="fas fa-folder" aria-hidden="true"></i> ..</button>`)

                let fileArr     = JSON.parse(files)

                // sotiere nach Ordner & Größe
                fileArr.sort((a, b) => {
                    return a.isFile - b.isFile || a.sizebit - b.sizebit
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
                                    Action
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item disabled" href="javascript:void(0)"><i class="fas fa-edit"></i> edit</a>
                                    <a class="dropdown-item disabled" href="javascript:void(0)"><i class="fas fa-file-import"></i> exec</a>
                                    <a class="dropdown-item disabled" href="javascript:void(0)"><i class="fas fa-file-signature"></i> rename</a>
                                    <a class="dropdown-item disabled" href="javascript:void(0)"><i class="fas fa-arrows-alt"></i> move</a>
                                    <a class="dropdown-item disabled" href="javascript:void(0)"><i class="fas fa-info-circle"></i> info</a>
                                    <a class="dropdown-item" href="${file.totalPath.replace(vars.defaultPath, `/serv/${vars.cfg}`)}" download=""><i class="fas fa-file-download"></i> download</a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="javascript:void(0)"><i class="far fa-eye"></i> show</a>
                                    <a class="dropdown-item text-danger" href="javascript:void(0)" data-acceptDel="use" data-file="${file.totalPath}"><i class="far fa-trash-alt"></i> del</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    `)
                    if(file.isDir)      listDir.push(`<button type="button" onClick="getPath('${file.totalPath}')" class="p-1 pl-4 pr-3 list-group-item list-group-item-action"><i class="fas fa-folder" aria-hidden="true"></i> ${file.name}</button>`)
                }

                console.log(list.length, list)
                console.log(listDir.length, listDir)
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
    $('*[data-acceptDel="use"]').click((e) => {
        console.log(e.target.dataset.file)
        swalWithBootstrapButtons .fire({
            icon: 'warning',
            text: "You won't be able to revert this!",
            title: '<strong>Delete?</strong>',
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-trash"></i>`,
            cancelButtonText: `<i class="fas fa-times"></i>`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            let cancel = true
            if (result.isConfirmed) {
                //swalWithBootstrapButtons.fire('Saved!', '', 'success')
                cancel = false
            }
            if(cancel) swalWithBootstrapButtons.fire(
               'Cancelled',
               'Your imaginary file is safe :)',
               'error'
            )
        })
    })
}

$(document).ready(() => setInterval(() => $('.content-wrapper').attr("style", "min-height: 1750px")), 500)