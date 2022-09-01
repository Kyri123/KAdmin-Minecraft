"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskBase = void 0;
class TaskBase {
    Task;
    TaskTime = 60000;
    TaskName = "Unknown Task";
    TaskId = 0;
    constructor() {
        this.InitTask();
    }
    // init the Task
    InitTask(ShouldExc = true) {
        this.Task = setInterval(() => this.ExecuteTask(), this.TaskTime);
        if (ShouldExc) {
            this.ExecuteTask().then(r => {
                console.log(this.TaskName + " Init Exec > Time: " + this.TaskTime);
            });
        }
        console.log(this.TaskName + " Installed > Time: " + this.TaskTime);
    }
    set SetNewTaskInterval(TaskTime) {
        if (this.IsTaskRunning) {
            this.TaskTime = TaskTime;
            clearInterval(this.Task);
            this.Task = setInterval(() => this.ExecuteTask(), this.TaskTime);
        }
    }
    Stop() {
        if (this.IsTaskRunning) {
            clearInterval(this.Task);
            this.Task = undefined;
        }
    }
    get IsTaskRunning() {
        return this.Task !== undefined;
    }
    get GetTaskId() {
        return this.TaskId;
    }
    async ExecuteTask() {
    }
}
exports.TaskBase = TaskBase;
//# sourceMappingURL=Task.Base.js.map