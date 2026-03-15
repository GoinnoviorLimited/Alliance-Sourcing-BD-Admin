"use client";
import { useState, useEffect } from "react";
import PhotoUpload from "../../ui/PhoneUpload";

export default function BuyingHouseForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [modifiedFields, setModifiedFields] = useState({});

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        image: initialData.image || "",
      });
      setModifiedFields({});
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    setModifiedFields((prev) => ({
      ...prev,
      [name]: value !== initialData?.[name]
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
    
    setModifiedFields((prev) => ({
      ...prev,
      image: imageUrl !== initialData?.image
    }));
    
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
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

  const hasChanges = Object.values(modifiedFields).some(value => value === true);

  const getFieldStyle = (fieldName) => {
    if (errors[fieldName]) return "border-red-500";
    if (modifiedFields[fieldName]) return "border-yellow-500 bg-yellow-50";
    return "border-gray-300";
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
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldStyle("title")}`}
          placeholder="e.g., Supplier Selection & Evaluation"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
        {modifiedFields.title && !errors.title && (
          <p className="mt-1 text-xs text-yellow-600">✓ Modified</p>
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
          disabled={isSubmitting}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getFieldStyle("description")}`}
          placeholder="Enter detailed description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        {modifiedFields.description && !errors.description && (
          <p className="mt-1 text-xs text-yellow-600">✓ Modified</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Image Upload */}
      <PhotoUpload
        name="image"
        label="Buying House Image"
        required={true}
        value={formData.image}
        onChange={handleImageChange}
        error={errors.image}
        disabled={isSubmitting}
      />
      {modifiedFields.image && !errors.image && (
        <p className="mt-1 text-xs text-yellow-600">✓ Image modified</p>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !hasChanges}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            initialData ? "Update Item" : "Create Item"
          )}
        </button>
      </div>

      {/* Status Indicator */}
      <div className="text-xs text-gray-400 flex justify-end">
        <span className={hasChanges ? "text-yellow-600" : "text-gray-400"}>
          {hasChanges ? "⚠️ Unsaved changes" : "✓ All changes saved"}
        </span>
      </div>
    </form>
  );
}