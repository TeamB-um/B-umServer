import mongoose from "mongoose";
import { ICheers } from "../interfaces/ICheers";

const CheersSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  context: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },

});

export default mongoose.model<ICheers & mongoose.Document>("Cheers", CheersSchema);