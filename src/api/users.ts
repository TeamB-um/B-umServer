import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/Users";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";

const router = Router();

/**
 *  @route POST api/users
 *  @desc Create a user
 *  @access Public
 */

router.post(
  "/",
  [check("device_id", "id is required").not().isEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const device_id = req.body.device_id;
    try {
      let user = await User.findOne({ device_id });
      if (user) {
        const payload = {
          user: {
            id: user.id,
          },
        };
        jwt.sign(
          payload,
          config.jwtSecret,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } else {
        let ispush = true;
        let delperiod = 3;
        user = new User({
          device_id,
          ispush,
          delperiod,
        });
        await user.save();
        const payload = {
          user: {
            id: user.id,
          },
        };
        jwt.sign(
          payload,
          config.jwtSecret,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("서버 오류");
    }
  }
);

/**
 *  @route GET api/users/:id
 *  @desc Get user by ID
 *  @access Public
 */
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user.id);

    if (!user) {
      return res.status(404).json({ msg: "특정 사용자 조회 실패" });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "특정 사용자 조회 실패" });
    }
    res.status(500).send("서버 오류");
  }
});

/**
 *  @route PATCH api/users/:id
 *  @desc PATCH user by ID
 *  @access Public
 */
router.patch("/", auth, async (req: Request, res: Response) => {
  try {
    if ("ispush" in req.body) {
      await User.findByIdAndUpdate(req.body.user.id, {
        ispush: req.body.ispush,
      });
    } else {
      await User.findByIdAndUpdate(req.body.user.id, {
        delperiod: req.body.delperiod,
      });
    }
    const user = await User.findById(req.body.user.id);
    console.log(user);
    res.status(200).send("성공적으로 수정되었습니다.");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("서버 오류");
  }
});

module.exports = router;
