import mongoose from "mongoose";
import { ITrashcans } from "../interfaces/ITrashcans";

const TrashcansSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  category_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Categories",
  },
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
  },
  delperiod: {
    type: Number,
    required: true,
  },
  created_date: {
    type: Date,
    //created_date가 될 시 1분 후 해당 문서 삭제
    expires: 60,
  },
  category: {
    type: Object,
    required: true,
  },
});

export default mongoose.model<ITrashcans & mongoose.Document>(
  "Trashcans",
  TrashcansSchema
);
