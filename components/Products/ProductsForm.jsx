"use client";
import { useState, useEffect } from "react";
import PhotoUpload from "../ui/PhoneUpload";

export default function ProductsForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting 
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
  
  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deletingItem, setDeletingItem] = useState(false);

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
        const subs = data.data[0].subcategories.map(sub => ({
          name: sub.name,
          id: sub._id
        }));
        setSubcategoriesForSelected(subs);
      } else {
        setSubcategoriesForSelected([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategoriesForSelected([]);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (!confirm(`Are you sure you want to delete the category "${categoryName}"? This will affect all products in this category.`)) {
      return;
    }

    setDeletingItem(true);
    try {
      const response = await fetch(`/api/categories?name=${encodeURIComponent(categoryName)}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh categories list
        await fetchCategoriesFromDB();
        
        // Clear form if this category was selected
        if (formData.category === categoryName) {
          setFormData(prev => ({ ...prev, category: "", subcategory: "" }));
        }
        
        // Show success message (you can integrate with toast)
        alert('Category deleted successfully');
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    } finally {
      setDeletingItem(false);
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteSubcategory = async (categoryName, subcategoryName) => {
    if (!confirm(`Are you sure you want to delete the subcategory "${subcategoryName}"?`)) {
      return;
    }

    setDeletingItem(true);
    try {
      const response = await fetch(
        `/api/categories?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(subcategoryName)}`, 
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();
      
      if (data.success) {
        // Refresh subcategories list
        await fetchSubcategoriesFromDB(categoryName);
        
        // Clear form if this subcategory was selected
        if (formData.subcategory === subcategoryName) {
          setFormData(prev => ({ ...prev, subcategory: "" }));
        }
        
        // Show success message
        alert('Subcategory deleted successfully');
      } else {
        alert(data.error || 'Failed to delete subcategory');
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      alert('Error deleting subcategory');
    } finally {
      setDeletingItem(false);
      setShowDeleteConfirm(null);
    }
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
      
      // Check if category already exists
      const exists = dbCategories.some(cat => cat.name.toLowerCase() === trimmedCategory.toLowerCase());
      if (exists) {
        alert('This category already exists');
        return;
      }

      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmedCategory })
        });

        const data = await response.json();
        
        if (data.success) {
          // Update form and refresh categories
          setFormData(prev => ({ ...prev, category: trimmedCategory }));
          await fetchCategoriesFromDB();
          setCustomCategory("");
          setShowCustomCategory(false);
        } else {
          alert(data.error || 'Failed to create category');
        }
      } catch (error) {
        console.error('Error creating category:', error);
        alert('Error creating category');
      }
    }
  };

  const addCustomSubcategory = async () => {
    if (customSubcategory.trim() && formData.category) {
      const trimmedSubcategory = customSubcategory.trim();
      
      // Check if subcategory already exists
      const exists = subcategoriesForSelected.some(
        sub => sub.name.toLowerCase() === trimmedSubcategory.toLowerCase()
      );
      
      if (exists) {
        alert('This subcategory already exists');
        return;
      }

      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: formData.category,
            subcategory: trimmedSubcategory 
          })
        });

        const data = await response.json();
        
        if (data.success) {
          // Update form and refresh subcategories
          setFormData(prev => ({ ...prev, subcategory: trimmedSubcategory }));
          await fetchSubcategoriesFromDB(formData.category);
          setCustomSubcategory("");
          setShowCustomSubcategory(false);
        } else {
          alert(data.error || 'Failed to create subcategory');
        }
      } catch (error) {
        console.error('Error creating subcategory:', error);
        alert('Error creating subcategory');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Field */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-600">*</span>
        </label>
        
        {!showCustomCategory ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting || loadingCategories || deletingItem}
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                } ${loadingCategories ? "bg-gray-100" : ""}`}
              >
                <option value="">
                  {loadingCategories ? "Loading categories..." : "Select a category"}
                </option>
                {dbCategories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <button
                type="button"
                onClick={() => setShowCustomCategory(true)}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                title="Add new category"
                disabled={isSubmitting || deletingItem}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Category List with Delete Buttons */}
            {dbCategories.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <p className="text-xs font-medium text-gray-500 mb-2">Existing Categories:</p>
                <div className="flex flex-wrap gap-2">
                  {dbCategories.map((category) => (
                    <div
                      key={category._id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-md"
                    >
                      <span className="text-sm text-gray-700">{category.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(category.name)}
                        disabled={deletingItem || isSubmitting}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        title="Delete category"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter new category name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              disabled={isSubmitting || deletingItem}
            />
            <button
              type="button"
              onClick={addCustomCategory}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting || deletingItem || !customCategory.trim()}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowCustomCategory(false)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting || deletingItem}
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
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                disabled={isSubmitting || !formData.category || deletingItem}
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.subcategory ? "border-red-500" : "border-gray-300"
                } ${!formData.category ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="">
                  {formData.category 
                    ? subcategoriesForSelected.length > 0 
                      ? "Select a subcategory" 
                      : "No subcategories found" 
                    : "Select a category first"}
                </option>
                {subcategoriesForSelected.map((subcategory) => (
                  <option key={subcategory.id || subcategory.name} value={subcategory.name}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              
              {formData.category && (
                <button
                  type="button"
                  onClick={() => setShowCustomSubcategory(true)}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  title="Add new subcategory"
                  disabled={isSubmitting || deletingItem}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
            </div>

            {/* Subcategory List with Delete Buttons */}
            {formData.category && subcategoriesForSelected.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <p className="text-xs font-medium text-gray-500 mb-2">Existing Subcategories:</p>
                <div className="flex flex-wrap gap-2">
                  {subcategoriesForSelected.map((subcategory) => (
                    <div
                      key={subcategory.id || subcategory.name}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-md"
                    >
                      <span className="text-sm text-gray-700">{subcategory.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubcategory(formData.category, subcategory.name)}
                        disabled={deletingItem || isSubmitting}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        title="Delete subcategory"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={customSubcategory}
              onChange={(e) => setCustomSubcategory(e.target.value)}
              placeholder="Enter new subcategory name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              disabled={isSubmitting || deletingItem}
            />
            <button
              type="button"
              onClick={addCustomSubcategory}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting || deletingItem || !customSubcategory.trim()}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowCustomSubcategory(false)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting || deletingItem}
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
          disabled={isSubmitting || deletingItem}
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
        disabled={isSubmitting || deletingItem}
      />

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || deletingItem}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || deletingItem}
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
    </form>
  );
}