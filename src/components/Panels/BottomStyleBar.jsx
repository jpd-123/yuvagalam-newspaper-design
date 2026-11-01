import React from 'react';

export function BottomStyleBar() {
  return (
    <div style={{ background: '#222', color: '#fff', padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '13px', borderTop: '1px solid #444' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontWeight: 'bold' }}>ఫాంట్ సైజ్:</span>
        <button style={{ background: '#444', color: '#fff', border: 'none', padding: '2px 8px', cursor: 'pointer', borderRadius: '3px' }}>-</button>
        <span style={{ background: '#333', padding: '2px 10px', borderRadius: '3px', border: '1px solid #555' }}>12pt</span>
        <button style={{ background: '#444', color: '#fff', border: 'none', padding: '2px 8px', cursor: 'pointer', borderRadius: '3px' }}>+</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '20px' }}>
        <span style={{ fontWeight: 'bold' }}>బుల్లెట్లు:</span>
        <select style={{ background: '#333', color: '#fff', border: '1px solid #555', padding: '3px 6px', borderRadius: '3px' }}>
          <option value="none">ఏదీ వద్దు</option>
          <option value="bullet1">బుల్లెట్ 1</option>
          <option value="bullet2">బుల్లెట్ 2</option>
          <option value="bullet3">బుల్లెట్ 3</option>
        </select>
      </div>
    </div>
  );
}
