import {TaskBase} from "../../Classes/Task.Base";

class UpdaterTask extends TaskBase {
    constructor() {
        super();
        this.TaskName = "Changelog Task";
        this.TaskId = 0;
    }
}

module.exports = new UpdaterTask();