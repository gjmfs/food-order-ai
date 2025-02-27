const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  food: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
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
