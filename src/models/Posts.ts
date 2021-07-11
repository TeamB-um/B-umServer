import mongoose from "mongoose";
import { IPosts } from "../interfaces/IPosts";
// const moment = require("moment-timezone");
// const dateSeoul = moment.tz(Date.now(), "Asia/Seoul");

const PostsSchema = new mongoose.Schema({
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
  category_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Categories",
  },
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
  },
});

export default mongoose.model<IPosts & mongoose.Document>("Posts", PostsSchema);
