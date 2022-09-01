"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = exports.TaskManagerClass = void 0;
const fs_1 = require("fs");
class TaskManagerClass {
    ActiveTasks;
    constructor() {
        this.ActiveTasks = [];
    }
    Init() {
        (0, fs_1.readdir)("./Tasks", (err, Files) => {
            if (!err) {
                for (const File of Files) {
                    let Task = require("./Tasks/" + Files);
                    this.ActiveTasks.push(Task);
                }
            }
            else if (debug) {
                console.error(err);
            }
        });
    }
    Clear() {
        for (const Task of this.ActiveTasks) {
            Task.Stop();
        }
        this.ActiveTasks = [];
    }
    GetTask(TaskId) {
        return this.ActiveTasks.find((e) => e.GetTaskId === TaskId);
    }
    IsTaskRunning(TaskId) {
        let Task = this.GetTask(TaskId);
        if (Task)
            return Task.IsTaskRunning;
        return false;
    }
    IsTaskThere(TaskId) {
        let Task = this.GetTask(TaskId);
        return Task !== undefined;
    }
    RenewTask(TaskId, ShouldExc = true) {
        let Task = this.GetTask(TaskId);
        if (Task) {
            Task.Stop();
            Task.InitTask(ShouldExc);
        }
    }
    StartTask(TaskId, ShouldExc = true) {
        let Task = this.GetTask(TaskId);
        if (Task)
            if (!Task.IsTaskRunning) {
                Task.InitTask(ShouldExc);
            }
    }
    StopTask(TaskId, ShouldExc = true) {
        let Task = this.GetTask(TaskId);
        if (Task)
            if (Task.IsTaskRunning) {
                Task.Stop();
                if (ShouldExc)
                    Task.ExecuteTask().then(r => { });
            }
    }
}
exports.TaskManagerClass = TaskManagerClass;
if (global.TaskManager === undefined) {
    global.TaskManager = new TaskManagerClass();
}
exports.TaskManager = global.TaskManager;
//# sourceMappingURL=TaskManager.js.map