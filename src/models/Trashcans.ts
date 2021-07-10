import mongoose from "mongoose";
import { ITrashcans } from "../interfaces/ITrashcans";

const TrashcansSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  category_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref:"Categories",
  },
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref:"Users",
  },
  created_date: {
    type: Date,
    required: true
  },
  delpriod: {
    type: Number,
    required: true
  }
});

export default mongoose.model<ITrashcans & mongoose.Document>("Trashcans", TrashcansSchema);