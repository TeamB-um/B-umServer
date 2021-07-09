import express, { Router, Request, Response } from "express";
import User from "../models/Users";
import Posts from "../models/Posts";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Categories from "../models/Categories";
import ObjectID from "mongodb";

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
    check("category_name", "category_name is required").not().isEmpty(),
    check("text", "text is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let title = req.body.title;
    if (!title) {
      title = "제목 없음";
    }
    const text = req.body.text;
    const category_name = req.body.category_name;
    try {
      const user = await User.findById(req.body.user.id);
      const category = await Categories.findOne({
        name: req.body.category_name,
      });

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
      const newPost = new Posts({
        title: title,
        text: text,
        user_id: user.id,
        category_id: category.id,
        created_date: getCurrentDate(),
      });

      const post = await newPost.save();
      console.log(post);
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("서버 오류");
    }
  }
);

router.get("/", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const datetoggle = req.body.datetoggle;
  let start_date = req.body.start_date;
  let end_date = req.body.end_date;
  const category = req.body.category;
  start_date = new Date(start_date);
  end_date = new Date(end_date);

  try {
    if (datetoggle) {
      if (category) {
        const posts = await Posts.find().where("category_id").equals(category)
        .where("created_date").gte(start_date)..where("created_date").lte(end_date)
        res.json(posts);
      } else {
        const posts = await Posts.find().where("created_date").gte(start_date)..where("created_date").lte(end_date)
        res.json(posts);
      }
    } else {
      if (category) {
        const posts = await Posts.find().where("created_date").gte(start_date)..where("created_date").lte(end_date)
        res.json(posts);
      } else {
        const posts = await Posts.find();
        res.json(posts);
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
});

router.get("/statistics", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
});

router.delete("/", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const posts_id = req.body.posts_id;
  try {
    await Posts.deleteMany({
      _id: { $in: posts_id },
    });

    const post = await Posts.find();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
});

router.delete("/:id", auth, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const category_id = req.params.id;
  try {
    await Posts.deleteMany({
      category_id: category_id,
    });

    const post = await Posts.find();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
});

module.exports = router;
