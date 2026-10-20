import React from 'react';

export const FooterCMYK = () => {
  const colors = ['#00FFFF', '#FF00FF', '#FFFF00', '#000000', '#FF0000', '#00FF00', '#0000FF'];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px 0', borderTop: '1px dashed #ccc', marginTop: '20px' }}>
      {colors.map((col, idx) => (
        <div key={idx} style={{ width: '10px', height: '10px', borderRadius: '50%', background: col, border: '1px solid #333' }} />
      ))}
    </div>
  );
};
