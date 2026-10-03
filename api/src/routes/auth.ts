import {Router} from "express";
import db from "../database/connection.js"
import * as argon2 from "argon2";
import * as crypto from "node:crypto";
import Config from "../config/config.js";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        // check users credentials
        const {email, password} = req.body || {};
        if (!email || !password){
            return res.status(400).json({error: "Empty email or password"});
        }
        const result =  await db()`SELECT password FROM users WHERE email=${email}`;
        const storedHash = result[0]?.password;

        if(!storedHash){
            return res.status(401).json({error: "Invalid Credentials: failed to retrieve data from database"});
        }


        const verifyHash = await argon2.verify(storedHash,password);
        if (verifyHash){
            const token = crypto.randomBytes(32).toString("hex");
            const tokenHash = crypto.hash("sha256", token);

            res.cookie("session", token, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: Config.SESSION_EXPIRES,
                path: '/'
            });

            const currentDate = new Date();
            const expiresAt = new Date(currentDate.getTime() + Config.SESSION_EXPIRES);

            // store session hash and session data in database
            const result = await db()`INSERT INTO sessions 
                (user_id, token, expires_at) 
                VALUES ((SELECT id FROM users WHERE email=${email}), ${tokenHash}, ${expiresAt})
                ON CONFLICT DO NOTHING`;

            return res.status(200).json({login: true});

        }else{
            res.status(401).json({error: "Invalid Credentials: passwords are not matching"});
        }
    }catch (error){
        console.log(error);
        res.status(500).json({error: "Failed to retrieve data from database"});
    }

});

router.get("/logout", async (req, res) => {
    try{
        const cookie = req.headers.cookie || "";
        if(cookie == ""){
            return res.status(401).json({error: "Not logged in"});
        }

        const sessionToken = cookie.split('=')[1];
        const sessionTokenHash = crypto.hash("sha256", sessionToken);

        const result = await db()`DELETE FROM sessions WHERE token=${sessionTokenHash}`;

        return res.status(200).cookie("session","",{
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            expires: new Date(0),
            path: '/'
        }).json({logout: true});

    }catch (error){
        return res.status(500).json({error: "Failed to destroy session"});
    }
})

router.get("/validate", async (req,res)=>{
    try{
        const cookie = req.headers.cookie || "";
        if(cookie == ""){
            return res.status(401).json({error: "Not logged in"});
        }
        const sessionToken = cookie.split('=')[1];
        const sessionTokenHash = crypto.hash("sha256", sessionToken);
        console.log("user-session-token-hash:" + sessionTokenHash);

        const currentDate = new Date();
        const result = await db()`select 1 from sessions where token=${sessionTokenHash} and expires_at > ${currentDate}::timestamptz`;

        const isTokenValid = !!result[0];
        console.log("is token valid:" + isTokenValid);

        if(isTokenValid){
            return res.status(200).json({validate: true});
        }else{
            return res.status(401).json({error: "Invalid Credentials: cookie"});
        }
    }catch (error){
        return res.status(500).json({error: "Failed to validate session"});
    }
});

export default router
