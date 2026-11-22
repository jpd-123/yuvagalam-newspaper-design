import React from 'react';
import { DARK_COLORS, LIGHT_COLORS, ESSENTIAL_FONTS } from '../../constants/themeConstants';

export const RightStylePanel = ({ onColorSelect, onFontSelect, selectedFont = 'Gidugu' }) => {
  return (
    <div style={{ width: '250px', background: '#f4f4f4', borderLeft: '1px solid #ddd', padding: '15px', height: '100vh', boxSizing: 'border-box', overflowY: 'auto' }}>
      <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
        స్టైల్ & కలర్ ప్యానెల్
      </h4>

      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>తెలుగు ఫాంట్ స్టైల్:</label>
      <select 
        value={selectedFont}
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => onFontSelect(e.target.value)} 
        style={{ width: '100%', marginBottom: '12px', padding: '5px' }}
      >
        {ESSENTIAL_FONTS.map((font, idx) => (
          <option key={idx} value={font}>{font}</option>
        ))}
      </select>

      {/* బ్లాక్ & వైట్ అక్షరాల రంగు బటన్లు */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onColorSelect('DARK', '#000000', 'TEXT_ONLY')}
          style={{ flex: 1, background: '#000000', color: '#ffffff', border: '1px solid #333', padding: '5px', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          బ్లాక్ టెక్స్ట్
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onColorSelect('LIGHT', '#ffffff', 'TEXT_ONLY')}
          style={{ flex: 1, background: '#ffffff', color: '#000000', border: '1px solid #666', padding: '5px', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          వైట్ టెక్స్ట్
        </button>
      </div>

      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>ముదురు రంగులు (బాక్స్ BG / అక్షరాలు):</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px', marginBottom: '15px' }}>
        {DARK_COLORS.map((color, idx) => (
          <div 
            key={idx} 
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onColorSelect('DARK', color)} 
            style={{ width: '30px', height: '30px', background: color, cursor: 'pointer', border: '1px solid #000' }} 
            title="ముదురు రంగు: బాక్స్ BG లేదా టెక్స్ట్ కలర్ మారుతుంది (డార్క్ BG అయితే టెక్స్ట్ వైట్ అవుతుంది)"
          />
        ))}
      </div>

      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>లేత రంగులు (గ్రిడ్ బ్యాక్‌గ్రౌండ్):</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px' }}>
        {LIGHT_COLORS.map((color, idx) => (
          <div 
            key={idx} 
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onColorSelect('LIGHT', color)} 
            style={{ width: '30px', height: '30px', background: color, cursor: 'pointer', border: '1px solid #000' }} 
            title="సెలెక్ట్ చేసిన గ్రిడ్ బాక్స్‌కి బ్యాక్‌గ్రౌండ్ మారుతుంది"
          />
        ))}
      </div>
    </div>
  );
};
