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
import React, { useState, useRef } from 'react';
import { useMasterStore } from './store/useMasterStore';
import { MasterToolbar } from './components/Toolbars/MasterToolbar';
import { DailyToolbar } from './components/Toolbars/DailyToolbar';
import { MobileToolbar } from './components/Toolbars/MobileToolbar';
import { LeftToolPanel } from './components/Panels/LeftToolPanel';
import { RightStylePanel } from './components/Panels/RightStylePanel';
import { BottomStyleBar } from './components/Panels/BottomStyleBar';
import { ExportPdfModal } from './components/Modals/ExportPdfModal';

export default function App() {
  const { activeMode, openDailyLayout, setActiveMode } = useMasterStore();
  const [showPdfModal, setShowPdfModal] = useState(false);
  
  const [paperSize, setPaperSize] = useState('BROADSHEET');
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [activeTool, setActiveTool] = useState('POINTER');
  const [selectedShape, setSelectedShape] = useState(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [selectedFont, setSelectedFont] = useState('Gidugu');
  const [fontSize, setFontSize] = useState(12);

  const [canvasElements, setCanvasElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);

  const pageRef = useRef(null);

  const handleColorSelect = (type, color) => {
    if (type === 'LIGHT') {
      setBgColor(color);
    } else {
      setTextColor(color);
      if (selectedElementId !== null) {
        setCanvasElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, color: color } : el));
      }
    }
  };

  const handleCanvasClick = (e) => {
    if (!selectedShape || activeTool === 'POINTER') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement = {
      id: Date.now(),
      type: selectedShape,
      x: Math.max(10, x - 100),
      y: Math.max(10, y - 50),
      width: 220,
      height: selectedShape === 'DIVIDER' ? 4 : 130,
      color: textColor || '#000000',
      text: selectedShape === 'RECTANGLE' ? 'ఇక్కడ మీ వార్త లేదా శీర్షిక టైప్ చేయండి...' : '',
      fontSize: fontSize
    };

    setCanvasElements([...canvasElements, newElement]);
    setSelectedElementId(newElement.id);
    setSelectedShape(null);
  };

  const getPaperDimensions = () => {
    switch (paperSize) {
      case 'A3 సైజ్': return { width: '700px', minHeight: '990px' };
      case 'మీడియం సైజ్': return { width: '750px', minHeight: '1050px' };
      case 'జిల్లా టాబ్లెట్': return { width: '650px', minHeight: '900px' };
      default: return { width: '820px', minHeight: '1160px' };
    }
  };

  const dimensions = getPaperDimensions();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* హెడర్ బార్ */}
      <div style={{ background: '#222', color: '#fff', padding: '8px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ margin: 0, fontSize: '16px', color: '#ff4444' }}>సాత్విక పబ్లిషర్</h2>
        <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
          <button onClick={() => setActiveMode('MASTER')} style={{ background: activeMode === 'MASTER' ? '#d32f2f' : '#555', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>మాస్టర్ డిజైన్</button>
          <button onClick={() => openDailyLayout('MASTER_1')} style={{ background: activeMode === 'DAILY' ? '#d32f2f' : '#555', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>డైలీ డిజైన్</button>
          <button onClick={() => setActiveMode('MOBILE')} style={{ background: activeMode === 'MOBILE' ? '#d32f2f' : '#555', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>మొబైల్ అప్‌లోడ్</button>
        </div>
      </div>

      {activeMode === 'MOBILE' ? (
        <div style={{ flex: 1, background: '#f9f9f9', padding: '20px', maxWidth: '500px', margin: '20px auto', width: '100%', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px', overflowY: 'auto' }}>
          <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', color: '#333', marginTop: 0 }}>మొబైల్ వార్తల అప్‌లోడ్ టూల్‌బార్</h3>
          <MobileToolbar onUploadClick={() => alert('వార్త విజయవంతంగా అప్‌లోడ్ అయింది!')} />
        </div>
      ) : (
        <>
          {activeMode === 'MASTER' && (
            <MasterToolbar 
              onSaveMaster={() => alert('మాస్టర్ లేఅవుట్ భద్రపరచబడింది!')} 
              onUploadLogo={() => alert('లోగో అప్‌లోడర్ ఓపెన్ అయింది')} 
            />
          )}
          {activeMode === 'DAILY' && (
            <DailyToolbar onExportPdfClick={() => setShowPdfModal(true)} />
          )}

          {/* పేజీ సెలెక్టర్ బార్ */}
          <div style={{ background: '#eee', padding: '5px 15px', fontSize: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>వర్క్‌స్పేస్: {paperSize}</span>
            <span style={{ marginLeft: 'auto' }}>
              ప్రస్తుత పేజీ: 
              {[...Array(Number(pageCount))].map((_, i) => (
                <button 
                  key={i + 1} 
                  onClick={() => setCurrentPage(i + 1)} 
                  style={{ fontWeight: currentPage === (i + 1) ? 'bold' : 'normal', marginLeft: '4px', background: currentPage === (i + 1) ? '#d32f2f' : '#ccc', color: currentPage === (i + 1) ? '#fff' : '#000', border: 'none', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer' }}
                >
                  {i + 1}
                </button>
              ))}
            </span>
          </div>

          {/* మెయిన్ 3-ప్యానెల్ లేఅవుట్ */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            
            {/* లెఫ్ట్ టూల్ ప్యానెల్ */}
            <LeftToolPanel 
              onSelectTool={(tool) => setActiveTool(tool)}
              onSelectShape={(shape) => setSelectedShape(shape)}
              onPageSizeChange={(size) => setPaperSize(size)}
              onPageCountChange={(count) => setPageCount(count)}
              onAutoPageSetup={() => alert('ఆటో పేజీ సెటప్ రన్ అయింది!')}
            />

            {/* సెంటర్ క్లీన్ వైట్ పేపర్ కాన్వాస్ */}
            <div style={{ flex: 1, background: '#444', overflowY: 'auto', padding: '20px', display: 'flex', justifyContent: 'center' }}>
              <div 
                ref={pageRef}
                onClick={handleCanvasClick}
                style={{ 
                  width: dimensions.width, 
                  minHeight: dimensions.minHeight, 
                  background: bgColor, 
                  boxShadow: '0 0 20px rgba(0,0,0,0.6)', 
                  padding: '20px',
                  fontFamily: selectedFont,
                  boxSizing: 'border-box',
                  position: 'relative',
                  cursor: selectedShape ? 'crosshair' : 'default'
                }}
              >
                {/* పూర్తిగా ఖాళీ అయిన క్లీన్ వైట్ పేపర్ మెసేజ్ */}
                {canvasElements.length === 0 && (
                  <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', color: '#aaa', textAlign: 'center', pointerEvents: 'none', border: '2px dashed #ccc', padding: '40px', borderRadius: '10px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>మాస్టర్ లేఅవుట్ - పేజీ {currentPage}</h3>
                    <p style={{ margin: 0, fontSize: '13px' }}>ఇది పూర్తిగా ఖాళీగా ఉన్న క్లీన్ వైట్ పేపర్. ఎడమ వైపు టూల్స్ ద్వారా మీరు మాన్యువల్‌గా డిజైన్ ప్రారంభించండి.</p>
                  </div>
                )}

                {/* యూజర్ గీసే గ్రిడ్స్ / ఎలిమెంట్స్ */}
                {canvasElements.map((el) => (
                  <div
                    key={el.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}
                    style={{
                      position: 'absolute',
                      left: `${el.x}px`,
                      top: `${el.y}px`,
                      width: `${el.width}px`,
                      height: `${el.height}px`,
                      border: selectedElementId === el.id ? '2px solid #d32f2f' : '1px solid #888',
                      background: el.type === 'PICTURE' || el.type === 'CIRCLE_PHOTO' ? '#f0f0f0' : 'transparent',
                      color: el.color,
                      borderRadius: el.type === 'CIRCLE' || el.type === 'CIRCLE_PHOTO' ? '50%' : el.type === 'OVAL' ? '50% / 30%' : '0px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '5px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {el.type === 'PICTURE' && <span style={{ fontSize: '11px', color: '#555' }}>❎ పిక్చర్ బాక్స్</span>}
                    {el.type === 'CIRCLE_PHOTO' && <span style={{ fontSize: '10px', color: '#555' }}>⊗ సర్కిల్ ఫోటో</span>}
                    {el.type === 'DIVIDER' && <div style={{ width: '100%', height: '2px', background: el.color }} />}
                    {el.type === 'RECTANGLE' && (
                      <textarea 
                        defaultValue={el.text}
                        style={{ width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', resize: 'none', color: el.color, fontFamily: selectedFont, fontSize: `${fontSize}pt` }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* రైట్ సైడ్ స్టైల్ & కలర్ ప్యానెల్ */}
            <RightStylePanel 
              onColorSelect={handleColorSelect} 
              onFontSelect={(font) => setSelectedFont(font)} 
            />
          </div>

          <BottomStyleBar 
            fontSize={fontSize} 
            setFontSize={setFontSize} 
          />
        </>
      )}

      {showPdfModal && <ExportPdfModal pageRef={pageRef} onClose={() => setShowPdfModal(false)} />}
    </div>
  );
}
