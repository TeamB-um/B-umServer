import express, { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Cheers from "../models/Cheers";

const router = Router();

/**
 *  @route POST api/cheers
 *  @desc Create a cheers
 *  @access Private
 */

router.post(
  "/",
  auth,
  [check("name", "name is required").not().isEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, context, img } = req.body;

    try {

      const newCheers = new Cheers({
        id,
        context,
        img
      });

      const cheer = await newCheers.save();
      res.status(201).json({success: true, data: cheer});

    } catch (err) {
      console.error(err.message);
      res.status(500).send("서버 오류");
    }
  }
);

router.get(
  "/",
  async (req: Request, res: Response) => {

    try{
        const cheers = await Cheers.find();

        if (!cheers){
            return res.status(204).json({message : "응원 메세지가 없음."});
        }

        res.status(200).json({success: true, data : cheers, message : "응원 메세지 조회 성공"});

    } catch (error){
        console.error(error.message);
        res.status(500).send("Server Error");
    }

  }
);


module.exports = router;