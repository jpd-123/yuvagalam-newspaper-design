import React, { useState, useRef, useEffect } from 'react';
import { useMasterStore } from './store/useMasterStore';
import { MasterToolbar } from './components/Toolbars/MasterToolbar';
import { DailyToolbar } from './components/Toolbars/DailyToolbar';
import { MobileToolbar } from './components/Toolbars/MobileToolbar';
import { LeftToolPanel } from './components/Panels/LeftToolPanel';
import { RightStylePanel } from './components/Panels/RightStylePanel';
import { BottomStyleBar } from './components/Panels/BottomStyleBar';
import PageCanvas from './components/Canvas/PageCanvas';
import { ExportPdfModal } from './components/Modals/ExportPdfModal';

// హెడ్‌లైన్ / సబ్-హెడ్‌లైన్ గ్రిడ్ వెడల్పు ఆధారంగా ఒకే లైన్‌లో సరిపోయేలా ఫాంట్ సైజ్ లెక్కించే ఫంక్షన్
const calculateSingleLineFontSize = (text, boxWidth, isSubHeadline = false) => {
  const usableWidth = Math.max(80, (boxWidth || 300) - 24);
  const cleanLength = Math.max(1, (text || '').trim().length);
  const maxAllowed = isSubHeadline ? 24 : 32;
  const minAllowed = isSubHeadline ? 11 : 13;

  // తెలుగు అక్షరాల సగటు వెడల్పు ఆధారంగా సింగిల్-లైన్ సైజ్ అంచనా
  const estimatedPt = Math.floor((usableWidth / cleanLength) * 1.15);
  return Math.max(minAllowed, Math.min(maxAllowed, estimatedPt));
};

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

  const [pagesElements, setPagesElements] = useState({});
  const [selectedElementId, setSelectedElementId] = useState(null);
  const pageRef = useRef(null);

  const currentCanvasElements = pagesElements[currentPage] || [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId !== null) {
        if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT' || document.activeElement.isContentEditable) {
          return;
        }
        setPagesElements(prev => ({
          ...prev,
          [currentPage]: (prev[currentPage] || []).filter(el => el.id !== selectedElementId)
        }));
        setSelectedElementId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, currentPage]);

  // ఫాంట్ సైజ్ మారితే సెలెక్ట్ అయిన గ్రిడ్‌కి కూడా అప్‌డేట్ అవుతుంది (ఆటో-సైజ్‌ని ఓవర్‌రైడ్ చేసి మాన్యువల్ సైజ్ సెట్ చేస్తుంది)
  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    if (selectedElementId !== null) {
      setPagesElements(prev => ({
        ...prev,
        [currentPage]: (prev[currentPage] || []).map(el =>
          el.id === selectedElementId
            ? { ...el, fontSize: newSize, manualFontSize: true }
            : el
        )
      }));
    }
  };

  // లైట్ కలర్ -> సెలెక్ట్ చేసిన బాక్స్ బ్యాక్‌గ్రౌండ్; డార్క్ కలర్ -> సెలెక్ట్ చేసిన బాక్స్/టెక్స్ట్ కలర్
  const handleColorSelect = (type, color) => {
    if (type === 'LIGHT') {
      if (selectedElementId !== null) {
        setPagesElements(prev => ({
          ...prev,
          [currentPage]: (prev[currentPage] || []).map(el => el.id === selectedElementId ? { ...el, bgColor: color } : el)
        }));
      } else {
        setBgColor(color);
      }
    } else {
      setTextColor(color);
      if (selectedElementId !== null) {
        setPagesElements(prev => ({
          ...prev,
          [currentPage]: (prev[currentPage] || []).map(el => el.id === selectedElementId ? { ...el, color: color } : el)
        }));
      }
    }
  };

  // క్లిక్ చేసిన చోట ఉన్న లేదా దగ్గరగా ఉన్న వార్త గ్రిడ్ (RECTANGLE) ను కనుగొనడం
  const findTargetNewsGrid = (elements, clickX, clickY) => {
    const rectGrids = elements.filter(el => el.type === 'RECTANGLE');
    if (rectGrids.length === 0) return null;

    const containing = rectGrids.find(
      g => clickX >= g.x - 20 && clickX <= g.x + g.width + 20 && clickY >= g.y - 100 && clickY <= g.y + g.height + 20
    );
    if (containing) return containing;

    return rectGrids[rectGrids.length - 1];
  };

  const handleCanvasClick = (e) => {
    if (!selectedShape || activeTool === 'POINTER' || activeTool === 'TEXT') return;

    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const isHeadline = selectedShape === 'HEADLINE';
    const isSubHeadline = selectedShape === 'SUB_HEADLINE';
    const targetGrid = (isHeadline || isSubHeadline) ? findTargetNewsGrid(currentCanvasElements, x, y) : null;

    const linkedWidth = targetGrid ? targetGrid.width : (isHeadline || isSubHeadline ? 320 : 240);
    const linkedX = targetGrid ? targetGrid.x : Math.max(10, x - 120);

    const defaultHeadlineText = 'ప్రధాన హెడ్‌లైన్ ఇక్కడ టైప్ చేయండి...';
    const defaultSubHeadlineText = 'సబ్-హెడ్‌లైన్ ఇక్కడ టైప్ చేయండి...';

    const autoSize = isHeadline
      ? calculateSingleLineFontSize(defaultHeadlineText, linkedWidth, false)
      : (isSubHeadline ? calculateSingleLineFontSize(defaultSubHeadlineText, linkedWidth, true) : fontSize);

    const newElement = {
      id: Date.now(),
      type: selectedShape,
      parentRectId: targetGrid ? targetGrid.id : null,
      x: linkedX,
      y: Math.max(10, y - 25),
      width: selectedShape === 'CIRCLE_PHOTO' ? 140 : linkedWidth,
      height: selectedShape === 'DIVIDER' ? 4 : (selectedShape === 'CIRCLE_PHOTO' ? 140 : (isHeadline ? 52 : (isSubHeadline ? 38 : 140))),
      color: isHeadline ? '#b71c1c' : (isSubHeadline ? '#0d47a1' : (textColor || '#000000')),
      text: isHeadline
        ? defaultHeadlineText
        : (isSubHeadline ? defaultSubHeadlineText : (selectedShape === 'RECTANGLE' ? 'ఇక్కడ మీ వార్త టైప్ చేయండి...' : '')),
      fontSize: autoSize,
      singleLine: isHeadline || isSubHeadline,
      manualFontSize: false,
      bgColor: isHeadline ? '#fff8e1' : (isSubHeadline ? '#f3f8ff' : '#ffffff'),
      imageUrl: null,
      isVerticalPhoto: false
    };

    setPagesElements(prev => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), newElement]
    }));
    setSelectedElementId(newElement.id);
    setSelectedShape(null);
    setActiveTool('POINTER');
  };

  // ఎలిమెంట్ అప్‌డేట్:
  // 1. వార్త గ్రిడ్ వెడల్పు మారితే దాని హెడ్‌లైన్/సబ్-హెడ్‌లైన్ గ్రిడ్‌ల వెడల్పు & ఆటో-సైజ్ మారుతుంది
  // 2. హెడ్‌లైన్/సబ్-హెడ్‌లైన్ టెక్స్ట్ మారితే ఒకే లైన్‌లో సరిపోయేలా ఫాంట్ సైజ్ ఆటోమేటిక్‌గా సర్దుబాటు అవుతుంది
  const handleUpdateElement = (id, updates) => {
    setPagesElements(prev => {
      const pageEls = prev[currentPage] || [];
      const targetEl = pageEls.find(el => el.id === id);
      const isResizingRectangle = targetEl && targetEl.type === 'RECTANGLE' && typeof updates.width === 'number';

      const updatedEls = pageEls.map(el => {
        if (el.id === id) {
          const nextEl = { ...el, ...updates };
          if ((nextEl.type === 'HEADLINE' || nextEl.type === 'SUB_HEADLINE') && nextEl.singleLine && !nextEl.manualFontSize) {
            if (typeof updates.text === 'string' || typeof updates.width === 'number') {
              nextEl.fontSize = calculateSingleLineFontSize(
                nextEl.text,
                nextEl.width,
                nextEl.type === 'SUB_HEADLINE'
              );
            }
          }
          return nextEl;
        }

        if (
          isResizingRectangle &&
          (el.type === 'HEADLINE' || el.type === 'SUB_HEADLINE') &&
          (el.parentRectId === id || Math.abs(el.x - targetEl.x) < 25)
        ) {
          const nextWidth = updates.width;
          const nextX = typeof updates.x === 'number' ? updates.x : el.x;
          const nextFontSize = (el.singleLine && !el.manualFontSize)
            ? calculateSingleLineFontSize(el.text, nextWidth, el.type === 'SUB_HEADLINE')
            : el.fontSize;

          return {
            ...el,
            width: nextWidth,
            x: nextX,
            fontSize: nextFontSize
          };
        }

        return el;
      });

      return {
        ...prev,
        [currentPage]: updatedEls
      };
    });
  };

  const handleDeleteElement = (id) => {
    setPagesElements(prev => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).filter(el => el.id !== id)
    }));
    if (selectedElementId === id) setSelectedElementId(null);
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
            <MasterToolbar onSaveMaster={() => alert('మాస్టర్ లేఅవుట్ భద్రపరచబడింది!')} onUploadLogo={() => alert('లోగో అప్‌లోడర్ ఓపెన్ అయింది')} />
          )}
          {activeMode === 'DAILY' && (
            <DailyToolbar onExportPdfClick={() => setShowPdfModal(true)} />
          )}

          <div style={{ background: '#eee', padding: '5px 15px', fontSize: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>వర్క్‌స్పేస్: {paperSize}</span>
            <span style={{ marginLeft: 'auto' }}>
              ప్రస్తుత పేజీ: 
              {[...Array(Number(pageCount))].map((_, i) => (
                <button 
                  key={i + 1} 
                  onClick={() => {
                    setCurrentPage(i + 1);
                    setSelectedElementId(null);
                  }} 
                  style={{ fontWeight: currentPage === (i + 1) ? 'bold' : 'normal', marginLeft: '4px', background: currentPage === (i + 1) ? '#d32f2f' : '#ccc', color: currentPage === (i + 1) ? '#fff' : '#000', border: 'none', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer' }}
                >
                  {i + 1}
                </button>
              ))}
            </span>
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <LeftToolPanel 
              onSelectTool={(tool) => setActiveTool(tool)}
              onSelectShape={(shape) => setSelectedShape(shape)}
              onPageSizeChange={(size) => setPaperSize(size)}
              onPageCountChange={(count) => setPageCount(count)}
              onAutoPageSetup={() => alert('ఆటో పేజీ సెటప్ రన్ అయింది!')}
            />

            <PageCanvas 
              pageTitle={`మాస్టర్ లేఅవుట్ - పేజీ ${currentPage}`}
              pageNumber={currentPage}
              bgColor={bgColor}
              selectedFont={selectedFont}
              dimensions={dimensions}
              onCanvasClick={handleCanvasClick}
              canvasElements={currentCanvasElements}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
              selectedElementId={selectedElementId}
              onSelectElement={(id) => setSelectedElementId(id)}
              fontSize={fontSize}
              isMasterDesignMode={activeMode === 'MASTER'}
              activeTool={activeTool}
            />

            <RightStylePanel 
              onColorSelect={handleColorSelect} 
              onFontSelect={(font) => setSelectedFont(font)} 
            />
          </div>

          <BottomStyleBar 
            fontSize={fontSize} 
            setFontSize={handleFontSizeChange} 
          />
        </>
      )}

      {showPdfModal && <ExportPdfModal pageRef={pageRef} onClose={() => setShowPdfModal(false)} />}
    </div>
  );
}
