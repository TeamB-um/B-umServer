import express, { Router, Request, Response } from "express";
import User from "../models/Users";
import Posts from "../models/Writings";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Categories from "../models/Categories";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "node:constants";

const router = Router();

/**
 *  @route POST api/categories
 *  @desc Create a category
 *  @access Private
 */

router.post(
  "/",
  auth,
  [check("name", "name is required").not().isEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const name = req.body.name;
    const checkname = await Categories.findOne({ name });
    if (checkname) {
      res.status(500).json({ success: false, msg: "중복된 이름 유지" });
    } else {
      try {
        let newindex = -1;
        for (var i = 0; i < 8; i++) {
          let ifcategory = await Categories.findOne({ index: i });
          if (!ifcategory) {
            newindex = i;
            break;
          }
        }
        if (newindex == -1) {
          res.status(500).json({ success: false, msg: "카테고리 8개 초과" });
        } else {
          const user = await User.findById(req.body.user.id);
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
              Date.UTC(
                year,
                month,
                today,
                hours,
                minutes,
                seconds,
                milliseconds
              )
            );
          }
          const newCategory = new Categories({
            name,
            user_id: user.id,
            index: newindex,
            count: 0,
            img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/${newindex}-0.png`,
            created_date: getCurrentDate(),
          });
          const category = await newCategory.save();
          const categoryresult = {
            _id: category._id,
            name: category.name,
            img: category.img,
            created_date: category.created_date,
          };
          res.json({ success: true, categoryresult });
        }
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
      }
    }
  }
);

router.get("/", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const categories = await Categories.find().select(
      "-user_id -index -count -__v"
    );
    res.json({ success: true, categories });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, msg: "서버 오류" });
  }
});

router.delete("/:category_id", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const category_id = req.params.category_id;
  try {
    await Posts.deleteMany({
      category_id: category_id,
    });
    await Categories.deleteOne({
      _id: category_id,
    });
    res
      .status(204)
      .json({ success: true, msg: "카테고리 및 관련 글 삭제 완료" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "서버 오류" });
  }
});

/**
 *  @route PATCH api/categories
 *  @desc PATCH categories by ID
 *  @access Public
 */
router.patch("/:category_id", auth, async (req: Request, res: Response) => {
  try {
    if (req.body.name != null) {
      await Categories.findByIdAndUpdate(req.params.category_id, {
        name: req.body.name,
      });
    }
    const category = await Categories.findById(req.params.category_id).select(
      "_id name img"
    );
    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, msg: "서버 오류" });
  }
});

module.exports = router;
