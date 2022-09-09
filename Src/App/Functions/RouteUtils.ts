import * as express from "express";
import {WebSession} from "../../Types/RestAPI";

export function GetSession(request: express.Request) : WebSession {
    return request.session as WebSession
}