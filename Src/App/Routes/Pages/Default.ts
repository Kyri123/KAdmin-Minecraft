import {RestApiRouteBase} from "../../Classes/RestAPIRoute.Base";

class REST_DefaultRoutes extends RestApiRouteBase {
    constructor() {
        super();
        this.UseMiddleware = false;
        this.UseCheck = true;
        this.Init();
    }
}

module.exports = new REST_DefaultRoutes();