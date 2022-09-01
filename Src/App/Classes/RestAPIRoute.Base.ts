import * as express from "express";
import {NextFunction} from "express";
import * as core from "express-serve-static-core";

export class RestApiRouteBase {
    protected ExpressRouter: core.Router;

    // Please note: this is ONLY for init the function cant use **this.**
    protected Url: string = '*';
    protected UseMiddleware: boolean = true;
    protected UseCheck: boolean = true;
    protected CheckNeedGuildValidate: boolean = true;

    public constructor() {
        this.ExpressRouter = express.Router();
    }

    protected Init() {
        if(this.UseMiddleware) {
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

    protected InitMiddleware() {
        if(this.UseCheck) {
            if(this.CheckNeedGuildValidate)
                this.ExpressRouter.use(this.Url, this.CheckedMiddleware);
            else
                this.ExpressRouter.use(this.Url, this.CheckedGuildMiddleware);
        }
        else {
            this.ExpressRouter.use(this.Url, this.Middleware);
        }
    }

    protected InitGet() {
        this.ExpressRouter.get(this.Url, this.Get);
    }

    protected InitPut() {
        this.ExpressRouter.put(this.Url, this.Put);
    }

    protected InitPost() {
        this.ExpressRouter.post(this.Url, this.Post);
    }

    protected InitDelete() {
        this.ExpressRouter.delete(this.Url, this.Get);
    }

    protected InitAll() {
        this.ExpressRouter.all(this.Url, this.All);
    }

    public async CheckedMiddleware(request: express.Request, response: express.Response, next: NextFunction): Promise<void> {
        /*if(request.body && request.body.UserId && request.body.SessionHash) {
            if(await IsSessionValid(request.body.SessionHash, request.body.UserId)) {
                next();
                return;
            }
        }*/
        next();
        return;
        response.json({Request: false, RequestType: 'Post', NoPermission: true});
    }

    public async CheckedGuildMiddleware(request: express.Request, response: express.Response, next: NextFunction): Promise<void> {
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
        response.json({Request: false, RequestType: 'Post', NoPermission: true});
    }

    public async Middleware(request: express.Request, response: express.Response, next: NextFunction): Promise<void> {
        next();
    }

    public async Get(request: express.Request, response: express.Response, next: NextFunction): Promise<void> {
        response.json({Request: false, RequestType: 'Get'});
    }

    public async Post(request: express.Request, response: express.Response, next: NextFunction): Promise<void> {
        response.send({Request: false, RequestType: 'Post'});
    }

    public async Put(request: express.Request, response: express.Response, next: NextFunction): Promise<void> {
        response.send({Request: false, RequestType: 'Put'});
    }

    public async Delete(request: express.Request, response: express.Response, next: NextFunction): Promise<void> {
        response.send({Request: false, RequestType: 'Delete'});
    }

    public async All(request: express.Request, response: express.Response, next: NextFunction): Promise<void> {
        response.send({Request: false, RequestType: 'All'});
    }
}