import mongoose from "mongoose";

export interface IRewards {
  id: String;
  created_date: Date;
  sentence: String;
  author: String;
  category_id: mongoose.Types.ObjectId;
  user_id: Array<1000>;
  seq: Number;
}