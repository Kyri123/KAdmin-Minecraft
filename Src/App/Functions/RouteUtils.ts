import * as express from "express";
import {WebSession} from "../../Types/RestAPI";

/**
 * Get from a Request the WebSession
 * @param request
 * @constructor
 */
export function GetSession(request: express.Request) : WebSession {
    return request.session as WebSession
}

/**
 * Do we have a valid Session?
 * @param request
 * @constructor
 */
export function HasValidSession(request: express.Request) : boolean {
    return GetSession(request).ActiveSessionId !== undefined;
}