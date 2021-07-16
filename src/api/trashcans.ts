import express, { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Trashcans from "../models/Trashcans";
import Users from "../models/Users";

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
 *  @route GET api/trashcans
 *  @desc open all post in trashcan
 *  @access Private
 */

router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const trashcans = await Trashcans.find({ user_id: req.body.user.id }).sort({
      created_date: -1,
    });
    const trashcount = await Trashcans.find({
      user_id: req.body.user.id,
    }).count();
    let trashresult = [];
    for (let i = 0; i < trashcount; i++) {
      const current: Date = getCurrentDate();
      current.setHours(current.getHours() + 9);
      const deleted_date = trashcans[i].created_date;
      deleted_date.setDate(deleted_date.getDate() + Number(trashcans[i].delperiod));
      const d_day = (deleted_date.getTime() - current.getTime()) / 86400000;
      const object = {
        _id: trashcans[i].id,
        title: trashcans[i].title,
        text: trashcans[i].text,
        category: trashcans[i].category,
        d_day: Math.round(d_day),
      };
      trashresult.push(object);
    };
    if (!trashcans[0]) {
      return res
        .status(404)
        .json({ success: false, message: "휴지통이 비어 있음." });
    }

    res.status(200).json({
      success: true,
      data: { trashresult },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("서버 오류");
  }
});

module.exports = router;
