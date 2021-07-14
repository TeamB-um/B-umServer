import express, { Router, Request, Response } from "express";
import User from "../models/Users";
import Writing from "../models/Writings";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Categories from "../models/Categories";
import { InputWritingsDTO, IWritings } from "../interfaces/IWritings";
import Writings from "../models/Writings";
import Trashcans from "../models/Trashcans";
import RewardDummy from "../models/Rewards_dummy";
import { ICategories } from "../interfaces/ICategories";
import { constants } from "buffer";
import { disconnect } from "process";
import Rewards from "../models/Rewards";

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

function addDays(date, days) {
  const clone = new Date(date);
  clone.setDate(date.getDate() + days);
  return clone;
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
    check("iswriting", "iswriting is requied").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    let title = req.body.title;
    if (!title) {
      title = "제목 없음";
    }
    const text = req.body.text;
    const category_id = req.body.category_id;
    const usercheck = await User.findById(req.body.user.id);
    const categoryObjectcheck = await Categories.findOne({
      _id: category_id,
    });
    if (req.body.user.id != categoryObjectcheck.user_id) {
      res
        .status(400)
        .json({ success: false, message: "카테고리가 유저와 일치하지 않음" });
    } else {
      try {
        const user = await User.findById(req.body.user.id);
        const categoryObject = await Categories.findOne({
          _id: category_id,
        });
        let categorycount = categoryObject.count;
        let categoryindex = categoryObject.index;
        categorycount = Number(categorycount) + 1;
        let categorycount_img = categorycount;
        if (categorycount >= 5) {
          categorycount_img = 5;
        }
        if (req.body.iswriting) {
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
        if (req.body.iswriting) {
          const newWriting = new Writings({
            title: title,
            text: text,
            user_id: user.id,
            category: inputcategoryObject,
            created_date: getCurrentDate(),
            category_id: req.body.category_id,
          });
          const writingresult = await newWriting.save();
          let writing = {
            _id: writingresult.id,
            title: writingresult.title,
            text: writingresult.text,
            category: inputcategoryObject,
            created_date: writingresult.created_date,
          };
          res.status(201).json({ success: true, data: { writing } });
        } else {
          //현재 날짜를 생성날짜로 정하고
          let created_date = getCurrentDate();
          //user model에서 유통기한을 받아온 뒤
          const delperiod = user.delperiod;
          console.log("user_delperiod");
          console.log(user.delperiod);
          //두 날짜를 더해서 삭제 예정 날짜를 연산
          //models expire 설정에 따라 해당 날짜가 되면 1분 경과 후 삭제
          created_date = addDays(created_date, delperiod);
          const inputcategoryObject = await Categories.findOne({
            _id: req.body.category_id,
          }).select("-__v -user_id");
          const newTrash = new Trashcans({
            title: title,
            text: text,
            user_id: user.id,
            category: inputcategoryObject,
            created_date: created_date,
            category_id: req.body.category_id,
            delperiod: user.delperiod,
          });

          const trashresult = await newTrash.save();
          let writing = {
            _id: trashresult.id,
            title: trashresult.title,
            text: trashresult.text,
            category: inputcategoryObject,
            created_date: trashresult.created_date,
          };
          res.status(201).json({ success: true, data: { writing } });
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
        const writings = await Writing.find({
          user_id: user_id,
          category_id: { $in: category_real_list },
          created_date: { $gte: Date_start_date, $lte: Date_end_date },
        })
          .select("-__v -category_id -category.__v")
          .sort({ created_date: -1 });
        if (writings.length != 0) {
          res.status(200).json({ success: true, data: { writings } });
        } else {
          res
            .status(404)
            .json({ success: false, message: "해당 필터 결과가 없습니다. " });
        }
      } else {
        const writings = await Writing.find({
          user_id: user_id,
          created_date: { $gte: Date_start_date, $lte: Date_end_date },
        })
          .select("-__v -category_id -category.__v")
          .sort({ created_date: -1 });
        if (writings.length != 0) {
          res.status(200).json({ success: true, data: { writings } });
        } else {
          res
            .status(404)
            .json({ success: false, message: "해당 필터 결과가 없습니다." });
        }
      }
    } else {
      if (req.query.category_ids) {
        const writings = await Writing.find({
          user_id: user_id,
          category_id: { $in: category_real_list },
        })
          .select("-__v -category_id -category.__v")
          .sort({ created_date: -1 });
        if (writings.length != 0) {
          res.status(200).json({ success: true, data: { writings } });
        } else {
          res
            .status(404)
            .json({ success: false, message: "해당 필터 결과가 없습니다." });
        }
      } else {
        const writings = await Writing.find({
          user_id: { $eq: user_id },
        })
          .select("-__v -category_id -category.__v")
          .sort({ created_date: -1 });
        if (writings.length != 0) {
          res.status(200).json({ success: true, data: { writings } });
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
    const writing = await Writing.findOne({
      _id: req.params.writing_id,
      user_id: req.body.user.id,
    }).select("-__v");
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
  const user_id = req.body.user.id;
  try {
    // const categorycount = await Writings.aggregate([
    //   { $match: { user_id: req.body.user.id } },

    //   { $group: { name: "$category_id", count: { $sum: 1 } } },

    //   { $sort: { count: -1 } },
    // ]);
    // res.status(200).json({
    //   success: true,
    //   data: { categorycount },
    // });

    // 해당 사용자 ID에 대응하는 카테고리 이름을 찾아서 category 변수에 저장
    const category = await Categories.find({
      user_id: user_id,
    });
    console.log("category", category);
    //해당 사용자 ID에 대응하는 카테고리들의 수를 찾아서 categorynumber 변수에 저장
    const categorynumber = await Categories.find({
      user_id: user_id,
    }).count();

    //전체글 count
    //카테고리 이름과 글의 개수를 담는 딕셔너리 (key: 카테고리 이름, value: 카테고리 글 개수)
    var dicObject = [];
    //전체 글의 개수를 all_cnt 변수에 저장
    const all_cnt = await Writings.find({
      user_id: user_id,
    }).count();

    //카테고리 개수만큼 반복
    for (let i = 0; i < categorynumber; i++) {
      //전체 글 중 탐색 중인 카테고리 ID에 해당하는 글의 개수 count
      const cnt = await Writings.find({
        user_id: user_id,
        category_id: category[i]._id,
      }).count();

      const index = category[i].index;
      //전체 글에서 해당 카테고리가 차지하는 비율 percent 변수에 저장
      const percent = Math.floor((cnt / all_cnt) * 100);
      //카테고리 이름을 string 변환해서 name 변수에 저장
      const name = String(category[i].name);
      //카테고리 이름을 key, 글 개수를 value로 저장
      dicObject.push({ name: name, index: index, percent: percent });
    }

    //월별 count
    //월별 카테고리 이름과 글의 개수를 담는 딕셔너리 (key: 카테고리 이름, value: 카테고리 글 개수)
    var month_dicObject = [];
    //현재 날짜
    const end_date = getCurrentDate();
    //한달 전 날짜
    let start_date = new Date(end_date);
    start_date.setDate(end_date.getDate() - 30);

    for (let j = 0; j < categorynumber; j++) {
      //전체 글 중 탐색 중인 카테고리 ID에 해당하고, 한 달 이내에 작성된 글의 개수 count
      const cnt = await Writings.find({
        user_id: user_id,
        category_id: category[j]._id,
        created_date: { $gte: start_date, $lte: end_date },
      }).count();

      const index = category[j].index;

      //전체 글에서 해당 카테고리가 차지하는 비율 percent 변수에 저장
      const percent = Math.floor((cnt / all_cnt) * 100);
      //카테고리 이름을 string 변환해서 name 변수에 저장
      const name = String(category[j].name);
      //카테고리 이름을 key, 글 개수를 value로 저장
      month_dicObject.push({ name: name, index: index, percent: percent });
    }

    var sort_stand = "percent";

    dicObject.sort(function (a, b) {
      return b[sort_stand] - a[sort_stand];
    });
    month_dicObject.sort(function (a, b) {
      return b[sort_stand] - a[sort_stand];
    });

    //전체 통계와 월별 통계를 반환
    res.status(200).json({
      success: true,
      data: { allstat: dicObject, monthstat: month_dicObject },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: "서버 오류" });
  }
});

router.delete("/", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: "false", errors: errors.array() });
  }
  console.log(req.query.ids);
  const writing_ids = String(req.query.ids).replace("[", "").replace("]", "");
  console.log(writing_ids);
  const id_list = writing_ids.split(",");
  console.log(id_list);
  try {
    for (let i = 0; i < id_list.length; i++) {
      const writing_info = await Writings.findById(id_list[i]);
      const user = await User.findById(req.body.user.id);
      const title = writing_info.title;
      const text = writing_info.text;
      const user_id = writing_info.user_id;
      const category = writing_info.category;

      //현재 날짜를 생성날짜로 정하고
      let created_date = getCurrentDate();
      //user model에서 유통기한을 받아온 뒤
      const delperiod = user.delperiod;
      //두 날짜를 더해서 삭제 예정 날짜를 연산
      //models expire 설정에 따라 해당 날짜가 되면 1분 경과 후 삭제
      created_date = addDays(created_date, delperiod);

      const newTrash = new Trashcans({
        title,
        text,
        user_id,
        delperiod,
        created_date,
        category,
      });

      const trash = await newTrash.save();
    }
    await Writing.deleteMany({
      _id: { $in: id_list },
    });
    res.status(204).json({ success: true, message: "보관함 글 삭제 완료" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});

module.exports = router;
