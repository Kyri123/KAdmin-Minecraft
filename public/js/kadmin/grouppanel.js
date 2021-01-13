/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-ArkWIN/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-ArkWIN
 * *******************************************************************************************
 */
"use strict"

getGroupList()
setInterval(() => {
    getGroupList()
},2000)

function getGroupList() {
    console.log(globalvars.lang_arr.userpanel)
    $.get('/ajax/grouppanel', {
        getgrouplist: true
    }, (data) => {
        try {
            let groups          = JSON.parse(data).grouplist
            let groupList       = ``
            let htmGroupList    = $('#grouplist')

            groups.forEach((val, key) => {
                let perms = JSON.parse(val.permissions)
                let former  = hasPermFiller(perms).split('___')
                let remove  = [
                    `'#removeID~val~${val.id}'`,
                    `'#removeNAME~htm~${val.name}'`
                ]
                let js      = [
                    `'#editgroupid~val~${val.id}'`,
                    `'#editname~val~${val.name}'`,
                    `'#edittitle~htm~${val.name}'`
                ]
                former.forEach((val) => (val !== '') ? js.push(val) : undefined)
                groupList += `    <tr>
                                      <td>
                                          <b>${val.name}</b>
                                      </td>
                                      <td>
                                          <span class="text-${perms.all !== undefined ? perms.all.is_admin !== undefined ? "danger" : "success" : "success"}">
                                            ${perms.all !== undefined ? perms.all.is_admin !== undefined ? globalvars.lang_arr.userpanel.modal.admin: globalvars.lang_arr.userpanel.modal.user: globalvars.lang_arr.userpanel.modal.user}
                                          </span>
                                      </td>
                                      <td class="project-actions text-right">
                                          ${val.id !== 1 ? `<a class="btn btn-danger btn-sm" href="#" data-toggle="modal" data-target="#remove" onclick="setInModal(${remove.join(',')})">
                                              <i class="fas fa-trash" aria-hidden="true">
                                              </i> ${globalvars.lang_arr.grouppanel.remove}
                                          </a>

                                          <a class="btn btn-success btn-sm" href="#" data-toggle="modal" data-target="#edit" onclick="$('#edit').trigger('reset');setInModal(${js.join(',')})">
                                              <i class="fas fa-edit" aria-hidden="true"></i>
                                              ${globalvars.lang_arr.grouppanel.edit}
                                          </a>` : ''}
                                      </td>
                                  </tr>`
            })

            if(htmGroupList.html() !== groupList) htmGroupList.html(groupList)
        }
        catch (e) {
            console.log(e)
        }
    })
}

function hasPermFiller(permission, keys = '') {
    let re          = ''

    for (const [key, value] of Object.entries(permission)) {
        if(typeof value === "object") {
            let thiskey = `${keys}\\\\[${key}\\\\]`
            re += hasPermFiller(value, thiskey)
        }
        else if(typeof value === "number") {
            re += `'#edit${keys}\\\\[${key}\\\\]~checkbox~true'___`
        }
    }

    return re
}

function send(modal) {
    $.post(`/ajax/grouppanel`, $(`#${modal}`).serialize(), (data) => {
        try {
            data    = JSON.parse(data)
            getGroupList()
            if(data.alert !== undefined) $('#global_resp').append(data.alert)
            if(data.success !== undefined) $(`#${modal}`).modal('hide')
        }
        catch (e) {
            console.log(e)
        }
    })
    return false
}