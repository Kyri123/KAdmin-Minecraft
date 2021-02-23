/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict"

const util      = require('util');
const exec      = util.promisify(require('child_process').exec)
const execSync  = require('child_process').execSync

/**
 * Führt einen Befehl aus
 * @param command
 * @return {boolean}
 */
async function execShell(command) {
    try {
        const { stdout, stderr } = await exec(command)
        if(debug) {
            if(stdout && debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m runCMD > ${command} >`, stdout)
            if(stderr) {
                if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m runCMD > ${command} >`, stderr)
                return false
            }
            return true
        }
    }
    catch(e) {
        if(debug) console.log(e)
        return false
    }
}

module.exports  = {
    /**
     * Führt SHELL Command aus
     * @param {string} command CMD command
     * @returns {boolean}
     */
    runSHELL: (command) => {
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m runCMD > ${command}`)
        execShell(command)
        return true
    },
    /**
     * Führt SHELL Command aus
     * @param {string} command CMD command
     * @returns {boolean}
     */
    runSyncSHELL: (command) => {
        return execSync(command)
    },
}