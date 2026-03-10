import mongoose from "mongoose";

// established-excellence
const EstablishedExcellenceSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
            trim: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        subtitle: {
            type: String,
            trim: true
        },
        paragraphs: [
            {
                type: String,
            }
        ]
    },
);

export const EstablishedExcellence = mongoose.models.EstablishedExcellence || mongoose.model("EstablishedExcellence", EstablishedExcellenceSchema);