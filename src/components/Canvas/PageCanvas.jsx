import React from 'react';

export default function PageCanvas({ 
  pageTitle, 
  children, 
  bgColor = '#ffffff', 
  selectedFont = 'Gidugu', 
  dimensions = { width: '820px', minHeight: '1160px' },
  onCanvasClick,
  canvasElements = [],
  selectedElementId,
  onSelectElement,
  fontSize = 12
}) {
  return (
    <div style={{ flex: 1, background: '#444', overflowY: 'auto', padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div 
        onClick={onCanvasClick}
        style={{ 
          width: dimensions.width, 
          minHeight: dimensions.minHeight, 
          background: bgColor, 
          boxShadow: '0 0 20px rgba(0,0,0,0.6)', 
          padding: '20px',
          fontFamily: selectedFont,
          boxSizing: 'border-box',
          position: 'relative',
          cursor: 'crosshair'
        }}
      >
        {/* ఎలాంటి ముందస్తు అక్షరాలు లేదా డమ్మీ మెసేజ్‌లు లేకుండా పూర్తిగా ఖాళీగా ఉండే క్లీన్ వైట్ పేపర్ */}
        {children}

        {/* యూజర్ మ్యాన్యువల్‌గా లేదా ఆటోమేటిక్‌గా గీసిన గ్రిడ్స్ / ఎలిమెంట్స్ */}
        {canvasElements.map((el) => (
          <div
            key={el.id}
            onClick={(e) => { e.stopPropagation(); if(onSelectElement) onSelectElement(el.id); }}
            style={{
              position: 'absolute',
              left: `${el.x}px`,
              top: `${el.y}px`,
              width: `${el.width}px`,
              height: `${el.height}px`,
              border: selectedElementId === el.id ? '2px solid #d32f2f' : '1px solid #888',
              background: el.type === 'PICTURE' || el.type === 'CIRCLE_PHOTO' ? '#f0f0f0' : 'transparent',
              color: el.color,
              borderRadius: el.type === 'CIRCLE' || el.type === 'CIRCLE_PHOTO' ? '50%' : el.type === 'OVAL' ? '50% / 30%' : '0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px',
              boxSizing: 'border-box'
            }}
          >
            {el.type === 'PICTURE' && <span style={{ fontSize: '11px', color: '#555' }}>❎ పిక్చర్ బాక్స్</span>}
            {el.type === 'CIRCLE_PHOTO' && <span style={{ fontSize: '10px', color: '#555' }}>⊗ సర్కిల్ ఫోటో</span>}
            {el.type === 'DIVIDER' && <div style={{ width: '100%', height: '2px', background: el.color }} />}
            {el.type === 'RECTANGLE' && (
              <textarea 
                defaultValue={el.text}
                style={{ width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', resize: 'none', color: el.color, fontFamily: selectedFont, fontSize: `${fontSize}pt` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
