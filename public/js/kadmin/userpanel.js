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
            let htmUserList = $('#userlist')

            users.forEach((val, key) => {
                let rangIDs = JSON.parse(val.rang)
                let groups = [
                    `'#userID~val~${val.id}'`,
                    `'#userTitle~htm~${val.username}'`
                ]
                rangIDs.forEach((val) => groups.push(`'#group${val}~checkbox~true'`))

                let groupArr    = val.groupinfo
                let groupNames  = []
                for(let groupItem of groupArr) {
                    if(groupItem !== null) {
                        let groupPerm = JSON.parse(groupItem.permissions)
                        let isAdmin = false
                        if (groupPerm.all !== undefined)
                            if (groupPerm.all.is_admin === 1)
                                isAdmin = true
                        groupNames.push(`<span class="text-${isAdmin ? "danger" : "success"}">${groupItem.name}</span>`)
                    }
                }

                if(key !== 0) userlist += `<tr>
                                                <td>
                                                    ${val.username}
                                                </td>
                                                <td>
                                                    ${groupNames.join(" | ")}
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
                                                    ${hasPermissions(globalvars.perm, "all/is_admin") ? `<a id="btn${val.id}" class="btn btn-info btn-sm" href="#" data-toggle="modal" data-target="#groups" onclick="$('#groups').trigger('reset');setInModal(${groups.join(',')})">
                                                        <i class="fas fa-edit" aria-hidden="true"></i>                                                         
                                                        <!--${globalvars.lang_arr.userpanel.perm}-->
                                                    </a>` : ''}
                                                    
                                                    ${hasPermissions(globalvars.perm, "userpanel/delete_user") ? `<a class="btn btn-danger btn-sm" href="#" data-toggle="modal" data-target="#remove" onclick="removeUser('${val.username}', '${val.id}')">
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
                if(val.groupinfo !== undefined) {
                    let groupinfos = val.groupinfo
                    let groupPerm = JSON.parse(groupinfos.permissions)
                    let isAdmin = false
                    if (groupPerm.all !== undefined)
                        if (groupPerm.all.is_admin === 1)
                            isAdmin = true

                    codeList += `<tr id="code${val.id}">
                                <td style="width:5%">
                                    <span class="text-${isAdmin ? "danger" : "success"}">${groupinfos.name}</span>
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
                }
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
            if (data.remove) {
                $(htmlID).remove()
            }
            fireToast(data.remove ? 31 : 32, data.remove ? "success" : "error")
        }
        catch (e) {
            fireToast(32, "error")
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
            fireToast(data.success ? 25 : 26, data.success ? "success" : "error")
            if (data.success)
                getCodeList()
        }
        catch (e) {
            fireToast(26, "error")
            console.log(e)
        }
    })
}

/**
 * Entfernt einen Benutzer
 */
function removeUser(name, id) {
    swalWithBootstrapButtons .fire({
        icon: 'question',
        text: name,
        title: `<strong>${globalvars.lang_arr.userpanel.modalDelete.text}</strong>`,
        showCancelButton: true,
        confirmButtonText: `<i class="far fa-trash-alt"></i>`,
        cancelButtonText: `<i class="fas fa-times"></i>`,
    }).then((result) => {
        let cancel = true
        if (result.isConfirmed) {
            $.post("/ajax/userpanel", {
                "deleteuser"    : true,
                "uid"           : id
            })
                .done((data) => {
                    try {
                        let success = JSON.parse(data).success
                        fireToast(success ? 29 : 30, success ? 'success' : 'error')
                        getUserList()
                    }
                    catch (e) {
                        console.log(e)
                        fireToast(30, "error")
                    }
                })
                .fail(() => {
                    fireToast(30, "error")
                })
            cancel = false
        }
        if(cancel) fireToast(30, "error")
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
    $(`#${btnID}`).html('<i class="fas fa-spinner fa-pulse"></i>')
    $.post(`/ajax/userpanel`, {
        toggleUser  : true,
        id          : id
    }, () => getUserList())
}

function sendGroups() {
    $.post(`/ajax/userpanel`, $(`#groups`).serialize(), (data) => {
        try {
            data    = JSON.parse(data)
            fireToast(data.success ? 27 : 28, data.success ? "success" : "error")
            getUserList()

            $(`#groups`).modal('hide')
            $('.modal-backdrop').remove()
        }
        catch (e) {
            fireToast(27, "error")
            console.log(e)
        }
    })
    return false
}