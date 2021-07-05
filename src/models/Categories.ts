import mongoose from "mongoose";
import { ICategories } from "../interfaces/ICategories";

const CategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  index : {
    type: Date,
    required: true
  },
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref:"Users"
  }

});

export default mongoose.model<ICategories & mongoose.Document>("Categories", CategoriesSchema);