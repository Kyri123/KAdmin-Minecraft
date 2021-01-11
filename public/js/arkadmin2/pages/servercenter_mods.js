/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"
get(); getTnstalled()
setInterval(() => {
    get(); getTnstalled()
}, 2000)

function get() {
    // Hole SteamAPI
    $.get('/json/steamAPI/mods.json', (steamAPI) => {
        steamAPI = steamAPI.response.publishedfiledetails

        // Hole aktuelle Modlist
        $.get('/ajax/serverCenterMods', {
            serverInfos     : true,
            cfg             : vars.cfg
        }, (server) => {
            let serverInfos     = JSON.parse(server).serverInfos
            server              = JSON.parse(server).serverCFG
            let list = ``
            if(server.mods.length > 0) {
                server.mods.forEach((val, key) => {
                    let i = steamAPI.find(p => p.publishedfileid == val)
                    list += `<div class="col-lg-6 col-xl-3"id="mod${val}">
                                <div class="card card-widget widget-user item-box">
                                    <div class="card bg-dark card-widget widget-user mb-0">
                                        <div class="row p-2">
                                            <div class="col-6">
                                                <h5 class="text-center left d-inline pt-3 pl-0 m-0 ">
                                                    Pos: ${key}
                                                </h5>
                                            </div>
                                            <div class="col-6 btn-group">
                                                <!-- Push Up -->
                                                <a class="btn btn-sm btn-outline-secondary ${hasPermissions(globalvars.perm, "mods/changeplace", varser.cfg) && server.mods[(key-1)] !== undefined ? `" onclick="push(true, '${key}')"` : "disabled\""}><i class="fas fa-arrow-up" aria-hidden="true"></i></a>
                                                <!-- Push down -->
                                                <a class="btn btn-sm btn-outline-secondary ${hasPermissions(globalvars.perm, "mods/changeplace", varser.cfg) && server.mods[(key+1)] !== undefined ? `" onclick="push(false, '${key}')"` : "disabled\""}><i class="fas fa-arrow-down" aria-hidden="true"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="widget-user-header text-" style="background: url('/img/backgrounds/5.jpg') center center;">
                                        <h5 title="${typeof(i) !== "undefined" ? i.title !== undefined ? i.title : "???" : "???"}" class="widget-user-desc text-bold text-center border ${!serverInfos.notInstalledMods.includes(val) ? (serverInfos.modNeedUpdates === false ? 'text-success border-success' : (!serverInfos.modNeedUpdates.includes(val) ? 'text-success border-success' : 'text-danger border-danger')) : 'text-warning border-warning'}" style="background-color: rgb(66 66 66 / 58%)!important;">${typeof(i) !== "undefined" ? i.title !== undefined ? `${i.title.substr(0, 14)}...` : "???" : "???"}</h5>
                                    </div>
                                    <div class="widget-user-image" id="serv_img" style="top: 130px;z-index: 1000"><img src="${typeof(i) !== "undefined" ? i.preview_url !== undefined ? i.preview_url : "https://steamuserimages-a.akamaihd.net/ugc/885384897182110030/F095539864AC9E94AE5236E04C8CA7C2725BCEFF/" : "https://steamuserimages-a.akamaihd.net/ugc/885384897182110030/F095539864AC9E94AE5236E04C8CA7C2725BCEFF/"}" style="border-top-width: 3px!important;height: 90px;width: 90px;background-color: #001f3f" class="border-secondary"></div>
                                    
                                    <div class="card card-widget widget-user mb-0">
                                        <!-- Steam URL -->
                                        <div class="text-left left d-inline" style="width:50%;padding-right: 45px;">
                                            <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=${val}" target="_blank" style="width: 100%" class="btn btn-dark"><i class="fab fa-steam-symbol" aria-hidden="true"></i></a>
                                        </div>
                                        <!-- Remove btn -->
                                        <div class="right-no-top ml-auto d-inline" style="width:50%;padding-left: 45px;">
                                            <a style="width: 100%" class="text-white btn btn-danger${hasPermissions(globalvars.perm, "mods/remove", varser.cfg) ? `" onclick="remove('${key}')"` : ' disabled"'}><i class="fa fa-trash-o" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    
                                    <div class="card-footer p-0">
                                        <div class="row">
                                            <div class="col-sm-6 border-right">
                                                <div class="description-block">
                                                    <h5 class="description-header">${convertTime(typeof(i) !== "undefined" ? i.time_updated !== undefined ? i.time_updated * 1000 : 0 : 0)}</h5>
                                                    <span class="description-text">${globalvars.lang_arr.serverCenterMods.time}</span>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="description-block">
                                                    <h5 class="description-header"><b>${val}</b></h5>
                                                    <span class="description-text">${globalvars.lang_arr.serverCenterMods.modid}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                })
            }

            // Keie Mods gefunden
            if(list === ``) {
                list = `<ul class="list-group ml-2 mr-2 mb-4" style="border:0; width: 100%">
                            <div class="list-group-item bg-warning">
                                <div class="row p-0">
                                    <div class="col-12">
                                        <i class="text-black-50 fas fa-exclamation-triangle -align-left position-absolute" style="font-size: 45px;color: rgba(0,0,0,.5)!important;" height="50" width="50" aria-hidden="true"></i>
                                        <div style="margin-left: 60px;">${globalvars.lang_arr.serverCenterMods.noModFoundTitle}<br><span style="font-size: 11px;">${globalvars.lang_arr.serverCenterMods.noModFoundText}</span></div>
                                    </div>
                                </div>
                            </div>
                        </ul>`
            }

            if($('#modlist').html() !== list) $('#modlist').html(list)
        })
    })
}

function getTnstalled() {
    // Hole SteamAPI
    $.get('/json/steamAPI/mods.json', (steamAPI) => {
        steamAPI = steamAPI.response.publishedfiledetails

        // Hole aktuelle Modlist
        $.get('/ajax/serverCenterMods', {
            serverInfos     : true,
            cfg             : vars.cfg
        }, (server) => {
            let json            = JSON.parse(server)
            server              = json.serverCFG
            let serverInfos     = json.serverInfos
            let list = ``
            if(serverInfos.installedMods.length > 0) {
                serverInfos.installedMods.forEach((val, key) => {
                    let i = steamAPI.find(p => p.publishedfileid == val)
                    list += `<div class="col-lg-6 col-xl-3" id="modi${val}">
                                <div class="card card-widget widget-user item-box">
                                    <div class="card bg-dark card-widget widget-user mb-0">
                                        <div class="row p-2">
                                            <div class="col-6">
                                                <h5 class="text-center left d-inline pt-3 pl-0 m-0 ${server.mods.includes(parseInt(val).toString()) ? "text-success" : "text-danger"}">
                                                    ${server.mods.includes(parseInt(val).toString()) ? globalvars.lang_arr.serverCenterMods.active : globalvars.lang_arr.serverCenterMods.notActive}
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="widget-user-header text-white" style="background: url('/img/backgrounds/5.jpg') center center;">
                                        <h5 title="${typeof(i) !== "undefined" ? i.title !== undefined ? i.title : "???" : "???"}" class="widget-user-desc text-bold text-center text-light border" style="background-color: rgb(66 66 66 / 58%)!important;">${typeof(i) !== "undefined" ? i.title !== undefined ? `${i.title.substr(0, 14)}...` : "???" : "???"}</h5>
                                    </div>
                                    <div class="widget-user-image" id="serv_img" style="top: 124px;z-index: 1000"><img src="${typeof(i) !== "undefined" ? i.preview_url !== undefined ? i.preview_url : "https://steamuserimages-a.akamaihd.net/ugc/885384897182110030/F095539864AC9E94AE5236E04C8CA7C2725BCEFF/" : "https://steamuserimages-a.akamaihd.net/ugc/885384897182110030/F095539864AC9E94AE5236E04C8CA7C2725BCEFF/"}" style="border-top-width: 3px!important;height: 90px;width: 90px;background-color: #001f3f" class="border-secondary"></div>
                                    
                                    <div class="card card-widget widget-user mb-0">
                                        <!-- Steam URL -->
                                        <div class="text-left left d-inline" style="width:50%;padding-right: 45px;">
                                            <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=${val}" target="_blank" style="width: 100%" class="btn btn-dark"><i class="fab fa-steam-symbol" aria-hidden="true"></i></a>
                                        </div>
                                        <!-- Remove btn -->
                                        <div class="right-no-top ml-auto d-inline" style="width:50%;padding-left: 45px;">
                                            <a style="width: 100%" class="text-white btn btn-danger${hasPermissions(globalvars.perm, "mods/remove", varser.cfg) ? `" onclick="removeInstalled('${val}')"` : ' disabled"'}><i class="fa fa-trash-o" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    
                                    <div class="card-footer p-0">
                                        <div class="row">
                                            <div class="col-sm-6 border-right">
                                                <div class="description-block">
                                                    <h5 class="description-header">${convertTime(typeof(i) !== "undefined" ? i.time_updated !== undefined ? i.time_updated * 1000 : 0 : 0)}</h5>
                                                    <span class="description-text">${globalvars.lang_arr.serverCenterMods.time}</span>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="description-block">
                                                    <h5 class="description-header"><b>${val}</b></h5>
                                                    <span class="description-text">${globalvars.lang_arr.serverCenterMods.modid}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                })
            }

            // Keine Mods gefunden
            if(list === ``) {
                list = `<ul class="list-group ml-2 mr-2 mb-4" style="border:0; width: 100%">
                            <div class="list-group-item bg-warning">
                                <div class="row p-0">
                                    <div class="col-12">
                                        <i class="text-black-50 fas fa-exclamation-triangle -align-left position-absolute" style="font-size: 45px;color: rgba(0,0,0,.5)!important;" height="50" width="50" aria-hidden="true"></i>
                                        <div style="margin-left: 60px;">${globalvars.lang_arr.serverCenterMods.noModFoundTitle}<br><span style="font-size: 11px;">${globalvars.lang_arr.serverCenterMods.noModFoundText}</span></div>
                                    </div>
                                </div>
                            </div>
                        </ul>`
            }

            if($('#modlist_installed').html() !== list) $('#modlist_installed').html(list)
        })
    })
}


function remove(key) {
    $.post('/ajax/serverCenterMods' , {
        remove  : true,
        key     : key,
        cfg     : vars.cfg
    }, (data) => {
        try {
            data    = JSON.parse(data)
            if(data.alert !== undefined) $('#all_resp').append(data.alert)
            if(data.success === true) $(`mod${modid}`).remove()
            get()
        }
        catch (e) {
            console.log(e)
        }
    })
    return false
}

function removeInstalled(modid) {
    $.post('/ajax/serverCenterMods' , {
        removeIstalled  : true,
        modID           : modid,
        cfg             : vars.cfg
    }, (data) => {
        try {
            data    = JSON.parse(data)
            if(data.alert !== undefined) $('#all_resp').append(data.alert)
            get()
        }
        catch (e) {
            console.log(e)
        }
    })
    return false
}

function push(up, key) {
    $.post('/ajax/serverCenterMods' , {
        push    : true,
        key     : key,
        up      : up,
        cfg     : vars.cfg
    }, (data) => {
        try {
            data    = JSON.parse(data)
            if(data.alert !== "") $('#all_resp').append(data.alert)
            get()
        }
        catch (e) {
            console.log(e)
        }
    })
    return false
}

function addmod() {
    $.post('/ajax/serverCenterMods' , {
        data    : $('#modadd').val(),
        addmod  : true,
        cfg     : vars.cfg
    }, (data) => {
        try {
            data    = JSON.parse(data)
            if(data.alert !== undefined) $('#modal_resp').append(data.alert)
            if(data.success) $('#modadd').val('')
            get()
        }
        catch (e) {
            console.log(e)
        }
    })
    return false
}