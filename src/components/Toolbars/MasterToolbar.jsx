import React from 'react';

export const MasterToolbar = ({ onSaveMaster, onUploadLogo }) => {
  return (
    <div style={{ padding: '10px 20px', background: '#1a1a1a', color: '#fff', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ color: '#ffcc00', fontWeight: 'bold' }}>[మాస్టర్ లేఅవుట్ టూల్‌బార్]</span>
      
      <select style={{ padding: '5px' }}>
        <option>పేజీ సైజ్: A3 Broadsheet</option>
      </select>

      <input type="number" placeholder="పేజీల సంఖ్య" defaultValue={4} style={{ width: '90px', padding: '5px' }} />

      <button onClick={onUploadLogo} style={{ padding: '5px 10px', background: '#0055ff', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Upload Main Logo
      </button>

      <button style={{ padding: '5px 10px', background: '#444', color: '#fff', border: 'none' }}>
        బాటమ్ బుల్లెట్స్ ఆన్/ఆఫ్
      </button>

      <button style={{ padding: '5px 15px', background: '#00aa00', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={onSaveMaster}>
        మాస్టర్ లేఅవుట్‌గా సేవ్ చేయి
      </button>
    </div>
  );
};
