/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const toEnd = `    <a class="col-lg-6 col-xl-6" data-toggle="modal" data-target="#addserver" href="#">
                        <div class="border border-success text-success align-content-center justify-content-center align-items-center d-flex card" style="font-size: 75px; width:100%; height:278px; border: 2px solid!important; cursor: pointer">
                            <i class="fas fa-plus" aria-hidden="true"></i>
                        </div>
                    </a>`

setInterval(() => {
    $.get('/ajax/serverCenterAny?getglobalinfos', (datas) => {
        serverList  = JSON.parse(datas).servers_arr
        if(serverList.length > 0) {
            let list = ``
            serverList.forEach((val) => {
                let stateColor = val[1].is_installed ? (
                    val[1].is_free ? (
                        val[1].pid !== 0 && val[1].online ? "success"
                            : (val[1].pid !== 0 ? "info" : "danger")
                    ) : "info"
                ) : (val[1].is_free ? "warning" : "info")

                if(val[1].server === undefined && hasPermissions(globalvars.perm, "show", val[0])) list +=    `    <div class="col-lg-6 col-xl-6" id="${val[0]}">
                                    <div class="card card-widget widget-user  item-box">
                                        <div class="card bg-dark card-widget widget-user mb-0">
                                            <div class="row p-2" title="${val[1].sessionName}">
                                                <div class="col-12 text-center">
                                                    <h5 class="text-center left d-inline pt-3 pl-0 m-0">
                                                        ${val[1].sessionName}
                                                    </h5>
                                                </div>
                            
                                            </div>
                                        </div>
                                        <div class="widget-user-header text-white" style="background: url('/img/backgrounds/TheIsland.jpg') center center;">
                            
                                            <!--<h5 title="" class="widget-user-desc text-bold text-center border" style="background-color: rgb(66 66 66 / 58%)!important;">
                                                <a href="/cluster#4c51f09bf0330d03047f8bc634290fc8" class="text-light"></a>
                                            </h5>-->
                            
                                        </div>
                                        <div class="widget-user-image" id="serv_img" style="top: 124px;z-index: 1000"><img src="/img/igmap/TheIsland.jpg" style="border-top-width: 3px!important;height: 90px;width: 90px;background-color: #001f3f" class="border-secondary"></div>
                                        <div class="card card-widget widget-user mb-0">
                                            <div class="text-left left d-inline" style="width:50%;padding-right: 45px;">
                                                <a href="/servercenter/${val[0]}" target="_blank" style="width: 100%" class="btn btn-dark"><i class="fas fa-server" aria-hidden="true"></i></a>
                                            </div>
                                            <div class="right-no-top ml-auto d-inline" style="width:50%;padding-left: 45px;">
                                                <a style="width: 100%" class="text-white btn btn-danger${hasPermissions(globalvars.perm, "servercontrolcenter/delete", val[0]) ? `" data-toggle="modal" data-target="#remove${val[0]}"` : ' disabled"'}><i class="fa fa-trash-o" aria-hidden="true"></i></a>
                                            </div>
                                        </div>
                                        <div class="card-footer p-0">
                                            <div class="row">
                                                <div class="col-sm-4 border-right border-sm-right">
                                                    <div class="description-block">
                                                        <h5 class="description-header"><b><a href="steam://connect/${vars.ip}:${val[1].query}">${vars.ip}:${val[1].query}</a></b></h5>
                                                        <span class="description-text">${globalvars.lang_arr.servercontrolcenter.ip}</span>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4 border-right border-sm-right">
                                                    <div class="description-block">
                                                        <h5 class="description-header"><b class="text-${stateColor}">${globalvars.lang_arr.state[stateColor]}</b></h5>
                                                        <span class="description-text">${globalvars.lang_arr.servercontrolcenter.state}</span>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="description-block">
                                                        <h5 class="description-header"><b>${val[1].serverMap}</b></h5>
                                                        <span class="description-text">${globalvars.lang_arr.servercontrolcenter.map}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `

                if($(`#remove${val[0]}`).html() === undefined) $('#modallist').append(`<form class="modal fade" method="post" action="#" id="remove${val[0]}" tabindex="-1" style="display: none;" aria-hidden="true">
                                    <div class="modal-dialog modal-xl" role="document" style="max-width: 700px">
                                        <div class="modal-content border-0">
                                            <div class="modal-header bg-danger">
                                                <h5 class="modal-title">${globalvars.lang_arr.servercontrolcenter.modalDelete.title}</h5>
                                            </div>
                                
                                            <div class="modal-body">
                                                <p>${globalvars.lang_arr.servercontrolcenter.modalDelete.text.replace("{servername}", val[1].sessionName)}</p>
                                                <input name="cfg" value="${val[0]}" type="hidden">
                                                <input name="deleteserver" value="true" type="hidden">
                                            </div>
                                
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">${globalvars.lang_arr.servercontrolcenter.modalDelete.cancel}</button>
                                                <button type="button" class="btn btn-danger" name="del" onclick="submitform('#remove${val[0]}')">${globalvars.lang_arr.servercontrolcenter.modalDelete.remove}</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>`)
            })
            if(hasPermissions(globalvars.perm, "servercontrolcenter/create")) list += toEnd

            if($('#serverlist').html() !== list)        $('#serverlist').html(list)
        }
    })
}, 2000)

function submitform(id) {
    $.post(`/ajax/servercontrolcenter`, $(id).serialize())
        .done(function(data) {
            try {
                data = JSON.parse(data)
                if(data.alert !== undefined) $('#global_resp').append(data.alert)
                if (data.remove !== undefined) {
                    $(id).modal('hide')
                    $(`#remove${data.removed}`).modal('hide').remove()
                    $(`#${data.removed}`).remove()
                    $('.modal-backdrop').remove()
                }
                if(data.added !== undefined) {
                    $(`#addserver`).modal('hide')
                }
            }
            catch (e) {
                $(id).modal('hide')
            }
        })
}