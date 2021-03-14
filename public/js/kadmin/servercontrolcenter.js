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
        servers         : {},
        canAdd          : hasPermissions(globalvars.perm, "servercontrolcenter/create"),
        canEdit         : hasPermissions(globalvars.perm, "servercontrolcenter/editServer")
    }
})

let VUE_serverControlCenterModals = new Vue({
    el      : '#serverControlCenterModals',
    data    : {
        cfgForm         : {},
        action          : 'add',
        targetServer    : undefined,
        canAdd          : hasPermissions(globalvars.perm, "servercontrolcenter/create"),
        canEdit         : hasPermissions(globalvars.perm, "servercontrolcenter/editServer")
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

                    objServers[key] = server
                }
            })
            VUE_serverControlCenterContainer.servers = objServers
        }
    })
}

getServers()
setInterval(() => getServers(), 2000)

/**
 * Erstellt ein Server
 */
function sendServer() {
    $.post(`/ajax/servercontrolcenter`, $('#server').serialize())
       .done(function (data) {
           try {
               // erzeuge Meldungen
               let response = JSON.parse(data)
               if(response.action === "add")    fireToast(response.success ? 43 : 42, response.success ? "success" : "error")
               if(response.action === "edit")   fireToast(response.success ? 45 : 44, response.success ? "success" : "error")

               // reload
               getServers()

               // schließe Modal
               $(`#server`).modal('hide')
               $('.modal-backdrop').remove()
           } catch (e) {
               console.log(e)
               $(`#server`).modal('hide')
               $('.modal-backdrop').remove()
               fireToast(46, "error")
           }
       })
       .fail(() => {
           fireToast(46, "error")
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

/**
 * Öffnet das Modal mit Value Daten
 * @param {string} action Aktion (add oder edit)
 * @param {string} server welchen server (undefined oder existierenden Server Namen)
 */
function openModal(action, server = undefined) {
    $.get('/ajax/servercontrolcenter', {
        serverCfg   : server,
        type        : action
    })
       .done((data) => {
           try{
               let response                                  = JSON.parse(data)
               VUE_serverControlCenterModals.action          = action
               VUE_serverControlCenterModals.cfgForm         = response
               VUE_serverControlCenterModals.targetServer    = server
               $(`#server`).modal('show')
           }
           catch (e) {
               //setTimeout(() => openModal(action, server), 2000)
           }
       })
}