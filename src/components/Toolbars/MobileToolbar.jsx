import React, { useState } from 'react';

export function MobileToolbar({ onUploadClick }) {
  const [headline, setHeadline] = useState('');
  const [subHeadline, setSubHeadline] = useState('');
  const [dateLine, setDateLine] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [selectedMaster, setSelectedMaster] = useState('MASTER_1');
  const [selectedPage, setSelectedPage] = useState('1');
  const [newsIndex, setNewsIndex] = useState('1');
  const [imageFile, setImageFile] = useState(null);

  const handleSaveNews = () => {
    alert(`వార్త విజయవంతంగా సేవ్ చేయబడింది!\nమాస్టర్: ${selectedMaster} | పేజీ: ${selectedPage} | వార్త నంబర్: ${newsIndex}`);
    if (onUploadClick) onUploadClick();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
      
      {/* హెడ్‌లైన్ ఇన్‌పుట్ */}
      <div>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
          హెడ్‌లైన్ (Headline):
        </label>
        <input 
          type="text" 
          value={headline} 
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="ఇక్కడ వార్త ప్రధాన శీర్షిక రాయండి..."
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>

      {/* సబ్ హెడ్‌లైన్ ఇన్‌పుట్ */}
      <div>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
          సబ్ హెడ్‌లైన్ (Sub-Headline):
        </label>
        <input 
          type="text" 
          value={subHeadline} 
          onChange={(e) => setSubHeadline(e.target.value)}
          placeholder="సబ్ హెడ్‌లైన్ ఇక్కడ ఇవ్వండి..."
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>

      {/* డేట్‌లైన్ */}
      <div>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
          డేట్‌లైన్ (DateLine / Place):
        </label>
        <input 
          type="text" 
          value={dateLine} 
          onChange={(e) => setDateLine(e.target.value)}
          placeholder="ఉదా: పాడేరు - యువగళం ప్రతినిధి"
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>

      {/* బాడీ టెక్స్ట్ */}
      <div>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
          బాడీ టెక్స్ట్ (Body Text / Unicode):
        </label>
        <textarea 
          rows="4" 
          value={bodyText} 
          onChange={(e) => setBodyText(e.target.value)}
          placeholder="ఇక్కడ పూర్తి వార్త మేటర్ పేస్ట్ చేయండి..."
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' }}
        />
      </div>

      {/* ఫోటో అప్‌లోడ్ */}
      <div>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
          వార్తా ఫోటో అప్‌లోడ్ (Photo Upload):
        </label>
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          style={{ width: '100%', fontSize: '13px' }}
        />
      </div>

      {/* మాస్టర్ లేఅవుట్ & పేజీ సెలెక్షన్ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f1f1f1', padding: '10px', borderRadius: '4px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '2px' }}>మాస్టర్ లేఅవుట్:</label>
          <select 
            value={selectedMaster} 
            onChange={(e) => setSelectedMaster(e.target.value)}
            style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="MASTER_1">యువగళం - మాస్టర్ 1</option>
            <option value="MASTER_2">యువగళం - మాస్టర్ 2</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '2px' }}>పేజీ & వార్త నంబర్:</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <select 
              value={selectedPage} 
              onChange={(e) => setSelectedPage(e.target.value)}
              style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="1">పేజీ 1</option>
              <option value="2">పేజీ 2</option>
              <option value="3">పేజీ 3</option>
              <option value="4">పేజీ 4</option>
            </select>
            <select 
              value={newsIndex} 
              onChange={(e) => setNewsIndex(e.target.value)}
              style={{ width: '50px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="1">#1</option>
              <option value="2">#2</option>
              <option value="3">#3</option>
              <option value="4">#4</option>
            </select>
          </div>
        </div>
      </div>

      {/* సేవ్ బటన్ */}
      <button 
        onClick={handleSaveNews}
        style={{ 
          background: '#d32f2f', 
          color: '#fff', 
          padding: '12px', 
          border: 'none', 
          borderRadius: '4px', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          textAlign: 'center',
          marginTop: '5px'
        }}
      >
        సేవ్ ది న్యూస్ & PNG డౌన్‌లోడ్ సిద్ధం చేయి
      </button>

    </div>
  );
}
