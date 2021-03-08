/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"
let old_state = {}

// hole Serverliste zyklisch
getServerList()
setInterval(() =>
   getServerList()
,2000)

// Vue Serverlist
const VUE_serverlist = new Vue({
   el      : '#serverlist',
   data    : {
      serverlist  : [],
      serverOn    : 0
   }
})

//hole Serverliste für Navigation oben
function getServerList() {
   let servercount_off     = 0
   let servercount_on      = 0
   let servercount_total   = 0
   $.get('/ajax/serverCenterAny', {
      "getglobalinfos": true
   }, (data) => {
      let newServerList = []
      data = JSON.parse(data)

      data.servers_arr.forEach((val, key) => {
         let server = {}

         if(hasPermissions(globalvars.perm, "show", val[0])) {
            let                                                            stateColor = "danger"
            if (!val[1].is_installed)                                      stateColor = "warning"
            if (val[1].pid !== 0 && val[1].online)                         stateColor = "success"
            if ((val[1].pid !== 0 && !val[1].online) || val[1].isAction)   stateColor = "primary"
            if (val[1].is_installing)                                      stateColor = "info"

            if (old_state[val[0]] === undefined) old_state[val[0]] = stateColor
            if (old_state[val[0]] !== stateColor) {
               fireToast(stateColor, "info", {
                  replace: [
                     ["{server}"],
                     [val[1].selfname]
                  ]
               })
               old_state[val[0]] = stateColor
            }

            server.name = val[0]
            server.url = `/servercenter/${val[0]}/home`
            server.class = `float-right text-sm text-${stateColor}`
            server.selfname = `${val[1].selfname.substring(0, 22)}${val[1].selfname.length > 22 ? "..." : ""}`
            server.playerCountIS = val[1].aplayers
            server.playerCountMAX = val[1].players

            newServerList.push(server)

            if (val[1].online) servercount_on++
            if (!val[1].online) servercount_off++
            servercount_total++
         }
      })

      if (hasPermissions(globalvars.perm, "all/show_traffic")) {
         // Server
         VUE_traffic.serv_on     = servercount_on
         VUE_traffic.serv_off    = servercount_off
         VUE_traffic.serv_proc   = data.servercounter.proc
         VUE_traffic.serv_total  = servercount_total
         VUE_traffic.serv_perc   = `${servercount_on / servercount_total * 100}%`
      }
      VUE_serverlist.serverlist   = newServerList
      VUE_serverlist.serverOn     = servercount_on
   })
}