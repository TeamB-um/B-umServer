import express, { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Rewards from "../models/Rewards";
import RewardDummy from "../models/Rewards_dummy";

function getCurrentDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var today = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var milliseconds = date.getMilliseconds();
  return new Date(
    Date.UTC(year, month, today, hours, minutes, seconds, milliseconds)
  );
}

const router = Router();

/**
 *  @route POST api/rewards
 *  @desc Create a rewards
 *  @access Private
 */

router.post(
  "/",
  auth,
  [
    check("sentence", "sentence is required").not().isEmpty(),
    check("context", "context is required").not().isEmpty(),
    check("author", "author is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { sentence, author, context } = req.body;

    try {
      const seq = (await RewardDummy.count()) + 1;

      const newRewards = new RewardDummy({
        sentence,
        author,
        context,
        seq,
      });

      const reward = await newRewards.save();
      res.json({ success: true, reward });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, msg: "서버 오류" });
    }
  }
);

router.get("/dummy", async (req: Request, res: Response) => {
  try {
    const rewards = await RewardDummy.find();

    if (!rewards) {
      return res.status(404).json({ success: false, message: "리워드가 없음" });
    }

    res.json({ success: true, reward: rewards, message: "리워드 조회 성공" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, msg: "서버 오류" });
  }
});

router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const rewards = await Rewards.find().select("-__v");

    if (!rewards) {
      return res.status(404).json({ success: false, message: "리워드가 없음" });
    }

    res.json({ success: true, reward: rewards, message: "리워드 조회 성공" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, msg: "서버 오류" });
  }
});

module.exports = router;
