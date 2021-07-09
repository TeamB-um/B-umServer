import express, { Router, Request, Response } from "express";
import Cheer from "../models/Cheers";
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

    const { name, context, img } = req.body;

    try {

      const newCheers = new Cheers({
        name,
        context,
        img
      });

      const cheer = await newCheers.save();
      res.json(cheer);

    } catch (err) {
      console.error(err.message);
      res.status(500).send("서버 오류");
    }
  }
);

module.exports = router;