import React, { useState } from 'react';

export default function MobileUploadModal({ isOpen, onClose, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (selectedFile && onUpload) {
      onUpload(selectedFile);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
          మొబైల్ నుండి ఫైల్ అప్‌లోడ్ (Mobile Upload)
        </h3>
        
        <div className="mb-4">
          <input 
            type="file" 
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold"
          >
            రద్దు చేయు
          </button>
          <button 
            onClick={handleUploadSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold"
          >
            అప్‌లోడ్ చేయి
          </button>
        </div>
      </div>
    </div>
  );
}
