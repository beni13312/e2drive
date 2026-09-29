import postgres from "postgres";

function db(){
    return postgres({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "dev",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "app",
    });
}
export default db;