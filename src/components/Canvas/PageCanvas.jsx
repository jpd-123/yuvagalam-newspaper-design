import React from 'react';
import AdSlot from './AdSlot';

export default function PageCanvas({ pageTitle, children }) {
  return (
    <div className="page-canvas-container bg-white shadow-lg mx-auto my-4 p-6 rounded-md max-w-4xl border border-gray-300">
      <div className="canvas-header border-b-2 border-red-600 pb-2 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{pageTitle || "సాత్విక దినపత్రిక"}</h2>
        <span className="text-sm text-gray-500">బ్రోడ్‌షీట్ లేఅవుట్</span>
      </div>

      {/* ప్రధాన వార్తల గ్రిడ్ ఏరియా */}
      <div className="canvas-body min-h-[500px] relative border border-dashed border-gray-200 p-4">
        {children}
        
        {/* అడ్వర్టైజ్‌మెంట్ స్లాట్ ఉదాహరణ */}
        <div className="mt-6">
          <AdSlot adTitle="ప్రకటన స్థలం (Advertisement)" />
        </div>
      </div>
    </div>
  );
}
