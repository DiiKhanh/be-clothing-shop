const mongoose = require("mongoose");
const { genders } = require("../constants");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  ],
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
  promotions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Promotion",
      required: true,
    },
  ],
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  name: {
    type: String,
    required: true,
  },
  address: [
    {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      ward: {
        type: String,
        required: true,
      },
      detail: {
        type: String,
        required: true,
      },
      isDefault: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
  ],
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: this.account ? true : false,
  },
  gender: {
    type: String,
    enum: Object.values(genders),
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("Customer", customerSchema);
