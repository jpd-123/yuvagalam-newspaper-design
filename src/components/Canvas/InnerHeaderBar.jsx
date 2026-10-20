import React from 'react';

export const InnerHeaderBar = ({ category, pageNumber }) => {
  const currentDate = new Date().toLocaleDateString('te-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#990000', color: '#fff', padding: '6px 15px', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ background: '#ffcc00', color: '#000', padding: '2px 8px', fontSize: '12px', borderRadius: '2px' }}>యువగళం</span>
        <span>{category || 'జనరల్ వార్తలు'}</span>
      </div>
      <div>{currentDate}</div>
      <div style={{ background: '#000', padding: '2px 12px', borderRadius: '3px', color: '#fff' }}>{pageNumber || '2'}</div>
    </div>
  );
};
