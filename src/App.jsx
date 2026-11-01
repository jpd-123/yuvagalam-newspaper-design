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
      
      {/* హెడర్ / మోడ్ స్విచర్ (మొబైల్ & ల్యాప్‌టాప్ రెండింటికి ఉపయోగపడుతుంది) */}
      <div style={{ background: '#333', color: '#fff', padding: '8px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ margin: 0, fontSize: '16px', color: '#ff4444' }}>సాత్విక పబ్లిషర్</h2>
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
          <button onClick={() => setActiveMode('MASTER')} style={{ background: activeMode === 'MASTER' ? '#d32f2f' : '#555', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>మాస్టర్ డిజైన్</button>
          <button onClick={() => openDailyLayout('MASTER_1')} style={{ background: activeMode === 'DAILY' ? '#d32f2f' : '#555', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>డైలీ డిజైన్</button>
          <button onClick={() => setActiveMode('MOBILE')} style={{ background: activeMode === 'MOBILE' ? '#d32f2f' : '#555', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>మొబైల్ అప్‌లోడ్</button>
        </div>
      </div>

      {/* మొబైల్ మోడ్ లేదా ల్యాప్‌టాప్ మోడ్ ప్రకారం మార్పు */}
      {activeMode === 'MOBILE' ? (
        /* మొబైల్ ఫోన్ లో ఓపెన్ చేసినప్పుడు కేవలం మొబైల్ అప్‌లోడ్ టూల్‌బార్ మాత్రమే కనిపిస్తుంది */
        <div style={{ flex: 1, background: '#f9f9f9', padding: '20px', maxWidth: '500px', margin: '20px auto', width: '100%', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px', overflowY: 'auto' }}>
          <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', color: '#333', marginTop: 0 }}>మొబైల్ వార్తల అప్‌లోడ్ టూల్‌బార్</h3>
          <MobileToolbar onUploadClick={() => alert('మొబైల్ వార్త అప్‌లోడర్ ఓపెన్ అయింది')} />
        </div>
      ) : (
        /* ల్యాప్‌టాప్ / డెస్క్‌టాప్ లో పూర్తి పేజ్‌మేకర్ తరహా మాస్టర్ లేఅవుట్ */
        <>
          {activeMode === 'MASTER' && (
            <MasterToolbar 
              onSaveMaster={() => alert('మాస్టర్ లేఅవుట్ భద్రపరచబడింది!')} 
              onUploadLogo={() => alert('వాట్సాప్ లోగో అప్‌లోడ్ ఐకాన్ సక్సెస్!')} 
            />
          )}
          {activeMode === 'DAILY' && (
            <DailyToolbar onExportPdfClick={() => setShowPdfModal(true)} />
          )}

          {/* పేజీ సెలెక్టర్ బార్ */}
          <div style={{ background: '#eee', padding: '5px 15px', fontSize: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>మోడ్స్ వర్క్‌స్పేస్</span>
            <span style={{ marginLeft: 'auto' }}>
              పేజీ సెలెక్టర్: 
              <button onClick={() => setCurrentPage(1)} style={{ fontWeight: currentPage === 1 ? 'bold' : 'normal', marginLeft: '5px', cursor: 'pointer' }}>ఫ్రంట్ పేజీ</button>
              <button onClick={() => setCurrentPage(2)} style={{ fontWeight: currentPage === 2 ? 'bold' : 'normal', marginLeft: '5px', cursor: 'pointer' }}>2వ పేజీ (Inner)</button>
            </span>
          </div>

          {/* మెయిన్ 3-ప్యానెల్ లేఅవుట్ */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <LeftToolPanel onSelectShape={(shape) => setSelectedShape(shape)} />

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
                  {currentPage === 1 ? (
                    <FrontHeaderBar logoUrl="" volume="02" issue="108" price="3.00" totalPages="4" />
                  ) : (
                    <InnerHeaderBar category="జనరల్ వార్తలు" pageNumber={currentPage} />
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
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

                <FooterCMYK />
              </div>
            </div>

            <RightStylePanel 
              onColorSelect={handleColorSelect} 
              onFontSelect={(font) => setSelectedFont(font)} 
            />
          </div>

          <BottomStyleBar />
        </>
      )}

      {showPdfModal && <ExportPdfModal pageRef={pageRef} onClose={() => setShowPdfModal(false)} />}

    </div>
  );
}
