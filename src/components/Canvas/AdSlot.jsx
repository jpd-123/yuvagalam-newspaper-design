import React from 'react';

export default function AdSlot({ adTitle }) {
  return (
    <div className="ad-slot border-2 border-dashed border-blue-400 bg-blue-50 p-4 text-center rounded-lg my-2">
      <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
        {adTitle || "বিজ্ঞাপন / Advertisement Space"}
      </p>
      <span className="text-xs text-gray-500">ఇక్కడ ప్రకటనను సెట్ చేయవచ్చు</span>
    </div>
  );
}
