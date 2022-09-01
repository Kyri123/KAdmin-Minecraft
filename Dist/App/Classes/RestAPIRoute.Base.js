"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestApiRouteBase = void 0;
const express = __importStar(require("express"));
class RestApiRouteBase {
    ExpressRouter;
    // Please note: this is ONLY for init the function cant use **this.**
    Url = '*';
    UseMiddleware = true;
    UseCheck = true;
    CheckNeedGuildValidate = true;
    constructor() {
        this.ExpressRouter = express.Router();
    }
    Init() {
        if (this.UseMiddleware) {
            this.InitMiddleware();
        }
        this.InitGet();
        this.InitPost();
        this.InitPut();
        this.InitDelete();
        this.InitAll();
        ExpressServer.use(this.ExpressRouter);
        console.log(`Install Rooter on url: ${this.Url} | UseMiddleware: ${this.UseMiddleware}`);
    }
    InitMiddleware() {
        if (this.UseCheck) {
            if (this.CheckNeedGuildValidate)
                this.ExpressRouter.use(this.Url, this.CheckedMiddleware);
            else
                this.ExpressRouter.use(this.Url, this.CheckedGuildMiddleware);
        }
        else {
            this.ExpressRouter.use(this.Url, this.Middleware);
        }
    }
    InitGet() {
        this.ExpressRouter.get(this.Url, this.Get);
    }
    InitPut() {
        this.ExpressRouter.put(this.Url, this.Put);
    }
    InitPost() {
        this.ExpressRouter.post(this.Url, this.Post);
    }
    InitDelete() {
        this.ExpressRouter.delete(this.Url, this.Get);
    }
    InitAll() {
        this.ExpressRouter.all(this.Url, this.All);
    }
    async CheckedMiddleware(request, response, next) {
        /*if(request.body && request.body.UserId && request.body.SessionHash) {
            if(await IsSessionValid(request.body.SessionHash, request.body.UserId)) {
                next();
                return;
            }
        }*/
        next();
        return;
        response.json({ Request: false, RequestType: 'Post', NoPermission: true });
    }
    async CheckedGuildMiddleware(request, response, next) {
        /*if(request.body && request.body.SessionHash && request.body.UserId && request.body.GuildId) {
            if(await IsSessionValid(request.body.SessionHash, request.body.UserId)) {
                let SuperAdminQuery = await MariaDbManager.Select("Web_AdminLogin", {
                    IsSuperAdmin: true,
                    UserId: request.body.UserId
                })

                let GuildAdminQuery = await MariaDbManager.Select("Web_AdminLogin", {
                    GuildId: request.body.GuildId,
                    UserId: request.body.UserId
                })

                if (SuperAdminQuery.IsValid || GuildAdminQuery.IsValid) {
                    next();
                    return;
                }
            }
        }*/
        next();
        return;
        response.json({ Request: false, RequestType: 'Post', NoPermission: true });
    }
    async Middleware(request, response, next) {
        next();
    }
    async Get(request, response, next) {
        response.json({ Request: false, RequestType: 'Get' });
    }
    async Post(request, response, next) {
        response.send({ Request: false, RequestType: 'Post' });
    }
    async Put(request, response, next) {
        response.send({ Request: false, RequestType: 'Put' });
    }
    async Delete(request, response, next) {
        response.send({ Request: false, RequestType: 'Delete' });
    }
    async All(request, response, next) {
        response.send({ Request: false, RequestType: 'All' });
    }
}
exports.RestApiRouteBase = RestApiRouteBase;
//# sourceMappingURL=RestAPIRoute.Base.js.map