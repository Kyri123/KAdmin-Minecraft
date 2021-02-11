/*
* *******************************************************************************************
* @author:  Oliver Kaufmann (Kyri123)
* @copyright Copyright (c) 2019-2020, Oliver Kaufmann
* @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
* Github: https://github.com/Kyri123/KAdmin-Minecraft
* *******************************************************************************************
*/
"use strict"

let filesFrontend   = $('#files')

filesFrontend.html(loading("tr", 3))
getPath(vars.defaultPath)

function getPath(path) {
    let pathbefore  = path.split("/")
    pathbefore.pop()
    pathbefore      = pathbefore.join("/")
    if(path.includes(vars.cfg)) {
        filesFrontend.html(loading("tr", 3))
        $.get("/ajax/serverCenterFilebrowser", {
            getList     : true,
            server      : vars.cfg,
            path        : path
        }, (files) => {
            try {
                let fileArr     = JSON.parse(files)
                let list        = pathbefore.includes(vars.cfg) ? [`<tr>
                        <td><i class="fas fa-folder" aria-hidden="true"></i></td>
                        <td>..</td>
                        <td>
                            <a href="javascript:void(0)" onClick="getPath('${pathbefore}')" class="btn btn-sm btn-secondary">
                                <i class="fas fa-folder-open" aria-hidden="true"></i>
                            </a>
                        </td>
                    </tr>`] : []

                console.log(fileArr)

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
                                return "far fa-file-alt"
                            default:
                               return "fas fa-file"
                        }
                    }

                    list.push(`<tr>
                        <td><i class="${icon()}" aria-hidden="true"></i></td>
                        <td>${file.name}</td>
                        <td>
                           ${file.isFile ? "" : `<a href="javascript:void(0)" onClick="getPath('${file.totalPath}')" class="btn btn-sm btn-secondary"><i class="fas fa-folder-open" aria-hidden="true"></i></a>`}
                        </td>
                    </tr>`)
                }
                filesFrontend.html(list.join(""))
            }
            catch (e) {
                console.log(e)
                filesFrontend.html(failed("tr", 3))
            }
        })
    }
}

$(document).ready(() => setInterval(() => $('.content-wrapper').attr("style", "min-height: 1750px")), 500)