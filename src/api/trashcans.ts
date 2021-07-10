import express, { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Trashcans from "../models/Trashcans";
import Users from "../models/Users";

const router = Router();

/**
 *  @route GET api/trashcans
 *  @desc open all post in trashcan
 *  @access Private
 */


router.get(
  "/",
  async (req: Request, res: Response) => {

    try{
        const trashcans = await Trashcans.find();

        if (!trashcans){
            return res.status(204).json({message : "휴지통이 비어 있음."});
        }

        res.json({trashcan : trashcans, message : "전체 휴지통 조회 성공"});

    } catch (error){
        console.error(error.message);
        res.status(500).send("서버 오류");
    }

  }
);

/**
 *  @route GET api/trashcans/:id
 *  @desc Get trash by ID
 *  @access Private
 */
 router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const trash = await Trashcans.findById(req.body.user.id);

    if (!trash) {
      return res.status(404).json({ msg: "특정 휴지 조회 실패" });
    }
    res.json(trash);

  } catch (error) {
    console.error(error.message);

    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "특정 휴지 조회 실패" });
    }

    res.status(500).send("서버 오류");
  }
});

/**
 *  @route DELETE api/trashcans
 *  @desc Delete trash by Expire Date
 *  @access Public
 */




/**
 *  @route POST api/trashcans
 *  @desc Create a trash
 *  @access Public
 */

 router.post(
  "/",
  auth,
  async (req: Request, res: Response) => {

    const user = await Users.findById(req.body.user.id);
    const title = req.body.title;
    const text = req.body.text;
    const user_id = req.body.user_id;

    let created_date = new Date();
    const delperiod = user.delperiod;

    try {
      const newTrash = new Trashcans({
        title,
        text,
        user_id,
        created_date,
        delperiod
      });
      const trash = await newTrash.save();
      res.json(trash);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("서버 오류");
    }
  }
);



module.exports = router;