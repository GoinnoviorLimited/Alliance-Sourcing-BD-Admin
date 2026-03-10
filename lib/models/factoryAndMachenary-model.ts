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

// Advanced Machinery section

const AdvancedMachinerySchema = new mongoose.Schema(
  {
    label: {
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

//Machinery Inventory
const MachineryInventorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
  },
);




export const FactoryInfo = mongoose.models.FactoryInfo || mongoose.model("FactoryInfo", FactoryInfoSchema);
export const AdvancedMachinery = mongoose.models.AdvancedMachinery || mongoose.model("AdvancedMachinery", AdvancedMachinerySchema);
export const MachineryInventory = mongoose.models.MachineryInventory || mongoose.model("MachineryInventory", MachineryInventorySchema);