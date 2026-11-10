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
    </div>
  );
}
