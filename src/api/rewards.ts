import express, { Router, Request, Response } from "express";
import Reward from "../models/Rewards";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Rewards from "../models/Rewards";

const router = Router();

/**
 *  @route POST api/rewards
 *  @desc Create a rewards
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

    const { name, created_date, sentence, author, category_id} = req.body;

    try {
      // const user = await Reward.findById(req.body.user.id);

      const newRewards = new Rewards({
        name,
        created_date,
        sentence,
        author,
        category_id
      });

      const reward = await newRewards.save();
      res.json(reward);

    } catch (err) {
      console.error(err.message);
      res.status(500).send("서버 오류");
    }
  }
);

module.exports = router;