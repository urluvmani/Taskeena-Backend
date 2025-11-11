import mongoose from "mongoose";

const productsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    category: { type: mongoose.ObjectId, ref: "Category", required: true },
    quantity: { type: Number, required: true },
    shipping: { type: Boolean, required: false },
    photo: { data: Buffer, contentType: String },
    discountPercent: {
      type: Number,
      default: 0, // default means no discount
      min: 0,
      max: 100,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("products", productsSchema);
