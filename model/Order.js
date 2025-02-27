const mongoose = require("mongoose");
const { type } = require("os");
const orderSchema = new mongoose.Schema({
  food: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: false,
  },
  size: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Order", orderSchema);
