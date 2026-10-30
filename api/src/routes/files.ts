import {Router} from "express";
import crypto from "node:crypto";
import db from "../database/connection.js";
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

        if (!password){
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
});

router.get("/getEmail", async (req, res) => {
    try {
        const sessionCookie = req.cookies["session"];

        const tokenHash = crypto.hash("sha256", sessionCookie);
        const result =  await db()`SELECT users.email FROM users 
                        JOIN sessions ON sessions.user_id = users.id WHERE sessions.token=${tokenHash}`;
        const storedEmail = result[0]?.email;

        if(storedEmail){
            return res.status(200).json({email: storedEmail});
        }else{
            res.status(404).json({error: "Email not found"});
        }
    }catch (error){
        console.log(error);
        res.status(500).json({error: "Failed to retrieve data from database"});
    }
})



router.get("/list", async (req, res) => {
    try{
        const sessionCookie = req.cookies["session"];

        const tokenHash = crypto.hash("sha256", sessionCookie);

        const requestedPath = String(req.query.path);
        console.log("Requested URL: " + requestedPath);

        if(!requestedPath){
            return res.status(400).json({error: "Failed to get requested path"});
        }

        const parentId:number | null = Number(requestedPath.split('/').filter(Boolean).at(-1)) || null;
        console.log("parentId", parentId);

        const result = await db()`
                            WITH "current_user" AS (
                              SELECT users.id from users 
                              JOIN sessions ON sessions.user_id = users.id WHERE sessions.token = ${tokenHash}
                            )
                            
                            SELECT id, 'file' AS type, encrypted_name, size, modified_at FROM files WHERE parent_id IS NOT DISTINCT FROM ${parentId} 
                            AND owner_id=(SELECT id FROM "current_user")
                              UNION ALL
                            SELECT id, 'folder' AS type,encrypted_name, size, modified_at FROM folders WHERE parent_id IS NOT DISTINCT FROM ${parentId}
                            AND owner_id=(SELECT id FROM "current_user");`;


        interface response{
            path: {id:string, name:string}[],
            items: object[]
        }
        let response:response = {
            path: [],
            items: []

        };

        response.path.push({id:"0", name: "Storage"});

        for (const row of result){
            response.items.push({
                id: row["id"],
                type: row["type"],
                encryptedName: (row["encrypted_name"] as Buffer).toString("base64"),
                size: row["size"],
                modDate: row["modified_at"]
            });
        }
        if(response) {
            return res.status(200).json(response);
        }else {
            return res.status(404).json({error: "Path not found"});
        }

    }catch (error){
        console.log(error);
        return res.status(500).json({error: "Failed to get path"});
    }
});

router.post("/uploadMetadata", multerInit.single("filename"), async (req, res) => {
    try{
        console.log("FilePath: " + req.query.path);

        if(!req.files || !req.body){
            return res.status(400).json({error: "Failed to read request"});
        }

        const files = req.files as {[filedname: string]: Express.Multer.File[]};
        const body = req.body;

        const filenameBytes = files.filename[0].buffer;
        const size = body.size;
        const modDate = new Date (Number(body.modDate));

        console.log("File size: " + size);
        console.log("File modDate: " + modDate);

        const sessionCookie = req.cookies["session"];

        const tokenHash = crypto.hash("sha256", sessionCookie);
        const result = db()`INSERT INTO files (owner_id, parent_id, encrypted_name, size, modified_at)
                        VALUES (
                        (SELECT users.id FROM users
                        JOIN sessions ON sessions.user_id = users.id WHERE sessions.token=${tokenHash}),
                                NULL,
                                ${filenameBytes},
                                ${size},
                                ${modDate}
                               )`;

        return res.status(200).json({});
    }catch (error){
        return res.status(500).json({error: "Failed to upload files"});
    }
});

router.post("/uploadChunk", async (req, res) => {
    try{
        req.on('data', (chunk: Buffer) => {
            console.log(`Chunk size: ${chunk.length} Byte`);
        });

        const body = req.body;
        const writePath = req.headers.path;
        const dataBytes = req.headers.dataSize;


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