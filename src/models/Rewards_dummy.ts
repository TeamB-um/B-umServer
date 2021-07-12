import mongoose from "mongoose";
import { IRewards } from "../interfaces/IRewards";

const RewardDummySchema = new mongoose.Schema({
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
  seq: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<IRewards & mongoose.Document>(
  "RewardDummy",
  RewardDummySchema
);
