import {Router} from "express";
import db from "../database/connection.js"
import * as argon2 from "argon2";

const router = Router();

router.post("/login", async (req, res) => {
    // check users credentials
    const {email, password} = req.body || {};
    if (!email || !password){
        return res.status(400).json({error: "Email or password"});
    }
    const result =  await db()`SELECT password FROM users WHERE email=${email}`.catch((error)=>{
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
    if (!verifyHash){
        res.json({error: "Invalid Credentials: passwords are not matching"});
    }else{
        res.cookie("session", "randomCookie");
        res.json({login: true});
    }

});

export default router
