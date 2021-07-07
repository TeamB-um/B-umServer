import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/Users";
import Post from "../models/Posts";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Categories from "../models/Categories";

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
      const newPost = new Post({
        title: title,
        text: text,
        user_id: user.id,
        category_id: category.id,
        created_date: date.now,
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

module.exports = router;
