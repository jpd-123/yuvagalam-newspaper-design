import React from 'react';

export default function RectNews({ title, content, style }) {
  return (
    <div className="rect-news border border-gray-400 bg-white p-3 rounded shadow-sm my-2" style={style}>
      <h3 className="font-bold text-base text-red-700 border-b pb-1 mb-2">{title || "చతురస్ర వార్తా శీర్షిక"}</h3>
      <p className="text-sm text-gray-800 leading-relaxed">{content || "ఇక్కడ వార్తకు సంబంధించిన వివరాలు, టెక్స్ట్ వస్తుంది..."}</p>
    </div>
  );
}
