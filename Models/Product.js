const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "users",
  },
  dislikes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "users",
  },
  // likesCount:{
  //   type:Number,
  //   default:0,
  // }
  reviews: {
    type: [
      {
        rating: Number,
        comment: String,
        userId: mongoose.Schema.Types.ObjectId,
      },
    ],
    default: [],
  },
});


const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
