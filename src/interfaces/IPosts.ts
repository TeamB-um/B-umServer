import mongoose from "mongoose";

export interface IPosts {
  _id?: String;
  title: String;
  text: String;
  user_id : mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  created_date : Date;
}