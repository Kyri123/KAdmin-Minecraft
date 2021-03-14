/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

// hole Serverliste zyklisch
getTraffic()
setInterval(() =>
   getTraffic()
,2000)

// Traffic
const VUE_traffic = new Vue({
   el          : "#traffics",
   data        : {
      cpu         : "",
      cpu_perc    : `0%`,
      ram         : "",
      ram_perc    : `0%`,
      mem         : "",
      mem_perc    : `0%`,
      serv_perc   : `0%`,
      serv_on     : "0",
      serv_off    : "0",
      serv_proc   : "0",
      serv_total  : "0"
   }
})

function getTraffic() {
   $.get('/json/serverInfos/auslastung.json', (data) => {
      if (hasPermissions(globalvars.perm, "all/show_traffic")) {

         // CPU
         VUE_traffic.cpu         = `${data.cpu}`
         VUE_traffic.cpu_perc    = `${data.cpu}%`

         // Speicher
         VUE_traffic.mem         = `${data.mem_availble} / ${data.mem_total}`
         VUE_traffic.mem_perc    = `${data.mem}%`

         // RAM
         VUE_traffic.ram         = `${data.ram_availble} / ${data.ram_total}`
         VUE_traffic.ram_perc    = `${data.ram}%`
      }
   })
}