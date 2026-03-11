// components/admin/ContactList.jsx
"use client";
import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

const STATUS_COLORS = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  read: "bg-gray-100 text-gray-800 border-gray-200",
  replied: "bg-green-100 text-green-800 border-green-200",
  archived: "bg-yellow-100 text-yellow-800 border-yellow-200",
  spam: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_OPTIONS = ["new", "read", "replied", "archived", "spam"];

export default function ContactList({ messages, onViewDetails, onStatusChange, onDelete, isDeleting }) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and sort messages - LATEST ON TOP
  const filteredAndSortedMessages = useMemo(() => {
    // First filter the messages
    const filtered = messages.filter(message => {
      const matchesFilter = filter === "all" || message.status === filter;
      const matchesSearch = 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });

    // Then sort by createdAt date in DESCENDING order (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [messages, filter, searchTerm]);

  // Get unread count
  const unreadCount = useMemo(() => 
    messages.filter(m => m.status === "new").length, [messages]
  );

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-gray-500 text-lg">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Filter Bar */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter("new")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === "new" 
                  ? "bg-blue-600 text-white" 
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("replied")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === "replied" 
                  ? "bg-green-600 text-white" 
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              Replied
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-2.5 top-2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Messages List - LATEST ON TOP */}
      <div className="divide-y divide-gray-200">
        {filteredAndSortedMessages.map((message, index) => (
          <div
            key={message._id}
            className={`hover:bg-gray-50 transition-colors ${
              message.status === "new" ? "bg-blue-50/50" : ""
            }`}
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Status Indicator */}
                <div className="flex-shrink-0 pt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    message.status === "new" ? "bg-blue-600" : "bg-gray-300"
                  }`} />
                </div>

                {/* Avatar/Initials */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {message.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{message.name}</span>
                    <span className="text-sm text-gray-500">&lt;{message.email}&gt;</span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </span>
                    {/* New message indicator for first 3 items */}
                    {index < 3 && message.status === "new" && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                        Latest
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-md font-medium text-gray-900 mb-1">
                    {message.subject}
                  </h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {message.message}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onViewDetails(message)}
                      className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>

                    {/* Status Dropdown */}
                    <select
                      value={message.status}
                      onChange={(e) => onStatusChange(message._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded border ${STATUS_COLORS[message.status]}`}
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`}
                      className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Reply
                    </button>

                    <button
                      onClick={() => onDelete(message._id)}
                      disabled={isDeleting}
                      className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Preview Badge */}
                {message.status === "new" && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                      New
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredAndSortedMessages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages match your filters</p>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 flex justify-between">
        <span>Showing {filteredAndSortedMessages.length} of {messages.length} messages</span>
        <span>Sorted by: Latest first</span>
      </div>
    </div>
  );
}