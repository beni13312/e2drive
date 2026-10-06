import {Request, Response, NextFunction} from "express";
import crypto from "node:crypto";
import db from "../database/connection.js";

async function validateSession(req:Request, res:Response, next:NextFunction){
    try{
        const sessionCookie = req.cookies["session"]|| "";
        if(sessionCookie == ""){
            return res.status(401).json({error: "Not logged in"});
        }
        const sessionToken = req.cookies["session"];
        const sessionTokenHash = crypto.hash("sha256", sessionToken);
        console.log("session token:" + sessionTokenHash);

        const currentDate = new Date();
        const result = await db()`select 1 from sessions where token=${sessionTokenHash} and expires_at > ${currentDate}::timestamptz`;

        const isTokenValid = !!result[0];
        console.log("is token valid:" + isTokenValid);

        if(!isTokenValid){
            return res.status(401).json({error: "Invalid Credentials: cookie"});
        }

        next();
    }catch (error){
        return res.status(500).json({error: "Failed to validate session"});
    }
}

export default validateSession;