/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-ArkWIN/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-ArkWIN
 * *******************************************************************************************
 */
"use strict"

//Global vars
var globalServerList = $('#globalServerList');

// hole Serverliste
getServerList();
setInterval(() => {
    getServerList();
},5000)


function getServerList() {
    $.get('/ajax/serverCenterAny', {
        "getglobalinfos": true
    }, (data) => {
        let newServerList = ``;
        data = JSON.parse(data);

        if(hasPermissions(globalvars.perm, "all/show_traffic")) {
            // Server
            $('#top_on')        .html(data.servercounter.on);
            $('#top_off')       .html(data.servercounter.off);
            $('#top_proc')      .html(data.servercounter.proc);
            $('#top_total')     .html(data.servercounter.total);
            $('#top_perc')      .css('width', `${data.servercounter.on / data.servercounter.total * 100}%`);

            // CPU
            $('#cpu')           .html(`${data.server_data.cpu} <small>%</small>`);
            $('#cpu_perc')      .css('width', `${data.server_data.cpu}%`);

            // Speicher
            $('#mem')           .html(`${data.server_data.mem_availble} / ${data.server_data.mem_total}`);
            $('#mem_perc')      .css('width', `${data.server_data.mem}%`);

            // RAM
            $('#ram')           .html(`${data.server_data.ram_availble} / ${data.server_data.ram_total}`);
            $('#ram_perc')      .css('width', `${data.server_data.ram}%`);
        }

        data.servers_arr.forEach((val, key) => {

            let stateColor                                       = "danger";
            if(!val[1].is_installed)                  stateColor = "warning";
            if(val[1].pid !== 0 && !val[1].online)    stateColor = "primary";
            if(val[1].pid !== 0 && val[1].online)     stateColor = "success";
            if(val[1].cmd || val[1].steamcmd)         stateColor = "info";

            if(val[1].server === undefined && hasPermissions(globalvars.perm, "show", val[0])) newServerList += `
            <a href="/servercenter/${val[0]}/home" class="dropdown-item bg-light">
                <div class="media">
                    <div class="mr-2"><img src="/img/igmap/${val[1].serverMap}.jpg" style="border-width: 3px!important;background-color: #001f3f" class="img-size-50 border border-${stateColor}"></div>
                    <div class="media-body">
                        <h3 class="dropdown-item-title">
                            ${val[1].sessionName}
                        </h3>
                        <p class="text-sm pt-2">
                            ${stateColor === "success" ? `${val[1].aplayers} / ${val[1].players}` : "0 / 0"} | V.${val[1].version}
                            <!--<br><span class="info-box-text"><i class="fas fa-random" aria-hidden="true"></i> %CLUSTER%</span>-->
                        </p>
                    </div>
                </div>
            </a>`;
        });
        if(globalServerList.html() !== newServerList) globalServerList.html(newServerList);
    });
}



function setInModal() {
    Object.values(arguments).forEach((arg) => {
        let id      = arg.split('~')[0];
        let type    = arg.split('~')[1];
        let val     = arg.split('~')[2];

        if(type === "txt")      $(id).text(val);
        if(type === "val")      $(id).val(val);
        if(type === "htm")      $(id).html(val);
        if(type === "checkbox") $(id).prop('checked', val === "true");
    })
}

