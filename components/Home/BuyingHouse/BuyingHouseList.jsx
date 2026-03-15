"use client";
import Image from "next/image";
import { useState } from "react";

export default function BuyingHouseList({ items, onEdit, onDelete, isDeleting }) {
  const [expandedId, setExpandedId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
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
        <p className="text-gray-500 text-lg">No items found. Add your first buying house item!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div 
          key={item._id} 
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1 p-6"
        >
          {/* Profile Image Section - Rounded Full */}
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-blue-100 shadow-md">
              {!imageErrors[item._id] && item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(item._id)}
                  sizes="128px"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs mt-1">No image</p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 text-center mb-3 line-clamp-2">
            {item.title}
          </h3>

          {/* Description with expand/collapse */}
          <div className="relative">
            <p className={`text-gray-600 text-center mb-4 ${
              expandedId === item._id ? '' : 'line-clamp-3'
            }`}>
              {item.description}
            </p>
            {item.description && item.description.length > 150 && (
              <button
                onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
                className="text-xs text-blue-600 hover:text-blue-800 block mx-auto mb-2"
              >
                {expandedId === item._id ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => onEdit(item)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(item._id)}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}