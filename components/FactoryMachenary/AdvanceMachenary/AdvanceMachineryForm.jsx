"use client";
import { useState, useEffect } from "react";
import PhotoUpload from "../../ui/PhotoUpload";

export default function AdvanceMachineryForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    label: "",
    image: "",
  });

  const [errors, setErrors] = useState({});

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        label: initialData.label || "",
        image: initialData.image || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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

    if (!formData.label.trim()) {
      newErrors.label = "Label is required";
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
      {/* Label Field */}
      <div>
        <label
          htmlFor="label"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Machinery Label <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="label"
          name="label"
          value={formData.label}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.label ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g., Thread Sucking Machine"
        />
        {errors.label && (
          <p className="mt-1 text-sm text-red-600">{errors.label}</p>
        )}
      </div>

      {/* Image Upload */}
      <PhotoUpload
        name="image"
        label="Machinery Image"
        required={true}
        value={formData.image}
        onChange={handleImageChange}
        error={errors.image}
        disabled={isSubmitting}
      />

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
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : initialData ? (
            "Update Machinery"
          ) : (
            "Add Machinery"
          )}
        </button>
      </div>
    </form>
  );
}
