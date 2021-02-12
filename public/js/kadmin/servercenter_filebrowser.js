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

function getPath(path) {
    console.log(path)
    let pathbefore  = path.split("/")
    pathbefore.pop()
    pathbefore      = pathbefore.join("/")
    if(path.includes(vars.cfg)) {
        filesFrontend.html(loading("FB"))
        $.get("/ajax/serverCenterFilebrowser", {
            getList     : true,
            server      : vars.cfg,
            path        : path
        }, (files) => {
            try {
                // leere Dir list und letzte Ordner
                let pathSplit   = path.split("/")
                $('#FB_currDir').html(pathSplit[(pathSplit.length - 1)])
                $('#FB_totalDir').html(path)
                $('#FB_reload').data("path", path)

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
                        if(file.FileExt === false) return "fas fa-folder"
                        switch (file.FileExt) {
                            case ".jar":
                                return "fab fa-java"
                            case ".yml":
                            case ".json":
                            case ".properties":
                            case ".cfg":
                                return "far fa-file-code"
                            case ".sh":
                                return "fa fa-terminal"
                            case ".txt":
                            case ".log":
                                return "far fa-file-alt"
                            case ".zip":
                                return "fas fa-file-archive"
                            default:
                               return "fas fa-file"
                        }
                    }

                    if(file.isFile)     list.push(`<div class="p-1 pl-2 pr-3 list-group-item border-left-0"><i class="${icon()}" aria-hidden="true"></i> ${file.name}</div>`)
                    if(file.isDir)      listDir.push(`<button type="button" onClick="getPath('${file.totalPath}')" class="p-1 pl-4 pr-3 list-group-item list-group-item-action"><i class="fas fa-folder" aria-hidden="true"></i> ${file.name}</button>`)
                }

                console.log(list.length, list)
                console.log(listDir.length, listDir)
                if(list.length === 0)
                    list.push(`<div class="p-1 pl-2 pr-3 list-group-item border-left-0"><i class="fas fa-exclamation"></i> ${globalvars.lang_arr["servercenter_filebrowser"].noFileFound}</div>`)
                if(listDir.length === 0 || (listDir.length === 1 && listDir[0].includes("data-js")))
                    listDir.push(`<div class="p-1 pl-4 pr-3 list-group-item"><i class="fas fa-exclamation"></i> ${globalvars.lang_arr["servercenter_filebrowser"].noDirFound}</div>`)

                filesFrontend.html(list.join(""))
                dirFrontend.html(listDir.join(""))
            }
            catch (e) {
                console.log(e)
                filesFrontend.html(failed("FB"))
                dirFrontend.html(failed("FB"))
            }
        })
    }
}

$(document).ready(() => setInterval(() => $('.content-wrapper').attr("style", "min-height: 1750px")), 500)