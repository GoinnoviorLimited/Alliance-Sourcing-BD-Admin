"use client";
import { useState, useEffect } from "react";
import PhotoUpload from "../../ui/PhotoUpload";

export default function FactoryInfoForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    actions: "",
  });

  const [errors, setErrors] = useState({});

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        description: initialData.description || "",
        image: initialData.image || "",
        actions: initialData.actions || "",
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

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.image) {
      newErrors.image = "Image is required";
    }

    if (!formData.actions.trim()) {
      newErrors.actions = "Action link is required";
    } else if (
      !formData.actions.match(/\.(pdf|doc|docx)$/i) &&
      !formData.actions.startsWith("/")
    ) {
      newErrors.actions = "Action must be a valid file path (PDF, DOC) or URL";
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
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g., Open Factory"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Subtitle Field */}
      <div>
        <label
          htmlFor="subtitle"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Subtitle <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="subtitle"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.subtitle ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g., The Ways to Keep Business Growing"
        />
        {errors.subtitle && (
          <p className="mt-1 text-sm text-red-600">{errors.subtitle}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter detailed description about the factory"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Image Upload */}
      <PhotoUpload
        name="image"
        label="Factory Image"
        required={true}
        value={formData.image}
        onChange={handleImageChange}
        error={errors.image}
        disabled={isSubmitting}
      />

      {/* Actions (PDF/File Link) Field */}
      <div>
        <label
          htmlFor="actions"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Action Link (PDF/File) <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="actions"
            name="actions"
            value={formData.actions}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.actions ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="/files/factory-profile.pdf"
          />
          {formData.actions && (
            <a
              href={formData.actions}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors inline-flex items-center"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </a>
          )}
        </div>
        {errors.actions && (
          <p className="mt-1 text-sm text-red-600">{errors.actions}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Supported formats: PDF, DOC, DOCX or absolute paths starting with /
        </p>
      </div>

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
            "Update Factory Info"
          ) : (
            "Add Factory Info"
          )}
        </button>
      </div>
    </form>
  );
}
