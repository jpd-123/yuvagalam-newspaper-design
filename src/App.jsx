import React, { useState, useRef } from 'react';
import { useMasterStore } from './store/useMasterStore';
import { MasterToolbar } from './components/Toolbars/MasterToolbar';
import { DailyToolbar } from './components/Toolbars/DailyToolbar';
import { MobileToolbar } from './components/Toolbars/MobileToolbar';
import { LeftToolPanel } from './components/Panels/LeftToolPanel';
import { RightStylePanel } from './components/Panels/RightStylePanel';
import { BottomStyleBar } from './components/Panels/BottomStyleBar';
import { FrontHeaderBar } from './components/Canvas/FrontHeaderBar';
import { InnerHeaderBar } from './components/Canvas/InnerHeaderBar';
import { FooterCMYK } from './components/Canvas/FooterCMYK';
import { ShapeContainer } from './components/NewsShapes/ShapeContainer';
import { ExportPdfModal } from './components/Modals/ExportPdfModal';

export default function App() {
  const { activeMode, openDailyLayout, setActiveMode } = useMasterStore();
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedShape, setSelectedShape] = useState('RECTANGLE');
  const [selectedFont, setSelectedFont] = useState('Gidugu');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [currentPage, setCurrentPage] = useState(1); // 1 = Front Page, 2 = Inner Page
  const pageRef = useRef(null);

  const handleColorSelect = (type, color) => {
    if (type === 'LIGHT') {
      setBgColor(color);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* 3 రకాల టూల్‌బార్ల స్విచింగ్ */}
      {activeMode === 'MASTER' && (
        <MasterToolbar 
          onSaveMaster={() => alert('మాస్టర్ లేఅవుట్ భద్రపరచబడింది!')} 
          onUploadLogo={() => alert('వాట్సాప్ లోగో అప్‌లోడ్ ఐకాన్ సక్సెస్!')} 
        />
      )}
      {activeMode === 'DAILY' && (
        <DailyToolbar onExportPdfClick={() => setShowPdfModal(true)} />
      )}
      {activeMode === 'MOBILE' && (
        <MobileToolbar onUploadClick={() => alert('మొబైల్ వార్త అప్‌లోడర్ ఓపెన్ అయింది')} />
      )}

      {/* వర్క్‌స్పేస్ స్విచర్ (టెస్టింగ్ కోసం) */}
      <div style={{ background: '#eee', padding: '5px 15px', fontSize: '12px', display: 'flex', gap: '10px' }}>
        <span>మోడ్స్:</span>
        <button onClick={() => setActiveMode('MASTER')}>మాస్టర్ డిజైన్</button>
        <button onClick={() => openDailyLayout('MASTER_1')}>డైలీ డిజైన్ (డూప్లికేట్)</button>
        <button onClick={() => setActiveMode('MOBILE')}>మొబైల్ అప్‌లోడ్</button>
        <span style={{ marginLeft: 'auto' }}>
          పేజీ సెలెక్టర్: 
          <button onClick={() => setCurrentPage(1)} style={{ fontWeight: currentPage === 1 ? 'bold' : 'normal' }}>ఫ్రంట్ పేజీ</button>
          <button onClick={() => setCurrentPage(2)} style={{ fontWeight: currentPage === 2 ? 'bold' : 'normal' }}>2వ పేజీ (Inner)</button>
        </span>
      </div>

      {/* మెయిన్ 3-ప్యానెల్ లేఅవుట్ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* ఎడమ సైడ్ ప్యానెల్ */}
        <LeftToolPanel onSelectShape={(shape) => setSelectedShape(shape)} />

        {/* మధ్య వర్క్‌స్పేస్ కాన్వాస్ (A3 Board) */}
        <div style={{ flex: 1, background: '#555', overflowY: 'auto', padding: '20px', display: 'flex', justifyContent: 'center' }}>
          
          <div 
            ref={pageRef} 
            style={{ 
              width: '800px', 
              minHeight: '1130px', 
              background: bgColor, 
              boxShadow: '0 0 15px rgba(0,0,0,0.5)', 
              padding: '20px',
              fontFamily: selectedFont,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              {/* పేజీ రకం ఆధారంగా హెడర్ మారుతుంది */}
              {currentPage === 1 ? (
                <FrontHeaderBar logoUrl="" volume="02" issue="108" price="3.00" totalPages="4" />
              ) : (
                <InnerHeaderBar category="జనరల్ వార్తలు" pageNumber={currentPage} />
              )}

              {/* వార్తా గ్రిడ్ నమూనా */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                
                {/* ప్రయోగాత్మక షేప్ బాక్స్ */}
                <ShapeContainer shapeType={selectedShape} isNeighborFlexible={true}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#CC0000' }}>ముఖ్యమైన పత్రికా వార్త శీర్షిక</h3>
                  <div style={{ color: '#880000', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>
                    పాడేరు - యువగళం ప్రతినిధి:
                  </div>
                  <p style={{ fontSize: '12px', lineHeight: '1.5', margin: 0 }}>
                    ఇక్కడ Unicode లో కాపీ చేసిన వార్తా మేటర్ ఆటో-ఫిట్ అవుతుంది. కొత్త వార్త నిడివి బట్టి పక్కన ఉన్న గ్రిడ్‌లు ఆటోమేటిక్‌గా అడ్జస్ట్ అవుతాయి.
                  </p>
                </ShapeContainer>

                <ShapeContainer shapeType="RECTANGLE">
                  <h3 style={{ margin: '0 0 5px 0', color: '#0044AA' }}>ప్రాంతీయ వార్తలు & కథనాలు</h3>
                  <p style={{ fontSize: '12px', lineHeight: '1.5', margin: 0 }}>
                    పత్రికా ప్రమాణాల ప్రకారం కాలమ్స్ విభజన మరియు డివైడర్ లైన్లు ఆటోమేటిక్‌గా సెట్ అవుతాయి.
                  </p>
                </ShapeContainer>

              </div>
            </div>

            {/* ఫుటర్ CMYK డాట్స్ */}
            <FooterCMYK />
          </div>

        </div>

        {/* కుడి సైడ్ ప్యానెల్ */}
        <RightStylePanel 
          onColorSelect={handleColorSelect} 
          onFontSelect={(font) => setSelectedFont(font)} 
        />

      </div>

      {/* అడుగు క్విక్ బార్ */}
      <BottomStyleBar />

      {/* PDF మోడల్ పాప్-అప్ */}
      {showPdfModal && <ExportPdfModal pageRef={pageRef} onClose={() => setShowPdfModal(false)} />}

    </div>
  );
                }
