"use client";
import { useState } from "react";
import { useCatalogData } from "../../../lib/DataFetch/SWRDataFetch";
import CatalogForm from "./CatalogForm";
import CatalogList from "./CatalogList";
import Modal from "../../ui/Modal";
import { toast } from "sonner";

export default function CatalogManager() {
  const { data: catalogItems, mutate, isLoading } = useCatalogData();
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
    if (!confirm("Are you sure you want to delete this catalog?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catalog/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Catalog deleted successfully!");
      mutate();
    } catch (error) {
      toast.error("Failed to delete catalog");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const url = editingItem
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/catalog/${editingItem._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/catalog`;

      const method = editingItem ? "PATCH" : "POST";

      // Remove MongoDB specific fields to prevent immutable field errors
      const { _id, createdAt, updatedAt, __v, ...submitData } = formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save");
      }

      toast.success(editingItem ? "Catalog updated successfully!" : "Catalog added successfully!");
      mutate();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save catalog");
      console.error("Save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading catalogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalog Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your dynamic catalog sections here.
          </p>
        </div>
        
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Catalog
        </button>
      </div>

      <CatalogList 
        items={catalogItems} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        isDeleting={isDeleting} 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={editingItem ? "Edit Catalog" : "Add New Catalog"}
      >
        <CatalogForm 
          initialData={editingItem} 
          onSubmit={handleSubmit} 
          onCancel={() => !isSubmitting && setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
        {isSubmitting && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Saving...</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
