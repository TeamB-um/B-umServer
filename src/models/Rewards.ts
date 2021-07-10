import mongoose from "mongoose";
import { IRewards } from "../interfaces/IRewards";

const RewardsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    required: true,
  },
  sentence: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Categories",
  },
  user_id: {
    type: Array,
    required: true,
  },
});

export default mongoose.model<IRewards & mongoose.Document>(
  "Rewards",
  RewardsSchema
);
