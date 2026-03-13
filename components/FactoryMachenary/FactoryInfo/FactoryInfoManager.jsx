"use client";
import { useState } from "react";
import FactoryInfoForm from "./FactoryInfoForm";
import FactoryInfoList from "./FactoryInfoList";
import Modal from "../../ui/Modal";
import { useFactoryInfoData } from "../../../lib/DataFetch/SWRDataFetch";
import { toast } from "sonner";

export default function FactoryInfoManager() {
  const { data: factoryItems, mutate, isLoading } = useFactoryInfoData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const url = editingItem
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/factory-info/${editingItem._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/factory-info`;

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

      toast.success(editingItem ? "Factory info updated successfully!" : "Factory info added successfully!");
      mutate(); // Refresh the data
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save factory info");
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
          <p className="text-gray-600">Loading factory info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Factory Information Management</h1>
          <p className="text-gray-600 mt-1">
            Total Items: <span className="font-semibold">{factoryItems?.length || 0}</span>
          </p>
        </div>
      </div>

      {/* Factory Info List */}
      <FactoryInfoList 
        items={factoryItems || []} 
        onEdit={handleEdit} 
      />

      {/* Modal for Add/Edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={editingItem ? "Edit Factory Info" : "Add New Factory Info"}
        size="lg"
      >
        <FactoryInfoForm 
          initialData={editingItem} 
          onSubmit={handleSubmit} 
          onCancel={() => !isSubmitting && setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}