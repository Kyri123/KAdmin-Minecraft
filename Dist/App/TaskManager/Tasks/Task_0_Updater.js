"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task_Base_1 = require("../../Classes/Task.Base");
class UpdaterTask extends Task_Base_1.TaskBase {
    constructor() {
        super();
        this.TaskName = "Changelog Task";
        this.TaskId = 0;
    }
}
module.exports = new UpdaterTask();
//# sourceMappingURL=Task_0_Updater.js.map