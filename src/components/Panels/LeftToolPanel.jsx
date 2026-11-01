import React from 'react';

export function LeftToolPanel({ onSelectShape }) {
  return (
    <div style={{ width: '220px', background: '#333', color: '#fff', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', borderRight: '1px solid #444', overflowY: 'auto' }}>
      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff4444', borderBottom: '1px solid #555', paddingBottom: '5px' }}>
        డ్రాయింగ్ & షేప్ టూల్స్
      </div>

      {/* గ్రిడ్ & షేప్ సెలెక్షన్ బటన్లు */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={() => onSelectShape('RECTANGLE')}
          style={{ background: '#444', color: '#fff', border: '1px solid #555', padding: '8px', textAlign: 'left', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
        >
          📄 రెక్టాంగులర్ గ్రిడ్ (Text/News)
        </button>

        <button 
          onClick={() => onSelectShape('PICTURE')}
          style={{ background: '#444', color: '#fff', border: '1px solid #555', padding: '8px', textAlign: 'left', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
        >
          🖼️ పిక్చర్ బాక్స్ (Photo Grid)
        </button>

        <button 
          onClick={() => onSelectShape('CIRCLE')}
          style={{ background: '#444', color: '#fff', border: '1px solid #555', padding: '8px', textAlign: 'left', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
        >
          ⚪ గుండ్రని బంతి ఆకారం (Circle)
        </button>

        <button 
          onClick={() => onSelectShape('OVAL')}
          style={{ background: '#444', color: '#fff', border: '1px solid #555', padding: '8px', textAlign: 'left', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
        >
          🪩 అండాకార గ్రిడ్ (Oval)
        </button>

        <button 
          onClick={() => onSelectShape('DIVIDER')}
          style={{ background: '#444', color: '#fff', border: '1px solid #555', padding: '8px', textAlign: 'left', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
        >
          📏 డివైడర్ లైన్ (Divider Line)
        </button>
      </div>

      <div style={{ fontSize: '11px', color: '#aaa', marginTop: 'auto', borderTop: '1px solid #555', paddingTop: '10px' }}>
        పేజ్‌మేకర్ 7.0 మాన్యువల్ మోడ్ యాక్టివ్‌గా ఉంది.
      </div>
    </div>
  );
}
