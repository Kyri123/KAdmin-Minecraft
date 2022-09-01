"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppState = exports.AppStateClass = void 0;
const path_1 = __importDefault(require("path"));
const sync_request_1 = __importDefault(require("sync-request"));
const fs_1 = require("fs");
class AppStateClass {
    GithubQuery;
    GithubBuildId = "";
    BuildId = "";
    IsInstalled = false;
    constructor() {
        this.GithubQuery = {
            valid: false
        };
        this.GithubBuildId = "";
        this.BuildId = (0, fs_1.readFileSync)(path_1.default.join(mainDir, "build"), 'utf-8');
        this.Query();
    }
    Query() {
        try {
            this.GithubQuery = JSON.parse((0, sync_request_1.default)('GET', `https://api.github.com/repos/Kyri123/KAdmin-Minecraft/contents/build?ref=${CONFIG.updater.useBranch}`, {
                headers: {
                    'user-agent': 'KAdmin-Minecraft',
                },
            }).getBody().toString());
            if (this.GithubQuery.content) {
                this.GithubQuery.valid = true;
                this.GithubBuildId = this.GithubQuery.content;
            }
        }
        catch (e) {
            this.GithubQuery = {
                valid: false
            };
        }
    }
    get GetGithubBuildId() {
        this.Query();
        return this.GithubBuildId;
    }
    get GetBuildId() {
        return this.BuildId;
    }
    get NeedUpdate() {
        return this.GetGithubBuildId !== this.GetBuildId;
    }
}
exports.AppStateClass = AppStateClass;
if (global.AppState === undefined) {
    global.AppState = new AppStateClass();
}
exports.AppState = global.AppState;
//# sourceMappingURL=AppState.js.map