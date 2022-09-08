import {readdir} from "fs";
import {TaskBase} from "../Classes/Task.Base";

export class TaskManagerClass {
    public ActiveTasks: TaskBase[];

    constructor() {
        this.ActiveTasks = [];
    }

    Init() {
        readdir("./Tasks", (err, Files) => {
            if(!err) {
                for(const File of Files) {
                    let Task: TaskBase = require("./Tasks/" + Files) as TaskBase;
                    this.ActiveTasks.push(Task);
                }
            }
            else if(debug) {
                console.error(err);
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