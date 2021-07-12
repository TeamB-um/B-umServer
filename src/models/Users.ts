import mongoose from "mongoose";
import { IUsers } from "../interfaces/IUsers";

const UsersSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },

  ispush: {
    type: Boolean,
    required: true,
  },
  delperiod: {
    type: Number,
    required: true,
  },
  seq: {
    type: Number,
    required: true,
    default: 1,
  },
});

export default mongoose.model<IUsers & mongoose.Document>("Users", UsersSchema);
