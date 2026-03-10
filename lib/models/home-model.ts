import mongoose, { Schema, model, models } from "mongoose";

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
    icons: {
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
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // store image URL or path
      trim: true,
    },
  },
  {
    timestamps: true,
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
    icon: {
      type: String,
      required: true,
      trim: true
    }
  }
);


export const HeroSection = mongoose.models.HeroSection || mongoose.model("HeroSection", heroSectionSchema);
export const Apart = mongoose.models.Apart || mongoose.model("Apart", ApartSchema);
export const WeWork = mongoose.models.WeWork || mongoose.model("WeWork", WeWorkSchema);
export const BuyingHouse = mongoose.models.BuyingHouse || mongoose.model("BuyingHouse", BuyingHouseSchema);