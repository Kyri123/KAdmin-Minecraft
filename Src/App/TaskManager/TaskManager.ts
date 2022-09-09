import {readdir} from "fs";
import {TaskBase} from "../Classes/Task.Base";
import * as path from "path";
import {Logging} from "../Functions/Logging";

export class TaskManagerClass {
    public ActiveTasks: TaskBase[];

    constructor() {
        this.ActiveTasks = [];
    }

    Init() {
        readdir(path.join(__dirname, "Tasks"), (err, Files) => {
            if(!err) {
                for(const File of Files) {
                    if(File.endsWith(".js")) {
                        let Task: TaskBase = require(path.join(__dirname, "Tasks", File)) as TaskBase;
                        this.ActiveTasks.push(Task);
                    }
                }
            }
            else if(debug) {
                Logging(err, "Error");
            }
        })
    }

    Clear() {
        for(const Task of this.ActiveTasks) {
            Task.Stop();
        }

        this.ActiveTasks = [];
    }

    GetTask(TaskId: number): TaskBase | undefined {
        return this.ActiveTasks.find((e) => e.GetTaskId === TaskId)
    }

    IsTaskRunning(TaskId: number): boolean {
        let Task = this.GetTask(TaskId);
        if(Task)
            return Task.IsTaskRunning;
        return false;
    }

    IsTaskThere(TaskId: number): boolean {
        let Task = this.GetTask(TaskId);
        return Task !== undefined;
    }

    RenewTask(TaskId: number, ShouldExc: boolean = true): void {
        let Task : TaskBase | undefined = this.GetTask(TaskId);
        if(Task) {
            Task.Stop();
            Task.InitTask(ShouldExc);
        }
    }

    StartTask(TaskId: number, ShouldExc: boolean = true): void {
        let Task : TaskBase | undefined = this.GetTask(TaskId);
        if(Task)
            if(!Task.IsTaskRunning) {
                Task.InitTask(ShouldExc);
            }
    }

    StopTask(TaskId: number, ShouldExc: boolean = true): void {
        let Task : TaskBase | undefined = this.GetTask(TaskId);
        if(Task)
            if(Task.IsTaskRunning) {
                Task.Stop();
                if(ShouldExc)
                    Task.ExecuteTask().then(r => {});
            }
    }
}

if (global.TaskManager === undefined) {
    global.TaskManager = new TaskManagerClass();
}

export let TaskManager = global.TaskManager;