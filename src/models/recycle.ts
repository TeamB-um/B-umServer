import mongoose from "mongoose";
import { IRecycles } from "../interfaces/IRecycles";

const RecyclesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },

});

export default mongoose.model<IRecycles & mongoose.Document>("Recycles", RecyclesSchema);