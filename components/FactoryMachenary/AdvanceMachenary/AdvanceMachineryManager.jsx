"use client";
import { useState } from "react";
import AdvanceMachineryForm from "./AdvanceMachineryForm";
import AdvanceMachineryList from "./AdvanceMachineryList";
import { useAdvanceMachineryData } from "../../../lib/DataFetch/SWRDataFetch";
import Modal from "../../ui/Modal";
import { toast } from "sonner";

export default function AdvanceMachineryManager() {
  const { data: machineryItems, mutate, isLoading } = useAdvanceMachineryData();
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
    if (!confirm("Are you sure you want to delete this machinery item?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/advance-machinery/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Machinery item deleted successfully!");
      mutate(); // Refresh the data
    } catch (error) {
      toast.error("Failed to delete machinery item");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const url = editingItem
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/advance-machinery/${editingItem._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/advance-machinery`;

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

      toast.success(editingItem ? "Machinery updated successfully!" : "Machinery added successfully!");
      mutate(); // Refresh the data
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save machinery item");
      console.error("Save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading machinery items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advance Machinery Management</h1>
          <p className="text-gray-600 mt-1">
            Total Items: <span className="font-semibold">{machineryItems?.length || 0}</span>
          </p>
        </div>
        
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Machinery
        </button>
      </div>

      {/* Machinery List */}
      <AdvanceMachineryList 
        items={machineryItems || []} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        isDeleting={isDeleting} 
      />

      {/* Modal for Add/Edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={editingItem ? "Edit Machinery Item" : "Add New Machinery Item"}
        size="md"
      >
        <AdvanceMachineryForm
          initialData={editingItem} 
          onSubmit={handleSubmit} 
          onCancel={() => !isSubmitting && setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}