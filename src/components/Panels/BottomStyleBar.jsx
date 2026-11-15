import React from 'react';

// App.jsx లో { BottomStyleBar } అని ఇంపోర్ట్ చేసుకున్నాం కాబట్టి ఇక్కడ 'export function' వాడాలి
export function BottomStyleBar({ fontSize = 12, setFontSize }) {

  // సెలెక్ట్ చేసిన అక్షరాలకు స్టైల్ (Bold / Align / Size) అప్లై చేయడానికి
  const applyStyleToSelection = (styleType, value) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    // 1. అలైన్‌మెంట్ (Left, Center, Right)
    if (styleType === 'ALIGN') {
      document.execCommand(value, false, null);
      return;
    }

    // 2. ఫాంట్ సైజ్ మార్పు (సెలెక్ట్ చేసిన అక్షరాలకు మాత్రమే సైజ్ పెంచడం/తగ్గించడం)
    if (styleType === 'INLINE_SIZE') {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = document.createElement('span');
        span.style.fontSize = `${value}pt`;
        try {
          range.surroundContents(span);
        } catch (err) {
          document.execCommand('fontSize', false, '4');
        }
      }
      return;
    }

    // 3. మూడు రకాల బోల్డ్ ఆప్షన్లు (Extra Bold, Medium Bold, Normal)
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const span = document.createElement('span');
    if (styleType === 'EXTRA_BOLD') {
      span.style.fontWeight = '900';
      span.style.textShadow = '1px 1px 0px rgba(0,0,0,0.3)';
    } else if (styleType === 'MEDIUM_BOLD') {
      span.style.fontWeight = '600';
    } else if (styleType === 'NORMAL') {
      span.style.fontWeight = 'normal';
      span.style.textShadow = 'none';
    }

    try {
      range.surroundContents(span);
    } catch (err) {
      document.execCommand('bold', false, null);
    }
  };

  return (
    <div 
      // ఇది చాలా ముఖ్యం: బటన్ నొక్కినప్పుడు పైన సెలెక్ట్ చేసిన అక్షరాలు డీ-సెలెక్ట్ అవ్వకుండా ఆపుతుంది!
      onMouseDown={(e) => e.preventDefault()} 
      style={{ 
        background: '#222', 
        color: '#fff', 
        padding: '8px 15px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        fontSize: '13px', 
        borderTop: '1px solid #444', 
        flexWrap: 'wrap',
        zIndex: 100
      }}
    >
      
      {/* 1. ఫాంట్ సైజ్ కంట్రోల్స్ (- మరియు +) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontWeight: 'bold', color: '#ff4444' }}>ఫాంట్ సైజ్:</span>
        <button 
          onClick={() => {
            const newSize = Math.max(8, fontSize - 1);
            if (setFontSize) setFontSize(newSize);
            applyStyleToSelection('INLINE_SIZE', newSize);
          }} 
          style={{ background: '#444', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold' }}
          title="సైజ్ తగ్గించండి (-)"
        >
          -
        </button>
        <span style={{ background: '#333', padding: '4px 12px', borderRadius: '3px', border: '1px solid #555', minWidth: '42px', textAlign: 'center', fontWeight: 'bold' }}>
          {fontSize}pt
        </span>
        <button 
          onClick={() => {
            const newSize = fontSize + 1;
            if (setFontSize) setFontSize(newSize);
            applyStyleToSelection('INLINE_SIZE', newSize);
          }} 
          style={{ background: '#444', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold' }}
          title="సైజ్ పెంచండి (+)"
        >
          +
        </button>
      </div>

      {/* 2. మూడు రకాల బోల్డ్ ఆప్షన్లు */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontWeight: 'bold', color: '#ff4444' }}>బోల్డ్:</span>
        
        <button 
          onClick={() => applyStyleToSelection('EXTRA_BOLD')} 
          style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px', fontWeight: '900', fontSize: '12px' }}
          title="ఎక్స్‌ట్రా బోల్డ్ (హెడ్‌లైన్ కోసం)"
        >
          Extra Bold
        </button>

        <button 
          onClick={() => applyStyleToSelection('MEDIUM_BOLD')} 
          style={{ background: '#555', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px', fontWeight: '600', fontSize: '12px' }}
          title="మీడియం బోల్డ్ (సబ్-హెడ్‌లైన్ కోసం)"
        >
          Medium Bold
        </button>

        <button 
          onClick={() => applyStyleToSelection('NORMAL')} 
          style={{ background: '#444', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'normal', fontSize: '12px' }}
          title="సాధారణ అక్షరాలు (బాడీ టెక్స్ట్ కోసం)"
        >
          Normal
        </button>
      </div>

      {/* 3. అలైన్‌మెంట్ ఆప్షన్లు (Left, Center, Right) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontWeight: 'bold', color: '#ff4444' }}>అలైన్:</span>
        <button 
          onClick={() => applyStyleToSelection('ALIGN', 'justifyLeft')} 
          style={{ background: '#444', color: '#fff', border: 'none', padding: '5px 9px', cursor: 'pointer', borderRadius: '3px', fontSize: '12px' }}
          title="ఎడమ వైపు (Left)"
        >
          ⬅ Left
        </button>
        <button 
          onClick={() => applyStyleToSelection('ALIGN', 'justifyCenter')} 
          style={{ background: '#444', color: '#fff', border: 'none', padding: '5px 9px', cursor: 'pointer', borderRadius: '3px', fontSize: '12px' }}
          title="మధ్యకు (Center)"
        >
          ↔ Center
        </button>
        <button 
          onClick={() => applyStyleToSelection('ALIGN', 'justifyRight')} 
          style={{ background: '#444', color: '#fff', border: 'none', padding: '5px 9px', cursor: 'pointer', borderRadius: '3px', fontSize: '12px' }}
          title="కుడి వైపు (Right)"
        >
          Right ➡
        </button>
      </div>

    </div>
  );
}
