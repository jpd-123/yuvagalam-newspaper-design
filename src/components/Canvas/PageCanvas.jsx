import React, { useState, useRef, useEffect } from 'react';
import { getWrapStyle, getHeadlineStyle, handleTextFlow } from '../../utils/gridEngine';
import { getNewspaperDate } from '../../utils/dateEngine';

export default function PageCanvas({ 
  pageTitle, 
  pageNumber = 1, 
  children, 
  bgColor = '#ffffff', 
  selectedFont = 'Gidugu', 
  dimensions = { width: '820px', minHeight: '1160px' },
  onCanvasClick,
  canvasElements = [],
  onUpdateElement,   
  onDeleteElement,   
  selectedElementId,
  onSelectElement,
  fontSize = 12,
  isMasterDesignMode = false,
  volume = 1,
  issue = 12,
  activeTool = 'POINTER' 
}) {
  const { dateString } = getNewspaperDate();
  const canvasRef = useRef(null);

  const [draggingId, setDraggingId] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectionToolbar, setSelectionToolbar] = useState({ show: false, x: 0, y: 0 });

  useEffect(() => {
    if (activeTool === 'POINTER') {
      setEditingId(null);
      setSelectionToolbar({ show: false, x: 0, y: 0 });
    }
  }, [activeTool]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId !== null) {
        if (document.activeElement.isContentEditable || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') {
          return;
        }
        if (onDeleteElement) onDeleteElement(selectedElementId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, onDeleteElement]);

  const handleMouseMove = (e) => {
    if (!canvasRef.current || activeTool === 'TEXT') return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (draggingId) {
      const newX = Math.max(0, mouseX - dragOffset.x);
      const newY = Math.max(0, mouseY - dragOffset.y);
      if (onUpdateElement) onUpdateElement(draggingId, { x: newX, y: newY });
    } else if (resizingId) {
      const targetEl = canvasElements.find(el => el.id === resizingId);
      if (targetEl) {
        const newWidth = Math.max(60, mouseX - targetEl.x);
        const newHeight = Math.max(40, mouseY - targetEl.y);
        // సర్కిల్ ఫోటో / బంతి ఆకారం అయితే వెడల్పు, ఎత్తు ఎప్పుడూ సమానంగా (బంతి ఆకారం) ఉండేలా లాక్ చేయడం
        if (targetEl.type === 'CIRCLE_PHOTO' || targetEl.type === 'CIRCLE') {
          const size = Math.max(newWidth, newHeight);
          if (onUpdateElement) onUpdateElement(resizingId, { width: size, height: size });
        } else {
          if (onUpdateElement) onUpdateElement(resizingId, { width: newWidth, height: newHeight });
        }
      }
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setResizingId(null);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0 && canvasRef.current) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setSelectionToolbar({
        show: true,
        x: rect.left - canvasRect.left,
        y: Math.max(10, rect.top - canvasRect.top - 45)
      });
    } else {
      setSelectionToolbar({ show: false, x: 0, y: 0 });
    }
  };

  const applyInlineStyle = (styleType, value) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');

    if (styleType === 'MAIN_HEADLINE') {
      const hStyle = getHeadlineStyle('MAIN_HEADLINE');
      Object.assign(span.style, hStyle, { fontSize: `${fontSize + 8}pt` });
    } else if (styleType === 'SUB_HEADLINE') {
      const subStyle = getHeadlineStyle('SUB_HEADLINE');
      Object.assign(span.style, subStyle, { fontSize: `${fontSize + 3}pt` });
    } else if (styleType === 'DATELINE') {
      const dateStyle = getHeadlineStyle('DATELINE');
      Object.assign(span.style, dateStyle, { fontSize: `${fontSize}pt` });
    } else if (styleType === 'COLOR') {
      span.style.color = value;
    } else if (styleType === 'FONT_SIZE') {
      span.style.fontSize = `${value}pt`;
    }

    try {
      range.surroundContents(span);
    } catch (err) {
      if (styleType === 'COLOR') document.execCommand('foreColor', false, value);
      if (styleType === 'MAIN_HEADLINE' || styleType === 'SUB_HEADLINE') document.execCommand('bold', false, null);
    }
    setSelectionToolbar({ show: false, x: 0, y: 0 });
  };

  const handleImageUpload = (e, el) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const isVertical = img.height > img.width;
        const aspectRatio = img.width / img.height;

        if (el.type === 'CIRCLE_PHOTO') {
          // బంతి ఆకారం (సర్కిల్) అయితే బాక్స్ వెడల్పు ఎత్తు సమానంగా ఉంచి ఇమేజ్ అప్‌డేట్ చేయడం
          if (onUpdateElement) {
            onUpdateElement(el.id, { 
              imageUrl: event.target.result,
              width: Math.max(el.width, el.height),
              height: Math.max(el.width, el.height)
            });
          }
        } else {
          const adjustedHeight = Math.round(el.width / aspectRatio);
          if (onUpdateElement) {
            onUpdateElement(el.id, {
              imageUrl: event.target.result,
              height: adjustedHeight,
              isVerticalPhoto: isVertical
            });
          }
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const getOverlappingImages = (textEl) => {
    return canvasElements.filter(other => 
      (other.type === 'PICTURE' || other.type === 'CIRCLE_PHOTO') &&
      other.x < textEl.x + textEl.width &&
      other.x + other.width > textEl.x &&
      other.y < textEl.y + textEl.height &&
      other.y + other.height > textEl.y
    );
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ flex: 1, background: '#444', overflowY: 'auto', padding: '20px', display: 'flex', justifyContent: 'center' }}
    >
      <div 
        ref={canvasRef}
        onClick={(e) => {
          if (activeTool === 'POINTER') {
            setEditingId(null);
            setSelectionToolbar({ show: false, x: 0, y: 0 });
          }
          if (onCanvasClick) onCanvasClick(e);
        }}
        style={{ 
          width: dimensions.width, 
          minHeight: dimensions.minHeight, 
          background: bgColor, 
          boxShadow: '0 0 20px rgba(0,0,0,0.6)', 
          padding: '20px',
          fontFamily: selectedFont,
          boxSizing: 'border-box',
          position: 'relative',
          cursor: activeTool === 'TEXT' ? 'text' : 'default',
          userSelect: editingId && activeTool === 'TEXT' ? 'text' : 'none'
        }}
      >
        {!isMasterDesignMode && (
          <div style={{ borderBottom: '2px solid #333', paddingBottom: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
            <div>సంపుటి: {volume} | సంచిక: {issue}</div>
            <div style={{ color: '#d32f2f', fontSize: '14px' }}>{pageTitle || "యువగళం దినపత్రిక"}</div>
            <div>తేదీ: {dateString}</div>
          </div>
        )}

        {children}

        {selectionToolbar.show && activeTool === 'TEXT' && (
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: `${selectionToolbar.x}px`,
              top: `${selectionToolbar.y}px`,
              background: '#222',
              color: '#fff',
              padding: '5px 8px',
              borderRadius: '6px',
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              fontSize: '11px'
            }}
          >
            <button onClick={() => applyInlineStyle('MAIN_HEADLINE')} style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }} title="హెడ్‌లైన్ (Extra Bold)">H1</button>
            <button onClick={() => applyInlineStyle('SUB_HEADLINE')} style={{ background: '#444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }} title="సబ్ హెడ్‌లైన్">H2</button>
            <button onClick={() => applyInlineStyle('DATELINE')} style={{ background: '#444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }} title="బాడీ టెక్స్ట్">Body</button>
            <span style={{ color: '#666' }}>|</span>
            <button onClick={() => applyInlineStyle('FONT_SIZE', fontSize + 4)} style={{ background: '#333', color: '#fff', border: '1px solid #555', padding: '2px 5px', cursor: 'pointer' }}>A+</button>
            <button onClick={() => applyInlineStyle('FONT_SIZE', Math.max(9, fontSize - 2))} style={{ background: '#333', color: '#fff', border: '1px solid #555', padding: '2px 5px', cursor: 'pointer' }}>A-</button>
            <input 
              type="color" 
              onChange={(e) => applyInlineStyle('COLOR', e.target.value)} 
              title="అక్షరాల రంగు"
              style={{ width: '20px', height: '20px', border: 'none', background: 'transparent', cursor: 'pointer' }} 
            />
          </div>
        )}

        {canvasElements.map((el) => {
          const isSelected = selectedElementId === el.id;
          const isEditing = (activeTool === 'TEXT' && isSelected) || editingId === el.id;
          const overlappingImages = el.type === 'RECTANGLE' ? getOverlappingImages(el) : [];
          const isPageOne = pageNumber === 1;

          const flowResult = (el.type === 'RECTANGLE' && isPageOne && el.text)
            ? handleTextFlow(el.text, el.height, fontSize, 1)
            : { page1Content: el.text, hasOverflow: false };

          return (
            <div
              key={el.id}
              onMouseDown={(e) => {
                if (activeTool === 'TEXT') return;
                e.stopPropagation();
                if (onSelectElement) onSelectElement(el.id);

                if (activeTool === 'POINTER') {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  setDraggingId(el.id);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectElement) onSelectElement(el.id);
                if (activeTool === 'TEXT' && el.type === 'RECTANGLE') {
                  setEditingId(el.id);
                }
              }}
              style={{
                position: 'absolute',
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: `${el.width}px`,
                height: (el.type === 'RECTANGLE' && !isPageOne) ? 'auto' : `${el.height}px`,
                minHeight: `${el.height}px`,
                border: isSelected ? '2px solid #1976d2' : '1px solid #888',
                background: el.bgColor || (el.type === 'PICTURE' || el.type === 'CIRCLE_PHOTO' ? '#f0f0f0' : 'transparent'),
                color: el.color || '#000',
                borderRadius: el.type === 'CIRCLE' || el.type === 'CIRCLE_PHOTO' ? '50%' : el.type === 'OVAL' ? '50% / 30%' : '0px',
                padding: '6px',
                boxSizing: 'border-box',
                cursor: activeTool === 'TEXT' && el.type === 'RECTANGLE' ? 'text' : (activeTool === 'POINTER' ? 'move' : 'default'),
                zIndex: (el.type === 'PICTURE' || el.type === 'CIRCLE_PHOTO') ? 10 : 5,
                overflow: 'hidden'
              }}
            >
              {isSelected && activeTool === 'POINTER' && (
                <div 
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: '-24px',
                    right: '0px',
                    display: 'flex',
                    gap: '6px',
                    background: '#1976d2',
                    padding: '3px 8px',
                    borderRadius: '4px 4px 0 0',
                    zIndex: 50,
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '10px', color: '#fff' }}>బాక్స్ కలర్:</span>
                  <input 
                    type="color" 
                    value={el.bgColor || '#ffffff'}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (onUpdateElement) onUpdateElement(el.id, { bgColor: e.target.value });
                    }}
                    title="ఈ గ్రిడ్ బాక్స్ బ్యాక్‌గ్రౌండ్ కలర్ మాత్రమే మారుతుంది"
                    style={{ width: '18px', height: '18px', border: 'none', padding: 0, cursor: 'pointer', background: 'transparent' }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteElement) onDeleteElement(el.id);
                    }}
                    title="ఈ గ్రిడ్ డిలీట్ చేయండి"
                    style={{
                      background: '#d32f2f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '2px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      padding: '0 5px'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              {(el.type === 'PICTURE' || el.type === 'CIRCLE_PHOTO') && (
                <label style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: 0 }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, el)} 
                    style={{ display: 'none' }} 
                  />
                  {el.imageUrl ? (
                    <img 
                      src={el.imageUrl} 
                      alt="Uploaded" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        borderRadius: el.type === 'CIRCLE_PHOTO' ? '50%' : '0px'
                      }} 
                    />
                  ) : (
                    <span style={{ fontSize: '11px', color: '#555', textAlign: 'center', padding: '4px' }}>
                      {el.type === 'CIRCLE_PHOTO' ? '⊗ బంతి ఆకారం ఫోటో' : '📷 ఫోటో అప్‌లోడ్ చేయండి'}
                    </span>
                  )}
                </label>
              )}

              {el.type === 'DIVIDER' && <div style={{ width: '100%', height: '2px', background: el.color || '#000' }} />}
              
              {el.type === 'RECTANGLE' && (
                <div style={{ width: '100%', height: '100%', position: 'relative', textAlign: 'justify', lineHeight: '1.35', overflowY: 'auto' }}>
                  {overlappingImages.map(imgEl => {
                    const relLeft = imgEl.x - el.x;
                    const isRightSide = relLeft > (el.width / 2);
                    const wrapCSS = getWrapStyle(
                      isRightSide ? 'FLOAT_RIGHT' : 'FLOAT_LEFT',
                      imgEl.type === 'CIRCLE_PHOTO' ? 'CIRCLE' : 'RECTANGLE',
                      imgEl.isVerticalPhoto
                    );
                    return (
                      <div
                        key={`wrap-${imgEl.id}`}
                        style={{
                          ...wrapCSS,
                          width: `${Math.min(imgEl.width + 10, el.width * 0.7)}px`,
                          height: `${imgEl.height + 10}px`,
                          shapeOutside: imgEl.type === 'CIRCLE_PHOTO' ? 'circle(50%)' : 'none',
                          pointerEvents: 'none'
                        }}
                      />
                    );
                  })}

                  <div
                    contentEditable={isEditing && activeTool === 'TEXT'}
                    suppressContentEditableWarning={true}
                    onMouseUp={handleTextSelection}
                    onKeyUp={handleTextSelection}
                    onBlur={(e) => {
                      if (onUpdateElement) {
                        onUpdateElement(el.id, { text: e.currentTarget.innerText, htmlContent: e.currentTarget.innerHTML });
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      outline: 'none',
                      fontFamily: selectedFont,
                      fontSize: `${fontSize}pt`,
                      color: el.color || '#000',
                      wordBreak: 'break-word',
                      cursor: activeTool === 'TEXT' ? 'text' : 'default'
                    }}
                  >
                    {flowResult.page1Content || "T టూల్ సెలెక్ట్ చేసి ఇక్కడ వార్త రాయండి లేదా పేస్ట్ చేయండి..."}
                  </div>
                </div>
              )}

              {isSelected && activeTool === 'POINTER' && (
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setResizingId(el.id);
                  }}
                  title="లాగి సైజ్ పెంచండి / తగ్గించండి"
                  style={{
                    position: 'absolute',
                    right: '-6px',
                    bottom: '-6px',
                    width: '12px',
                    height: '12px',
                    background: '#1976d2',
                    border: '2px solid #fff',
                    borderRadius: '50%',
                    cursor: el.type === 'CIRCLE_PHOTO' ? 'se-resize' : 'nwse-resize',
                    zIndex: 60
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
