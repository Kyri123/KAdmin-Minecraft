/*
* *******************************************************************************************
* @author:  Oliver Kaufmann (Kyri123)
* @copyright Copyright (c) 2019-2020, Oliver Kaufmann
* @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
* Github: https://github.com/Kyri123/KAdmin-Minecraft
* *******************************************************************************************
*/
"use strict"

const VUE_configControler = new Vue({
   el    : '#configControler',
   data  : {
      files : []
   }
})

function getConfigs() {
   $.get(`/ajax/config?${Date.now()}`, {
      fileList: true
   })
      .done((data) => {
         try {
            VUE_configControler.files  = JSON.parse(data)
         }
         catch (e) {
            console.log(e)
            setTimeout(() => {
               getConfigs()
            }, 1000)
         }
      })
      .fail(() => {
         setTimeout(() => {
            getConfigs()
         }, 1000)
      })
}
getConfigs()

function saveCfg(cfg) {
   $.post(`/ajax/config`, $(`#pills-${cfg}`).serialize())
      .done((data) => {
         try {
            data = JSON.parse(data)
            fireToast(data.success ? 1 : 19, data.success ? "success" : "error")
         } catch (e) {
            console.log(e)
            fireToast(19, "error")
         }
      })
      .fail(() => {
         fireToast(19, "error")
      })
}