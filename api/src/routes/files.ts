import {Router} from "express";
import crypto from "node:crypto";
import db from "../database/connection.js";
import {readdir} from "node:fs/promises";
import Config from "../config/config.js";
import path from "node:path";
import multer from "multer"
import * as argon2 from "argon2";

const router = Router();
// use multer for getting data from formData
const multerInit = multer({
    storage: multer.memoryStorage()
});


// using a simpler check for now
router.post("/checkEncryptionPassword", async (req, res) => {
    try {
        // check users credentials
        const {password} = req.body || {};
        const sessionCookie = req.cookies["session"];

        if (!password || !sessionCookie){
            return res.status(400).json({error: "Wrong password"});
        }

        const tokenHash = crypto.hash("sha256", sessionCookie);
        const result =  await db()`SELECT users.password FROM users 
                        JOIN sessions ON sessions.user_id = users.id WHERE sessions.token=${tokenHash}`;
        const storedHash = result[0]?.password;

        if(!storedHash){
            return res.status(401).json({error: "Invalid Credentials: failed to retrieve data from database"});
        }


        const verifyHash = await argon2.verify(storedHash,password);
        if (verifyHash){
            const token = crypto.randomBytes(32).toString("hex");
            const tokenHash = crypto.hash("sha256", token);

            return res.status(200).json({encryptionPassword: true});

        }else{
            res.status(401).json({error: "Invalid Credentials: password is not matching"});
        }
    }catch (error){
        console.log(error);
        res.status(500).json({error: "Failed to retrieve data from database"});
    }
})

router.get("/list", async (req, res) => {
    try{
        const requestedPath = path.resolve((req.query.path || "").toString());
        if(!requestedPath){
            return res.status(400).json({error: "Failed to get requested path"});
        }
        const storagePath = path.resolve(Config.DATA_STORAGE);
        const relativeSafePath = path.join(storagePath, requestedPath);

        console.log("Relative safe path: " + relativeSafePath);
        console.log("Storage path: " + path.resolve(Config.DATA_STORAGE));

        const storage = await readdir(relativeSafePath, {withFileTypes: true});

        for (const e of storage){
            if (e.isFile()){
                console.log("File: " + e.name);
            }else if(e.isDirectory()){
                console.log("Directory: " + e.name);
            }
        }
        return res.status(200).json({});

    }catch (error){
        return res.status(500).json({error: "Failed to get path"});
    }
});

router.post("/upload", multerInit.fields(
    [
        {name: "filename", maxCount: 1},
        {name: "data", maxCount: 1},
    ]
), async (req, res) => {
    try{
        console.log("FilePath: " + req.query.path);
        console.log(req.files);

        return res.status(200).json({});
    }catch (error){
        return res.status(500).json({error: "Failed to upload files"});
    }
});

router.get("/downlaod", async (req, res) => {
    try{

    }catch (error){
        return res.status(500).json({error: "Failed to download files"});
    }
});


export default router;