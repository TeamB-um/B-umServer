import mongoose from "mongoose";

export interface IWritings {
  title: String;
  text: String;
  user_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  category: Object;
  created_date: Date;
  category_name : String;
  paper : Number;
}

export interface InputWritingsDTO {
  _id: String;
  title: String;
  text: String;
  category: Object;
  created_date: Date;
}
