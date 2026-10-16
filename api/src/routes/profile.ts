import {Router} from "express";
import crypto from "node:crypto";
import db from "../database/connection.js";

const router = Router();

router.get("/name", async (req, res) => {
    try {
        const sessionCookie = req.cookies["session"];

        const tokenHash = crypto.hash("sha256", sessionCookie);
        const result =  await db()`SELECT users.name FROM users 
                        JOIN sessions ON sessions.user_id = users.id WHERE sessions.token=${tokenHash}`;
        const profileName = result[0]?.name;

        if(profileName){
            return res.status(200).json({name: profileName});
        }else{
            res.status(404).json({error: "User not found"});
        }
    }catch (error){
        console.log(error);
        res.status(500).json({error: "Failed to retrieve data from database"});
    }
})

export default router;