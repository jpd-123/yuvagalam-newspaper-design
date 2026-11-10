import React from 'react';
import { getWrapStyle } from '../../utils/gridEngine'; // గ్రిడ్ ఇంజిన్ నుండి రాపింగ్ స్టైల్స్ ఇంపోర్ట్ చేయడం
import { getNewspaperDate } from '../../utils/dateEngine'; // ఆటోమేటిక్ డేట్ ఇంజిన్ ఇంపోర్ట్ చేయడం

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
  // ఆటోమేటిక్‌గా రేపటి తేదీ మరియు వారాన్ని పొందడం
  const { dateString } = getNewspaperDate();

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
        {/* పత్రిక హెడర్ / మాస్ట్ హెడ్ వద్ద ఆటోమేటిక్ తేదీ & సంపుటి డిస్ప్లే */}
        <div style={{ borderBottom: '2px solid #333', paddingBottom: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
          <div>సంపుటి: 1 | సంచిక: 12</div>
          <div style={{ color: '#d32f2f', fontSize: '14px' }}>{pageTitle || "యువగళం దినపత్రిక"}</div>
          <div>తేదీ: {dateString}</div>
        </div>

        {/* ఎలాంటి ముందస్తు అక్షరాలు లేదా డమ్మీ మెసేజ్‌లు లేకుండా పూర్తిగా ఖాళీగా ఉండే క్లీన్ వైట్ పేపర్ */}
        {children}

        {/* యూజర్ మ్యాన్యువల్‌గా లేదా మొబైల్ అప్‌లోడ్ ద్వారా వచ్చిన గ్రిడ్స్ / ఎలిమెంట్స్ */}
        {canvasElements.map((el) => {
          // ఫోటో నిలువుగా ఉంటే L-షేప్ రాపింగ్ లేదా సాధారణ రాపింగ్ స్టైల్ వర్తింపజేయడం
          const wrapStyle = (el.type === 'PICTURE' || el.type === 'CIRCLE_PHOTO')
            ? getWrapStyle(el.wrapMode || 'FLOAT_LEFT', el.shapeType || 'RECTANGLE', el.isVerticalPhoto)
            : {};

          return (
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
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px',
                boxSizing: 'border-box',
                ...wrapStyle // L-షేప్ మరియు ఫ్లోటింగ్ స్టైల్స్ ఇక్కడ అప్లై అవుతాయి
              }}
            >
              {el.type === 'PICTURE' && (
                <span style={{ fontSize: '11px', color: '#555', textAlign: 'center' }}>
                  {el.isVerticalPhoto ? '📐 నిలువు ఫోటో (L-Shape)' : '❎ పిక్చర్ బాక్స్'}
                </span>
              )}
              {el.type === 'CIRCLE_PHOTO' && <span style={{ fontSize: '10px', color: '#555' }}>⊗ సర్కిల్ ఫోటో</span>}
              {el.type === 'DIVIDER' && <div style={{ width: '100%', height: '2px', background: el.color }} />}
              
              {el.type === 'RECTANGLE' && (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {el.headline && (
                    <div style={{ fontWeight: 'bold', fontSize: `${fontSize + 2}pt`, color: el.color, marginBottom: '2px' }}>
                      {el.headline}
                    </div>
                  )}
                  <textarea 
                    defaultValue={el.text}
                    style={{ 
                      width: '100%', 
                      flex: 1, 
                      border: 'none', 
                      outline: 'none', 
                      background: 'transparent', 
                      resize: 'none', 
                      color: el.color, 
                      fontFamily: selectedFont, 
                      fontSize: `${fontSize}pt` 
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
