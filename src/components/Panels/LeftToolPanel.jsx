import React from 'react';

export function LeftToolPanel({ onSelectShape }) {
  return (
    <div style={{ width: '260px', background: '#2c2c2c', color: '#fff', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', borderRight: '1px solid #444', overflowY: 'auto', fontSize: '12px' }}>
      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ff4444', borderBottom: '1px solid #444', paddingBottom: '4px' }}>
        లెఫ్ట్ ప్యానెల్ (2-కాలమ్ టూల్స్)
      </div>

      {/* 2-కాలమ్ గ్రిడ్ లేఅవుట్ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        
        {/* 1. లెఫ్ట్ కాలమ్ - పేపర్ సైజ్ */}
        <div style={{ background: '#3a3a3a', padding: '6px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontWeight: 'bold', color: '#ffcc00', fontSize: '11px' }}>పేపర్ సైజ్</span>
          <select style={{ background: '#222', color: '#fff', border: '1px solid #555', padding: '3px', fontSize: '11px', borderRadius: '3px' }}>
            <option>బ్రాడ్ షీట్</option>
            <option>మీడియం సైజ్</option>
            <option>A3 సైజ్</option>
            <option>జిల్లా టాబ్లెట్</option>
          </select>
        </div>

        {/* 2. రైట్ కాలమ్ - నంబర్స్ ఆఫ్ పేజీలు */}
        <div style={{ background: '#3a3a3a', padding: '6px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontWeight: 'bold', color: '#ffcc00', fontSize: '11px' }}>పేజీలు (1-16)</span>
          <select style={{ background: '#222', color: '#fff', border: '1px solid #555', padding: '3px', fontSize: '11px', borderRadius: '3px' }}>
            {[...Array(16)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} వ పేజీ</option>
            ))}
          </select>
        </div>

      </div>

      {/* టూల్స్ ఐకాన్లు & ఆప్షన్లు */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '5px' }}>
        
        <button 
          onClick={() => onSelectShape('RECTANGLE')}
          style={{ background: '#444', color: '#fff', border: 'none', padding: '6px', textAlign: 'left', borderRadius: '3px', cursor: 'pointer' }}
          title="న్యూ రియాక్టర్ గ్రిడ్ (వార్త బాక్స్)"
        >
          📄 న్యూ రియాక్టర్ గ్రిడ్
        </button>

        <button 
          onClick={() => onSelectShape('DIVIDER')}
          style={{ background: '#444', color: '#fff', border: 'none', padding: '6px', textAlign: 'left', borderRadius: '3px', cursor: 'pointer' }}
          title="అండర్‌లైన్ / డివైడర్ గీత"
        >
          📏 అండర్‌లైన్ / గీత
        </button>

        <button 
          onClick={() => onSelectShape('BORDER_BOX')}
          style={{ background: '#444', color: '#fff', border: 'none', padding: '6px', textAlign: 'left', borderRadius: '3px', cursor: 'pointer' }}
          title="హైలైట్ వార్త బోర్డర్"
        >
          🔲 చతురస్ర బోర్డర్ గ్రిడ్
        </button>

        {/* 6 రకాల బుల్లెట్లు */}
        <div style={{ background: '#3a3a3a', padding: '6px', borderRadius: '4px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '11px', display: 'block', marginBottom: '3px' }}>బుల్లెట్ గుర్తులు (6 రకాలు)</span>
          <select style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #555', padding: '3px', fontSize: '11px', borderRadius: '3px' }}>
            <option>బుల్లెట్ గుర్తు 1 (■)</option>
            <option>బుల్లెట్ గుర్తు 2 (●)</option>
            <option>బుల్లెట్ గుర్తు 3 (◆)</option>
            <option>బుల్లెట్ గుర్తు 4 (▶)</option>
            <option>బుల్లెట్ గుర్తు 5 (★)</option>
            <option>బుల్లెట్ గుర్తు 6 (✔)</option>
          </select>
        </div>

        {/* ఆటో పేజీ సెటప్ బటన్ */}
        <button 
          onClick={() => alert('ఆటో పేజీ సెటప్ రన్ అవుతోంది: ఖాళీలు లేかండా వార్తలు సర్దుబాటు చేయబడుతున్నాయి!')}
          style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '8px', textAlign: 'center', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold', marginTop: '5px' }}
          title="పేజీ అడుగుభాగంలో ఖాళీ లేకుండా ఆటోమేటిక్‌గా సర్దుబాటు చేస్తుంది"
        >
          ⚙️ ఆటో పేజీ సెటప్ (Auto Fit)
        </button>

      </div>

      <div style={{ fontSize: '10px', color: '#aaa', marginTop: 'auto', borderTop: '1px solid #444', paddingTop: '6px', textAlign: 'center' }}>
        పేజ్‌మేకర్ 7.0 మాన్యువల్ మోడ్
      </div>
    </div>
  );
}
