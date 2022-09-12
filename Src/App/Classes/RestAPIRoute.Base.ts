import * as express from "express";
import {NextFunction} from "express";
import * as core from "express-serve-static-core";
import {GetSession} from "../Functions/RouteUtils";
import {MariaDbManager} from "../Helper/MariaDB";
import {Logging} from "../Functions/Logging";
import {KAMC_User} from "../../Types/MariaDB";

export class RestApiRouteBase {
    protected ExpressRouter: core.Router;

    // Please note: this is ONLY for init the function cant use **this.**
    protected Url: string = '*';
    protected UseMiddleware: boolean = true;
    protected UseCheck: boolean = true;
    protected RenderPage: string = "pages/404";

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
        Logging(`Install Router on url: ${this.Url} | UseMiddleware: ${this.UseMiddleware}`, "Info");
    }

    protected InitMiddleware() {
        if(this.UseCheck) {
            this.ExpressRouter.use(this.Url, this.CheckedMiddleware);
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
        let Session = GetSession(request);
        if(Session.ActiveSessionId) {
            let UserInformation = await MariaDbManager.Select<KAMC_User>("KAMC_User", {
                UID: Session.SessionUserID
            });

            if(!UserInformation.IsValid) {
                Response.redirect("/logout");
            }
            else {
                if(UserInformation.first.Banned || UserInformation.first.ForcedLoggedOut) {
                    let Query = UserInformation.first;
                    Query.ForcedLoggedOut = false;

                    await MariaDbManager.Update("KAMC_User", Query, {
                        UserID: Query.UserID
                    })

                    Response.redirect("/logout");
                }
                else {
                    next()
                }
            }
        }
        else {
            // Todo: Cookie support
            /*
            let cookies = request.cookies
            if(cookies.id !== undefined && cookies.validate !== undefined) {
                let sql    = 'SELECT * FROM `user_cookies` WHERE `md5id`=? AND `validate`=?'
                let result = safeSendSQLSync(sql, cookies.id, cookies.validate)
                if(result.length > 0) {
                    sess.uid = result[0].userid
                    req.session.save((err) => {})
                    // Prüfe ob dieser gebannt ist
                    sql    = 'SELECT * FROM `users` WHERE `id`=?'
                    result = safeSendSQLSync(sql, sess.uid)
                    if(result[0].ban === 0) {
                        next()
                    }
                    else {
                        module.exports.logout(req, res)
                    }
                }
                else {
                    res.redirect("/login")
                    return true
                }
            }
            else {
                res.redirect("/login")
                return true
            }
            */
        }
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