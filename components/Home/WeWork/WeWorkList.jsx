"use client";
import Image from "next/image";
import { useState } from "react";

// Icon mapping for display
const ICON_MAPPING = {
  supplier: { emoji: "🏭", bgColor: "bg-blue-100", textColor: "text-blue-600" },
  handshake: { emoji: "🤝", bgColor: "bg-green-100", textColor: "text-green-600" },
  factory: { emoji: "🏭", bgColor: "bg-orange-100", textColor: "text-orange-600" },
  quality: { emoji: "⭐", bgColor: "bg-yellow-100", textColor: "text-yellow-600" },
  delivery: { emoji: "🚚", bgColor: "bg-purple-100", textColor: "text-purple-600" },
  support: { emoji: "💬", bgColor: "bg-indigo-100", textColor: "text-indigo-600" },
  innovation: { emoji: "💡", bgColor: "bg-amber-100", textColor: "text-amber-600" },
  sustainability: { emoji: "🌱", bgColor: "bg-emerald-100", textColor: "text-emerald-600" },
  global: { emoji: "🌍", bgColor: "bg-cyan-100", textColor: "text-cyan-600" },
  partnership: { emoji: "🤝", bgColor: "bg-rose-100", textColor: "text-rose-600" },
};

export default function WeWorkList({ items, onEdit, onDelete, isDeleting }) {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (itemId) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  if (!items) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No items found. Add your first we work item!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const iconStyle = ICON_MAPPING[item.icon] || { emoji: "📦", bgColor: "bg-gray-100", textColor: "text-gray-600" };
        
        return (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Image Section */}
            <div className="relative h-48 w-full bg-gray-100">
              {!imageErrors[item._id] ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(item._id)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm mt-2">Image not available</p>
                </div>
              )}
              
              {/* Cloudinary Badge */}
              {item.image?.includes('cloudinary') && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Cloudinary
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-4">
              {/* Icon and Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${iconStyle.bgColor} flex items-center justify-center text-xl`}>
                  {iconStyle.emoji}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

              {/* Icon Info */}
              <div className="mb-4 p-2 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Icon:</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${iconStyle.bgColor} ${iconStyle.textColor}`}>
                    {item.icon}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>ID: {item._id.slice(-6)}</span>
                <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center gap-1 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  disabled={isDeleting}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}