"use client";
import { useState } from "react";
import { useEstablishedExcellenceData } from "../../../lib/DataFetch/SWRDataFetch";
import EstablishedExcellenceForm from "./EstablishedExcellenceForm";
import EstablishedExcellenceList from "./EstablishedExcellenceList";
import EstablishedExcellenceModal from "./EstablishedExcellenceModal";
import { toast } from "sonner";

export default function EstablishedExcellenceManager() {
  const { data: excellenceItems, mutate, isLoading } = useEstablishedExcellenceData();
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
      const url = editingItem && `${process.env.NEXT_PUBLIC_API_URL}/api/established-excellence/${editingItem._id}`;

      const method = editingItem && "PATCH";

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

      toast.success(editingItem && "Item updated successfully!");
      mutate(); // Refresh the data
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save item");
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
          <p className="text-gray-600">Loading established excellence items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Established Excellence Management</h1>
          <p className="text-gray-600 mt-1">
            Total Items: <span className="font-semibold">{excellenceItems?.length || 0}</span>
          </p>
        </div>
      </div>

      {/* Established Excellence List */}
      <EstablishedExcellenceList 
        items={excellenceItems} 
        onEdit={handleEdit} 
      />

      {/* Modal for Add/Edit */}
      <EstablishedExcellenceModal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)} 
        title={editingItem ? "Edit Established Excellence Item" : "Add New Established Excellence Item"}
        size="lg"
      >
        <EstablishedExcellenceForm 
          initialData={editingItem} 
          onSubmit={handleSubmit} 
          onCancel={() => !isSubmitting && setIsModalOpen(false)}
        />
        {isSubmitting && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Saving...</p>
            </div>
          </div>
        )}
      </EstablishedExcellenceModal>
    </div>
  );
}