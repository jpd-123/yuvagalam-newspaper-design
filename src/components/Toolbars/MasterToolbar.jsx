import React from 'react';

export function MasterToolbar({ onSaveMaster, onUploadLogo }) {
  return (
    <div style={{ background: '#222', color: '#fff', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', borderBottom: '2px solid #d32f2f' }}>
      <div style={{ fontWeight: 'bold', color: '#ff4444', fontSize: '15px' }}>[మాస్టర్ లేఅవుట్ టూల్‌బార్]</div>
      
      {/* పేపర్ సైజ్ సెలెక్షన్ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ fontSize: '13px' }}>పేపర్ సైజ్:</label>
        <select style={{ padding: '5px', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #555' }}>
          <option value="BROADSHEET">A3 బ్రాడ్‌షీట్</option>
          <option value="MEDIUM">మీడియం</option>
          <option value="DISTRICT_TABLOID">జిల్లా టాబ్లెట్ షీట్</option>
        </select>
      </div>

      {/* నంబర్స్ ఆఫ్ పేజీలు */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ fontSize: '13px' }}>పేజీలు:</label>
        <select style={{ padding: '5px', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #555', width: '60px' }}>
          {[...Array(16)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>

      {/* లోగో అప్‌లోడ్ బటన్ */}
      <button 
        onClick={onUploadLogo}
        style={{ background: '#1976d2', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
      >
        Upload Main Logo
      </button>

      {/* సేవ్ మాస్టర్ లేఅవుట్ */}
      <button 
        onClick={onSaveMaster}
        style={{ background: '#388e3c', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', marginLeft: 'auto' }}
      >
        మాస్టర్ లేఅవుట్‌గా సేవ్ చేయి
      </button>
    </div>
  );
}
