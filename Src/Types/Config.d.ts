export type AppBranches = "master" | "dev" | "test" | "typescript"

export interface EnvConfig extends Record<string, any> {
    "Panel_WebPort": string,
    "Panel_ServerRootDir": string,
    "Panel_LogRootDir": string,
    "Panel_BackupRootDir": string,

    "MySQL_dbhost": string,
    "MySQL_dbuser": string,
    "MySQL_dbpass": string,
    "MySQL_dbbase": string,

    "Dev_UseDebug": boolean,

    "Updater_GithubBranch": string,
    "Updater_AutomaticInstallUpdates": string,
}