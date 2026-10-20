import React from 'react';
import { DARK_COLORS, LIGHT_COLORS, ESSENTIAL_FONTS } from '../../constants/themeConstants';

export const RightStylePanel = ({ onColorSelect, onFontSelect }) => {
  return (
    <div style={{ width: '250px', background: '#f4f4f4', borderLeft: '1px solid #ddd', padding: '15px', height: '100vh', boxSizing: 'border-box', overflowY: 'auto' }}>
      <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
        స్టైల్ & కలర్ ప్యానెల్
      </h4>

      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>తెలుగు ఫాంట్ స్టైల్:</label>
      <select onChange={(e) => onFontSelect(e.target.value)} style={{ width: '100%', marginBottom: '15px', padding: '5px' }}>
        {ESSENTIAL_FONTS.map((font, idx) => (
          <option key={idx} value={font}>{font}</option>
        ))}
      </select>

      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>ముదురు రంగులు (హెడ్‌లైన్స్):</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px', marginBottom: '15px' }}>
        {DARK_COLORS.map((color, idx) => (
          <div 
            key={idx} 
            onClick={() => onColorSelect('DARK', color)} 
            style={{ width: '30px', height: '30px', background: color, cursor: 'pointer', border: '1px solid #000' }} 
          />
        ))}
      </div>

      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>లేత రంగులు (బ్యాక్‌గ్రౌండ్స్):</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px' }}>
        {LIGHT_COLORS.map((color, idx) => (
          <div 
            key={idx} 
            onClick={() => onColorSelect('LIGHT', color)} 
            style={{ width: '30px', height: '30px', background: color, cursor: 'pointer', border: '1px solid #000' }} 
          />
        ))}
      </div>
    </div>
  );
};
