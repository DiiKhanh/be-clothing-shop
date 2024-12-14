const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const {
  orderShippingStatuses,
  orderPaymentStatuses,
  orderShippingMethods,
  orderPaymentMethods,
} = require("../constants/index");

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    toName: {
      type: String,
      required: true,
    },
    toPhone: {
      type: String,
      required: true,
    },
    toEmail: {
      type: String,
      required: true,
    },
    toAddress: {
      type: String,
      required: true,
    },
    toNote: {
      type: String,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    totalProductsPrice: {
      type: Number,
      required: true,
    },
    shippingMethod: {
      type: String,
      enum: orderShippingMethods,
      default: orderShippingMethods.FAST_DELIVERY,
    },
    shippingStatus: {
      type: String,
      enum: orderShippingStatuses,
      default: orderShippingStatuses.PREPARING,
    },
    paymentMethod: {
      type: String,
      enum: orderPaymentMethods,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: orderPaymentStatuses,
      default: orderPaymentStatuses.UNPAID,
    },
    companyName: {
      type: String,
    },
    companyAddress: {
      type: String,
    },
    companyTaxNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
