import express, { Router, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/Users";
import Writing from "../models/Writings";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Categories from "../models/Categories";
import Writings from "../models/Writings";

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
 *  @route POST api/posts
 *  @desc Create a post
 *  @access Private
 */

router.post(
  "/",
  auth,
  [
    check("category_id", "category_id is required").not().isEmpty(),
    check("text", "text is required").not().isEmpty(),
    check("iswriting", "iswriting is required").not().isEmpty(),
    check("paper","paper is required").not().isEmpty()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    console.log(req.body)
 
    let title = req.body.title;
    if (!title) {
      title = "제목 없음";
    }
    const text = req.body.text;
    const paper = req.body.paper;
    const category_id = req.body.category_id;
    const categoryObjectcheck = await Categories.findOne({
      _id: category_id,
    });
    if (req.body.user.id != categoryObjectcheck.user_id) {
      res
        .status(400)
        .json({ success: false, message: "카테고리가 유저와 일치하지 않음" });
    } else {
      console.log("fuckingbium!!!!!!!!!!!!!!!!!")
      try {
        const user = await User.findById(req.body.user.id);
        const categoryObject = await Categories.findOne({
          _id: category_id,
        });
 
        if (req.body.iswriting) {
          let categorycount = categoryObject.count;
          let categoryindex = categoryObject.index;
          categorycount = Number(categorycount) + 1;
          let categorycount_img = categorycount;
          if (categorycount >= 5) {
            categorycount_img = 5;
          }
          const category = await Categories.findOneAndUpdate(
            {
              _id: category_id,
            },
            {
              $set: {
                count: categorycount,
                img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/${categoryindex}-${categorycount_img}.png`,
              },
            }
          );
        }
        const newcategory = await Categories.findById(req.body.category_id);
        await Writings.updateMany(
          { category_id: req.body.category_id },
          { category: newcategory }
        );
        const inputcategoryObject = await Categories.findOne({
          _id: req.body.category_id,
        }).select("-__v -user_id");
        let created_date = getCurrentDate();
        //created_date.setHours(created_date.getHours() + 9);
        if (req.body.iswriting) {
          const newWriting = new Writings({
            title: title,
            text: text,
            user_id: user.id,
            category: inputcategoryObject,
            created_date: created_date,
            category_id: req.body.category_id,
            category_name : inputcategoryObject.name,
            paper : paper,
          });
          const writingresult = await newWriting.save();
          const writing = await Writings.find({
            user_id: req.body.user.id,
          }).select("-__v -category_id -category.__v -category.user_id -category_name").sort({ created_date: -1 });
          res.status(201).json({ success: true, data: { writing } });
        } else {
          res.status(201).json({ success: true, message: "삭제 완료" });
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
  console.log(typeof req.query.start_date);
  console.log(req.query.start_date);
  let start_date = req.query.start_date;
  let end_date = req.query.end_date;
  let category = String(req.query.category_ids)
    .replace("[", "")
    .replace("]", "");
  const category_real_list = category.split(",");
  const Date_start_date = new Date(String(start_date));
  const Date_end_date = new Date(String(end_date));
  Date_end_date.setDate(Date_end_date.getDate() + 1);

  const user_id = req.body.user.id;
  console.log(category_real_list);
  try {
    if (start_date) {
      if (req.query.category_ids) {
        const writing = await Writing.find({
          user_id: user_id,
          category_id: { $in: category_real_list },
          created_date: { $gte: Date_start_date, $lte: Date_end_date },
        })
          .select("-__v -category_id -category.__v -category.user_id")
          .sort({ created_date: -1 });
        if (writing.length != 0) {
          res.status(200).json({ success: true, data: { writing } });
        } else {
          res
            .status(404)
            .json({ success: false, message: "해당 필터 결과가 없습니다. " });
        }
      } else {
        const writing = await Writing.find({
          user_id: user_id,
          created_date: { $gte: Date_start_date, $lte: Date_end_date },
        })
          .select("-__v -category_id -category.__v -category.user_id")
          .sort({ created_date: -1 });
        if (writing.length != 0) {
          res.status(200).json({ success: true, data: { writing } });
        } else {
          res
            .status(404)
            .json({ success: false, message: "해당 필터 결과가 없습니다." });
        }
      }
    } else {
      if (req.query.category_ids) {
        const writing = await Writing.find({
          user_id: user_id,
          category_id: { $in: category_real_list },
        })
          .select("-__v -category_id -category.__v -category.user_id")
          .sort({ created_date: -1 });
        if (writing.length != 0) {
          res.status(200).json({ success: true, data: { writing } });
        } else {
          res
            .status(404)
            .json({ success: false, message: "해당 필터 결과가 없습니다." });
        }
      } else {
        const writing = await Writing.find({
          user_id: { $eq: user_id },
        })
          .select("-__v -category_id -category.__v -category.user_id")
          .sort({ created_date: -1 });
        if (writing.length != 0) {
          res.status(200).json({ success: true, data: { writing } });
        } else {
          res
            .status(404)
            .json({ success: false, message: "해당 필터 결과가 없습니다." });
        }
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

router.get("/:writing_id", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const writing = await Writing.find({
      _id: req.params.writing_id,
      user_id: req.body.user.id,
    }).select("-__v -category_id -category.__v -category.user_id");
    res.status(200).json({ success: true, data: { writing } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

router.get("/stat/graph", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userid = mongoose.Types.ObjectId(req.body.user.id);
  try{
    console.log(req.body.user.id)
    const nums = await Writings.find({ user_id : req.body.user.id}).count();
    console.log(nums)
    const allstat = await Writings.aggregate([
     { $match: { "user_id" : userid } },

     { $group: { _id : 
      {
        'name' : "$category_name",
        'index' : '$category.index'
      }, count: { $sum: 1 } } },
      
      {  $project:{
          name:"$_id.name",
          index : "$_id.index",
          _id:false,
         percent: 
         {$round : [{ "$multiply": [ { "$divide": 
         [ "$count", {"$literal": nums }] }, 100 ] },0]
      }
          
      
      }},
      { $sort: { percent: -1 } },
    ])
    console.log(allstat)

    const end_date = getCurrentDate();
    console.log(end_date);
    let start_date = new Date(end_date);
    
    start_date.setDate(end_date.getDate() - 30);
    console.log(start_date);
    const month_cnt = await Writings.find({
      user_id: req.body.user.id,
      created_date: { $gte: start_date, $lte: end_date },
    }).count();
    console.log(month_cnt)
    const monthstat = await Writings.aggregate([
      { $match: { "user_id" : userid , "created_date": { $gte: start_date, $lte: end_date } } },
 
      { $group: { _id : 
       {
         'name' : "$category_name",
         'index' : '$category.index'
       }, count1: { $sum: 1 } } },
       
       {  $project:{
           name:"$_id.name",
           index : "$_id.index",
           _id:false,
          percent: 
          {$round : [{ "$multiply": [ { "$divide": 
          [ "$count1", {"$literal": month_cnt }] }, 100 ] },0]
       }
           
       
       }},
       { $sort: { percent: -1 } },
     ])
    res.status(200).json({
      success: true,
      data: { allstat, monthstat }
    });
  }
  catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "서버 오류" });
  }
});

router.delete("/", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: "false", errors: errors.array() });
  }
  const writing_ids = String(req.query.ids).replace("[", "").replace("]", "");
  const id_list = writing_ids.split(",");
  try {
    await Writing.deleteMany({
      _id: { $in: id_list },
    });
    const writing = await Writings.find({
      user_id: req.body.user.id,
    }).select("-__v -category_id -category.__v").sort({ created_date: -1 });
    res.status(200).json({ success: true, data: { writing } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

module.exports = router;
