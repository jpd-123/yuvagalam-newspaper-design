import React, { useState } from 'react';
import { generateCustomPDF } from '../../utils/pdfGenerator';

export const ExportPdfModal = ({ pageRef, onClose }) => {
  const [selectedMb, setSelectedMb] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (mode) => {
    setLoading(true);
    await generateCustomPDF(pageRef.current, mode, selectedMb);
    setLoading(false);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
      <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '420px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
        <h3 style={{ marginTop: 0, color: '#004080', borderBottom: '2px solid #004080', paddingBottom: '8px' }}>
          📄 సాత్విక PDF జనరేటర్
        </h3>

        <div style={{ margin: '20px 0' }}>
          <button 
            onClick={() => handleGenerate('PRINTING')}
            disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#008800', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            1. ప్రింటింగ్ ప్రెస్ PDF (High Res A3 Vector)
          </button>
        </div>

        <hr />

        <div style={{ margin: '20px 0' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>2. సోషల్ మీడియా PDF (HD Text Crispness)</h4>
          <label style={{ fontSize: '13px' }}>కావలసిన PDF ఫైల్ సైజ్: <strong style={{ color: '#d65a00' }}>{selectedMb} MB</strong></label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={selectedMb} 
            onChange={(e) => setSelectedMb(e.target.value)}
            style={{ width: '100%', margin: '10px 0' }}
          />
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
            * అక్షరాల క్వాలిటీ దెబ్బతినకుండా, ఫోటో సైజ్ కంప్రెషన్ ద్వారా ఫైల్ సైజ్ కంట్రోల్ చేయబడుతుంది.
          </div>
          <button 
            onClick={() => handleGenerate('SOCIAL_MEDIA')}
            disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#d65a00', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            {loading ? 'జనరేట్ అవుతోంది...' : `సోషల్ మీడియా PDF జనరేట్ చేయి (${selectedMb}MB)`}
          </button>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose} style={{ padding: '6px 15px', background: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            క్యాన్సిల్
          </button>
        </div>
      </div>
    </div>
  );
};
