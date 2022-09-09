import session from "express-session";

export interface WebSession extends session.Session {
    ActiveSessionId: boolean | undefined,
    SessionUserID?: string,
}