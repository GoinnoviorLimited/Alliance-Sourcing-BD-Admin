"use client";
import { useState, useEffect } from "react";
import PhotoUpload from "../ui/PhoneUpload";

// Predefined categories for suggestions
const PREDEFINED_CATEGORIES = [
  "Knitwear",
  "Woven",
  "Sweater",
  "Denim",
  "Sportswear",
  "Outerwear",
  "Underwear",
  "Accessories",
  "Home Textile",
  "Technical Textile"
];

// Subcategory suggestions based on category
const SUBCATEGORY_SUGGESTIONS = {
  "Knitwear": ["T-Shirt", "Polo", "Henley", "Tank Top", "Sweatshirt", "Hoodie", "Cardigan", "Pullover"],
  "Woven": ["Shirt", "Blouse", "Trousers", "Shorts", "Jeans", "Jacket", "Skirt", "Dress"],
  "Sweater": ["Crew Neck", "V-Neck", "Turtle Neck", "Cardigan", "Pullover", "Cable Knit"],
  "Denim": ["Jeans", "Jacket", "Shirt", "Skirt", "Shorts", "Vest"],
  "Sportswear": ["Tracksuit", "Jersey", "Shorts", "Leggings", "Sports Bra", "Training Top"],
  "Outerwear": ["Jacket", "Coat", "Parka", "Blazer", "Bomber", "Windbreaker"],
  "Underwear": ["Briefs", "Boxers", "Bikini", "Thong", "Bra", "Panties"],
  "Accessories": ["Scarf", "Hat", "Gloves", "Socks", "Belt", "Bag", "Cap"],
  "Home Textile": ["Bed Sheet", "Pillow Case", "Towel", "Blanket", "Curtain", "Table Cloth"],
  "Technical Textile": ["Workwear", "Uniform", "Protective Gear", "Medical Textile", "Industrial Fabric"]
};

export default function ProductsForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting,
  existingCategories = [],
  existingSubcategories = []
}) {
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    product: "",
    imageURL: "",
  });

  const [errors, setErrors] = useState({});
  const [customCategory, setCustomCategory] = useState("");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomSubcategory, setShowCustomSubcategory] = useState(false);

  // Get unique categories and subcategories from existing data and predefined
  const allCategories = [...new Set([...PREDEFINED_CATEGORIES, ...existingCategories])].sort();
  
  // Get subcategory suggestions based on selected category
  const getSubcategorySuggestions = () => {
    const suggestions = SUBCATEGORY_SUGGESTIONS[formData.category] || [];
    const existing = existingSubcategories.filter(sub => 
      !suggestions.includes(sub) && sub.toLowerCase().includes(formData.category?.toLowerCase() || '')
    );
    return [...new Set([...suggestions, ...existing])].sort();
  };

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category || "",
        subcategory: initialData.subcategory || "",
        product: initialData.product || "",
        imageURL: initialData.imageURL || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Reset subcategory if category changes
    if (name === "category") {
      setFormData((prev) => ({ ...prev, subcategory: "" }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (imageUrl) => {
    setFormData((prev) => ({ ...prev, imageURL: imageUrl }));
    if (errors.imageURL) {
      setErrors((prev) => ({ ...prev, imageURL: "" }));
    }
  };

  const addCustomCategory = () => {
    if (customCategory.trim()) {
      setFormData(prev => ({ ...prev, category: customCategory.trim() }));
      setCustomCategory("");
      setShowCustomCategory(false);
    }
  };

  const addCustomSubcategory = () => {
    if (customSubcategory.trim()) {
      setFormData(prev => ({ ...prev, subcategory: customSubcategory.trim() }));
      setCustomSubcategory("");
      setShowCustomSubcategory(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.subcategory.trim()) {
      newErrors.subcategory = "Subcategory is required";
    }
    
    if (!formData.product.trim()) {
      newErrors.product = "Product name is required";
    }
    
    if (!formData.imageURL) {
      newErrors.imageURL = "Product image is required";
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
      {/* Category Field */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-600">*</span>
        </label>
        
        {!showCustomCategory ? (
          <div className="flex gap-2">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a category</option>
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCustomCategory(true)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              title="Add custom category"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="button"
              onClick={addCustomCategory}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowCustomCategory(false)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
        
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      {/* Subcategory Field */}
      <div>
        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
          Subcategory <span className="text-red-600">*</span>
        </label>
        
        {!showCustomSubcategory ? (
          <div className="flex gap-2">
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              disabled={isSubmitting || !formData.category}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.subcategory ? "border-red-500" : "border-gray-300"
              } ${!formData.category ? "bg-gray-100" : ""}`}
            >
              <option value="">
                {formData.category ? "Select a subcategory" : "Select a category first"}
              </option>
              {getSubcategorySuggestions().map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
            {formData.category && (
              <button
                type="button"
                onClick={() => setShowCustomSubcategory(true)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                title="Add custom subcategory"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={customSubcategory}
              onChange={(e) => setCustomSubcategory(e.target.value)}
              placeholder="Enter custom subcategory"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="button"
              onClick={addCustomSubcategory}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowCustomSubcategory(false)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
        
        {errors.subcategory && (
          <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>
        )}
      </div>

      {/* Product Name Field */}
      <div>
        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="product"
          name="product"
          value={formData.product}
          onChange={handleChange}
          disabled={isSubmitting}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.product ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g., Urban Style Graphic T-Shirt"
        />
        {errors.product && (
          <p className="mt-1 text-sm text-red-600">{errors.product}</p>
        )}
      </div>

      {/* Image Upload */}
      <PhotoUpload
        name="imageURL"
        label="Product Image"
        required={true}
        value={formData.imageURL}
        onChange={handleImageChange}
        error={errors.imageURL}
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
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            initialData ? "Update Product" : "Add Product"
          )}
        </button>
      </div>
    </form>
  );
}