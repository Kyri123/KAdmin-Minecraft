import {Logging} from "../Functions/Logging";

export class TaskBase {
    private Task: NodeJS.Timer | undefined;

    protected TaskTime: number = 60000;
    protected TaskName: string = "Unknown Task";
    protected TaskId: number = 0;

    constructor() {
    }

    // init the Task
    InitTask(ShouldExc: boolean = true): void {
        this.Task = setInterval(() => this.ExecuteTask(), this.TaskTime);
        if (ShouldExc) {
            this.ExecuteTask().then(r => {
                Logging(this.TaskName + " Init Exec > Time: " + this.TaskTime, "Info")
            });
        }
        Logging(this.TaskName + " Installed > Time: " + this.TaskTime, "Info")
    }

    set SetNewTaskInterval(TaskTime: number) {
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

    get IsTaskRunning(): boolean {
        return this.Task !== undefined;
    }

    get GetTaskId(): number {
        return this.TaskId;
    }

    async ExecuteTask(): Promise<void> {
    }
}