"use client";
import Image from "next/image";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ServicesList({ items, onEdit, onDelete, isDeleting }) {
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
        <p className="text-gray-500 text-lg">No services sections found. Add your first section!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div 
          key={item._id} 
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-6"
        >
          <div className={`flex flex-col md:flex-row gap-6 ${item.imagePosition === 'right' ? 'md:flex-row-reverse' : ''}`}>
            {/* Image Preview */}
            <div className="relative w-full md:w-64 h-64 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {!imageErrors[item._id] && item.image ? (
                <Image
                  src={item.image}
                  alt={item.imageAlt || item.title}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(item._id)}
                  sizes="(max-width: 768px) 100vw, 256px"
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

            {/* Content */}
            <div className="grow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">{item.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    disabled={isDeleting}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-6">{item.description}</p>
              
              <div className="space-y-4">
                {item.features?.map((feature, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="mt-0.5 text-cyan-500 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
