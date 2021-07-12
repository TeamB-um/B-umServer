import mongoose from "mongoose";

export interface ITrashcans {
  title: String;
  text: String;
  category_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  delperiod: Number;
  created_date: Date;
  category: Object;
}

export interface ITrashcansDTO {
  title: String;
  text: String;
  category_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  delperiod: Number;
  created_date: Date;
  category: Object;
  d_day: Number;
}
