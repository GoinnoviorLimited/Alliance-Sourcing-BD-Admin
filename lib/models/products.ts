import mongoose, { Schema } from "mongoose";

const ProductsSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      required: true,
      trim: true,
    },
    product: {
      type: String,
      required: true,
      trim: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Products = mongoose.models.Products || mongoose.model("Products", ProductsSchema);