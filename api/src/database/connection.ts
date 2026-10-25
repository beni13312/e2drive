import postgres from "postgres";
import env from "../config/env.js";

const conn = postgres({
    host: env.dbHost,
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbName,
});

function db(){
    return conn;
}

export default db;