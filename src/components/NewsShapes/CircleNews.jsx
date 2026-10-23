import React from 'react';

export default function CircleNews({ title, style }) {
  return (
    <div className="circle-news w-48 h-48 rounded-full border-2 border-red-600 bg-white flex flex-col justify-center items-center text-center p-4 shadow-md m-2 overflow-hidden" style={style}>
      <h3 className="font-bold text-sm text-gray-900 mb-1">{title || "వృత్తాకార వార్త"}</h3>
      <p className="text-xs text-gray-600">రౌండ్ షేప్ మేటర్</p>
    </div>
  );
}
