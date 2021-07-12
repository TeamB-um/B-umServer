import mongoose from "mongoose";

export interface IRewards {
  created_date: Date;
  sentence: String;
  author: String;
  context: String;
  category_id: mongoose.Types.ObjectId;
  user_id: Array<1000>;
  seq?: Number;
}
