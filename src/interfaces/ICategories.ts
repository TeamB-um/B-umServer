import mongoose from "mongoose";

export interface ICategories {
  _id?: String;
  user_id: mongoose.Types.ObjectId;
  name: String;
  count: Number;
  index: Number;
  img: String;
}
