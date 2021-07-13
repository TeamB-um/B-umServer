import mongoose from "mongoose";
import { IRewards } from "../interfaces/IRewards";

const RewardsSchema = new mongoose.Schema({
  created_date: {
    type: Date,
    required: true,
  },
  sentence: {
    type: String,
    required: true,
  },
  context: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
  },
  index: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<IRewards & mongoose.Document>(
  "Rewards",
  RewardsSchema
);
