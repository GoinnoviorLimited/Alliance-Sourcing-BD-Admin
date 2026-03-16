"use client";
import React, { useState, useEffect } from "react";
import PhotoUpload from "../../ui/PhotoUpload";
import { Plus, Trash2 } from "lucide-react";

const AVAILABLE_ICONS = ["knitwear", "denim", "woven", "accessories"];

const CategoryIcon = ({ name, className = "w-6 h-6" }) => {
  switch (name) {
    case "knitwear":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="10" width="24" height="16" rx="2" />
          <path d="M4 14 C8 11 12 13 16 11 C20 9 24 11 28 14" />
          <path d="M10 10 L8 4 M22 10 L24 4" />
        </svg>
      );
    case "denim":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="8" x2="28" y2="8" />
          <line x1="4" y1="13" x2="28" y2="13" />
          <line x1="4" y1="18" x2="28" y2="18" />
          <line x1="4" y1="23" x2="28" y2="23" />
          <rect x="4" y="6" width="24" height="20" rx="2" />
        </svg>
      );
    case "woven":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="24" height="24" rx="2" />
          <line x1="4" y1="11" x2="28" y2="11" />
          <line x1="4" y1="17" x2="28" y2="17" />
          <line x1="4" y1="23" x2="28" y2="23" />
          <line x1="11" y1="4" x2="11" y2="28" />
          <line x1="17" y1="4" x2="17" y2="28" />
          <line x1="23" y1="4" x2="23" y2="28" />
        </svg>
      );
    case "accessories":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="16" r="5" />
          <circle cx="10" cy="16" r="2" />
          <path d="M15 16 H28" />
          <circle cx="22" cy="10" r="3" />
          <circle cx="22" cy="22" r="3" />
        </svg>
      );
    default:
      return null;
  }
};

const CatalogForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    label: "Catalog",
    heading: "",
    description: "",
    cta: { text: "", href: "#" },
    image: "",
    categories: [],
  });
  useEffect(() => {
    if (initialData) {
      // Ensure existing categories have a default icon if missing
      const sanitizedData = {
        ...initialData,
        categories: initialData.categories?.map(cat => ({
          ...cat,
          icon: cat.icon || "knitwear" 
        })) || []
      };
      setFormData(sanitizedData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    setFormData((prev) => ({ ...prev, categories: updatedCategories }));
  };

  const addCategory = () => {
    if (formData.categories.length >= 4) {
      alert("Maximum 4 categories allowed");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        { id: prev.categories.length + 1, title: "", description: "", icon: "knitwear" },
      ],
    }));
  };

  const removeCategory = (index) => {
    const updatedCategories = formData.categories.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, categories: updatedCategories }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 relative pb-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Label
          </label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            disabled={isSubmitting}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Heading
          </label>
          <input
            type="text"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            disabled={isSubmitting}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            CTA Text
          </label>
          <input
            type="text"
            name="cta.text"
            value={formData.cta.text}
            onChange={handleChange}
            disabled={isSubmitting}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            CTA Href
          </label>
          <input
            type="text"
            name="cta.href"
            value={formData.cta.href}
            onChange={handleChange}
            disabled={isSubmitting}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <PhotoUpload
          name="image"
          label="Catalog Image"
          required={true}
          value={formData.image}
          onChange={handleImageChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Categories (Max 4)
          </h3>
          <button
            type="button"
            onClick={addCategory}
            disabled={formData.categories.length >= 4 || isSubmitting}
            className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        <div className="space-y-4">
          {formData.categories.map((cat, index) => (
            <div
              key={index}
              className="p-4 border rounded-md relative bg-gray-50 text-gray-800"
            >
              {!isSubmitting && (
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
                  title="Remove Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category {index + 1} Title
                </label>
                <input
                  type="text"
                  value={cat.title}
                  onChange={(e) =>
                    handleCategoryChange(index, "title", e.target.value)
                  }
                  disabled={isSubmitting}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={cat.description}
                  onChange={(e) =>
                    handleCategoryChange(index, "description", e.target.value)
                  }
                  disabled={isSubmitting}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div className="mt-3 mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Icon</label>
                <div className="flex flex-wrap gap-3">
                  {AVAILABLE_ICONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleCategoryChange(index, "icon", iconName)}
                      className={`p-2 rounded-md border flex flex-col items-center justify-center transition-colors w-20 h-16 ${
                        cat.icon === iconName || (!cat.icon && iconName === "knitwear")
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <CategoryIcon name={iconName} className="w-6 h-6 mb-1" />
                      <span className="text-[10px] capitalize">{iconName}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 sticky bottom-[-24px] bg-white pt-4 pb-4 border-t mt-6 z-10 w-full">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
        >
          {isSubmitting && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          {initialData
            ? isSubmitting
              ? "Updating..."
              : "Update Catalog"
            : isSubmitting
              ? "Creating..."
              : "Create Catalog"}
        </button>
      </div>
    </form>
  );
};

export default CatalogForm;
