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

// హెక్స్ కలర్ ముదురుగా (Dark) ఉందా లేదా అని తనిఖీ చేసే ఫంక్షన్
export const isDarkHexColor = (hex) => {
  if (!hex || typeof hex !== 'string') return false;
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.48;
};

// హెడ్‌లైన్ / సబ్-హెడ్‌లైన్ టెక్స్ట్ మొత్తం మొదటి నుండి చివరి వరకు ఒకే లైన్‌లో కనిపించేలా సైజ్ లెక్కించడం
export const calculateSingleLineFontSize = (text, boxWidth, isSubHeadline = false) => {
  const usableWidth = Math.max(70, (boxWidth || 300) - 20);
  const cleanText = (text || '').trim();
  const cleanLength = Math.max(1, cleanText.length);
  const maxAllowed = isSubHeadline ? 22 : 30;
  const minAllowed = isSubHeadline ? 9 : 11;

  // తెలుగు అక్షరాల వెడల్పుకు తగ్గట్టు ఖచ్చితమైన pt సైజ్
  const estimatedPt = Math.floor((usableWidth / cleanLength) * 1.05);
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

  const handleFontSelect = (font) => {
    setSelectedFont(font);
    window.dispatchEvent(
      new CustomEvent('SATHVIKA_APPLY_FORMAT', { detail: { kind: 'FONT_FAMILY', value: font } })
    );
  };

  // లైట్ లేదా ముదురు రంగులు ఎంచుకున్నప్పుడు బ్యాక్‌గ్రౌండ్ / అక్షరాల రంగు అప్‌డేట్
  const handleColorSelect = (type, color, targetMode = 'AUTO') => {
    // నిర్దిష్టంగా టెక్స్ట్ కలర్ (బ్లాక్ / వైట్ లేదా డార్క్ టెక్స్ట్) మార్చమని అడిగితే
    if (targetMode === 'TEXT_ONLY') {
      setTextColor(color);
      window.dispatchEvent(
        new CustomEvent('SATHVIKA_APPLY_FORMAT', { detail: { kind: 'COLOR', value: color } })
      );
      if (selectedElementId !== null) {
        setPagesElements(prev => ({
          ...prev,
          [currentPage]: (prev[currentPage] || []).map(el =>
            el.id === selectedElementId ? { ...el, color } : el
          )
        }));
      }
      return;
    }

    if (type === 'LIGHT') {
      if (selectedElementId !== null) {
        setPagesElements(prev => ({
          ...prev,
          [currentPage]: (prev[currentPage] || []).map(el =>
            el.id === selectedElementId ? { ...el, bgColor: color } : el
          )
        }));
      } else {
        setBgColor(color);
      }
    } else {
      // ముదురు రంగులు (DARK) ఎంచుకున్నప్పుడు:
      // బాక్స్ సెలెక్ట్ చేసి ఉంటే (మరియు టెక్స్ట్ సెలెక్షన్ లేకపోతే) బాక్స్ బ్యాక్‌గ్రౌండ్ మారుతుంది,
      // ముదురు రంగు అయితే అక్షరాల కలర్ ఆటోమేటిక్‌గా వైట్ (#ffffff) అవుతుంది.
      const selection = window.getSelection();
      const hasTextSelected = selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;

      if (hasTextSelected) {
        setTextColor(color);
        window.dispatchEvent(
          new CustomEvent('SATHVIKA_APPLY_FORMAT', { detail: { kind: 'COLOR', value: color } })
        );
      } else if (selectedElementId !== null) {
        const darkBg = isDarkHexColor(color);
        setPagesElements(prev => ({
          ...prev,
          [currentPage]: (prev[currentPage] || []).map(el =>
            el.id === selectedElementId
              ? {
                  ...el,
                  bgColor: color,
                  color: darkBg ? '#ffffff' : (el.color === '#ffffff' ? '#000000' : el.color)
                }
              : el
          )
        }));
      } else {
        setTextColor(color);
        window.dispatchEvent(
          new CustomEvent('SATHVIKA_APPLY_FORMAT', { detail: { kind: 'COLOR', value: color } })
        );
      }
    }
  };

  const findTargetNewsGrid = (elements, clickX, clickY) => {
    const rectGrids = elements.filter(el => el.type === 'RECTANGLE');
    if (rectGrids.length === 0) return null;

    const containing = rectGrids.find(
      g => clickX >= g.x - 20 && clickX <= g.x + g.width + 20 && clickY >= g.y - 120 && clickY <= g.y + g.height + 20
    );
    if (containing) return containing;

    return rectGrids[rectGrids.length - 1];
  };

  const handleCanvasClick = (e) => {
    if (!selectedShape) return;

    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const isHeadline = selectedShape === 'HEADLINE';
    const isSubHeadline = selectedShape === 'SUB_HEADLINE';
    const isCirclePhoto = selectedShape === 'CIRCLE_PHOTO';
    const targetGrid = (isHeadline || isSubHeadline) ? findTargetNewsGrid(currentCanvasElements, x, y) : null;

    const linkedWidth = targetGrid ? targetGrid.width : (isHeadline || isSubHeadline ? 320 : 240);
    const linkedX = targetGrid ? targetGrid.x : Math.max(10, x - 120);

    // ఒకే వార్త గ్రిడ్ కింద ఎన్ని సబ్-హెడ్‌లైన్స్ / హెడ్‌లైన్స్ పెట్టినా వరుస క్రమంలో కిందకి వచ్చేలా y లెక్కించడం
    let nextY = Math.max(10, y - 25);
    if ((isHeadline || isSubHeadline) && targetGrid) {
      const existingHeaders = currentCanvasElements.filter(
        el =>
          (el.type === 'HEADLINE' || el.type === 'SUB_HEADLINE') &&
          (el.parentRectId === targetGrid.id || Math.abs(el.x - targetGrid.x) < 25)
      );
      if (existingHeaders.length > 0) {
        const lowestBottom = Math.max(...existingHeaders.map(h => h.y + h.height));
        nextY = lowestBottom + 4;
      }
    }

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
      y: nextY,
      width: isCirclePhoto ? 140 : linkedWidth,
      height: selectedShape === 'DIVIDER' ? 4 : (isCirclePhoto ? 140 : (isHeadline ? 48 : (isSubHeadline ? 36 : 140))),
      color: isHeadline ? '#b71c1c' : (isSubHeadline ? '#0d47a1' : (textColor || '#000000')),
      text: isHeadline
        ? defaultHeadlineText
        : (isSubHeadline ? defaultSubHeadlineText : (selectedShape === 'RECTANGLE' ? 'ఇక్కడ మీ వార్త టైప్ చేయండి...' : '')),
      fontSize: autoSize,
      singleLine: isHeadline || isSubHeadline,
      manualFontSize: false,
      bgColor: isHeadline ? '#fff8e1' : (isSubHeadline ? '#f3f8ff' : '#ffffff'),
      imageUrl: null,
      isVerticalPhoto: false,
      photoZoom: 1,
      photoOffsetY: 0
    };

    setPagesElements(prev => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), newElement]
    }));
    setSelectedElementId(newElement.id);
    setSelectedShape(null);
    setActiveTool('POINTER');
  };

  const handleUpdateElement = (id, updates) => {
    setPagesElements(prev => {
      const pageEls = prev[currentPage] || [];
      const targetEl = pageEls.find(el => el.id === id);
      const isResizingRectangle = targetEl && targetEl.type === 'RECTANGLE' && typeof updates.width === 'number';

      const updatedEls = pageEls.map(el => {
        if (el.id === id) {
          const nextEl = { ...el, ...updates };
          if ((nextEl.type === 'HEADLINE' || nextEl.type === 'SUB_HEADLINE') && nextEl.singleLine) {
            // టెక్స్ట్ కొత్తగా మారితే లేదా కాపీ/పేస్ట్ చేస్తే గ్రిడ్ వెడల్పుకు తగ్గట్టు ఆటో-సైజ్ అప్‌డేట్ అవుతుంది
            if (typeof updates.text === 'string' && updates.text !== el.text) {
              nextEl.fontSize = calculateSingleLineFontSize(
                nextEl.text,
                nextEl.width,
                nextEl.type === 'SUB_HEADLINE'
              );
              nextEl.manualFontSize = false;
            } else if (typeof updates.width === 'number' && !nextEl.manualFontSize) {
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
              selectedShape={selectedShape}
              onClearShape={() => setSelectedShape(null)}
            />

            <RightStylePanel 
              selectedFont={selectedFont}
              onColorSelect={handleColorSelect} 
              onFontSelect={handleFontSelect} 
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
