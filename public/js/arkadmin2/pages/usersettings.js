/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

// Sende Aktionen
$("#pills-settings").submit(() => {
    // führe Aktion aus
    $.post(`/ajax/usersettings`, $('#pills-settings').serialize())
        .done(function(data) {
            let success = false
            try {
                data = JSON.parse(data)
                if(data.alert !== undefined) $('#global_resp').append(data.alert)
                if (data.done) {
                    success         = true
                    let pw1         = $('#pw1')
                    let pw2         = $('#pw2')
                    let email       = $('#email')
                    let username    = $('#username')

                    // Passwort
                    if(data.what.includes(globalvars.lang_arr.usersettings.pw)) {
                        pw1.val(""); pw2.val("")
                        pw1.toggleClass("border-success", true)
                        pw2.toggleClass("border-success", true)
                        setTimeout(() => {
                            pw1.toggleClass("border-success", false)
                            pw2.toggleClass("border-success", false)
                        }, 2000)
                    }

                    // Email
                    if(data.what.includes(globalvars.lang_arr.usersettings.email)) {
                        email.toggleClass("border-success", true)
                        setTimeout(() => {
                            email.toggleClass("border-success", false)
                        }, 2000)
                    }

                    // Benutzername
                    if(data.what.includes(globalvars.lang_arr.usersettings.username)) {
                        $('#leftUsername').html(username.val())
                        username.toggleClass("border-success", true)
                        setTimeout(() => {
                            username.toggleClass("border-success", false)
                        }, 2000)
                    }

                }
            }
            catch (e) {
                //skip
            }

            if(!success) {
                let submit  = $('#submitsettings')
                submit.toggleClass("btn-danger", true).toggleClass("btn-primary", false)
                setTimeout(() => {
                    submit.toggleClass("btn-primary", true).toggleClass("btn-danger", false)
                }, 2000)
            }
            else {
                let submit  = $('#submitsettings')
                submit.toggleClass("btn-primary", false)
                submit.toggleClass("btn-success", true)
                setTimeout(() => {
                    submit.toggleClass("btn-primary", true)
                    submit.toggleClass("btn-success", false)
                }, 2000)
            }
        })
    return false
});