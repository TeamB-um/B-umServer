import mongoose from "mongoose";
import { IUsers } from "../interfaces/IUsers";

const UsersSchema = new mongoose.Schema({
  ispush: {
    type: Boolean,
    required: true
  },
  delperiod: {
    type: Date,
    required: true
  }
});

export default mongoose.model<IUsers & mongoose.Document>("Users", UsersSchema);