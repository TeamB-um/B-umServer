import mongoose from "mongoose";
import { IWritings } from "../interfaces/IWritings";
// const moment = require("moment-timezone");
// const dateSeoul = moment.tz(Date.now(), "Asia/Seoul");

const WritingsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    required: true,
  },
  category: {
    type: Object,
    required : true,
  },
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
  },
  category_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Categories",
  },
});

export default mongoose.model<IWritings & mongoose.Document>("Writings", WritingsSchema);
