import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";

import User from "../models/Users";
import Post from "../models/Posts";

const router = Router();

/**
 *  @route POST api/posts
 *  @desc Create a post
 *  @access Public
 */

router.post(
  "/
  [check("device_id", "id is required").not().isEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    const device_id = req.body.device_id;
    let ispush = req.body.ispush;
    let delperiod = req.body.delperiod;

    try {
      let user = await User.findOne({ device_id });
      if (user) {
        res.status(200).json({
          errors: [{ msg: "이미 존재하는 사용자" }],
        });
      }

      user = new User({
        device_id,
        ispush,
        delperiod,
      });
      await user.save();
      res.status(201).send("사용자 생성 완료");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("서버 오류");
    }
  }
);

/**
 *  @route GET api/users
 *  @desc search all users
 *  @access Public
 */

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("서버 오류");
  }
});

/**
 *  @route GET api/users/:id
 *  @desc Get user by ID
 *  @access Public
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

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
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    if ("ispush" in req.body) {
      console.log(req.params.id);
      console.log(req.body["ispush"]);
      console.log(req.body.ispush);
      // User.updateOne({ _id: req.params.id }, { ispush: req.body.ispush });
      await User.findByIdAndUpdate(req.params.id, { ispush: req.body.ispush });
    } else {
      await User.findByIdAndUpdate(req.params.id, {
        ispush: req.body.delpeiod,
      });
    }
    const user = await User.findById(req.params.id);
    console.log(user);
    res.status(200).send("성공적으로 수정되었습니다.");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("서버 오류");
  }
});

module.exports = router;
