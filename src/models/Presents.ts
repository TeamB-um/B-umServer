import mongoose from "mongoose";

const PresentSchema = new mongoose.Schema({
  sentence: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<mongoose.Document>(
  "Present",
  PresentSchema
);

