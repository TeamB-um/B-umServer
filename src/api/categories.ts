import express, { Router, Request, Response } from "express";
import User from "../models/Users";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Categories from "../models/Categories";

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
      return res.status(400).json({ errors: errors.array() });
    }
    const name = req.body.name;
    try {
      const user = await User.findById(req.body.user.id);
      const newCategory = new Categories({
        name,
        user_id: user.id,
        index: 0,
        count: 0,
      });
      const category = await newCategory.save();
      res.json(category);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("서버 오류");
    }
  }
);

module.exports = router;
