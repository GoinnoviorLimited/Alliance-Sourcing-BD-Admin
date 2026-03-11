"use client";
import { useState } from "react";
import { useContactData } from "../../../lib/DataFetch/SWRDataFetch";
import ContactList from "./ContactList";
import ContactDetailsModal from "./ContactDetailsModal";
import { toast } from "sonner";

export default function ContactManager() {
  const { data: messages, mutate, isLoading } = useContactData();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewDetails = async (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    
    // Auto-update status to "read" if it's "new"
    if (message.status === "new") {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/contact/${message._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "read" }),
          }
        );

        if (!response.ok) throw new Error("Failed to update status");
        
        // Refresh the data
        mutate();
      } catch (error) {
        console.error("Status update error:", error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      toast.success(`Status updated to ${newStatus}`);
      mutate(); // Refresh the data
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Status update error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Message deleted successfully!");
      mutate(); // Refresh the data
      
      // Close modal if open
      if (selectedMessage?._id === id) {
        setIsModalOpen(false);
        setSelectedMessage(null);
      }
    } catch (error) {
      toast.error("Failed to delete message");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReply = (email, subject) => {
    // Open email client with pre-filled details
    window.location.href = `mailto:${email}?subject=Re: ${subject}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-600 mt-1">
          Total Messages: <span className="font-semibold">{messages?.length || 0}</span> | 
          Unread: <span className="font-semibold text-blue-600">
            {messages?.filter(m => m.status === "new").length || 0}
          </span>
        </p>
      </div>

      {/* Messages List */}
      <ContactList 
        messages={messages || []} 
        onViewDetails={handleViewDetails}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      {/* Details Modal */}
      <ContactDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={selectedMessage}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onReply={handleReply}
        isDeleting={isDeleting}
      />
    </div>
  );
}