import React from 'react';

export const DailyToolbar = ({ onExportPdfClick }) => {
  return (
    <div style={{ padding: '10px 20px', background: '#004080', color: '#fff', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ color: '#00ffff', fontWeight: 'bold' }}>[డైలీ న్యూస్ డిజైన్ టూల్‌బార్]</span>
      
      <button style={{ padding: '5px 10px', background: '#fff', color: '#000', border: 'none', cursor: 'pointer' }}>
        వార్త మార్చు (Replace News)
      </button>

      <button style={{ padding: '5px 10px', background: '#fff', color: '#000', border: 'none', cursor: 'pointer' }}>
        1-క్లిక్ షేప్ మోడల్
      </button>

      <button style={{ padding: '5px 10px', background: '#fff', color: '#000', border: 'none', cursor: 'pointer' }}>
        కలర్ థీమ్ మార్చు
      </button>

      <button style={{ padding: '5px 15px', background: '#ff8800', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={onExportPdfClick}>
        PDF జనరేటర్
      </button>
    </div>
  );
};
