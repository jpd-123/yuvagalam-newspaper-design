import React, { useState } from 'react';

export function LeftToolPanel({ onSelectTool, onSelectShape, onPageSizeChange, onPageCountChange, onAutoPageSetup }) {
  const [activeTool, setActiveTool] = useState('POINTER');
  const [paperSize, setPaperSize] = useState('బ్రాడ్ షీట్');
  const [pageCount, setPageCount] = useState(1);
  const [selectedBullet, setSelectedBullet] = useState('none');

  const handleToolClick = (toolName, shapeType = null) => {
    setActiveTool(toolName);
    if (onSelectTool) onSelectTool(toolName);
    if (onSelectShape) onSelectShape(shapeType);
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

      {/* 2-Column Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
        
        <button 
          onClick={() => handleToolClick('POINTER', null)}
          title="పాయింటర్ టూల్ (మౌస్ సెలెక్షన్ & మూవింగ్)"
          style={{ background: activeTool === 'POINTER' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}
        >
          ↖️
        </button>

        <button 
          onClick={() => handleToolClick('TEXT', null)}
          title="టెక్స్ట్ ఎడిటింగ్ టూల్ (T)"
          style={{ background: activeTool === 'TEXT' ? '#d32f2f' : '#3a3a3a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' }}
        >
          T
import React, { useState } from 'react';
import { BULLET_STYLES, DARK_COLORS, LIGHT_COLORS } from '../../constants/themeConstants';

export const LeftToolPanel = ({
  onSelectTool,
  onSelectShape,
  onPageSizeChange,
  onPageCountChange,
  onAutoPageSetup,
  onColorSelect
}) => {
  const [selectedBullet, setSelectedBullet] = useState(BULLET_STYLES?.[0] || '•');

  const darkPalette = ['#000000', ...(DARK_COLORS || [])];
  const lightPalette = ['#ffffff', ...(LIGHT_COLORS || [])];

  const handleBulletChange = (e) => {
    const bulletChar = e.target.value;
    setSelectedBullet(bulletChar);
    window.dispatchEvent(
      new CustomEvent('SATHVIKA_INSERT_BULLET', { detail: { bullet: bulletChar } })
    );
  };

  return (
    <div
      onMouseDown={(e) => {
        if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'OPTION') {
          e.preventDefault();
        }
      }}
      style={{
        width: '230px',
        background: '#2c2c2c',
        color: '#fff',
        padding: '12px',
        borderRight: '1px solid #444',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        fontSize: '12px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <button
          onClick={() => {
            if (onSelectTool) onSelectTool('TEXT');
          }}
          style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          T (టెక్స్ట్)
        </button>
        <button
          onClick={() => {
            if (onSelectTool) onSelectTool('POINTER');
            if (onSelectShape) onSelectShape(null);
          }}
          style={{ background: '#444', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ↖ పాయింటర్
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <button
          onClick={() => {
            if (onSelectShape) onSelectShape('HEADLINE');
            if (onSelectTool) onSelectTool('HEADLINE_BOX');
          }}
          style={{ background: '#3d3d3d', color: '#fff', border: '1px solid #555', padding: '7px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          H1 హెడ్‌లైన్
        </button>
        <button
          onClick={() => {
            if (onSelectShape) onSelectShape('SUB_HEADLINE');
            if (onSelectTool) onSelectTool('SUB_HEADLINE_BOX');
          }}
          style={{ background: '#3d3d3d', color: '#fff', border: '1px solid #555', padding: '7px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          H2 సబ్‌హెడ్‌లైన్
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <button
          onClick={() => {
            if (onSelectShape) onSelectShape('RECTANGLE');
            if (onSelectTool) onSelectTool('SHAPE');
          }}
          style={{ background: '#3d3d3d', color: '#fff', border: '1px solid #555', padding: '7px', borderRadius: '4px', cursor: 'pointer' }}
        >
          ▭ వార్త గ్రిడ్
        </button>
        <button
          onClick={() => {
            if (onSelectShape) onSelectShape('PICTURE');
            if (onSelectTool) onSelectTool('SHAPE');
          }}
          style={{ background: '#3d3d3d', color: '#fff', border: '1px solid #555', padding: '7px', borderRadius: '4px', cursor: 'pointer' }}
        >
          🖼 ఫోటో బాక్స్
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <button
          onClick={() => {
            if (onSelectShape) onSelectShape('CIRCLE_PHOTO');
            if (onSelectTool) onSelectTool('SHAPE');
          }}
          style={{ background: '#3d3d3d', color: '#fff', border: '1px solid #555', padding: '7px', borderRadius: '4px', cursor: 'pointer' }}
        >
          ⊗ రౌండ్ ఫోటో
        </button>
        <button
          onClick={() => {
            if (onSelectShape) onSelectShape('DIVIDER');
            if (onSelectTool) onSelectTool('SHAPE');
          }}
          style={{ background: '#3d3d3d', color: '#fff', border: '1px solid #555', padding: '7px', borderRadius: '4px', cursor: 'pointer' }}
        >
          — డివైడర్
        </button>
      </div>

      {/* బుల్లెట్ గుర్తులు (6 రకాలు) */}
      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          బుల్లెట్ గుర్తులు (సబ్-హెడ్‌లైన్):
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          <select
            value={selectedBullet}
            onChange={handleBulletChange}
            style={{ flex: 1, padding: '5px', background: '#1e1e1e', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          >
            {(BULLET_STYLES || ['•', '▪', '▸', '❖', '✦', '➤']).map((b, i) => (
              <option key={i} value={b}>
                {b} బుల్లెట్ ({i + 1})
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent('SATHVIKA_INSERT_BULLET', { detail: { bullet: selectedBullet } })
              )
            }
            title="సెలెక్ట్ చేసిన సబ్-హెడ్‌లైన్ ముందు బుల్లెట్ వేయండి"
            style={{ background: '#1976d2', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            +
          </button>
        </div>
      </div>

      {/* పేపర్ సైజ్ & పేజీల సంఖ్య */}
      <div>
        <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold' }}>పేపర్ సైజ్:</label>
        <select
          onChange={(e) => onPageSizeChange && onPageSizeChange(e.target.value)}
          style={{ width: '100%', padding: '5px', background: '#1e1e1e', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
        >
          <option value="BROADSHEET">బ్రాడ్ షీట్</option>
          <option value="A3 సైజ్">A3 సైజ్</option>
          <option value="మీడియం సైజ్">మీడియం సైజ్</option>
          <option value="జిల్లా టాబ్లెట్">జిల్లా టాబ్లెట్</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold' }}>పేజీలు (1-16):</label>
        <select
          onChange={(e) => onPageCountChange && onPageCountChange(Number(e.target.value))}
          style={{ width: '100%', padding: '5px', background: '#1e1e1e', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
        >
          {[...Array(16)].map((_, idx) => (
            <option key={idx + 1} value={idx + 1}>{idx + 1} పేజీ</option>
          ))}
        </select>
      </div>

      {/* ముదురు రంగులు (బ్లాక్ కలర్‌తో సహా) */}
      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>ముదురు రంగులు (బ్లాక్ సహా):</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
          {darkPalette.map((color, i) => (
            <div
              key={i}
              onClick={() => onColorSelect && onColorSelect('DARK', color)}
              title={color === '#000000' ? 'బ్లాక్ కలర్' : color}
              style={{ width: '100%', height: '22px', background: color, border: '1px solid #777', cursor: 'pointer', borderRadius: '2px' }}
            />
          ))}
        </div>
      </div>

      {/* లేత రంగులు (వైట్ కలర్‌తో సహా) */}
      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>లేత రంగులు (వైట్ సహా):</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
          {lightPalette.map((color, i) => (
            <div
              key={i}
              onClick={() => onColorSelect && onColorSelect('LIGHT', color)}
              title={color === '#ffffff' ? 'వైట్ కలర్' : color}
              style={{ width: '100%', height: '22px', background: color, border: '1px solid #777', cursor: 'pointer', borderRadius: '2px' }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => onAutoPageSetup && onAutoPageSetup()}
        style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '4px' }}
      >
        ఆటో పేజీ సెటప్ (Auto Fit)
      </button>
    </div>
  );
};
