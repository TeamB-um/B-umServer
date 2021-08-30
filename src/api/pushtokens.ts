import express, { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Pushtokens from "../models/Pushtokens";


const router = Router();


router.post("/",  async (req: Request, res: Response) => {
    try {
      const pushtoken = req.body.pushtoken
  
      await Pushtokens.updateOne(
        { token : pushtoken},
        { $set : { token : pushtoken}},
        {upsert : true},
      )
      
      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, msg: "서버 오류" });
    }
  });




module.exports = router;