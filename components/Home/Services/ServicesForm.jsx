"use client";
import React, { useState, useEffect } from "react";
import PhotoUpload from "../../ui/PhotoUpload";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";

export default function ServicesForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    imagePosition: "left",
    features: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (url) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", description: "" }],
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Section Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={isSubmitting}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>
      </div>

      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <PhotoUpload
            name="services_image"
            onChange={handleImageChange}
            value={formData.image}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image Position</label>
          <select
            name="imagePosition"
            value={formData.imagePosition}
            onChange={handleChange}
            disabled={isSubmitting}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Features List</h3>
          <button
            type="button"
            onClick={addFeature}
            disabled={isSubmitting}
            className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Feature
          </button>
        </div>

        <div className="space-y-4">
          {formData.features.map((feature, index) => (
            <div key={index} className="p-4 border rounded-md relative bg-gray-50 flex gap-4">
              <div className="mt-2 text-cyan-500 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="grow space-y-3">
                {!isSubmitting && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
                    title="Remove Feature"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Feature Title</label>
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                    disabled={isSubmitting}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Feature Description</label>
                  <input
                    type="text"
                    value={feature.description}
                    onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                    disabled={isSubmitting}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          {formData.features.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4 italic">No features added yet.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 sticky bottom-[-24px] bg-white pt-4 pb-4 border-t mt-6 z-10 w-full">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
        >
          {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          {initialData ? (isSubmitting ? "Updating..." : "Update Services") : (isSubmitting ? "Creating..." : "Create Services")}
        </button>
      </div>
    </form>
  );
}
