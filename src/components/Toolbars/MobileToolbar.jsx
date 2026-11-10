import React, { useState } from 'react';
import { getNewspaperDate } from '../../utils/dateEngine'; // మనం సృష్టించిన డేట్ ఇంజిన్ ఇంపోర్ట్ చేయడం

export function MobileToolbar({ onUploadClick }) {
  const [headline, setHeadline] = useState('');
  const [subHeadline, setSubHeadline] = useState('');
  const [dateLine, setDateLine] = useState('');
  const [bodyText, setBodyText] = useState('');
  
  // పత్రిక ఎడిషన్ మరియు సెక్షన్ రౌటింగ్
  const [targetEdition, setTargetEdition] = useState('యువగళం (Yuvagalam)');
  const [sectionType, setSectionType] = useState('MAIN_STORY'); // BRIEF, MEDIUM_STORY, MAIN_STORY
  
  // ఫోటో మరియు L-షేప్ రాపింగ్ సెట్టింగ్స్
  const [photoOrientation, setPhotoOrientation] = useState('VERTICAL'); // VERTICAL (L-Shape) లేదా HORIZONTAL
  const [wrapMode, setWrapMode] = useState('FLOAT_LEFT');

  const [selectedMaster, setSelectedMaster] = useState('MASTER_1');
  const [selectedPage, setSelectedPage] = useState('1');
  const [newsIndex, setNewsIndex] = useState('1');
  const [imageFile, setImageFile] = useState(null);

  const handleSaveNews = () => {
    // ఆటోమేటిక్‌గా రేపటి తేదీని పొందడం (Night-Shift Date Logic)
    const { dateString } = getNewspaperDate();

    alert(`వార్త విజయవంతంగా సేవ్ చేయబడింది!\n\nపత్రిక: ${targetEdition}\nప్రచురణ తేదీ: ${dateString}\nవిభాగం: ${sectionType}\nఫోటో స్టైల్: ${photoOrientation === 'VERTICAL' ? 'నిలువు ఫోటో (L-Shape Wrap)' : 'సాధారణ ఫోటో'}\nమాస్టర్: ${selectedMaster} | పేజీ: ${selectedPage}`);
    
    if (onUploadClick) onUploadClick();
  };

  const isYuvagalam = targetEdition.includes('యువగళం');
  const themeColor = isYuvagalam ? '#d32f2f' : '#2e7d32'; 

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
      
      {/* పత్రిక ఎడిషన్ మరియు విజువల్ సిగ్నల్ బ్యాడ్జ్ */}
      <div style={{ background: isYuvagalam ? '#ffebee' : '#e8f5e9', border: `1px solid ${themeColor}`, padding: '10px', borderRadius: '4px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: themeColor }}>
          🎯 ప్రస్తుత టార్గెట్ పత్రిక (Target Edition):
        </label>
        <select 
          value={targetEdition} 
          onChange={(e) => setTargetEdition(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: `1px solid ${themeColor}`, fontWeight: 'bold', background: '#fff', color: themeColor }}
        >
          <option value="యువగళం (Yuvagalam)">యువగళం (ప్రధాన ఎడిషన్ - Red Theme)</option>
          <option value="మరో పత్రిక (Second Paper)">మరో ప్రాంతీయ పత్రిక (Green Theme)</option>
        </select>
        <span style={{ fontSize: '11px', color: '#555', display: 'block', marginTop: '4px' }}>
          ℹ️ సిగ్నల్: ప్రస్తుతం మీరు అప్‌లోడ్ చేసే వార్త సరిగ్గా పై ఎడిషన్‌లోకి మాత్రమే వెళ్తుంది.
        </span>
      </div>

      {/* వార్త విభాగం (Section Routing: చిన్న, మధ్యస్థ, పెద్ద వార్తలు) */}
      <div>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
          వార్త విభాగం & కాలమ్స్ (Section Routing):
        </label>
        <select 
          value={sectionType} 
          onChange={(e) => setSectionType(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontWeight: 'bold' }}
        >
          <option value="BRIEF">చిన్న వార్త (Single Column Brief)</option>
          <option value="MEDIUM_STORY">మధ్యస్థ వార్త (Double Column Medium)</option>
          <option value="MAIN_STORY">పెద్ద వార్త (Double/Triple Column Main)</option>
        </select>
      </div>

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

      {/* ఫోటో అప్‌లోడ్ & L-షేప్ రాపింగ్ సెట్టింగ్స్ */}
      <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>ఫోటో ఆకృతి (Orientation):</label>
            <select 
              value={photoOrientation} 
              onChange={(e) => setPhotoOrientation(e.target.value)}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
            >
              <option value="VERTICAL">నిలువు ఫోటో (L-Shape Wrap)</option>
              <option value="HORIZONTAL">అడ్డు ఫోటో (Standard)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>టెక్స్ట్ రాపింగ్ (Wrap):</label>
            <select 
              value={wrapMode} 
              onChange={(e) => setWrapMode(e.target.value)}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
            >
              <option value="FLOAT_LEFT">ఎడమ వైపు (Float Left)</option>
              <option value="FLOAT_RIGHT">కుడి వైపు (Float Right)</option>
              <option value="CENTER_TOP">పైన సెంటర్ (Center Top)</option>
            </select>
          </div>
        </div>
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
            <option value="MASTER_1">మాస్టర్ ప్రొఫైల్ 1</option>
            <option value="MASTER_2">మాస్టర్ ప్రొఫైల్ 2</option>
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
          background: themeColor, 
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
        సేవ్ ది న్యూస్ & L-షేప్ ఆటో-రౌటింగ్ పూర్తి చేయి
      </button>

    </div>
  );
}
