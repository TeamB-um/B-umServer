import express, { Router, Request, Response } from "express";
import User from "../models/Users";
import Posts from "../models/Writings";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Categories from "../models/Categories";
import RewardDummy from "../models/Rewards_dummy";
import Rewards from "../models/Rewards";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "node:constants";
import Writings from "../models/Writings";
import Trashcans from "../models/Trashcans";

const router = Router();

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
      res.status(500).json({ success: false, message: "중복된 이름 존재" });
    } else {
      try {
        let newindex = -1;
        for (var i = 0; i < 8; i++) {
          let ifcategory = await Categories.find({
            index: i,
            user_id: req.body.user.id,
          }).select("-__v");
          console.log(ifcategory);
          if (!ifcategory[0]) {
            console.log(i);
            newindex = i;
            break;
          }
        }
        if (newindex == -1) {
          res
            .status(500)
            .json({ success: false, message: "카테고리 8개 초과" });
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
          const categoryresult = await newCategory.save();
          const category = {
            _id: categoryresult._id,
            name: categoryresult.name,
            img: categoryresult.img,
            index: categoryresult.index,
            count: categoryresult.count,
            created_date: categoryresult.created_date,
          };
          res.status(201).json({ success: true, data: { category } });
        }
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "서버 오류" });
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
    const categories = await Categories.find({
      user_id: req.body.user.id,
    })
      .sort({ created_date: 1 })
      .select("-user_id  -__v");
    res.status(200).json({ success: true, data: { categories } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

router.get(
  "/:category_id/rewards",
  auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const categorycheck = await Categories.find({
        _id: req.params.category_id,
        user_id: req.body.user.id,
      });
      if (categorycheck[0]) {
        const category = await Categories.findOne({
          _id: req.params.category_id,
        });
        const user = await User.findOne({
          _id: req.body.user.id,
        });

        const newseq = Number(user.seq) + 1;
        const rewardcheck = await RewardDummy.findOne({
          seq: user.seq,
        }).select("-__v -seq");
        await User.findOneAndUpdate(
          {
            _id: req.body.user.id,
          },
          {
            seq: newseq,
          }
        );
        const Categoryindex =  await Categories.findOne({_id: req.params.category_id,});
        const index = Categoryindex.index;
        await Categories.findOneAndUpdate(
          {
            _id: req.params.category_id,
          },
          {
            count: 0,
            img : `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/${index}-0.png`,
          }
        );
        const newcategory = await Categories.findById(req.params.category_id);
        await Writings.updateMany({category_id : req.params.category_id}, {category : newcategory});
        const rewardresult = new Rewards({
          sentence: rewardcheck.sentence,
          context: rewardcheck.context,
          author: rewardcheck.author,
          user_id: req.body.user.id,
          index: category.index,
          created_date: getCurrentDate(),
        });

        await rewardresult.save();
        const reward = {
          sentence: rewardresult.sentence,
          context: rewardresult.context,
          author: rewardresult.author,
          user_id: req.body.user.id,
          index: category.index,
          created_date: getCurrentDate(),
        };
        res.status(200).json({ success: true, data: { reward } });
      } else {
        res.status(400).json({
          success: false,
          message: "유저에 해당하는 카테고리 id가 아님",
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "서버 오류" });
    }
  }
);

router.delete("/:category_id", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const category_id = req.params.category_id;
  try {
    const categorycheck = await Categories.find({
      _id: req.params.category_id,
      user_id: req.body.user.id,
    });
    if (categorycheck[0]) {
      const category = await Categories.findOne({
        _id: req.params.category_id,
      });
      await Posts.deleteMany({
        category_id: category_id,
      });
      await Trashcans.deleteMany({
        category_id: category_id,
      });
      await Categories.deleteOne({
        _id: category_id,
      });
      res
        .status(204)
        .json({ success: true, message: "카테고리 및 관련 글 삭제 완료" });
    } else {
      res.status(400).json({
        success: false,
        message: "유저에 해당하는 카테고리 id가 아님",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

/**
 *  @route PATCH api/categories
 *  @desc PATCH categories by ID
 *  @access Public
 */
router.patch("/:category_id", auth, async (req: Request, res: Response) => {
  try {
    const categorycheck = await Categories.find({
      _id: req.params.category_id,
      user_id: req.body.user.id,
    });
    if (categorycheck[0]) {
      const check = await Categories.find({
        user_id: req.body.user.id,
        name: req.body.name,
      });

      if (check[0]) {
        res.status(500).json({ success: false, message: "중복된 이름 존재" });
      } else {
        if (req.body.name != null) {
          await Categories.findByIdAndUpdate(req.params.category_id, {
            name: req.body.name,
          });
          const newcategory = await Categories.findById(req.params.category_id);
          await Writings.updateMany({category_id : req.params.category_id}, {category : newcategory});
        }
        const category = await Categories.findById(
          req.params.category_id
        ).select("_id name index count img");
        res.status(200).json({ success: true, data: { category } });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "유저에 해당하는 카테고리 id가 아님",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

module.exports = router;
