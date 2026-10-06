import {Router} from "express";
import crypto from "node:crypto";
import db from "../database/connection.js";

const router = Router();

router.get("/list", async (req, res) => {
    try{
        const requestedPath = req.query.path || "";
        if(!requestedPath){
            return res.status(400).json({error: "Failed to get requested path"});
        }
        console.log("Requested Path: ", requestedPath);

    }catch (error){
        return res.status(500).json({error: "Failed to get path"});
    }
})


export default router;