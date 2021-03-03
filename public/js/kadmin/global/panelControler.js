/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

// PanelControler
const VUE_panelControler = new Vue({
   el          : "#panel_menue",
   data        : {
      is_update : globalvars.isUpdate,
   }
})

setInterval(() => {
   VUE_panelControler.is_update = globalvars.isUpdate
},2000)