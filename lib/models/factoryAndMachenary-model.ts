import mongoose from "mongoose";

// Factory and Machinery section
const FactoryInfoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    actions: {
        type: String,
        trim: true
    }
  }
);

export const FactoryInfo =
  mongoose.models.FactoryInfo ||
  mongoose.model("FactoryInfo", FactoryInfoSchema);