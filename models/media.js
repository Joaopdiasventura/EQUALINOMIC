import mongoose, { Schema } from "mongoose";

const mediaSchema = new mongoose.Schema({
  valor: {
    type: String,
    required: true
  },
  empresa : {
    type: Schema.ObjectId,
    required: true
  },
  Date: {
    type: Date,
    default: Date.now
  }
});

const Media = mongoose.model('Media', mediaSchema);

export default  Media;