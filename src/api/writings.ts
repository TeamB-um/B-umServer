import express, { Router, Request, Response } from "express";
import User from "../models/Users";
import Writing from "../models/Writings";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Categories from "../models/Categories";
import { InputWritingsDTO, IWritings } from "../interfaces/IWritings";
import Writings from "../models/Writings";
import { ICategories } from "../interfaces/ICategories";

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
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        "success" : "false", errors: errors.array() });
    }
    let title = req.body.title;
    if (!title) {
      title = "제목 없음";
    }
    const text = req.body.text;
    const category_id = req.body.category_id;
    const usercheck = await User.findById(req.body.user.id);
    const categoryObjectcheck = await Categories.findOne({
      _id : category_id,
    });
    if(req.body.user.id != categoryObjectcheck.user_id)
    {
      res.status(400).json({"success" :"false",msg : "카테고리가 유저와 일치하지 않음"})
    }
    else {
      try {
        const user = await User.findById(req.body.user.id);
        const categoryObject = await Categories.findOne({
          _id : category_id,
        });
        let categorycount = categoryObject.count;
        let categoryindex = categoryObject.index;
        categorycount = Number(categorycount) + 1;
        let categorycount_img = categorycount;
        if(categorycount>=5)
        {
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
      
        const inputcategoryObject = await Categories.findOne({
          _id : req.body.category_id,
        });
        const newWriting = new Writings({
          title: title,
          text: text,
          user_id: user.id,
          category: inputcategoryObject,
          created_date: getCurrentDate(),
          category_id : req.body.category_id
        });
        const writing = await newWriting.save();
        let writingresult :InputWritingsDTO = {_id : writing.id, title : writing.title, text : writing.text, category : writing.category, created_date: writing.created_date}
        res.status(201).json({"success" : "true", writingresult});
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ "success" : "false",msg: "서버 오류" });
      }
    }
  }
);

router.get("/", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({"success" :"false", errors: errors.array() });
  }
  let start_date = req.query.start_date;
  let end_date = req.query.end_date;
  const category_list = String(req.query.category_id);
  const category_real_list = category_list.split(",");
  const Date_start_date = new Date(String(start_date));
  const Date_end_date = new Date(String(end_date));
  const user_id = req.body.user.id;

  console.log(category_real_list);
  try {
    if (start_date) {
      if (req.query.category_id) {
        console.log("a");
        const writings = await Writing.find({'user_id' : user_id, 'category_id' :{$in : category_real_list},'created_date': {$gte : Date_start_date, $lte : Date_end_date}});
        console.log(writings);
        if (writings.length != 0) {
          res.status(200).json({"success" : "true",writings});
        } else {
          res.status(404).json({"success" :"false", msg: "해당 필터 결과가 없습니다." });
        }
      } else {
        console.log("b");
        const writings = await Writing.find({'user_id' : user_id, 'created_date': {$gte : Date_start_date, $lte : Date_end_date}});
        if (writings.length != 0) {
          res.status(200).json({"success" : "true",writings});
        } else {
          res.status(404).json({"success" :"false", msg: "해당 필터 결과가 없습니다." });
        }
      }
    } else {
      if (req.query.category_id) {
        console.log("c");
        const writings = await Writing.find({'user_id' : user_id, 'category_id' :{$in : category_real_list}});
        if (writings.length != 0) {
          res.status(200).json({"success" : "true",writings});
        } else {
          res.status(404).json({"success" :"false", msg: "해당 필터 결과가 없습니다." });
        }
      } else {
        console.log("d");
        const writings = await Writing.find({'user_id' : {$eq : user_id}});
        if (writings.length != 0) {
          res.status(200).json({"success" : "true",writings});
        } else {
          res.status(404).json({"success" :"false", msg: "해당 필터 결과가 없습니다." });
        }
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "서버 오류" });
  }
});

router.get("/:writing_id", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const writing = await Writing.findOne({'_id' : req.params.writing_id});
    const writingresult :InputWritingsDTO = {_id : writing.id, title : writing.title, text : writing.text, category : writing.category, created_date: writing.created_date};
    res.status(200).json({"success": "true", msg : "글 1개 조회 완료",writingresult});
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "서버 오류" });
  }
});

router.get("/", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    console.log("a");
   // const num = await Writings.count({"category_id" : "60eab0d26bfa6c44e8054769"});
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "서버 오류" });
  }
});

router.delete("/", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ "success" : "false", errors: errors.array() });
  }
  const writing_ids = String(req.query.writing_ids);
  console.log(req.query.writing_ids);
  const id_list = writing_ids.split(",");
  console.log(id_list);
  try {
      await Writing.deleteMany({
        _id: {$in : id_list}
      });
    res.status(204).json({"success" :"true", msg : "보관함 글 삭제 완료"});
  } catch (err) {
    console.error(err.message);
    res.status(500).json({"success" :"false", msg: "서버 오류" });
  }
});

module.exports = router;
