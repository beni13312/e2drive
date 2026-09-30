import postgres from "postgres";
import env from "../config/env.js";

function db(){
    return postgres({
        host: env.dbHost,
        user: env.dbUser,
        password: env.dbPassword,
        database: env.dbName,
    });
}
export default db;