// components/admin/ApartForm.jsx
"use client";
import { useState } from "react";

// Predefined emoji options for icons
const EMOJI_OPTIONS = [
  { emoji: "🤝", label: "Handshake", category: "Partnership" },
  { emoji: "🏭", label: "Factory", category: "Industry" },
  { emoji: "⭐", label: "Quality", category: "Excellence" },
  { emoji: "🌱", label: "Sustainability", category: "Environment" },
  { emoji: "💡", label: "Innovation", category: "Ideas" },
  { emoji: "🌍", label: "Global", category: "World" },
  { emoji: "💬", label: "Communication", category: "Support" },
  { emoji: "🚚", label: "Delivery", category: "Logistics" },
  { emoji: "🔒", label: "Security", category: "Safety" },
  { emoji: "📊", label: "Analytics", category: "Data" },
  { emoji: "👥", label: "Team", category: "People" },
  { emoji: "🎯", label: "Target", category: "Goals" },
  { emoji: "💪", label: "Strength", category: "Power" },
  { emoji: "🤲", label: "Care", category: "Support" },
  { emoji: "✨", label: "Excellence", category: "Quality" },
  { emoji: "🛡️", label: "Protection", category: "Safety" },
  { emoji: "📈", label: "Growth", category: "Progress" },
  { emoji: "🤲", label: "Trust", category: "Relationships" },
];

// Group emojis by category
const groupedEmojis = EMOJI_OPTIONS.reduce((acc, emoji) => {
  if (!acc[emoji.category]) {
    acc[emoji.category] = [];
  }
  acc[emoji.category].push(emoji);
  return acc;
}, {});

export default function ApartForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    icons: initialData?.icons || "",
  });

  const [errors, setErrors] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEmojiSelect = (emoji) => {
    setFormData((prev) => ({ ...prev, icons: emoji }));
    setShowEmojiPicker(false);
    if (errors.icons) {
      setErrors((prev) => ({ ...prev, icons: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.icons) {
      newErrors.icons = "Icon is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g., Ethical Sourcing"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Icon Selection with Emoji Picker */}
      <div>
        <label htmlFor="icons" className="block text-sm font-medium text-gray-700 mb-1">
          Icon <span className="text-red-600">*</span>
        </label>
        
        {/* Selected Icon Display */}
        <div className="flex items-center gap-3 mb-3">
          <div 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-4xl cursor-pointer transition-all ${
              formData.icons 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
            }`}
          >
            {formData.icons || "?"}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              {formData.icons ? "Click the icon to change" : "Click to select an icon"}
            </p>
            {formData.icons && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {EMOJI_OPTIONS.find(e => e.emoji === formData.icons)?.label || "Custom emoji"}
              </p>
            )}
          </div>
        </div>

        {/* Emoji Picker Dropdown */}
        {showEmojiPicker && (
          <div className="mb-4 p-4 border rounded-lg bg-white shadow-lg max-h-80 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">Select an Icon</h3>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {Object.entries(groupedEmojis).map(([category, emojis]) => (
              <div key={category} className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {category}
                </h4>
                <div className="grid grid-cols-8 gap-2">
                  {emojis.map((item) => (
                    <button
                      key={item.emoji}
                      type="button"
                      onClick={() => handleEmojiSelect(item.emoji)}
                      className={`p-2 text-2xl hover:bg-blue-50 rounded-lg transition-colors ${
                        formData.icons === item.emoji ? "bg-blue-100 ring-2 ring-blue-500" : ""
                      }`}
                      title={item.label}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Custom Emoji Input */}
            <div className="mt-4 pt-4 border-t">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Or enter custom emoji
              </label>
              <input
                type="text"
                placeholder="Paste any emoji here"
                onChange={(e) => {
                  const emoji = e.target.value;
                  // Simple emoji detection (you might want to enhance this)
                  if (emoji && /[\p{Emoji}]/u.test(emoji)) {
                    handleEmojiSelect(emoji);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {errors.icons && (
          <p className="mt-1 text-sm text-red-600">{errors.icons}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {initialData ? "Update" : "Create"} Item
        </button>
      </div>
    </form>
  );
}