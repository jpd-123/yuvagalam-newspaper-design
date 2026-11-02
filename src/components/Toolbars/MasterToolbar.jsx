import React from 'react';

export function MasterToolbar({ onSaveMaster, onUploadLogo }) {
  return (
    <div style={{ background: '#222', color: '#fff', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', borderBottom: '2px solid #d32f2f' }}>
      <div style={{ fontWeight: 'bold', color: '#ff4444', fontSize: '15px' }}>[మాస్టర్ లేఅవుట్ టూల్‌బార్]</div>
      
      {/* లోగో అప్‌లోడ్ బటన్ */}
      <button 
        onClick={onUploadLogo}
        style={{ background: '#1976d2', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
      >
        Upload Main Logo (PNG)
      </button>

      {/* సేవ్ మాస్టర్ లేఅవుట్ */}
      <button 
        onClick={onSaveMaster}
        style={{ background: '#388e3c', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', marginLeft: 'auto' }}
      >
        మాస్టర్ లేఅవుట్‌గా సేవ్ చేయి (Ctrl+S)
      </button>
    </div>
  );
}
