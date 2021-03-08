/*
* *******************************************************************************************
* @author:  Oliver Kaufmann (Kyri123)
* @copyright Copyright (c) 2019-2020, Oliver Kaufmann
* @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
* Github: https://github.com/Kyri123/KAdmin-Minecraft
* *******************************************************************************************
*/
"use strict"

const VUE_changelogContainer = new Vue({
   el    : '#changelogContainer',
   data  : {
      changelogs : []
   }
})

let timeOut = false
function getChangelog() {
    $.get('/ajax/all', {
        request: true,
        requestURL: 'https://api.minecraft.kadmin-panel.de/changelog.json'
    })
        .done((data) => {
            if (data !== 'false') {
                let array = JSON.parse(data).reverse()
                array.forEach((value, key) => {
                    console.log(key)
                    array[key].isOpen = false
                })
                VUE_changelogContainer.changelogs = array
                timeOut = false
            }
            else {
                console.log('CHANGELOG > retry in 5')
                setTimeout(() => getChangelog(), 5000)
                timeOut = true
            }
        })
}

getChangelog()
/*setInterval(() => {
    if(!timeOut) getChangelog()
}, 60000)*/