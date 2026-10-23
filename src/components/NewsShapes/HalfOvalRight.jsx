import React from 'react';

export default function HalfOvalRight({ title, style }) {
  return (
    <div className="half-oval-right w-48 h-36 rounded-l-full border-2 border-r-0 border-green-600 bg-white flex flex-col justify-center items-center text-center p-4 shadow-md m-2 overflow-hidden" style={style}>
      <h3 className="font-bold text-xs text-gray-900 mb-1">{title || "హాఫ్ ఓవల్ (కుడి)"}</h3>
      <p className="text-xs text-gray-600">స్పెషల్ డిజైన్</p>
    </div>
  );
}
