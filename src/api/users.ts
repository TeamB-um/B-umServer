import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/Users";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Categories from "../models/Categories";

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
      return res.status(400).json({ success: false, errors: errors.array() });
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
            res.status(200).json({ success: true, token });
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

        const newCategory0 = new Categories({
          name: "취업",
          user_id: user.id,
          index: 0,
          count: 0,
          img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/0-0.png`,
          created_date: getCurrentDate(),
        });
        await newCategory0.save();
        const newCategory1 = new Categories({
          name: "학업",
          user_id: user.id,
          index: 1,
          count: 0,
          img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/1-0.png`,
          created_date: getCurrentDate(),
        });
        await newCategory1.save();
        const newCategory2 = new Categories({
          name: "인간관계",
          user_id: user.id,
          index: 2,
          count: 0,
          img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/2-0.png`,
          created_date: getCurrentDate(),
        });
        await newCategory2.save();
        const newCategory3 = new Categories({
          name: "건강",
          user_id: user.id,
          index: 3,
          count: 0,
          img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/3-0.png`,
          created_date: getCurrentDate(),
        });
        await newCategory3.save();
        const newCategory4 = new Categories({
          name: "금전",
          user_id: user.id,
          index: 4,
          count: 0,
          img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/4-0.png`,
          created_date: getCurrentDate(),
        });
        await newCategory4.save();
        const newCategory5 = new Categories({
          name: "개인",
          user_id: user.id,
          index: 5,
          count: 0,
          img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/5-0.png`,
          created_date: getCurrentDate(),
        });
        await newCategory5.save();
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
            res.status(201).json({ success: true, token });
          }
        );
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, msg: "서버 오류" });
    }
  }
);

/**
 *  @route GET api/users
 *  @desc Get user by ID
 *  @access Public
 */
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user.id).select(
      "-device_id -_id -__v"
    );

    if (!user) {
      return res.status(404).json({ success: false, msg: "사용자 조회 실패" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ success: false, msg: "사용자 조회 실패" });
    }
    res.status(500).json({ success: false, msg: "서버 오류" });
  }
});

/**
 *  @route PATCH api/users
 *  @desc PATCH user by ID
 *  @access Public
 */
router.patch("/", auth, async (req: Request, res: Response) => {
  const ispush = req.body.ispush;
  const delperiod = req.body.delperiod;
  if (
    typeof ispush != "boolean" ||
    typeof delperiod != "number" ||
    delperiod >= 8
  ) {
    res.status(400).json({ success: false, msg: "조건에 맞지 않는 요청" });
  }
  try {
    if (req.body.ispush != null) {
      await User.findByIdAndUpdate(req.body.user.id, {
        ispush: req.body.ispush,
      });
    }
    if (req.body.delperiod != null) {
      await User.findByIdAndUpdate(req.body.user.id, {
        delperiod: req.body.delperiod,
      });
    }
    const user = await User.findById(req.body.user.id).select(
      "-device_id -_id -__v"
    );
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, msg: "서버 오류" });
  }
});

module.exports = router;
