import dateFormat from "dateformat";
import {ConfigManager} from "../Helper/ConfigManager";
import * as fs from "fs";
import path from "path";
import * as util from "util";
import {safeFileMkdirSync} from "./util";

export function OverwriteConsole() {
    // überschreibe console.log
    let logDir          = path.join(__dirname, "latest_logs")
    let logFile         = path.join(logDir, "current.log")

    // erstelle Log ordner & file (Überschreibe Console.log())
    if(fs.existsSync(logDir)) fs.rmSync(logDir, {recursive: true})
    fs.mkdirSync(logDir)
    fs.writeFileSync(logFile, "")

    let logStream = fs.createWriteStream(logFile, {flags : 'w'});
    let logStdout = process.stdout;

    console.log = function() {
        logStdout.write(util.format(...arguments) + '\n')

        for(let i in arguments) {
            if(typeof arguments[i] === "string") arguments[i] = arguments[i]
                .replaceAll('%s\x1b[0m', '')
                .replaceAll('\x1b[30m', '')
                .replaceAll('\x1b[31m', '')
                .replaceAll('\x1b[32m', '')
                .replaceAll('\x1b[33m', '')
                .replaceAll('\x1b[34m', '')
                .replaceAll('\x1b[35m', '')
                .replaceAll('\x1b[36m', '')
        }

        logStream.write(util.format(...arguments) + '\n', () => logStream.emit("write"))
    }
}

export function CheckOSAndNode() {
    // Prüfe NodeJS version
    if(parseInt(process.version.replaceAll(/[^0-9]/g, '').slice(0, 2)) < 16) {
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m NodeJS Version not supported (min 16.0.0) you use ${process.version}`)
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
        process.exit(1)
    }

    // Prüfe OS
    if(process.platform === "win32") {
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m OS is Windows or not supported`)
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit KAdmin-Minecraft`)
        process.exit(1)
    }
}

export function MakeRootPaths() {
    safeFileMkdirSync([ConfigManager.GetEnvConfig.Panel_ServerRootDir])
    safeFileMkdirSync([ConfigManager.GetEnvConfig.Panel_LogRootDir])
    safeFileMkdirSync([ConfigManager.GetEnvConfig.Panel_BackupRootDir])
}

export function InitGithub() {
}
