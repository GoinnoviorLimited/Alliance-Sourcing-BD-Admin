import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    subcategories: [{
        name: {
            type: String,
            required: true,
            trim: true
        }
    }],
});

export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);