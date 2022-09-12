export type SQLTable = "KAMC_User" | "KAMC_Session" | "KAMC_Server" | "KAMC_UserGroupes";

/**
 * Base Type (ID)
 */
interface DataTable_Base extends Record<string, any> {
    "Id": string
}

export interface KAMC_User extends Record<string, any> {
    "Banned": string,
    "ForcedLoggedOut": boolean,
    "UserID": string,
    "UserName": string,
    "Password": string,
    "LastLogin": string
}

export interface KAMC_Session extends DataTable_Base {
}

export interface KAMC_Server extends DataTable_Base {
}

export interface KAMC_UserGroupes extends DataTable_Base {
}