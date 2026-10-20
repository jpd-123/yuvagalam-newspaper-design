import React from 'react';

export const LeftToolPanel = ({ onSelectShape }) => {
  return (
    <div style={{ width: '220px', background: '#2a2a2a', color: '#fff', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px', height: '100vh', boxSizing: 'border-box' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#ffcc00', borderBottom: '1px solid #444', paddingBottom: '5px' }}>
        డ్రాయింగ్ & షేప్ టూల్స్
      </h4>
      
      <button style={{ padding: '8px', background: '#444', color: '#fff', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
        📝 టెక్స్ట్ బాక్స్ టూల్
      </button>
      <button style={{ padding: '8px', background: '#444', color: '#fff', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
        🖼️ పిక్చర్ బాక్స్ టూల్
      </button>
      <button style={{ padding: '8px', background: '#444', color: '#fff', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
        📏 డివైడర్ లైన్ టూల్
      </button>

      <h5 style={{ margin: '15px 0 5px 0', color: '#00ffff' }}>వార్తా ఆకారాలు (News Shapes)</h5>
      <button onClick={() => onSelectShape('RECTANGLE')} style={{ padding: '6px', background: '#0055aa', color: '#fff', border: 'none', cursor: 'pointer' }}>
        1. చతురస్రం (Flexible)
      </button>
      <button onClick={() => onSelectShape('CIRCLE')} style={{ padding: '6px', background: '#0055aa', color: '#fff', border: 'none', cursor: 'pointer' }}>
        2. బంతి వార్త (Circle)
      </button>
      <button onClick={() => onSelectShape('OVAL')} style={{ padding: '6px', background: '#0055aa', color: '#fff', border: 'none', cursor: 'pointer' }}>
        3. కోడిగుడ్డు వార్త (Oval)
      </button>
      <button onClick={() => onSelectShape('HALF_OVAL_LEFT')} style={{ padding: '6px', background: '#0055aa', color: '#fff', border: 'none', cursor: 'pointer' }}>
        4. హాఫ్ ఓవల్ (Left)
      </button>
      <button onClick={() => onSelectShape('HALF_OVAL_RIGHT')} style={{ padding: '6px', background: '#0055aa', color: '#fff', border: 'none', cursor: 'pointer' }}>
        5. హాఫ్ ఓవల్ (Right)
      </button>
    </div>
  );
};
