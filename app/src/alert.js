/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

module.exports = {
    /**
     * @param {int}     code            Code für den Alert (lang file)
     * @param {string}  custom_style    Style="XXX"
     * @param {int}     mb              Margin-Bottom
     * @param {int}     ml              Margin-Left
     * @param {int}     mr              Margin-Right
     * @param {int}     mt              Margin-Top
     * @returns {string|undefined}      Undefined -> Code nicht vorhanden
     */
    rd: (code, custom_style = "", mb = 3, ml = 0, mr = 0, mt = 0) => {
        if(PANEL_LANG_ALERT[code] !== undefined) {
            let color   = code >= 1000 ? (code >= 2000 ? (code >= 3000 ? "info" : "warning") : "success") : "danger"
            let text    = PANEL_LANG_ALERT[code].text
            let title   = PANEL_LANG_ALERT[code].title
            let rnd     = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7)

            return `<div class="callout callout-${color} mb-${mb} ml-${ml} mr-${mr} mt-${mt}" style="${custom_style}" id="${rnd}">
                          <button type="button" class="close" onclick="$('#${rnd}').fadeOut()">
                            <span aria-hidden="true">&times;</span>
                          </button>
                          <h5 class="text-${color}"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i> ${title}</h5>
                          ${text}
                    </div>`
        }
        return undefined
    }
}