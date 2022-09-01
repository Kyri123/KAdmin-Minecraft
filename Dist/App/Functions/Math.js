/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2022, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-Minecraft
 * *******************************************************************************************
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBytes = void 0;
const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
/**
 * Konvertiert Bytes in KB/MB/GB/TB
 * @param {int} bytes
 * @returns {string}
 */
function convertBytes(bytes) {
    let NumBytes = Number(bytes);
    if (NumBytes === 0)
        return "n/a";
    let i = parseInt(String(Math.floor(Math.log(NumBytes) / Math.log(1024))));
    return i === 0 ? bytes + " " + sizes[i] : (NumBytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}
exports.convertBytes = convertBytes;
//# sourceMappingURL=Math.js.map