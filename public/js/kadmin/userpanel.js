/*
* *******************************************************************************************
* @author:  Oliver Kaufmann (Kyri123)
* @copyright Copyright (c) 2019-2020, Oliver Kaufmann
* @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
* Github: https://github.com/Kyri123/KAdmin-Minecraft
* *******************************************************************************************
*/
"use strict"

getUserList()
getCodeList()
setInterval(() => {
    getUserList()
    getCodeList()
},2000)

/**
 * hole Benutzerliste
 */
function getUserList() {
    $.get('/ajax/userpanel', {
        getuserlist: true
    }, (data) => {
        try {
            let users       = JSON.parse(data).userlist
            let userlist    = ``
            let modallist   = ``
            let htmUserList = $('#userlist')

            users.forEach((val, key) => {
                let remove  = [
                    `'#removeID~val~${val.id}'`,
                    `'#removeTitle~htm~${val.username}'`
                ]
                let rangIDs = JSON.parse(val.rang)
                let groups = [
                    `'#userID~val~${val.id}'`,
                    `'#userTitle~htm~${val.username}'`
                ]
                rangIDs.forEach((val) => groups.push(`'#group${val}~checkbox~true'`))
                if(key !== 0) userlist += `<tr>
                                                <td>
                                                    ${val.username}
                                                </td>
                                                <td>
                                                    <span class="text-${rangIDs.includes(1) ? "danger" : "success"}">${rangIDs.includes(1) ? globalvars.lang_arr.userpanel.modal.admin: globalvars.lang_arr.userpanel.modal.user}</span>
                                                </td>
                                                <td>
                                                    ${val.email}
                                                </td>
                                                <!--<td>
                                                    val.registerdate
                                                </td>
                                                <td>
                                                    val.lastlogin
                                                </td>-->
                                                <td class="project-actions text-right">
                                                    ${hasPermissions(globalvars.perm, "all/is_admin") ? `<a id="banbtn${val.id}" class="btn btn-info btn-sm" href="#" data-toggle="modal" data-target="#groups" onclick="$('#groups').trigger('reset');setInModal(${groups.join(',')})">
                                                        <i class="fas fa-edit" aria-hidden="true"></i>                                                         
                                                        <!--${globalvars.lang_arr.userpanel.perm}-->
                                                    </a>` : ''}
                                                    
                                                    ${hasPermissions(globalvars.perm, "userpanel/delete_user") ? `<a class="btn btn-danger btn-sm" href="#" data-toggle="modal" data-target="#remove" onclick="setInModal(${remove.join(',')})">
                                                        <i class="fas fa-trash" aria-hidden="true"></i> 
                                                        <!--${globalvars.lang_arr.userpanel.remove}-->
                                                    </a>` : ''}
                                                    
                                                    ${hasPermissions(globalvars.perm, "userpanel/ban_user") ? `<a id="banbtn${val.id}" class="btn btn-${val.ban === 1 ? "danger" : "success"} btn-sm" href="#" onclick="toggleUser('${val.id}', this.id)">
                                                        ${val.ban === 0 ? globalvars.lang_arr.userpanel.banned: globalvars.lang_arr.userpanel.free}
                                                    </a>` : ''}
                                                </td>
                                            </tr>`
            })

            if(htmUserList.html() !== userlist) htmUserList.html(userlist)
        }
        catch (e) {
            console.log(e)
        }
    })
}

/**
 * hole Codeliste
 */
function getCodeList() {
    $.get('/ajax/userpanel', {
        getcodelist: true
    }, (data) => {
        try {
            let codes       = JSON.parse(data).codelist
            let codeList    = ``
            let codeListID  = $('#codes')

            codes.forEach((val, key) => {
                codeList += `<tr id="code${val.id}">
                                <td style="width:5%">
                                    <span class="text-${val.rang === 1 ? "danger" : "success"}">${val.rang === 1 ? globalvars.lang_arr.userpanel.modal.admin: globalvars.lang_arr.userpanel.modal.user}</span>
                                </td>
                                <td style="width:80%">
                                    <div class="input-group">
                                        <input type="text" class="form-control rounded-0" readonly="true" value="${val.code}" id="copy${val.id}">
                                        <span class="input-group-append">
                                            <button onclick="copythis('copy${val.id}')" class="btn btn-primary btn-flat" type="button">
                                                <i class="fas fa-copy" aria-hidden="true"></i>
                                            </button>
                                            ${hasPermissions(globalvars.perm, "userpanel/delete_code") ? `<a class="btn btn-danger" href="#" onclick="removeCode('${val.id}', '#code${val.id}')">
                                                <i class="fas fa-trash" aria-hidden="true"></i>
                                            </a>` : ''}
                                        </span>
                                    </div>
                                </td>
                            </tr>`
            })

            if(codeListID.html() !== codeList) codeListID.html(codeList)
        }
        catch (e) {
            console.log(e)
        }
    })
}

/**
 * Entfernt einen Code
 * @param {string} id (Von)
 * @param {string} htmlID (Ausgabe Ziel)
 * @return {boolean}
 */
// Entferne Code
function removeCode(id, htmlID) {
    // führe Aktion aus
    $.post(`/ajax/userpanel`, {
        removeCode  : true,
        id          : id
    }, (data) => {
        try {
            data    = JSON.parse(data)
            if(data.alert !== undefined) $('#global_resp').append(data.alert)
            if (data.remove !== undefined) {
                $(htmlID).remove()
            }
        }
        catch (e) {
            console.log(e)
        }
    })
}

/**
 * erstellt einen Code
 */
function createCode() {
    // führe Aktion aus
    $.post(`/ajax/userpanel`, $("#addserver").serialize(), (data) => {
        try {
            data    = JSON.parse(data)
            if(data.alert !== undefined) $('#global_resp').append(data.alert)
            if (data.added !== undefined) {
                getCodeList()
            }
        }
        catch (e) {
            console.log(e)
        }
    })
}

/**
 * Entfernt einen Benutzer
 */
function removeUser() {
    // führe Aktion aus
    $.post(`/ajax/userpanel`, $('#remove').serialize(), (data) => {
        try {
            data    = JSON.parse(data)
            if(data.alert !== undefined) $('#global_resp').append(data.alert)
            if (data.remove !== undefined) {
                $('#remove').modal('hide')
                $('.modal-backdrop').remove()
            }
        }
        catch (e) {
            console.log(e)
        }
    })
}

/**
 * Benutzer Bannen oder entbannen
 * @param {string} id (Von)
 * @param {string} htmlID (Ausgabe Ziel)
 * @return {boolean}
 */
function toggleUser(id, btnID) {
    // führe Aktion aus
    $.post(`/ajax/userpanel`, {
        toggleUser  : true,
        id          : id
    }, (data) => {
        try {
            data    = JSON.parse(data)
            if(data.alert !== undefined) $('#global_resp').append(data.alert)
            if (data.toggled !== undefined) {
                $('#' + btnID).html(data.ban === 0 ? globalvars.lang_arr.userpanel.banned: globalvars.lang_arr.userpanel.free).toggleClass('btn-danger', data.ban === 1).toggleClass('btn-success', data.ban === 0)
            }
        }
        catch (e) {
            console.log(e)
        }
    })
    return false
}

function sendGroups() {
    $.post(`/ajax/userpanel`, $(`#groups`).serialize(), (data) => {
        try {
            data    = JSON.parse(data)
            if(data.alert !== undefined) $('#global_resp').append(data.alert)
            getUserList()
            if(data.success !== undefined) {
                $(`#groups`).modal('hide')
                $('.modal-backdrop').remove()
            }
        }
        catch (e) {
            console.log(e)
        }
    })
    return false
}