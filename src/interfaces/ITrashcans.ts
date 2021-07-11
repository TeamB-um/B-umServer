import mongoose from "mongoose";

export interface ITrashcans {
  _id?: String;
  title: String;
  text: String;
  category_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  delperiod: Number;
  created_date: Date;
}