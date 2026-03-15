"use client";
import { useState, useEffect } from "react";
import PhotoUpload from "../ui/PhoneUpload";

// Predefined categories for initial suggestions
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
  
  // State for database categories
  const [dbCategories, setDbCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [subcategoriesForSelected, setSubcategoriesForSelected] = useState([]);

  // Fetch categories from database on mount
  useEffect(() => {
    fetchCategoriesFromDB();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      fetchSubcategoriesFromDB(formData.category);
    } else {
      setSubcategoriesForSelected([]);
    }
  }, [formData.category]);

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

  const fetchCategoriesFromDB = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setDbCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchSubcategoriesFromDB = async (categoryName) => {
    try {
      const response = await fetch(`/api/categories?category=${encodeURIComponent(categoryName)}`);
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        // Extract subcategory names from the category document
        const subs = data.data[0].subcategories.map(sub => sub.name);
        setSubcategoriesForSelected(subs);
      } else {
        setSubcategoriesForSelected([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategoriesForSelected([]);
    }
  };

  // Combine predefined categories with database categories
  const getAllCategories = () => {
    const dbCategoryNames = dbCategories.map(cat => cat.name);
    // Create a Set to remove duplicates (case insensitive)
    const allCats = new Set();
    
    // Add predefined categories
    PREDEFINED_CATEGORIES.forEach(cat => allCats.add(cat));
    
    // Add database categories (if not already in predefined)
    dbCategoryNames.forEach(cat => allCats.add(cat));
    
    // Add existing categories from props
    existingCategories.forEach(cat => allCats.add(cat));
    
    return Array.from(allCats).sort();
  };

  // Get subcategory suggestions combining predefined and database
  const getSubcategorySuggestions = () => {
    const predefined = SUBCATEGORY_SUGGESTIONS[formData.category] || [];
    const fromDB = subcategoriesForSelected || [];
    const fromExisting = existingSubcategories.filter(sub => 
      !predefined.includes(sub) && 
      !fromDB.includes(sub) &&
      sub.toLowerCase().includes(formData.category?.toLowerCase() || '')
    );
    
    // Combine all sources and remove duplicates
    return [...new Set([...predefined, ...fromDB, ...fromExisting])].sort();
  };

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

  const addCustomCategory = async () => {
    if (customCategory.trim()) {
      const trimmedCategory = customCategory.trim();
      
      // Optimistically update UI
      setFormData(prev => ({ ...prev, category: trimmedCategory }));
      setCustomCategory("");
      setShowCustomCategory(false);
      
      // Optionally pre-create the category in database
      try {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmedCategory })
        });
        // Refresh categories list
        fetchCategoriesFromDB();
      } catch (error) {
        console.error('Error creating category:', error);
        // Still continue - the product creation will handle it
      }
    }
  };

  const addCustomSubcategory = async () => {
    if (customSubcategory.trim() && formData.category) {
      const trimmedSubcategory = customSubcategory.trim();
      
      // Optimistically update UI
      setFormData(prev => ({ ...prev, subcategory: trimmedSubcategory }));
      setCustomSubcategory("");
      setShowCustomSubcategory(false);
      
      // Optionally pre-create the subcategory in database
      try {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: formData.category,
            subcategory: trimmedSubcategory 
          })
        });
        // Refresh subcategories for this category
        fetchSubcategoriesFromDB(formData.category);
      } catch (error) {
        console.error('Error creating subcategory:', error);
        // Still continue - the product creation will handle it
      }
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
    } else if (!formData.imageURL.startsWith('http')) {
      newErrors.imageURL = "Please upload a valid image";
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

  const allCategories = getAllCategories();
  const subcategorySuggestions = getSubcategorySuggestions();

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
              disabled={isSubmitting || loadingCategories}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? "border-red-500" : "border-gray-300"
              } ${loadingCategories ? "bg-gray-100" : ""}`}
            >
              <option value="">
                {loadingCategories ? "Loading categories..." : "Select a category"}
              </option>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={addCustomCategory}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting || !customCategory.trim()}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowCustomCategory(false)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        )}
        
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
        
        {/* Category suggestions hint */}
        {!showCustomCategory && !formData.category && (
          <p className="mt-1 text-xs text-gray-500">
            Can't find your category? Click the + button to add a custom one
          </p>
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
              } ${!formData.category ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value="">
                {formData.category 
                  ? subcategorySuggestions.length > 0 
                    ? "Select a subcategory" 
                    : "No subcategories found" 
                  : "Select a category first"}
              </option>
              {subcategorySuggestions.map((subcategory) => (
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
                disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={addCustomSubcategory}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting || !customSubcategory.trim()}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowCustomSubcategory(false)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        )}
        
        {errors.subcategory && (
          <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>
        )}
        
        {/* Subcategory suggestions hint */}
        {!showCustomSubcategory && formData.category && subcategorySuggestions.length === 0 && (
          <p className="mt-1 text-xs text-gray-500">
            No existing subcategories found. Click the + button to add a custom one
          </p>
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 min-w-[120px] justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            initialData ? "Update Product" : "Add Product"
          )}
        </button>
      </div>

      {/* Smart Features Note */}
      <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-md">
        <p className="font-medium text-gray-600 mb-1">✨ Smart Category Management:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Categories and subcategories are automatically saved to the database</li>
          <li>New categories will be created automatically when you add products</li>
          <li>Existing categories show all previously used subcategories</li>
          <li>Predefined suggestions help maintain consistency</li>
        </ul>
      </div>
    </form>
  );
}