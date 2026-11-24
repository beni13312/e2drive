import {Router} from "express";
import crypto from "node:crypto";
import db from "../database/connection.js";
import * as argon2 from "argon2";

const router = Router();

// Using a simpler check for now
router.post("/checkEncryptionPassword", async (req, res) => {
    try {
        // check users credentials
        const {password} = req.body || {};
        const sessionCookie = req.cookies["session"];

        if (!password){
            return res.status(400).json({error: "Wrong password"});
        }

        const tokenHash = crypto.hash("sha256", sessionCookie);
        const result =  await db()`SELECT users.password_hash FROM users 
                        JOIN sessions ON sessions.user_id = users.id WHERE sessions.token=${tokenHash}`;
        const storedHash = result[0]?.password_hash;

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
        console.log("Requested Path: " + requestedPath);

        if(!requestedPath){
            return res.status(400).json({error: "Failed to get requested path"});
        }

        const parentId:string = requestedPath.split('/').filter(Boolean).at(-1) ?? "";
        const urlFolderPathArray:string[] = requestedPath.split('/').map(e => e.trim()).filter(Boolean);
        console.log("parentId", parentId);
        console.log("urlFolderPathArray: " + urlFolderPathArray);

        interface DbResponse{
            path: {
                id: string,
                encrypted_name: Buffer
            }[],
            items: {
                id: string,
                type: string,
                encrypted_name: string,
                size: string,
                modified_at: string

            }[]
        }

        const result = await db()<DbResponse[]>`
                            WITH "current_user" AS (
                              SELECT users.id from users 
                              JOIN sessions ON sessions.user_id = users.id WHERE sessions.token = ${tokenHash}
                            ),

                            -- get folder path
                            folderPath AS (
                                SELECT folders.id, encode(encrypted_name, 'base64') as encrypted_name
                                FROM unnest(${urlFolderPathArray}::UUID[]) WITH ORDINALITY AS u(id, ord) 
                                JOIN folders ON folders.id = u.id
                                WHERE folders.id=ANY(${urlFolderPathArray}::UUID[])
                                AND owner_id=(SELECT id FROM "current_user")
                                ORDER BY u.ord
                            ),
                            
                            -- get files and folders
                            folderItems AS (
                                SELECT id, 'file' AS type, encode(encrypted_name, 'base64') as encrypted_name, size, modified_at 
                                FROM files WHERE parent_id IS NOT DISTINCT FROM NULLIF(${parentId}, '')::UUID
                                AND owner_id=(SELECT id FROM "current_user")
                                  UNION ALL
                                SELECT id, 'folder' AS type, encode(encrypted_name, 'base64') as encrypted_name, size, modified_at 
                                FROM folders WHERE parent_id IS NOT DISTINCT FROM NULLIF(${parentId}, '')::UUID
                                AND owner_id=(SELECT id FROM "current_user")
                                )
                            
                            SELECT 
                            COALESCE(
                                (SELECT json_agg(folderPath) FROM folderPath), '[]'::json
                            ) AS path,   
                            COALESCE(
                                (SELECT json_agg(folderItems) FROM folderItems), '[]'::json
                            ) AS items;
                            `;



        let response:{path:object[], items:object[], info:string} = {
            path: [],
            items: [],
            info: ""

        };

        const dbResult = result[0];

        for (const row of dbResult.path){
            response.path.push({
                id: row.id,
                encryptedName: row.encrypted_name,
            });
        }

        if(dbResult.items.length === 0){
            response.info = "Empty directory";
            return res.status(200).json(response);
        }

        for (const row of dbResult.items){
            response.items.push({
                id: row.id,
                type: row.type,
                encryptedName: row.encrypted_name,
                size: row.size,
                modDate: row.modified_at
            });
        }
        console.log(response);
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

router.post("/uploadMetadata", async (req, res) => {
    try{
        const sessionCookie = req.cookies["session"];

        const tokenHash = crypto.hash("sha256", sessionCookie);

        const requestedPath = String(req.query.path);
        console.log("Requested Path: " + requestedPath);

        if(!requestedPath){
            return res.status(400).json({error: "Failed to get requested path"});
        }

        if(!req.body){
            return res.status(400).json({error: "Failed to read request"});
        }

        const parentId:string = requestedPath.split('/').filter(Boolean).at(-1) ?? "";
        console.log("parentId", parentId);

        const body = req.body;

        const filenameBytes:Buffer = Buffer.from(body.filename, "base64");
        const size: number = body.dataSize;
        const modDate = new Date (Number(body.modDate));

        console.log("File size: " + size);
        console.log("File modDate: " + modDate);

        console.log("tokenHash: " + tokenHash);
        const result = await db()`INSERT INTO files (owner_id, parent_id, encrypted_name, size, modified_at)
                        VALUES (
                        (SELECT users.id FROM users
                        JOIN sessions ON sessions.user_id = users.id WHERE sessions.token=${tokenHash}),
                                NULLIF(${parentId}, '')::UUID,
                                ${filenameBytes},
                                ${size},
                                ${modDate}
                               ) RETURNING id`;

        console.log(result);
        if (result.length === 0){
            return res.status(500).json({error: "Failed to insert data to database"});
        }

        return res.status(200).json(result[0]);
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

router.post("/createFolder", async (req,res)=>{
    try{
        const sessionCookie = req.cookies["session"];

        const tokenHash = crypto.hash("sha256", sessionCookie);

        if(!req.body){
            return res.status(400).json({error: "Failed to read request"});
        }

        const body = req.body;

        const parentId:string = body.parentId;
        const folderNameBytes:Buffer = Buffer.from(body.folderName, "base64");
        console.log("parentId", parentId);

        console.log("tokenHash: " + tokenHash);
        const result = await db()`INSERT INTO folders (owner_id, parent_id, encrypted_name)
                        VALUES (
                        (SELECT users.id FROM users
                        JOIN sessions ON sessions.user_id = users.id WHERE sessions.token=${tokenHash}),
                                NULLIF(${parentId}, '')::UUID,
                                ${folderNameBytes}
                               ) RETURNING id`;

        if (result.length === 0){
            return res.status(500).json({error: "Failed to insert data to database"});
        }

        return res.status(200).json({createFolder:true});
    }catch (error){
        return res.status(500).json({error: "Failed to create folder"});
    }
});



router.get("/downlaod", async (req, res) => {
    try{

    }catch (error){
        return res.status(500).json({error: "Failed to download files"});
    }
});


export default router;