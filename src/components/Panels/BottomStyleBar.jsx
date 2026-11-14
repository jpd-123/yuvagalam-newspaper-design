import React from 'react';

export default function BottomStyleBar({ fontSize = 12, setFontSize }) {

  // ఇన్‌లైన్ టెక్స్ట్ ఎడిటింగ్ సమయంలో సెలెక్ట్ చేసిన టెక్స్ట్‌కి స్టైల్ అప్లై చేయడానికి హెల్పర్ ఫంక్షన్
  const applyFormatting = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  // మూడు రకాల బోల్డ్ / టైపోగ్రఫీ స్టైల్స్ అప్లై చేయడానికి
  const handleBoldStyle = (type) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');

    if (type === 'EXTRA_BOLD') {
      span.style.fontWeight = '900';
      span.style.textShadow = '1px 1px 0px rgba(0,0,0,0.3)';
    } else if (type === 'MEDIUM_BOLD') {
      span.style.fontWeight = '600';
    } else {
      span.style.fontWeight = 'normal';
    }

    try {
      range.surroundContents(span);
    } catch (err) {
      document.execCommand('bold', false, null);
    }
  };

  return (
    <div style={{ background: '#222', color: '#fff', padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '25px', fontSize: '13px', borderTop: '1px solid #444', flexWrap: 'wrap' }}>
      
      {/* ఫాంట్ సైజ్ కంట్రోల్స్ (- మరియు +) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontWeight: 'bold', color: '#ff4444' }}>ఫాంట్ సైజ్:</span>
        <button 
          onClick={() => setFontSize(Math.max(8, fontSize - 1))} 
          style={{ background: '#444', color: '#fff', border: 'none', padding: '3px 9px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold' }}
          title="సైజ్ తగ్గించండి (-)"
        >
          -
        </button>
        <span style={{ background: '#333', padding: '3px 12px', borderRadius: '3px', border: '1px solid #555', minWidth: '40px', textAlign: 'center' }}>
          {fontSize}pt
        </span>
        <button 
          onClick={() => setFontSize(fontSize + 1)} 
          style={{ background: '#444', color: '#fff', border: 'none', padding: '3px 9px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold' }}
          title="సైజ్ పెంచండి (+)"
        >
          +
        </button>
      </div>

      {/* మూడు రకాల బోల్డ్ ఆప్షన్లు (Extra Bold, Medium Bold, Normal) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 'bold', color: '#ff4444' }}>అక్షరాల బరువు (Bold Styles):</span>
        
        <button 
          onClick={() => handleBoldStyle('EXTRA_BOLD')} 
          style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '3px', fontWeight: '900', fontSize: '12px' }}
          title="ఎక్స్‌ట్రా బోల్డ్ (ప్రధాన శీర్షికల కోసం)"
        >
          Extra Bold
        </button>

        <button 
          onClick={() => handleBoldStyle('MEDIUM_BOLD')} 
          style={{ background: '#555', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '3px', fontWeight: '600', fontSize: '12px' }}
          title="మీడియం బోల్డ్ (సబ్-హెడ్‌లైన్స్ కోసం)"
        >
          Medium Bold
        </button>

        <button 
          onClick={() => handleBoldStyle('NORMAL')} 
          style={{ background: '#444', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'normal', fontSize: '12px' }}
          title="సాధారణ అక్షరాలు (బాడీ టెక్స్ట్ కోసం)"
        >
          Normal
        </button>
      </div>

    </div>
  );
}
