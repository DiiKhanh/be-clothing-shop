const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  tag: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  mainImg: {
    type: String,
    required: true,
  },
  subImgs: [
    {
      type: String,
    },
  ],
  relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

module.exports = mongoose.model("Event", eventSchema);
