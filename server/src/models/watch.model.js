import mongoose from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model("WatchHistory", mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mediaId: {
    type: Number,
    required: true
  },
  mediaType: {
    type: String,
    required: true
  }
}, modelOptions));
