"use client";
import { useState } from "react";
import MachineryInventoryForm from "./MachineryInventoryForm";
import MachineryInventoryList from "./MachineryInventoryList";
import Modal from "../../ui/Modal";
import { toast } from "sonner";
import { useMachineryInventoryData } from "../../../lib/DataFetch/SWRDataFetch";

export default function MachineryInventoryManager() {
  const { data: inventoryItems, mutate, isLoading } = useMachineryInventoryData();
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
    if (!confirm("Are you sure you want to delete this inventory item?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/machinery-inventory/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Inventory item deleted successfully!");
      mutate(); // Refresh the data
    } catch (error) {
      toast.error("Failed to delete inventory item");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const url = editingItem
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/machinery-inventory/${editingItem._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/machinery-inventory`;

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

      toast.success(editingItem ? "Inventory updated successfully!" : "Inventory added successfully!");
      mutate(); // Refresh the data
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save inventory item");
      console.error("Save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate summary statistics
  const totalItems = inventoryItems?.length || 0;
  const totalQuantity = inventoryItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  const categories = [...new Set(inventoryItems?.map(item => item.category) || [])];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Machinery Inventory Management</h1>
          <p className="text-gray-600 mt-1">
            Total Items: <span className="font-semibold">{totalItems}</span> | 
            Total Quantity: <span className="font-semibold">{totalQuantity}</span> |
            Categories: <span className="font-semibold">{categories.length}</span>
          </p>
        </div>
        
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Inventory
        </button>
      </div>

      {/* Inventory List */}
      <MachineryInventoryList 
        items={inventoryItems || []} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        isDeleting={isDeleting} 
      />

      {/* Modal for Add/Edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
        size="md"
      >
        <MachineryInventoryForm 
          initialData={editingItem} 
          onSubmit={handleSubmit} 
          onCancel={() => !isSubmitting && setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}