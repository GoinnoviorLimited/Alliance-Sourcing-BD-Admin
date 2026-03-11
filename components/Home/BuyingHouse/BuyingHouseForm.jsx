// components/admin/BuyingHouseForm.jsx
"use client";
import { useState, useRef, useEffect } from "react";

// Comprehensive emoji options for buying house context
const EMOJI_OPTIONS = [
  // Search & Discovery
  { emoji: "🔍", label: "Search", category: "Discovery" },
  { emoji: "🔎", label: "Magnifying Glass", category: "Discovery" },
  { emoji: "🎯", label: "Target", category: "Discovery" },
  { emoji: "📍", label: "Location", category: "Discovery" },
  
  // Evaluation & Quality
  { emoji: "⭐", label: "Star", category: "Quality" },
  { emoji: "✅", label: "Check Mark", category: "Quality" },
  { emoji: "📊", label: "Analytics", category: "Quality" },
  { emoji: "📈", label: "Growth", category: "Quality" },
  { emoji: "🏆", label: "Trophy", category: "Quality" },
  { emoji: "💎", label: "Diamond", category: "Quality" },
  
  // Suppliers & Manufacturing
  { emoji: "🏭", label: "Factory", category: "Manufacturing" },
  { emoji: "🔧", label: "Tools", category: "Manufacturing" },
  { emoji: "⚙️", label: "Gear", category: "Manufacturing" },
  { emoji: "🔨", label: "Hammer", category: "Manufacturing" },
  { emoji: "🏗️", label: "Construction", category: "Manufacturing" },
  
  // Partnership & Trust
  { emoji: "🤝", label: "Handshake", category: "Partnership" },
  { emoji: "💼", label: "Briefcase", category: "Partnership" },
  { emoji: "💪", label: "Strength", category: "Partnership" },
  
  // Values & Ethics
  { emoji: "🌱", label: "Sustainability", category: "Values" },
  { emoji: "🌍", label: "Global", category: "Values" },
  { emoji: "💚", label: "Green Heart", category: "Values" },
  
  // Communication
  { emoji: "💬", label: "Chat", category: "Communication" },
  { emoji: "📞", label: "Phone", category: "Communication" },
  { emoji: "📧", label: "Email", category: "Communication" },
  
  // Logistics
  { emoji: "🚚", label: "Delivery", category: "Logistics" },
  { emoji: "📦", label: "Package", category: "Logistics" },
  { emoji: "✈️", label: "Airplane", category: "Logistics" },
  
  // Innovation
  { emoji: "💡", label: "Idea", category: "Innovation" },
  { emoji: "🚀", label: "Rocket", category: "Innovation" },
  { emoji: "✨", label: "Sparkle", category: "Innovation" },
  
  // Business
  { emoji: "💰", label: "Money", category: "Business" },
  { emoji: "💳", label: "Credit Card", category: "Business" },
  { emoji: "📋", label: "Clipboard", category: "Business" },
];

// Group emojis by category
const groupedEmojis = EMOJI_OPTIONS.reduce((acc, emoji) => {
  if (!acc[emoji.category]) {
    acc[emoji.category] = [];
  }
  acc[emoji.category].push(emoji);
  return acc;
}, {});

export default function BuyingHouseForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    icon: initialData?.icon || "",
  });

  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEmojiSelect = (emoji) => {
    setFormData((prev) => ({ ...prev, icon: emoji }));
    setIsDropdownOpen(false);
    setSearchTerm("");
    if (errors.icon) {
      setErrors((prev) => ({ ...prev, icon: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    
    if (!formData.icon) {
      newErrors.icon = "Icon is required";
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

  // Filter emojis based on search term
  const filteredGroupedEmojis = searchTerm
    ? Object.entries(groupedEmojis).reduce((acc, [category, emojis]) => {
        const filtered = emojis.filter(
          (e) => 
            e.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.emoji.includes(searchTerm) ||
            category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
          acc[category] = filtered;
        }
        return acc;
      }, {})
    : groupedEmojis;

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
          placeholder="e.g., Supplier Selection & Evaluation"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.title.length}/100 characters
        </p>
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
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter detailed description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Icon Selection with Fixed Dropdown */}
      <div className="relative">
        <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
          Icon <span className="text-red-600">*</span>
        </label>
        
        {/* Selected Icon Display - acts as dropdown toggle */}
        <div className="flex items-center gap-4 mb-2">
          <button
            type="button"
            ref={buttonRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center text-5xl cursor-pointer transition-all ${
              formData.icon 
                ? "border-blue-500 bg-blue-50 shadow-md" 
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
            }`}
          >
            {formData.icon || "?"}
          </button>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-700">
              {formData.icon ? "Selected Icon" : "No Icon Selected"}
            </p>
            <p className="text-sm text-gray-500">
              {formData.icon 
                ? `Click the icon to change`
                : "Click the box to select an icon"}
            </p>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div 
            ref={dropdownRef}
            className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200"
            style={{ maxHeight: '400px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            {/* Search Bar - Fixed at top */}
            <div className="p-3 border-b bg-white">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  autoFocus
                />
                <svg
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Emoji Grid - Scrollable area */}
            <div className="overflow-y-auto p-3" style={{ maxHeight: '300px' }}>
              {Object.entries(filteredGroupedEmojis).length > 0 ? (
                Object.entries(filteredGroupedEmojis).map(([category, emojis]) => (
                  <div key={category} className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sticky top-0 bg-white py-1">
                      {category} ({emojis.length})
                    </h4>
                    <div className="grid grid-cols-8 gap-1">
                      {emojis.map((item) => (
                        <button
                          key={item.emoji + item.label}
                          type="button"
                          onClick={() => handleEmojiSelect(item.emoji)}
                          className={`p-2 text-xl hover:bg-blue-50 rounded transition-all ${
                            formData.icon === item.emoji 
                              ? "bg-blue-100 ring-1 ring-blue-500" 
                              : "hover:scale-110"
                          }`}
                          title={item.label}
                        >
                          {item.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No icons found for "{searchTerm}"</p>
                </div>
              )}
            </div>

            {/* Custom Emoji Input - Fixed at bottom */}
            <div className="p-3 border-t bg-gray-50">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Or paste custom emoji
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste emoji here"
                  onChange={(e) => {
                    const emoji = e.target.value;
                    // Check if it's an emoji
                    if (emoji && /\p{Emoji}/u.test(emoji)) {
                      handleEmojiSelect(emoji);
                    }
                  }}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {errors.icon && (
          <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
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