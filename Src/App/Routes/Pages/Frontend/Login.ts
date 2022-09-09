import {RestApiRouteBase} from "../../../Classes/RestAPIRoute.Base";
import * as express from "express";
import {NextFunction} from "express";

class REST_DefaultRoutes extends RestApiRouteBase {
    constructor() {
        super();
        this.Url = "/login/*"
        this.UseMiddleware = false;
        this.UseCheck = true;
        this.Init();
    }

    async CheckedMiddleware(request: express.Request, response: express.Response, next: NextFunction): Promise<void> {
        return super.CheckedMiddleware(request, response, next);
    }
}

module.exports = new REST_DefaultRoutes();