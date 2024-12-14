const mongoose = require("mongoose");
const { sizes } = require("../constants");
const Schema = mongoose.Schema;

const receiptSchema = new Schema({
  supplier: {
    type: String,
    required: true,
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  deliver: {
    type: String,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
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
            required: true,
          },
        },
      ],
      importPrice: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Receipt", receiptSchema);
