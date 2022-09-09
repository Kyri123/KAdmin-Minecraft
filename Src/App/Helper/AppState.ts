import path from "path";
import syncRequest from "sync-request";
import {GithubBuild} from "../Types/Github";
import {readFileSync} from "fs";
import {ConfigManager} from "./ConfigManager";

export class AppStateClass {
    private GithubQuery: GithubBuild
    private GithubBuildId: string = ""
    private readonly BuildId: string = ""
    private readonly IsInstalled: boolean = false

    constructor() {
        this.GithubQuery = {
            valid: false
        };

        this.GithubBuildId = "";
        this.BuildId = readFileSync(path.join(mainDir, "build"), 'utf-8');


        this.Query();
    }

    Query() {
        try {
            this.GithubQuery = JSON.parse(syncRequest('GET', `https://api.github.com/repos/Kyri123/KAdmin-Minecraft/contents/build?ref=${ConfigManager.GetEnvConfig.Updater_GithubBranch}`, {
                headers: {
                    'user-agent': 'KAdmin-Minecraft',
                },
            }).getBody().toString()) as GithubBuild;

            if(this.GithubQuery.content) {
                this.GithubQuery.valid = true;
                this.GithubBuildId = this.GithubQuery.content
            }
        } catch (e) {
            this.GithubQuery = {
                valid: false
            }
        }
    }

    get GetGithubBuildId(): string {
        this.Query();
        return this.GithubBuildId;
    }

    get GetBuildId(): string {
        return this.BuildId;
    }

    get NeedUpdate(): boolean {
        return this.GetGithubBuildId !== this.GetBuildId;
    }
}

if (global.AppState === undefined) {
    global.AppState = new AppStateClass();
}
export let AppState: AppStateClass = global.AppState;