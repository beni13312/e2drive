import {Router} from "express";

const router = Router();

router.get("/", async (req,res, next)=>{
    try{
        return res.status(200).json({validate: true});
    }catch (error){
        return res.status(500).json({error: "Failed to validate session"});
    }
});

export default router;