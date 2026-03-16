"use client";
import Image from "next/image";
import { useState } from "react";

const CategoryIcon = ({ name, className = "w-5 h-5" }) => {
  switch (name) {
    case "knitwear":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="10" width="24" height="16" rx="2" />
          <path d="M4 14 C8 11 12 13 16 11 C20 9 24 11 28 14" />
          <path d="M10 10 L8 4 M22 10 L24 4" />
        </svg>
      );
    case "denim":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="8" x2="28" y2="8" />
          <line x1="4" y1="13" x2="28" y2="13" />
          <line x1="4" y1="18" x2="28" y2="18" />
          <line x1="4" y1="23" x2="28" y2="23" />
          <rect x="4" y="6" width="24" height="20" rx="2" />
        </svg>
      );
    case "woven":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="24" height="24" rx="2" />
          <line x1="4" y1="11" x2="28" y2="11" />
          <line x1="4" y1="17" x2="28" y2="17" />
          <line x1="4" y1="23" x2="28" y2="23" />
          <line x1="11" y1="4" x2="11" y2="28" />
          <line x1="17" y1="4" x2="17" y2="28" />
          <line x1="23" y1="4" x2="23" y2="28" />
        </svg>
      );
    case "accessories":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="16" r="5" />
          <circle cx="10" cy="16" r="2" />
          <path d="M15 16 H28" />
          <circle cx="22" cy="10" r="3" />
          <circle cx="22" cy="22" r="3" />
        </svg>
      );
    default:
      return null;
  }
};

export default function CatalogList({ items, onEdit, onDelete, isDeleting }) {
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
        <p className="text-gray-500 text-lg">No catalogs found. Add your first catalog entry!</p>
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
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image Preview */}
            <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {!imageErrors[item._id] && item.image ? (
                <Image
                  src={item.image}
                  alt={item.heading}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(item._id)}
                  sizes="(max-width: 768px) 100vw, 192px"
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
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{item.label}</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{item.heading}</h3>
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
              <p className="text-gray-600 mt-2 line-clamp-2">{item.description}</p>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.categories?.map((cat, idx) => {
                  const iconName = cat.icon || "knitwear";
                  return (
                    <div key={idx} className="flex items-start gap-3 p-2 bg-gray-50 rounded-md">
                      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <CategoryIcon name={iconName} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">{cat.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{cat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
