/*
* *******************************************************************************************
* @author:  Oliver Kaufmann (Kyri123)
* @copyright Copyright (c) 2019-2020, Oliver Kaufmann
* @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
* Github: https://github.com/Kyri123/KAdmin-Minecraft
* *******************************************************************************************
*/
"use strict"
let editor = CodeMirror.fromTextArea(document.getElementById("editshow_area"), {
    lineNumbers: true,
    mode: "javascript",
    ext: ["json", "map"],
    theme: "material"
})


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
                $('#FB_upload')         .attr("data-path", path).data("path", path)
                $('#FB_renameFolder')
                   .attr("data-path", path).data("path", path)
                   .attr("data-filename", pathSplit[(pathSplit.length - 1)]).data("path", pathSplit[(pathSplit.length - 1)])


                let listDir     = []
                let list        = []

                // setzte .. wenn erlaubt
                if(pathbefore.includes(vars.cfg))
                    listDir.push(`<div type="button" onClick="getPath('${pathbefore}')" data-js="goback" class="p-1 pl-4 pr-3 list-group-item bg-dark"><i class="fas fa-folder" aria-hidden="true"></i> ..</div>`)

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
                        ".zs",
                        ".yml"
                    ]

                    if(file.isFile)     list.push(`
                    <div class="p-0 pl-4 list-group-item border-left-0 bg-dark">
                        <div class="d-flex">
                            <div class="pt-1 pb-1">
                                <i class="${icon(file.FileExt)}" aria-hidden="true"></i> 
                                ${file.name}
                            </div>
                            <div class="btn-group btn-group-sm ml-auto">
                                <span class="pr-3 text-sm pt-1 pb-1"><b>${file.size !== "n/a" ? file.size.includes("Bytes") ? "~1 KB" : file.size : "~1 KB"}</b></span>
                                <button type="button" class="rounded-0 btn btn-outline-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                                       ? `<a class="dropdown-item" href="javascript:void(0)" data-rename="use" data-filename="${file.name}" data-isfile="yes" data-path="${file.totalPath}"><i class="fas fa-file-signature"></i> ${globalvars.lang_arr["servercenter_filebrowser"].options.rename}</a>` : ""
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
                            <div type="button" onClick="getPath('${file.totalPath}')" class="p-0 pl-4 pr-1 list-group-item bg-dark">
                                <div class="d-flex">
                                    <div class="pt-1 pb-1">
                                        <i class="${icon(file.FileExt)}" aria-hidden="true"></i> 
                                        ${file.name}
                                    </div>
                                    <div class="pt-1 pb-1 ml-auto">
                                        <span class="text-sm"><b>${file.size !== "n/a" ? file.size.includes("Bytes") ? "~1 KB" : file.size : "~1 KB"}</b></span>
                                    </div>
                                </div>
                            </div>`)
                        dirArray[file.totalPath] = `${file.name} (${file.size !== "n/a" ? file.size.includes("Bytes") ? "~1 KB" : file.size : "~1 KB"})`
                    }
                    i++
                }

                if(list.length === 0)
                    list.push(`<div class="p-1 pl-4 pr-3 list-group-item border-left-0 bg-dark"><i class="fas fa-exclamation"></i> ${globalvars.lang_arr["servercenter_filebrowser"].noFileFound}</div>`)
                if(listDir.length === 0 || (listDir.length === 1 && listDir[0].includes("data-js")))
                    listDir.push(`<div class="p-1 pl-4 pr-3 list-group-item bg-dark"><i class="fas fa-exclamation"></i> ${globalvars.lang_arr["servercenter_filebrowser"].noDirFound}</div>`)

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