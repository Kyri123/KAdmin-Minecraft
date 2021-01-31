/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 * tool für Ausführungen von RCON mit CMD/Shell (Commandline with args)
 */

var Rcon = require('rcon')

let args = process.argv.slice(2)

switch (args[0]) {
    case 'rcon':
        let options = {
            tcp: true,
            challenge: true
        }

        conn = new Rcon(args[1], args[2], args[3], options)
        conn.on('auth', () => {
            conn.send(args[4])
        }).on('response', (str) => {
            console.log("Got response: " + str)
            conn.connect()
            process.exit(1)
        }).on('end', () => {
            console.log("Socket closed!")
            conn.connect()
            process.exit()
        })

        conn.connect()
        break
    default:
        console.log('please use: node rcon.js rcon <host> <port> <password> "<command>"')
        break
}