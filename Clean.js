const fs = require("fs");

if(fs.existsSync("Dist")) {
    console.log("CLean DIST!")
    fs.rmSync("Dist", {recursive:true});
    fs.mkdirSync("Dist");
}