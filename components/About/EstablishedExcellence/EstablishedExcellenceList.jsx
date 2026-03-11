// components/admin/EstablishedExcellenceList.jsx
"use client";
import Image from "next/image";
import { useState } from "react";

export default function EstablishedExcellenceList({ items, onEdit, onDelete, isDeleting }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
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
        <p className="text-gray-500 text-lg">No items found. Add your first established excellence item!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div 
          key={item._id} 
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/3 relative h-64 md:h-auto bg-gray-100">
              {!imageErrors[item._id] ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(item._id)}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{item.title}</h2>
                  <h3 className="text-lg text-gray-600">{item.subtitle}</h3>
                </div>
                
                {/* Version Badge */}
                {item.__v !== undefined && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    v{item.__v}
                  </span>
                )}
              </div>

              {/* Paragraphs */}
              <div className="space-y-3 mb-4">
                {(expandedItems[item._id] 
                  ? item.paragraphs 
                  : item.paragraphs.slice(0, 2)
                ).map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                
                {item.paragraphs.length > 2 && (
                  <button
                    onClick={() => toggleExpand(item._id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {expandedItems[item._id] ? 'Show less' : `Read more (${item.paragraphs.length - 2} more)`}
                  </button>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                <span className="font-mono">ID: {item._id.slice(-6)}</span>
                <span>Paragraphs: {item.paragraphs.length}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => onEdit(item)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}