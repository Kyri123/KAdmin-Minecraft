/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports  = {
    /**
     * Führt SHELL Command aus
     * @param {string} command CMD command
     * @returns {boolean}
     */
    runSHELL: (command) => {
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m runCMD > ${command}`)

        async function cmd() {
            const { stdout, stderr } = await exec(command)
            /*if(debug && stdout.trim() !== "")
                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m runCMD > ${command} >`, stdout)
            if(debug && stderr.trim() !== "")
                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m runCMD > ${command} >`, stderr)*/
        }
        cmd()

        return true
    },
}