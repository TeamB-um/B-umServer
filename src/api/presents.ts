import express, { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Present from "../models/Presents";
import User from "../models/Users";

const router = Router();

/**
 *  @route POST api/presents
 *  @desc Create a present
 *  @access Private
 */

router.post(
  "/",
  [
    check("sentence", "sentence is required").not().isEmpty()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const {sentence} = req.body;
    try {
      const seq = (await Present.count()) + 1;
      const newPresents = new Present({
        sentence,
        seq,
      });
      const present = await newPresents.save();
      res.status(201).json({ success: true, data: { present } });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, msg: "서버 오류" });
    }
  }
);

router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({_id : req.body.user.id})
    const present = await Present.findOne({ seq: user.presentseq })
      .select("-__v -seq -_id")
    const newseq = Number(user.presentseq) + 1;
    await User.findOneAndUpdate(
      {
          _id: req.body.user.id,
      },
      {
          presentseq: newseq,
      }
      );
    if (!present) {
      return res.status(404).json({ success: false, message: "선물 더미가 모자람" });
    }
    res.status(200).json({ success: true, data: { present } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, msg: "서버 오류" });
  }
});




module.exports = router;
