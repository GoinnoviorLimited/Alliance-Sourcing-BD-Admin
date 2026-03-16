import { Images } from "lucide-react";
import mongoose, { Schema } from "mongoose";

//Hero Section
const ctaSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    href: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const heroSectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    cta: {
      type: ctaSchema,
    },
  },
  {
    timestamps: true,
  }
);

//Apart section
const ApartSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

//how we work section
const WeWorkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  }
);

// Buying House Services
const BuyingHouseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true,
      trim: true
    }
  }
);

// Catalog Section
const catalogCategorySchema = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const catalogSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    cta: {
      type: ctaSchema,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    categories: [catalogCategorySchema],
  },
  {
    timestamps: true,
  }
);
// Prevent mongoose from returning cached models with old schemas during Next.js HMR
delete mongoose.models.HeroSection;
delete mongoose.models.Apart;
delete mongoose.models.WeWork;
delete mongoose.models.BuyingHouse;
delete mongoose.models.Catalog;

export const HeroSection = mongoose.models.HeroSection || mongoose.model("HeroSection", heroSectionSchema);
export const Apart = mongoose.models.Apart || mongoose.model("Apart", ApartSchema);
export const WeWork = mongoose.models.WeWork || mongoose.model("WeWork", WeWorkSchema);
export const BuyingHouse = mongoose.models.BuyingHouse || mongoose.model("BuyingHouse", BuyingHouseSchema);
export const Catalog = mongoose.models.Catalog || mongoose.model("Catalog", catalogSchema);