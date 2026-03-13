// components/admin/FactoryInfoList.jsx
"use client";
import Image from "next/image";
import { useState, useMemo } from "react";

export default function FactoryInfoList({ items, onEdit, onDelete, isDeleting }) {
  const [imageErrors, setImageErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  // Sort items by newest first and filter by search
  const filteredAndSortedItems = useMemo(() => {
    // First filter by search term
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then sort by createdAt date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [items, searchTerm]);

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-4H7v4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6" />
        </svg>
        <p className="text-gray-500 text-lg">No factory information found</p>
        <p className="text-gray-400 mt-2">Add your first factory info item to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative w-full sm:w-96">
        <input
          type="text"
          placeholder="Search by title, subtitle or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredAndSortedItems.map((item, index) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="md:w-1/4 relative h-48 md:h-auto bg-gray-100">
                {!imageErrors[item._id] ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-4"
                    onError={() => handleImageError(item._id)}
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm mt-2">Image not available</p>
                  </div>
                )}
                
                {/* New Badge for latest items */}
                {index < 2 && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Latest
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="md:w-3/4 p-6">
                <div className="flex justify-between items-start mb-3">
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

                {/* Description */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {expandedItems[item._id] 
                      ? item.description 
                      : item.description.length > 150 
                        ? item.description.substring(0, 150) + '...' 
                        : item.description
                    }
                  </p>
                  {item.description.length > 150 && (
                    <button
                      onClick={() => toggleExpand(item._id)}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {expandedItems[item._id] ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>

                {/* Action Link */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 inline-block">
                  <a
                    href={item.actions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Download Factory Profile
                  </a>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="font-mono">ID: {item._id.slice(-6)}</span>
                  <span>Added: {new Date(item.createdAt).toLocaleDateString()}</span>
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

      {/* Results Summary */}
      {filteredAndSortedItems.length > 0 && (
        <div className="text-xs text-gray-400 text-right">
          Showing {filteredAndSortedItems.length} of {items.length} items • Sorted by latest first
        </div>
      )}

      {/* Empty State for Search */}
      {filteredAndSortedItems.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-500">No items found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}