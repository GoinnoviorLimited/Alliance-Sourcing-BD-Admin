"use client";
import { useState } from "react";
import PhotoUpload from "../../ui/PhoneUpload";

// Predefined icon options
const ICON_OPTIONS = [
  { value: "supplier", label: "Supplier", emoji: "🏭" },
  { value: "handshake", label: "Handshake", emoji: "🤝" },
  { value: "factory", label: "Factory", emoji: "🏭" },
  { value: "quality", label: "Quality", emoji: "⭐" },
  { value: "delivery", label: "Delivery", emoji: "🚚" },
  { value: "support", label: "Support", emoji: "💬" },
  { value: "innovation", label: "Innovation", emoji: "💡" },
  { value: "sustainability", label: "Sustainability", emoji: "🌱" },
  { value: "global", label: "Global", emoji: "🌍" },
  { value: "partnership", label: "Partnership", emoji: "🤝" },
];

export default function WeWorkForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    icon: initialData?.icon || "",
    image: initialData?.image || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
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
    if (!formData.icon) {
      newErrors.icon = "Icon is required";
    }
    if (!formData.image) {
      newErrors.image = "Image is required";
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
          placeholder="e.g., Supplier Match"
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

      {/* Icon Selection */}
      <div>
        <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
          Icon <span className="text-red-600">*</span>
        </label>
        <select
          id="icon"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.icon ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select an icon</option>
          {ICON_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.emoji} {option.label}
            </option>
          ))}
        </select>
        {errors.icon && (
          <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
        )}
        
        {/* Icon Preview */}
        {formData.icon && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md inline-flex items-center gap-2">
            <span className="text-2xl">
              {ICON_OPTIONS.find(opt => opt.value === formData.icon)?.emoji}
            </span>
            <span className="text-sm text-gray-600">
              Selected: {ICON_OPTIONS.find(opt => opt.value === formData.icon)?.label}
            </span>
          </div>
        )}
      </div>

      {/* Image Upload */}
      <PhotoUpload
        name="image"
        label="Process Image"
        required={true}
        value={formData.image}
        onChange={handleImageChange}
        error={errors.image}
      />

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