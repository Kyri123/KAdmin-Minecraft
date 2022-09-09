import {readdirSync, statSync} from "fs";
import path from "path";


let Read = function (Path: string) {
    let Files = readdirSync(Path);
    for(const File of Files) {
        let FilePath = path.join(Path, File);
        let FileStats = statSync(FilePath);
        if(FileStats.isFile()) {
            if (!File.endsWith('.map') && !File.includes("Default")) {
                require(FilePath);
            }
        }
        else if(FileStats.isDirectory()) {
            Read(FilePath);
        }
    }
}

Read(path.join(__dirname, 'Routes', 'Pages'));

require(path.join(__dirname, 'Routes', 'Pages', 'Default.js'));