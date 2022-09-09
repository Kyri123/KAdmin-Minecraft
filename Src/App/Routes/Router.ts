import {readdirSync, statSync} from "fs";
import path from "path";
import {Logging} from "../Functions/Logging";


let Read = function (Path: string) {
    Logging(`Searching for router on directory: ${Path}`, "Debug");
    let Files = readdirSync(Path);
    for(const File of Files) {
        let FilePath = path.join(Path, File);
        let FileStats = statSync(FilePath);
        if(FileStats.isFile()) {
            if (File.toLowerCase().endsWith('.js') && !File.toLowerCase().endsWith('.map') && File.toLowerCase() !== "default.js") {
                require(FilePath);
            }
        }
        else if(FileStats.isDirectory()) {
            Read(FilePath);
        }
    }
}

require(path.join(__dirname, 'Pages', 'Default.js'));
Read(path.join(__dirname, 'Pages'));