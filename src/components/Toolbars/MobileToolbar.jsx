import React from 'react';

export const MobileToolbar = ({ onUploadClick }) => {
  return (
    <div style={{ padding: '12px', background: '#660033', color: '#fff', textAlign: 'center' }}>
      <span style={{ fontWeight: 'bold' }}>[సాత్విక మొబైల్ క్లిక్ అప్‌లోడర్]</span>
      <button 
        style={{ marginLeft: '15px', padding: '6px 20px', background: '#ff3366', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} 
        onClick={onUploadClick}
      >
        + క్రొత్త వార్త అప్‌లోడ్ / రీప్లేస్
      </button>
    </div>
  );
};
