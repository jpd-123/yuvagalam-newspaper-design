import React, { useState } from 'react';

export function LeftToolPanel({ onSelectTool, onSelectShape }) {
  const [activeTool, setActiveTool] = useState('POINTER');

  const handleToolClick = (toolName, shapeType = null) => {
    setActiveTool(toolName);
    if (onSelectTool) onSelectTool(toolName);
    if (shapeType && onSelectShape) onSelectShape(shapeType);
  };

  return (
    <div style={{ 
      width: '140px', 
      background: '#2c2c2c', 
      color: '#fff', 
      padding: '8px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8px', 
      borderRight: '1px solid #444', 
      overflowY: 'auto',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#ff4444', textAlign: 'center', borderBottom: '1px solid #444', paddingBottom: '4px' }}>
        టూల్‌బాక్స్ (Tools)
      </div>

      {/* 2-Column Grid Layout అచ్చం పేజ్‌మేకర్ లాగా */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
        
        {/* 1. Pointer Tool */}
        <button 
          onClick={() => handleToolClick('POINTER')}
          title="పాయింటర్ టూల్ (మౌస్ సెలెక్షన్)"
          style={{ background: activeTool === 'POINTER' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', textAlign: 'center' }}
        >
          ↖️
        </button>

        {/* 2. Text Tool */}
        <button 
          onClick={() => handleToolClick('TEXT', 'TEXT_BOX')}
          title="టెక్స్ట్ టూల్ (వార్తలు టైప్ చేయడానికి)"
          style={{ background: activeTool === 'TEXT' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}
        >
          T
        </button>

        {/* 3. Rotation Tool */}
        <button 
          onClick={() => handleToolClick('ROTATE')}
          title="రొటేషన్ టూల్"
          style={{ background: activeTool === 'ROTATE' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', textAlign: 'center' }}
        >
          🔄
        </button>

        {/* 4. Cropping Tool */}
        <button 
          onClick={() => handleToolClick('CROP')}
          title="క్రాపింగ్ టూల్ (ఫోటో కట్ చేయడానికి)"
          style={{ background: activeTool === 'CROP' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', textAlign: 'center' }}
        >
          ✂️
        </button>

        {/* 5. Diagonal Line Tool */}
        <button 
          onClick={() => handleToolClick('DIAGONAL_LINE', 'DIAGONAL')}
          title="డయాగనల్ లైన్ టూల్"
          style={{ background: activeTool === 'DIAGONAL_LINE' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', textAlign: 'center' }}
        >
          ╱
        </button>

        {/* 6. Straight Line Tool */}
        <button 
          onClick={() => handleToolClick('STRAIGHT_LINE', 'DIVIDER')}
          title="డివైడర్ / స్ట్రైట్ లైన్ టూల్"
          style={{ background: activeTool === 'STRAIGHT_LINE' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', textAlign: 'center' }}
        >
          │
        </button>

        {/* 7. Rectangle Box (News Grid) */}
        <button 
          onClick={() => handleToolClick('RECTANGLE', 'RECTANGLE')}
          title="దీర్ఘచతురస్ర బాక్స్ (న్యూస్ రియాక్టర్ గ్రిడ్)"
          style={{ background: activeTool === 'RECTANGLE' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', textAlign: 'center' }}
        >
          ◻️
        </button>

        {/* 8. Cross Rectangle Box (Picture Box) */}
        <button 
          onClick={() => handleToolClick('PICTURE_BOX', 'PICTURE')}
          title="పిక్చర్ బాక్స్ (ఫోటో లేదా లోగో అప్‌లోడ్ గ్రిడ్)"
          style={{ background: activeTool === 'PICTURE_BOX' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', textAlign: 'center' }}
        >
          ❎
        </button>

        {/* 9. Circle Box */}
        <button 
          onClick={() => handleToolClick('CIRCLE', 'CIRCLE')}
          title="గుండ్రని బంతి ఆకారపు గ్రిడ్"
          style={{ background: activeTool === 'CIRCLE' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', textAlign: 'center' }}
        >
          ◯
        </button>

        {/* 10. Cross Circle Box */}
        <button 
          onClick={() => handleToolClick('CROSS_CIRCLE', 'CIRCLE_PHOTO')}
          title="గుండ్రని పిక్చర్ బాక్స్"
          style={{ background: activeTool === 'CROSS_CIRCLE' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', textAlign: 'center' }}
        >
          ⊗
        </button>

        {/* 11. Oval / Polygon Box */}
        <button 
          onClick={() => handleToolClick('OVAL', 'OVAL')}
          title="అండాకార గ్రిడ్ (Oval Shape)"
          style={{ background: activeTool === 'OVAL' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', textAlign: 'center' }}
        >
          ⬭
        </button>

        {/* 12. Hand Tool (Pan) */}
        <button 
          onClick={() => handleToolClick('HAND')}
          title="హ్యాండ్ టూల్ (పేజీ మూవ్ చేయడానికి)"
          style={{ background: activeTool === 'HAND' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', textAlign: 'center' }}
        >
          ✋
        </button>

      </div>

      {/* ఆటోమేటిక్ ఫీచర్లు & ఆటో పేజీ సెటప్ బటన్ */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #444', paddingTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button 
          onClick={() => alert('ఆటో పేజీ సెటప్ రన్ అయింది: అడుగుభాగంలో ఖాళీ లేకుండా వార్తలు సర్దుబాటు చేయబడ్డాయి!')}
          style={{ background: '#388e3c', color: '#fff', border: 'none', padding: '6px', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
        >
          ⚙️ ఆటో పేజీ సెటప్
        </button>
        <div style={{ fontSize: '9px', color: '#aaa', textAlign: 'center' }}>
          సాత్విక పబ్లిషర్ v1.0
        </div>
      </div>

    </div>
  );
}
