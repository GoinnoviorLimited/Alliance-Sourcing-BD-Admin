"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useServicesData } from "../../../lib/DataFetch/SWRDataFetch";
import ServicesList from "./ServicesList";
import ServicesForm from "./ServicesForm";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="border-b px-6 py-4 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function ServicesManager() {
  const { data: services, isLoading, error: isError, mutate } = useServicesData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this services section?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Services section deleted successfully!");
      mutate();
    } catch (error) {
      toast.error("Failed to delete services section");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const url = editingItem
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/services/${editingItem._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/services`;

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

      toast.success(editingItem ? "Services section updated successfully!" : "Services section added successfully!");
      mutate();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save services section");
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
          <p className="text-gray-500">Loading services...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold mb-2">Error loading services</p>
          <button 
            onClick={() => mutate()} 
            className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your dynamic services sections and features here.
          </p>
        </div>
        
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Section
        </button>
      </div>

      <ServicesList
        items={services}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={editingItem ? "Edit Services Section" : "Add New Services Section"}
      >
        <ServicesForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}
