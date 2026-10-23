import React from 'react';

export default function HalfOvalLeft({ title, style }) {
  return (
    <div className="half-oval-left w-48 h-36 rounded-r-full border-2 border-l-0 border-green-600 bg-white flex flex-col justify-center items-center text-center p-4 shadow-md m-2 overflow-hidden" style={style}>
      <h3 className="font-bold text-xs text-gray-900 mb-1">{title || "హాఫ్ ఓవల్ (ఎడమ)"}</h3>
      <p className="text-xs text-gray-600">స్పెషల్ డిజైన్</p>
    </div>
  );
}
