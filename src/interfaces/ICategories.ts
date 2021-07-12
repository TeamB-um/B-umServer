import mongoose from "mongoose";

export interface ICategories {
  user_id: mongoose.Types.ObjectId;
  name: String;
  count: Number;
  index: Number;
  img: String;
  created_date: Date;
}
