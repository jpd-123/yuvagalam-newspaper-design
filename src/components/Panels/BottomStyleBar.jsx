import React from 'react';
import { BULLET_TYPES, UNDERLINE_STYLES } from '../../constants/themeConstants';

export const BottomStyleBar = () => {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#333', color: '#fff', padding: '8px 20px', display: 'flex', gap: '20px', alignItems: 'center', zIndex: 999 }}>
      <span><strong>ఫాంట్ సైజ్:</strong></span>
      <button style={{ padding: '2px 8px' }}>-</button>
      <span>12pt</span>
      <button style={{ padding: '2px 8px' }}>+</button>

      <span><strong>బుల్లెట్లు:</strong></span>
      <select style={{ padding: '3px' }}>
        {BULLET_TYPES.map((b, i) => <option key={i}>{b}</option>)}
      </select>

      <span><strong>అండర్‌లైన్:</strong></span>
      <select style={{ padding: '3px' }}>
        {UNDERLINE_STYLES.map((u) => <option key={u.id}>{u.name}</option>)}
      </select>
    </div>
  );
};
