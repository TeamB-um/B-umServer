import mongoose from "mongoose";
import { ICategories } from "../interfaces/ICategories";

const CategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
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
});

export default mongoose.model<ICategories & mongoose.Document>(
  "Categories",
  CategoriesSchema
);
