import React from 'react';

export default function PhotoShapeModal({ isOpen, onClose, onSelectShape }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
          ఫోటో ఆకారం ఎంచుకోండి (Photo Shape)
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => { onSelectShape('rectangle'); onClose(); }}
            className="p-3 border rounded-md hover:bg-red-50 text-gray-700 font-medium"
          >
            చతురస్రం (Rectangle)
          </button>
          <button 
            onClick={() => { onSelectShape('circle'); onClose(); }}
            className="p-3 border rounded-md hover:bg-red-50 text-gray-700 font-medium"
          >
            వృత్తాకారం (Circle)
          </button>
          <button 
            onClick={() => { onSelectShape('oval'); onClose(); }}
            className="p-3 border rounded-md hover:bg-red-50 text-gray-700 font-medium"
          >
            అండాకారం (Oval)
          </button>
          <button 
            onClick={() => { onSelectShape('custom'); onClose(); }}
            className="p-3 border rounded-md hover:bg-red-50 text-gray-700 font-medium"
          >
            కస్టమ్ షేప్
          </button>
        </div>
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold"
          >
            మూసివేయి (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
