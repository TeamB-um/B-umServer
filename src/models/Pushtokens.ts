import mongoose from "mongoose";
import { ITokens } from "../interfaces/Itoken";

const PushtokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  }
});

export default mongoose.model< ITokens & mongoose.Document>(
  "Pushtoken",
  PushtokenSchema
);
