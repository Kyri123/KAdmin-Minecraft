import {lstatSync, readdirSync} from "fs";
import path from "path";


let DoScan = function (FilePath: string) {
    let Files = readdirSync(FilePath);

    for(const File of Files) {
        let FileP = path.join(FilePath, File);
        let State = lstatSync(FileP);
        if(State.isDirectory()) {
            if (!File.endsWith('.map') && !File.includes("Default.js")) {
                require(FileP);
            }
        }
        else
            DoScan(FileP);
    }
}

require(path.join(__dirname, 'Routes', 'Default.js'));
DoScan(path.join(__dirname, 'Routes'));