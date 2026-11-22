import React from 'react';

export function BottomStyleBar({ fontSize = 12, setFontSize }) {
  const applyBoldStyle = (type) => {
    window.dispatchEvent(
      new CustomEvent('SATHVIKA_APPLY_FORMAT', { detail: { kind: 'BOLD', value: type } })
    );
  };

  const applyUnderlineOnly = () => {
    window.dispatchEvent(
      new CustomEvent('SATHVIKA_APPLY_FORMAT', { detail: { kind: 'UNDERLINE', value: true } })
    );
  };

  const applyAlignment = (command) => {
    window.dispatchEvent(
      new CustomEvent('SATHVIKA_APPLY_FORMAT', { detail: { kind: 'ALIGN', value: command } })
    );
  };

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      style={{
        background: '#222',
        color: '#fff',
        padding: '8px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: '13px',
        borderTop: '1px solid #444',
        flexWrap: 'wrap',
        zIndex: 100
      }}
    >
      {/* ఫాంట్ సైజ్ కంట్రోల్స్ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontWeight: 'bold', color: '#ff4444' }}>ఫాంట్ సైజ్:</span>
        <button
          onClick={() => {
            const nextSize = Math.max(8, fontSize - 1);
            setFontSize(nextSize);
            window.dispatchEvent(
              new CustomEvent('SATHVIKA_APPLY_FORMAT', { detail: { kind: 'FONT_SIZE', value: nextSize } })
            );
          }}
          style={{ background: '#444', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold' }}
        >
          -
        </button>
        <span style={{ background: '#333', padding: '4px 12px', borderRadius: '3px', border: '1px solid #555', minWidth: '42px', textAlign: 'center', fontWeight: 'bold' }}>
          {fontSize}pt
        </span>
        <button
          onClick={() => {
            const nextSize = fontSize + 1;
            setFontSize(nextSize);
            window.dispatchEvent(
              new CustomEvent('SATHVIKA_APPLY_FORMAT', { detail: { kind: 'FONT_SIZE', value: nextSize } })
            );
          }}
          style={{ background: '#444', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold' }}
        >
          +
        </button>
      </div>

      {/* 4 రకాల బోల్డ్ ఆప్షన్లు */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontWeight: 'bold', color: '#ff4444' }}>అక్షరాల బరువు:</span>
        <button onClick={() => applyBoldStyle('EXTRA_BOLD')} style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '3px', fontWeight: '900', fontSize: '11px' }}>Extra Bold</button>
        <button onClick={() => applyBoldStyle('MEDIUM_BOLD')} style={{ background: '#666', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '3px', fontWeight: '600', fontSize: '11px' }}>Med Bold</button>
        <button onClick={() => applyBoldStyle('NORMAL_BOLD')} style={{ background: '#555', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold', fontSize: '11px' }}>Bold</button>
        <button onClick={() => applyBoldStyle('NORMAL')} style={{ background: '#444', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'normal', fontSize: '11px' }}>Normal</button>
      </div>

      {/* కేవలం అండర్‌లైన్ బటన్ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <button
          onClick={applyUnderlineOnly}
          title="సెలెక్ట్ చేసిన పదాల కింద మాత్రమే అండర్‌లైన్ వస్తుంది"
          style={{ background: '#3949ab', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '3px', fontSize: '12px', textDecoration: 'underline', fontWeight: 'bold' }}
        >
          U అండర్‌లైన్
        </button>
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
