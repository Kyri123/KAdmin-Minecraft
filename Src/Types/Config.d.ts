export type AppBranches = "master" | "dev" | "test" | "typescript"

export interface AppConfig extends Record<string, any> {
    app: AppConfig_App,
    main: AppConfig_Main,
    mysql: AppConfig_MariaDB,
    updater: AppConfig_Updater,
}

export interface AppConfig_App extends Record<string, any> {
    "servRoot"      : string,
    "logRoot"       : string,
    "pathBackup"    : string,
    "port"          : number,
    "useDebug"      : boolean
}

export interface AppConfig_Main extends Record<string, any> {
    "interval": AppConfig_Main_Interval
}

export interface AppConfig_Main_Interval extends Record<string, any> {
    "getStateFromServers"       : number,
    "getTraffic"                : number,
    "doReReadConfig"            : number,
    "doServerBackgrounder"      : number,
    "backgroundUpdater"         : number,
    "doJob"                     : number,
    "getVersionList"            : number
}

export interface AppConfig_MariaDB extends Record<string, any> {
    "dbhost"  : string,
    "dbuser"  : string,
    "dbpass"  : string,
    "dbbase"  : string
}

export interface AppConfig_Updater extends Record<string, any> {
    "useBranch"         : AppBranches,
    "automaticInstall"  : boolean
}