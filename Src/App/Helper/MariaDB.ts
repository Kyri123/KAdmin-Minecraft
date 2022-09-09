import mariadb, {Pool, PoolConfig} from "mariadb";
import {ConfigManager, ConfigManagerClass} from "./ConfigManager";
import {SQLTable} from "../../Types/MariaDB";

export class QueryInformation {
    public Rows: any[] = [];
    public Success: boolean = false;

    get IsValid(): boolean {
        return !this.isEmpty && this.success;
    }

    get first(): any {
        return this.Rows[0];
    }

    get isEmpty(): any {
        return this.Rows.length <= 0;
    }

    get last(): any {
        return this.Rows[this.Rows.length - 1];
    }

    get success(): boolean {
        return this.Success;
    }
}

export class MariaDbManagerClass {
    private Pool: Pool;
    private ConnectionLimit: number = 50;

    constructor(PoolSettings: PoolConfig) {
        PoolSettings.connectionLimit = this.ConnectionLimit;
        PoolSettings.charset = "utf8mb4";
        this.Pool = mariadb.createPool(PoolSettings);
    }

    async Select(Table: SQLTable, Where: any = undefined): Promise<QueryInformation> {
        let Information: QueryInformation = new QueryInformation();
        let Values = [];
        let Request = `SELECT * FROM \`${Table}\``;
        if (Where !== undefined) {
            Request += " WHERE ";
            let WhereDelegates: string[] = [];
            for (const [key, value] of Object.entries(Where)) {
                let KeyAsString = key as string;
                let ParameterAsString = value as string;
                Values.push(ParameterAsString)
                WhereDelegates.push(`\`${KeyAsString}\` = ?`);
            }
            Request += WhereDelegates.join(" AND ");
        }
        Information = await this.Query(Request, Values);
        return Information;
    }

    async Delete(Table: SQLTable, Where: any): Promise<QueryInformation> {
        let Information: QueryInformation = new QueryInformation();
        let Values = [];
        let Request = `DELETE FROM \`${Table}\``;

        Request += " WHERE ";
        let WhereDelegates: string[] = [];
        for (const [key, value] of Object.entries(Where)) {
            let KeyAsString = key as string;
            let ParameterAsString = value as string;
            Values.push(ParameterAsString)
            WhereDelegates.push(`\`${KeyAsString}\` = ?`);
        }
        Request += WhereDelegates.join(" AND ");

        Information = await this.Query(Request, Values);
        return Information;
    }

    async Update(Table: SQLTable, Set: any, Where: any): Promise<QueryInformation> {
        let Information: QueryInformation;
        let Values = [];
        let Request = `UPDATE \`${Table}\``;

        Request += " SET ";
        let SetDelegates: string[] = [];
        for (const [key, value] of Object.entries(Set)) {
            let KeyAsString = key as string;
            let ParameterAsString = value as string;
            Values.push(ParameterAsString)
            SetDelegates.push(`\`${KeyAsString}\` = ?`);
        }
        Request += SetDelegates.join(", ");

        Request += " WHERE ";
        let WhereDelegates: string[] = [];
        for (const [key, value] of Object.entries(Where)) {
            let KeyAsString = key as string;
            let ParameterAsString = value as string;
            Values.push(ParameterAsString)
            WhereDelegates.push(`\`${KeyAsString}\` = ?`);
        }
        Request += WhereDelegates.join(" AND ");

        Information = await this.Query(Request, Values);
        return Information;
    }


    async Insert(Table: SQLTable, SetValues: any): Promise<QueryInformation> {
        let Information: QueryInformation = new QueryInformation();
        let Values = [];
        let ValuesPlaceHolders = [];
        let Request = `INSERT INTO \`${Table}\``;

        let SetDelegates: string[] = [];
        for (const [key, value] of Object.entries(SetValues)) {
            let KeyAsString = key as string;
            let ParameterAsString = value as string;
            Values.push(ParameterAsString)
            SetDelegates.push(`\`${KeyAsString}\``);
            ValuesPlaceHolders.push("?");
        }

        Request += `(${SetDelegates.join(", ")})`;
        Request += " VALUES ";
        Request += `(${ValuesPlaceHolders.join(", ")})`;

        Information = await this.Query(Request, Values);
        return Information;
    }

    private async Query(query: string, values: any[] = []): Promise<QueryInformation> {
        let conn;
        let Information: QueryInformation = new QueryInformation();

        try {
            conn = await this.Pool.getConnection();
            Information.Rows = await conn.query(query, values);
            Information.Success = true;
        } finally {
            if (conn) await conn.release();
        }

        return Information;
    }
}

export let MariaDbManager: MariaDbManagerClass;

if (!global.MariaDbManager) {
    global.MariaDbManager = new MariaDbManagerClass({
        host: ConfigManager.GetEnvConfig.MySQL_dbhost,
        user: ConfigManager.GetEnvConfig.MySQL_dbuser,
        password: ConfigManager.GetEnvConfig.MySQL_dbpassword,
        database: ConfigManager.GetEnvConfig.MySQL_dbdatabase
    });
}

MariaDbManager = global.MariaDbManager;