import React, { useState } from 'react';

export function LeftToolPanel({ onSelectTool, onSelectShape, onPageSizeChange, onPageCountChange, onAutoPageSetup }) {
  const [activeTool, setActiveTool] = useState('POINTER');
  const [paperSize, setPaperSize] = useState('బ్రాడ్ షీట్');
  const [pageCount, setPageCount] = useState(1);
  const [selectedBullet, setSelectedBullet] = useState('none');

  const handleToolClick = (toolName, shapeType = null) => {
    setActiveTool(toolName);
    if (onSelectTool) onSelectTool(toolName);
    if (shapeType && onSelectShape) onSelectShape(shapeType);
  };

  return (
    <div style={{ 
      width: '180px', 
      background: '#2c2c2c', 
      color: '#fff', 
      padding: '10px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '10px', 
      borderRight: '1px solid #444', 
      overflowY: 'auto',
      fontFamily: 'sans-serif',
      fontSize: '12px'
    }}>
      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff4444', textAlign: 'center', borderBottom: '1px solid #444', paddingBottom: '4px' }}>
        మాస్టర్ టూల్‌బాక్స్
      </div>

      {/* 1 & 2. పేపర్ సైజ్ మరియు పేజీల సంఖ్య సెలెక్టర్లు */}
      <div style={{ background: '#3a3a3a', padding: '6px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div>
          <label style={{ fontSize: '10px', color: '#ffcc00', fontWeight: 'bold', display: 'block' }}>పేపర్ సైజ్:</label>
          <select 
            value={paperSize} 
            onChange={(e) => { setPaperSize(e.target.value); if(onPageSizeChange) onPageSizeChange(e.target.value); }}
            style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #555', padding: '3px', fontSize: '11px', borderRadius: '3px' }}
          >
            <option value="బ్రాడ్ షీట్">బ్రాడ్ షీట్</option>
            <option value="మీడియం సైజ్">మీడియం సైజ్</option>
            <option value="A3 సైజ్">A3 సైజ్</option>
            <option value="జిల్లా టాబ్లెట్">జిల్లా టాబ్లెట్ షీట్</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '10px', color: '#ffcc00', fontWeight: 'bold', display: 'block' }}>పేజీలు (1-16):</label>
          <select 
            value={pageCount} 
            onChange={(e) => { setPageCount(e.target.value); if(onPageCountChange) onPageCountChange(e.target.value); }}
            style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #555', padding: '3px', fontSize: '11px', borderRadius: '3px' }}
          >
            {[...Array(16)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} పేజీ</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2-Column Grid Layout అచ్చం పేజ్‌మేకర్ లాగా */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
        
        {/* Pointer Tool */}
        <button 
          onClick={() => handleToolClick('POINTER')}
          title="పాయింటర్ టూల్ (మౌస్ సెలెక్షన్)"
          style={{ background: activeTool === 'POINTER' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}
        >
          ↖️
        </button>

        {/* Text Tool */}
        <button 
          onClick={() => handleToolClick('TEXT', 'TEXT_BOX')}
          title="టెక్స్ట్ టూల్"
          style={{ background: activeTool === 'TEXT' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' }}
        >
          T
        </button>

        {/* 3. న్యూ రియాక్టర్ గ్రిడ్ (Rectangle Box) */}
        <button 
          onClick={() => handleToolClick('RECTANGLE', 'RECTANGLE')}
          title="న్యూ రియాక్టర్ గ్రిడ్ (వార్త బాక్స్)"
          style={{ background: activeTool === 'RECTANGLE' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}
        >
          ◻️
        </button>

        {/* 7 & 8. పిక్చర్ బాక్స్ (Photo Grid / Logo) */}
        <button 
          onClick={() => handleToolClick('PICTURE_BOX', 'PICTURE')}
          title="పిక్చర్ బాక్స్ (ఫోటో / లోగో అప్‌లోడ్)"
          style={{ background: activeTool === 'PICTURE_BOX' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}
        >
          ❎
        </button>

        {/* 8. గుండ్రని బంతి ఆకారపు ఫోటో బాక్స్ (Circle Photo Box) */}
        <button 
          onClick={() => handleToolClick('CROSS_CIRCLE', 'CIRCLE_PHOTO')}
          title="గుండ్రని బంతి ఆకారపు ఫోటో గ్రిడ్"
          style={{ background: activeTool === 'CROSS_CIRCLE' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}
        >
          ⊗
        </button>

        {/* 4. అండర్‌లైన్ / స్ట్రైట్ లైన్ టూల్ */}
        <button 
          onClick={() => handleToolClick('STRAIGHT_LINE', 'DIVIDER')}
          title="అండర్‌లైన్ / డివైడర్ గీత"
          style={{ background: activeTool === 'STRAIGHT_LINE' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}
        >
          │
        </button>

        {/* 6. చతురస్ర బోర్డర్ గ్రిడ్ (Highlight Border Box) */}
        <button 
          onClick={() => handleToolClick('BORDER_BOX', 'BORDER')}
          title="హైలైట్ వార్త బోర్డర్ బాక్స్"
          style={{ background: activeTool === 'BORDER_BOX' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}
        >
          🔲
        </button>

        {/* Oval / Polygon Box */}
        <button 
          onClick={() => handleToolClick('OVAL', 'OVAL')}
          title="అండాకార గ్రిడ్"
          style={{ background: activeTool === 'OVAL' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}
        >
          ⬭
        </button>

      </div>

      {/* 5. 6 రకాల బుల్లెట్లు సెలెక్షన్ */}
      <div style={{ background: '#3a3a3a', padding: '6px', borderRadius: '4px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '10px', display: 'block', marginBottom: '3px', color: '#ffcc00' }}>బుల్లెట్ గుర్తులు (6 రకాలు):</span>
        <select 
          value={selectedBullet} 
          onChange={(e) => setSelectedBullet(e.target.value)}
          style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #555', padding: '3px', fontSize: '11px', borderRadius: '3px' }}
        >
          <option value="none">బుల్లెట్లు ఎంచుకోండి</option>
          <option value="bullet1">1. చతురస్రం (■)</option>
          <option value="bullet2">2. సర్కిల్ (●)</option>
          <option value="bullet3">3. డైమండ్ (◆)</option>
          <option value="bullet4">4. ఆరో (▶)</option>
          <option value="bullet5">5. స్టార్ (★)</option>
          <option value="bullet6">6. టిక్ (✔)</option>
        </select>
      </div>

      {/* 9. ఆటో పేజీ సెటప్ (Auto Fit Engine) బటన్ */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #444', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button 
          onClick={() => {
            if (onAutoPageSetup) onAutoPageSetup();
            alert('ఆటో పేజీ సెటప్ విజయవంతం! పేజీ అడుగుభాగంలో ఖాళీ లేకుండా హెడ్‌లైన్ మరియు ఫోటో సైజ్‌లు నిష్పత్తి ప్రకారం సర్దుబాటు చేయబడ్డాయి.');
          }}
          style={{ background: '#388e3c', color: '#fff', border: 'none', padding: '8px', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
          title="పేజీలో గ్యాప్ లేకుండా హెడ్‌లైన్ & ఫోటో సైజులను ఆటోమేటిక్‌గా సర్దుబాటు చేస్తుంది"
        >
          ⚙️ ఆటో పేజీ సెటప్ (Auto Fit)
        </button>
        <div style={{ fontSize: '9px', color: '#aaa', textAlign: 'center' }}>
          సాత్విక పబ్లిషర్ v1.0
        </div>
      </div>

    </div>
  );
}
