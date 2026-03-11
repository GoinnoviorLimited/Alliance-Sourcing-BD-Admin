"use client";
import { useState } from "react";
import PhotoUpload from "../../ui/PhoneUpload";

export default function EstablishedExcellenceForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    image: initialData?.image || "",
    paragraphs: initialData?.paragraphs || [""],
  });

  const [errors, setErrors] = useState({});

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

  const handleParagraphChange = (index, value) => {
    const updatedParagraphs = [...formData.paragraphs];
    updatedParagraphs[index] = value;
    setFormData((prev) => ({ ...prev, paragraphs: updatedParagraphs }));
    
    if (errors.paragraphs) {
      setErrors((prev) => ({ ...prev, paragraphs: "" }));
    }
  };

  const addParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      paragraphs: [...prev.paragraphs, ""],
    }));
  };

  const removeParagraph = (index) => {
    if (formData.paragraphs.length > 1) {
      const updatedParagraphs = formData.paragraphs.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, paragraphs: updatedParagraphs }));
    }
  };

  const moveParagraphUp = (index) => {
    if (index > 0) {
      const updatedParagraphs = [...formData.paragraphs];
      [updatedParagraphs[index - 1], updatedParagraphs[index]] = 
      [updatedParagraphs[index], updatedParagraphs[index - 1]];
      setFormData((prev) => ({ ...prev, paragraphs: updatedParagraphs }));
    }
  };

  const moveParagraphDown = (index) => {
    if (index < formData.paragraphs.length - 1) {
      const updatedParagraphs = [...formData.paragraphs];
      [updatedParagraphs[index], updatedParagraphs[index + 1]] = 
      [updatedParagraphs[index + 1], updatedParagraphs[index]];
      setFormData((prev) => ({ ...prev, paragraphs: updatedParagraphs }));
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
    
    if (!formData.image) {
      newErrors.image = "Image is required";
    }
    
    const validParagraphs = formData.paragraphs.filter(p => p.trim());
    if (validParagraphs.length === 0) {
      newErrors.paragraphs = "At least one paragraph is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty paragraphs
    const filteredData = {
      ...formData,
      paragraphs: formData.paragraphs.filter(p => p.trim())
    };
    
    if (validateForm()) {
      onSubmit(filteredData);
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
          placeholder="e.g., Established Excellence"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Subtitle Field */}
      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
          Subtitle <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="subtitle"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.subtitle ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g., Professional buying house services"
        />
        {errors.subtitle && (
          <p className="mt-1 text-sm text-red-600">{errors.subtitle}</p>
        )}
      </div>

      {/* Image Upload */}
      <PhotoUpload
        name="image"
        label="Featured Image"
        required={true}
        value={formData.image}
        onChange={handleImageChange}
        error={errors.image}
      />

      {/* Paragraphs Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Paragraphs <span className="text-red-600">*</span>
          </label>
          <button
            type="button"
            onClick={addParagraph}
            className="inline-flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Paragraph
          </button>
        </div>

        <div className="space-y-4">
          {formData.paragraphs.map((paragraph, index) => (
            <div key={index} className="relative group border rounded-lg p-4 bg-gray-50">
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => moveParagraphUp(index)}
                  disabled={index === 0}
                  className="p-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveParagraphDown(index)}
                  disabled={index === formData.paragraphs.length - 1}
                  className="p-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {formData.paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParagraph(index)}
                    className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    title="Remove paragraph"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="pr-20">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Paragraph {index + 1}
                </label>
                <textarea
                  value={paragraph}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter paragraph ${index + 1}`}
                />
              </div>
            </div>
          ))}
        </div>

        {errors.paragraphs && (
          <p className="mt-2 text-sm text-red-600">{errors.paragraphs}</p>
        )}

        <p className="mt-2 text-xs text-gray-500">
          Total paragraphs: {formData.paragraphs.filter(p => p.trim()).length}
        </p>
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