import {TaskBase} from "../../Classes/Task.Base";

class UpdaterTask extends TaskBase {
    constructor() {
        super();
        this.TaskName = "Changelog Task";
        this.TaskId = 0;
        this.InitTask();
    }
}

module.exports = new UpdaterTask();