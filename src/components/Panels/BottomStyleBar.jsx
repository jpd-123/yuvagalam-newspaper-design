import React from 'react';

export function BottomStyleBar({ fontSize = 12, setFontSize }) {

  const applyBoldStyle = (type) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const span = document.createElement('span');
    if (type === 'EXTRA_BOLD') {
      span.style.fontWeight = '900';
      span.style.textShadow = '0.5px 0.5px 0px rgba(0,0,0,0.4)';
    } else if (type === 'MEDIUM_BOLD') {
      span.style.fontWeight = '600';
    } else if (type === 'NORMAL_BOLD') {
      span.style.fontWeight = 'bold';
    } else {
      span.style.fontWeight = 'normal';
    }

    try {
      range.surroundContents(span);
    } catch (err) {
      document.execCommand('bold', false, null);
    }
  };

  const applyAlignment = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div 
      onMouseDown={(e) => e.preventDefault()} 
      style={{ background: '#222', color: '#fff', padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', borderTop: '1px solid #444', flexWrap: 'wrap', zIndex: 100 }}
    >
      {/* ఫాంట్ సైజ్ కంట్రోల్స్ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontWeight: 'bold', color: '#ff4444' }}>ఫాంట్ సైజ్:</span>
        <button 
          onClick={() => setFontSize(Math.max(8, fontSize - 1))} 
          style={{ background: '#444', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold' }}
        >
          -
        </button>
        <span style={{ background: '#333', padding: '4px 12px', borderRadius: '3px', border: '1px solid #555', minWidth: '42px', textAlign: 'center', fontWeight: 'bold' }}>
          {fontSize}pt
        </span>
        <button 
          onClick={() => setFontSize(fontSize + 1)} 
          style={{ background: '#444', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold' }}
        >
          +
        </button>
      </div>

      {/* 4 రకాల బోల్డ్ ఆప్షన్లు */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontWeight: 'bold', color: '#ff4444' }}>అక్షరాల బరువు:</span>
        <button onClick={() => applyBoldStyle('EXTRA_BOLD')} style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '3px', fontWeight: '900', fontSize: '11px' }} title="ఎక్స్‌ట్రా బోల్డ్">Extra Bold</button>
        <button onClick={() => applyBoldStyle('MEDIUM_BOLD')} style={{ background: '#666', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '3px', fontWeight: '600', fontSize: '11px' }} title="మీడియం బోల్డ్">Med Bold</button>
        <button onClick={() => applyBoldStyle('NORMAL_BOLD')} style={{ background: '#555', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold', fontSize: '11px' }} title="సాధారణ బోల్డ్">Bold</button>
        <button onClick={() => applyBoldStyle('NORMAL')} style={{ background: '#444', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'normal', fontSize: '11px' }} title="సాధారణ అక్షరాలు">Normal</button>
      </div>

      {/* అలైన్‌మెంట్ ఆప్షన్లు */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontWeight: 'bold', color: '#ff4444' }}>అలైన్:</span>
        <button onClick={() => applyAlignment('justifyLeft')} style={{ background: '#444', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '3px', fontSize: '11px' }}>Left</button>
        <button onClick={() => applyAlignment('justifyCenter')} style={{ background: '#444', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '3px', fontSize: '11px' }}>Center</button>
        <button onClick={() => applyAlignment('justifyRight')} style={{ background: '#444', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '3px', fontSize: '11px' }}>Right</button>
      </div>
    </div>
  );
}
