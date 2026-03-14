"use client";
import { useState } from "react";
import ProductsForm from "./ProductsForm";
import ProductsList from "./ProductsList";
import Modal from "../ui/Modal";
import { useProductsData } from "../../lib/DataFetch/SWRDataFetch";
import { toast } from "sonner";

export default function ProductsManager() {
  const { data: products, mutate, isLoading } = useProductsData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Product deleted successfully!");
      mutate(); // Refresh the data
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const url = editingItem
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingItem._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/products`;

      const method = editingItem ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save");
      }

      toast.success(editingItem ? "Product updated successfully!" : "Product added successfully!");
      mutate(); // Refresh the data
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save product");
      console.error("Save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate summary statistics
  const totalProducts = products?.length || 0;
  const categories = [...new Set(products?.map(item => item.category) || [])];
  const subcategories = [...new Set(products?.map(item => item.subcategory) || [])];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-1">
            Total Products: <span className="font-semibold">{totalProducts}</span> | 
            Categories: <span className="font-semibold">{categories.length}</span> |
            Subcategories: <span className="font-semibold">{subcategories.length}</span>
          </p>
        </div>
        
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Products List */}
      <ProductsList 
        items={products || []} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        isDeleting={isDeleting} 
      />

      {/* Modal for Add/Edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={editingItem ? "Edit Product" : "Add New Product"}
        size="lg"
      >
        <ProductsForm 
          initialData={editingItem} 
          onSubmit={handleSubmit} 
          onCancel={() => !isSubmitting && setIsModalOpen(false)}
          isSubmitting={isSubmitting}
          existingCategories={categories}
          existingSubcategories={subcategories}
        />
      </Modal>
    </div>
  );
}