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
  [check("device_id", "id is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const device_id = req.body.device_id;
    //const devicetoken = req.body.devicetoken;
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
            res.status(200).json({ success: true, data: { token } });
          }
        );
      } else {
        let ispush = true;
        user = new User({
          device_id,
          ispush,
        //devicetoken,
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
        let created_date0 = getCurrentDate();
        const newCategory0 = new Categories({
          name: "취업",
          user_id: user.id,
          index: 0,
          count: 0,
          img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/0-0.png`,
          created_date: created_date0
        });
        await newCategory0.save();
        let created_date1 = getCurrentDate();
        const newCategory1 = new Categories({
          name: "학업",
          user_id: user.id,
          index: 1,
          count: 0,
          img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/1-0.png`,
          created_date: created_date1,
        });
        await newCategory1.save();
        let created_date2 = getCurrentDate();
        const newCategory2 = new Categories({
          name: "인간관계",
          user_id: user.id,
          index: 2,
          count: 0,
          img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/2-0.png`,
          created_date: created_date2,
        });
        await newCategory2.save();
        let created_date3 = getCurrentDate();
        const newCategory3 = new Categories({
          name: "건강",
          user_id: user.id,
          index: 3,
          count: 0,
          img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/3-0.png`,
          created_date: created_date3,
        });
        await newCategory3.save();
        let created_date4 = getCurrentDate();
        const newCategory4 = new Categories({
          name: "금전",
          user_id: user.id,
          index: 4,
          count: 0,
          img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/4-0.png`,
          created_date: created_date4
        });
        await newCategory4.save();
        let created_date5 = getCurrentDate();
        const newCategory5 = new Categories({
          name: "개인",
          user_id: user.id,
          index: 5,
          count: 0,
          img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/5-0.png`,
          created_date: created_date5
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
            res.status(201).json({ success: true, data: { token } });
          }
        );
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "서버 오류" });
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
      "-device_id -_id -__v -seq"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "사용자 조회 실패" });
    }
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ success: false, message: "사용자 조회 실패" });
    }
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

/**
 *  @route PATCH api/users
 *  @desc PATCH user by ID
 *  @access Public
 */
router.patch("/", auth, async (req: Request, res: Response) => {
  const delperiod = req.body.delperiod;
  if (delperiod >= 8) {
    res.status(400).json({ success: false, message: "조건에 맞지 않는 요청" });
  }
  try {
    if (req.body.ispush != null && typeof req.body.ispush == "boolean") {
      await User.findByIdAndUpdate(req.body.user.id, {
        ispush: req.body.ispush,
      });
    }
    if (req.body.delperiod != null && typeof req.body.delperiod == "number") {
      await User.findByIdAndUpdate(req.body.user.id, {
        delperiod: req.body.delperiod,
      });
    }
    const user = await User.findById(req.body.user.id).select(
      "-device_id -_id -__v -seq"
    );
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

module.exports = router;
