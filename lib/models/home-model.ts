import mongoose from 'mongoose';

/* =========================
   🗓️ Event Schema
========================= */
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  banner: { type: String },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String },
  status: {
    type: String,
    enum: ['Open for All', 'Closed', 'Coming Soon'],
    default: 'Open for All'
  },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

/* =========================
   ✅ Export All Models
========================= */
export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);