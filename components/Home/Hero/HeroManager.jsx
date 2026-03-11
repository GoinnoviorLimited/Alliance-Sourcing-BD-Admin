"use client";
import { useState } from "react";
import HeroList from "./HeroList";
import { useHeroData } from "../../../lib/DataFetch/SWRDataFetch";
import HeroForm from "./HeroForm";
import Modal from "../../ui/Modal";
import { toast } from "sonner";

export default function HeroManager() {
  const { data: heros, mutate } = useHeroData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdd = () => {
    setEditingHero(null);
    setIsModalOpen(true);
  };

  const handleEdit = (hero) => {
    setEditingHero(hero);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this hero?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/heros/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Hero deleted successfully!");
      mutate(); // Refresh the data
    } catch (error) {
      toast.error("Failed to delete hero");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = editingHero
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/heros/${editingHero._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/heros`;

      const method = editingHero ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast(editingHero ? "Hero updated successfully!" : "Hero added successfully!");
      mutate(); // Refresh the data
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save hero");
      console.error("Save error:", error);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-900">Hero Section</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Hero
        </button>
      </div>

      <HeroList heros={heros} onEdit={handleEdit} onDelete={handleDelete} isDeleting={isDeleting} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingHero ? "Edit Hero" : "Add New Hero"}>
        <HeroForm initialData={editingHero} onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}