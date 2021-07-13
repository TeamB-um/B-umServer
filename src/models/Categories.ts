import mongoose from "mongoose";
import { ICategories } from "../interfaces/ICategories";

const CategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
  },
  img: {
    type: String,
    requied: true,
  },
  created_date: {
    type: Date,
    requied: true,
  },
});

export default mongoose.model<ICategories & mongoose.Document>(
  "Categories",
  CategoriesSchema
);
