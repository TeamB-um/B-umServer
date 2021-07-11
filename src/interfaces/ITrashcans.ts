import mongoose from "mongoose";

export interface ITrashcans {
  title: String;
  text: String;
  category_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  created_date: Date;
  delperiod: Number;
}