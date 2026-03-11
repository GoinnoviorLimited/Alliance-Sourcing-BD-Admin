// components/admin/ContactDetailsModal.jsx
"use client";
import { useEffect } from "react";
import { format } from "date-fns";

const STATUS_COLORS = {
  new: "bg-blue-100 text-blue-800",
  read: "bg-gray-100 text-gray-800",
  replied: "bg-green-100 text-green-800",
  archived: "bg-yellow-100 text-yellow-800",
  spam: "bg-red-100 text-red-800",
};

export default function ContactDetailsModal({ 
  isOpen, 
  onClose, 
  message, 
  onStatusChange,
  onDelete,
  onReply,
  isDeleting 
}) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Message Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[message.status]}`}>
                  Status: {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Received: {format(new Date(message.createdAt), "PPP 'at' p")}
              </div>
            </div>

            {/* Sender Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Sender Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{message.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{message.email}</p>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Subject</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-900">{message.subject}</p>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <span className="font-medium">Message ID:</span> {message._id}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span> {format(new Date(message.updatedAt), "PPP")}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <select
                value={message.status}
                onChange={(e) => onStatusChange(message._id, e.target.value)}
                className={`px-3 py-2 rounded-md border text-sm ${STATUS_COLORS[message.status]}`}
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
                <option value="spam">Spam</option>
              </select>

              <button
                onClick={() => onReply(message.email, message.subject)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Reply
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this message?")) {
                    onDelete(message._id);
                  }
                }}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}