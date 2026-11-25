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

export const calculateSingleLineFontSize = (text, boxWidth, isSubHeadline = false) => {
  const usableWidth = Math.max(70, (boxWidth || 300) - 20);
  const cleanText = (text || '').trim();
  const cleanLength = Math.max(1, cleanText.length);
  const maxAllowed = isSubHeadline ? 22 : 30;
  const minAllowed = isSubHeadline ? 9 : 11;

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

  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const isMobileView = screenWidth < 768;
  const [mobilePanel, setMobilePanel] = useState('CANVAS'); // 'CANVAS' | 'LEFT' | 'RIGHT'
  const [zoomBoost, setZoomBoost] = useState(0); // -0.2 నుండి +0.5 వరకు

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const getPaperDimensions = () => {
    switch (paperSize) {
      case 'A3 సైజ్': return { width: '700px', minHeight: '990px' };
      case 'మీడియం సైజ్': return { width: '750px', minHeight: '1050px' };
      case 'జిల్లా టాబ్లెట్': return { width: '650px', minHeight: '900px' };
      default: return { width: '820px', minHeight: '1160px' };
    }
  };
  const dimensions = getPaperDimensions();
  const rawPaperWidth = parseInt(dimensions.width, 10) || 820;
  const rawPaperHeight = parseInt(dimensions.minHeight, 10) || 1160;

  // మొబైల్ స్క్రీన్‌లో వైట్ పేపర్ మొత్తం వెడల్పు పట్టేలా ఆటో స్కేల్
  const fitScale = isMobileView
    ? Math.max(0.25, Math.min(1, (screenWidth - 24) / rawPaperWidth))
    : 1;
  const effectiveScale = isMobileView
    ? Math.max(0.25, Math.min(1.5, +(fitScale + zoomBoost).toFixed(2)))
    : 1;

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
    if (selectedElementId !== null) {
      setPagesElements(prev => ({
        ...prev,
        [currentPage]: (prev[currentPage] || []).map(el =>
          el.id === selectedElementId ? { ...el, fontFamily: font } : el
        )
      }));
    }
  };

  const handleColorSelect = (type, color, targetMode = 'AUTO') => {
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
    const x = (e.clientX - canvasRect.left) / effectiveScale;
    const y = (e.clientY - canvasRect.top) / effectiveScale;

    const isHeadline = selectedShape === 'HEADLINE';
    const isSubHeadline = selectedShape === 'SUB_HEADLINE';
    const isCirclePhoto = selectedShape === 'CIRCLE_PHOTO';
    const targetGrid = (isHeadline || isSubHeadline) ? findTargetNewsGrid(currentCanvasElements, x, y) : null;

    const linkedWidth = targetGrid ? targetGrid.width : (isHeadline || isSubHeadline ? 320 : 240);
    const linkedX = targetGrid ? targetGrid.x : Math.max(10, x - 120);

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
    if (isMobileView) setMobilePanel('CANVAS');
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

          <div style={{ background: '#eee', padding: '5px 12px', fontSize: '12px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 'bold' }}>వర్క్‌స్పేస్: {paperSize}</span>

            {isMobileView && mobilePanel === 'CANVAS' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => setZoomBoost(b => Math.max(-0.2, +(b - 0.1).toFixed(2)))}
                  style={{ padding: '2px 7px', background: '#444', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ fontWeight: 'bold' }}>{Math.round(effectiveScale * 100)}%</span>
                <button
                  onClick={() => setZoomBoost(b => Math.min(0.6, +(b + 0.1).toFixed(2)))}
                  style={{ padding: '2px 7px', background: '#444', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                >
                  +
                </button>
                <button
                  onClick={() => setZoomBoost(0)}
                  style={{ padding: '2px 6px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}
                >
                  Fit
                </button>
              </div>
            )}

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

          {isMobileView && (
            <div style={{ display: 'flex', background: '#333', borderBottom: '1px solid #555' }}>
              <button
                onClick={() => setMobilePanel('CANVAS')}
                style={{ flex: 1, padding: '8px', background: mobilePanel === 'CANVAS' ? '#2e7d32' : '#333', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                📄 వైట్ పేపర్ వ్యూ
              </button>
              <button
                onClick={() => setMobilePanel('LEFT')}
                style={{ flex: 1, padding: '8px', background: mobilePanel === 'LEFT' ? '#1976d2' : '#333', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🛠 టూల్స్ & గ్రిడ్స్
              </button>
              <button
                onClick={() => setMobilePanel('RIGHT')}
                style={{ flex: 1, padding: '8px', background: mobilePanel === 'RIGHT' ? '#1976d2' : '#333', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🎨 ఫాంట్ & కలర్స్
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
            {(!isMobileView || mobilePanel === 'LEFT') && (
              <LeftToolPanel 
                onSelectTool={(tool) => {
                  setActiveTool(tool);
                  if (isMobileView && tool === 'TEXT') setMobilePanel('CANVAS');
                }}
                onSelectShape={(shape) => {
                  setSelectedShape(shape);
                  if (isMobileView && shape) setMobilePanel('CANVAS');
                }}
                onPageSizeChange={(size) => setPaperSize(size)}
                onPageCountChange={(count) => setPageCount(count)}
                onAutoPageSetup={() => alert('ఆటో పేజీ సెటప్ రన్ అయింది!')}
                onColorSelect={handleColorSelect}
              />
            )}

            {(!isMobileView || mobilePanel === 'CANVAS') && (
              <div
                style={{
                  flex: 1,
                  background: '#444',
                  overflow: 'auto',
                  display: 'flex',
                  justifyContent: isMobileView && effectiveScale <= fitScale ? 'center' : 'flex-start',
                  alignItems: 'flex-start',
                  padding: isMobileView ? '12px' : '0px',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: isMobileView ? `${Math.round(rawPaperWidth * effectiveScale)}px` : '100%',
                    height: isMobileView ? `${Math.round(rawPaperHeight * effectiveScale)}px` : '100%',
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  <div
                    style={{
                      transform: isMobileView ? `scale(${effectiveScale})` : 'none',
                      transformOrigin: 'top left',
                      width: dimensions.width,
                      minHeight: dimensions.minHeight,
                      display: 'flex'
                    }}
                  >
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
                  </div>
                </div>

                {isMobileView && (
                  <div
                    style={{
                      position: 'sticky',
                      bottom: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(34,34,34,0.95)',
                      padding: '6px 10px',
                      borderRadius: '20px',
                      display: 'flex',
                      gap: '6px',
                      zIndex: 80,
                      boxShadow: '0 3px 10px rgba(0,0,0,0.5)'
                    }}
                  >
                    <button
                      onClick={() => { setSelectedShape('HEADLINE'); setActiveTool('HEADLINE_BOX'); }}
                      style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '12px', padding: '5px 9px', fontSize: '11px', fontWeight: 'bold' }}
                    >
                      + H1
                    </button>
                    <button
                      onClick={() => { setSelectedShape('SUB_HEADLINE'); setActiveTool('SUB_HEADLINE_BOX'); }}
                      style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '12px', padding: '5px 9px', fontSize: '11px', fontWeight: 'bold' }}
                    >
                      + H2
                    </button>
                    <button
                      onClick={() => { setSelectedShape('RECTANGLE'); setActiveTool('SHAPE'); }}
                      style={{ background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '12px', padding: '5px 9px', fontSize: '11px', fontWeight: 'bold' }}
                    >
                      + గ్రిడ్
                    </button>
                  </div>
                )}
              </div>
            )}

            {(!isMobileView || mobilePanel === 'RIGHT') && (
              <RightStylePanel 
                selectedFont={selectedFont}
                onColorSelect={handleColorSelect} 
                onFontSelect={handleFontSelect} 
              />
            )}
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
