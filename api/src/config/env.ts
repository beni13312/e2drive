import dotenv from "dotenv";

dotenv.config({
    path: "./test.env",
});

const env = {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
};
export default env;