import {Router} from "express";
import db from "../database/connection.js"
import * as argon2 from "argon2";
import * as crypto from "node:crypto";
import Config from "../config/config.js";

const router = Router();

router.post("/login", async (req, res) => {
    // check users credentials
    const {email, password} = req.body || {};
    if (!email || !password){
        return res.status(400).json({error: "Empty email or password"});
    }
    const result =  await db()`SELECT password FROM users WHERE email=${email}`.catch((error)=>{
        console.log(error);
        return res.json({error: "Invalid Credentials: failed to retrieve data from database"});
    });
    const storedHash = result[0]?.password;
    /*const hashOptions = {
        type: argon2.argon2id,
        memoryCost: 64 * 1024,
        timeCost:3,
        parallelism: 4
    };*/

    const verifyHash = await argon2.verify(storedHash,password);
    if (verifyHash){
        const token = crypto.randomBytes(32).toString("hex");

        res.cookie("session", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: Config.SESSION_EXPIRES
        });

        // TODO: store session hash and session data in database

        res.json({login: true});

    }else{
        res.json({error: "Invalid Credentials: passwords are not matching"});
    }

});

router.get("/validate", (req,res)=>{
    const cookie = req.headers.cookie || "";
    const session = cookie.split('=')[1];
    console.log("user-session cookie:" + session);
    return res.status(200).json({error: "Invalid Credentials: cookie"});
});

export default router
