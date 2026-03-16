'use client';

import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";

export default function PhotoUpload({ 
  name, 
  label, 
  value,
  required = false, 
  onChange,
  error,
  disabled = false
}) {
  const [preview, setPreview] = useState(value || null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (value) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = useCallback(async (file) => {
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "habson");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dov6k7xdk/image/upload",
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      onChange(data.secure_url); // Call the onChange prop
      toast.success(`${label} uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload ${label}`);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [onChange, label]);

  const handleInputChange = (e) => {
    if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const removeImage = () => {
    setPreview(null);
    onChange(""); // Clear the value
    const fileInput = document.getElementById(name);
    if (fileInput) fileInput.value = "";
  };

  const containerClasses = [
    "mt-2 border border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer",
    dragActive ? "border-sky-500 bg-sky-50" :
      preview ? "border-green-300 bg-green-50" :
        "border-gray-300 hover:border-gray-400",
    uploading ? "opacity-50 cursor-not-allowed" : ""
  ].join(" ");

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div
        className={containerClasses}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && !disabled && document.getElementById(name)?.click()}
      >
        <input
          id={name}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading || disabled}
          onChange={handleInputChange}
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto h-32 w-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeImage(); }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              ✕
            </button>
            <p className="text-sm text-green-600 mt-2">Image uploaded successfully!</p>
            <p className="text-xs text-gray-500">Click to change image</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
              {!required && (
                <p className="text-xs text-gray-400 mt-1">(Optional)</p>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};