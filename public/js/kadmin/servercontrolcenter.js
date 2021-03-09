/*
* *******************************************************************************************
* @author:  Oliver Kaufmann (Kyri123)
* @copyright Copyright (c) 2019-2020, Oliver Kaufmann
* @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
* Github: https://github.com/Kyri123/KAdmin-Minecraft
* *******************************************************************************************
*/
"use strict"

let VUE_serverControlCenterContainer = new Vue({
    el      : '#serverControlCenterContainer',
    data    : {
        servers: {}
    }
})

function getServers() {
    /**
     * hole Server für die Anzeige
     */
    $.get('/ajax/serverCenterAny?getglobalinfos', (datas) => {
        let serverList = JSON.parse(datas).servers_arr
        let objServers = {}

        if (serverList.length > 0) {
            let list = ``
            serverList.forEach((val, key) => {
                console.log(key)
                let server = {}
                if (hasPermissions(globalvars.perm, "show", val[0])) {
                    let stateColor = "danger"
                    if (!val[1].is_installed) stateColor = "warning"
                    if (val[1].pid !== 0 && !val[1].online) stateColor = "primary"
                    if (val[1].pid !== 0 && val[1].online) stateColor = "success"
                    if (val[1].is_installing) stateColor = "info"

                    server.stateColor   = stateColor
                    server.name         = val[0]
                    server.datas        = val[1]
                    server.deleletePerm = hasPermissions(globalvars.perm, "servercontrolcenter/delete")
                    server.editPerm     = hasPermissions(globalvars.perm, "servercontrolcenter/editServer")

                    console.log(server)

                    objServers[key] = server
                }
            })
            VUE_serverControlCenterContainer.servers = objServers
        }
    })
}

getServers()
setInterval(() => {
    getServers()
}, 2000)

/**
 * Erstellt ein Server
 */
function addServer() {
    $.post(`/ajax/servercontrolcenter`, $('#addserver').serialize())
       .done(function (data) {
           try {
               let success = JSON.parse(data).success
               $(`#addserver`).modal('hide')
               $('.modal-backdrop').remove()
               fireToast(success ? 43 : 42, success ? "success" : "error")
               if(success) getServers()
           } catch (e) {
               $(id).modal('hide')
               $('.modal-backdrop').remove()
               fireToast(42, "error")
           }
       })
       .fail(() => {
           fireToast(42, "error")
       })
}

/**
 * Entfernen eines Servers
 * @param {string} server
 */
function remove(server) {
    if(hasPermissions(globalvars.perm, "show", server)) swalWithBootstrapButtons .fire({
        icon: 'question',
        text: globalvars.lang_arr["servercontrolcenter"].modalDelete.text.replace('{servername}', server),
        title: `<strong>${globalvars.lang_arr["servercontrolcenter"].modalDelete.remove}</strong>`,
        showCancelButton: true,
        confirmButtonText: `<i class="far fa-trash-alt"></i>`,
        cancelButtonText: `<i class="fas fa-times"></i>`,
    }).then((result) => {
        let cancel = true
        if (result.isConfirmed) {
            $.post("/ajax/serverControlCenter", {
                cfg             : server,
                deleteserver    : true
            })
               .done((data) => {
                   try {
                       let success = JSON.parse(data).success
                       fireToast(success ? 41 : 40, success ? 'success' : 'error')
                       getServers()
                   }
                   catch (e) {
                       console.log(e)
                       fireToast(40, "error")
                   }
               })
               .fail(() => {
                   fireToast(40, "error")
               })
            cancel = false
        }
        if(cancel) fireToast(40, "error")
    })
}