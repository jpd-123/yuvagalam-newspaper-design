import React from 'react';

export default function OvalNews({ title, style }) {
  return (
    <div className="oval-news w-64 h-36 rounded-[50%] border-2 border-indigo-600 bg-white flex flex-col justify-center items-center text-center p-4 shadow-md m-2 overflow-hidden" style={style}>
      <h3 className="font-bold text-sm text-gray-900 mb-1">{title || "అండాకార వార్త"}</h3>
      <p className="text-xs text-gray-600">ఓవల్ షేప్ డిజైన్</p>
    </div>
  );
}
