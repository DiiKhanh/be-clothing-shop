const mongoose = require("mongoose");
const { sizes, productStates } = require("../constants");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    mainImg: {
      type: String,
      required: true,
    },
    subImg: {
      type: String,
      required: true,
    },
  },
  sizes: [
    {
      name: {
        type: String,
        enum: sizes,
        required: true,
      },
      quantity: {
        type: Number,
        default: 0,
      },
      sold: {
        type: Number,
        default: 0,
      },
    },
  ],
  totalSold: {
    type: Number,
    default: 0,
  },
  state: {
    type: String,
    enum: Object.values(productStates),
    default: Object.values(productStates)[0],
  },
});

module.exports = mongoose.model("Product", productSchema);
