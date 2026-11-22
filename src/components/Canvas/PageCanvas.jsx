import React, { useState, useRef, useEffect } from 'react';
import { getWrapStyle, handleTextFlow } from '../../utils/gridEngine';
import { getNewspaperDate } from '../../utils/dateEngine';
import { calculateSingleLineFontSize } from '../../App';

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
  activeTool = 'POINTER',
  selectedShape = null,
  onClearShape
}) {
  const { dateString } = getNewspaperDate();
  const canvasRef = useRef(null);
  const editableRefs = useRef({});
  const savedRangeRef = useRef(null);
  const lastStyledSpanRef = useRef(null);

  const [draggingId, setDraggingId] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (activeTool === 'POINTER' && !selectedShape) {
      setEditingId(null);
    }
  }, [activeTool, selectedShape]);

  // ఎడిట్ చేసే బాక్స్‌లోకి కర్సర్ వెంటనే బ్లింక్ అయ్యేలా ఫోకస్
  useEffect(() => {
    const targetId = editingId || (activeTool === 'TEXT' ? selectedElementId : null);
    if (targetId && editableRefs.current[targetId]) {
      const timer = setTimeout(() => {
        const elNode = editableRefs.current[targetId];
        if (elNode) {
          elNode.focus();
        }
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [editingId, selectedElementId, activeTool]);

  const saveCurrentSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed && selection.toString().trim().length > 0) {
        savedRangeRef.current = range.cloneRange();
        return range;
      }
    }
    return null;
  };

  // సెలెక్ట్ చేసిన పదాలకు మాత్రమే స్టైల్ లేదా అండర్‌లైన్ వర్తింపజేసే ఫంక్షన్
  const applyStyleToSelectedWords = (styleFn) => {
    const selection = window.getSelection();
    let targetRange = null;

    if (selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed) {
      targetRange = selection.getRangeAt(0);
    } else if (savedRangeRef.current) {
      targetRange = savedRangeRef.current.cloneRange();
    }

    if (!targetRange || targetRange.collapsed) return;

    const commonAncestor = targetRange.commonAncestorContainer;
    const existingSpan =
      commonAncestor?.nodeType === 1 && commonAncestor.tagName === 'SPAN'
        ? commonAncestor
        : commonAncestor?.parentElement?.closest('span[data-sathvika-run="true"]');

    if (existingSpan && existingSpan.innerText === targetRange.toString()) {
      styleFn(existingSpan);
      lastStyledSpanRef.current = existingSpan;
      return;
    }

    const span = document.createElement('span');
    span.setAttribute('data-sathvika-run', 'true');
    styleFn(span);

    try {
      targetRange.surroundContents(span);
    } catch (err) {
      const fragment = targetRange.extractContents();
      span.appendChild(fragment);
      targetRange.insertNode(span);
    }

    lastStyledSpanRef.current = span;

    if (selection) {
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(newRange);
      savedRangeRef.current = newRange.cloneRange();
    }
  };

  // సబ్-హెడ్‌లైన్ లేదా సెలెక్ట్ చేసిన లైన్ ముందు బుల్లెట్ గుర్తు చేర్చడం
  useEffect(() => {
    const handleInsertBullet = (e) => {
      const bulletChar = e.detail?.bullet || '•';
      const targetId = selectedElementId || editingId;
      const boxNode = targetId ? editableRefs.current[targetId] : null;
      if (!boxNode) return;

      const currentText = boxNode.innerText || '';
      const cleanBullet = bulletChar.trim();
      const prefixedText = currentText.startsWith(cleanBullet)
        ? currentText
        : `${cleanBullet} ${currentText}`;

      boxNode.innerText = prefixedText;
      if (onUpdateElement && targetId) {
        onUpdateElement(targetId, { text: prefixedText, htmlContent: boxNode.innerHTML });
      }
    };

    window.addEventListener('SATHVIKA_INSERT_BULLET', handleInsertBullet);
    return () => window.removeEventListener('SATHVIKA_INSERT_BULLET', handleInsertBullet);
  }, [selectedElementId, editingId, onUpdateElement]);

  // బయటి నుండి (BottomStyleBar / RightStylePanel) వచ్చే ఫార్మాటింగ్ ఈవెంట్లు
  useEffect(() => {
    const handleExternalFormat = (e) => {
      const { kind, value } = e.detail || {};

      if (kind === 'ALIGN') {
        const targetId = selectedElementId || editingId;
        if (targetId && onUpdateElement) {
          const alignMap = {
            justifyLeft: 'left',
            justifyCenter: 'center',
            justifyRight: 'right'
          };
          onUpdateElement(targetId, { textAlign: alignMap[value] || 'justify' });
        }
        return;
      }

      if (kind === 'FONT_FAMILY') {
        if (savedRangeRef.current || lastStyledSpanRef.current) {
          applyStyleToSelectedWords((span) => {
            span.style.fontFamily = value;
          });
        } else if (selectedElementId && onUpdateElement) {
          onUpdateElement(selectedElementId, { fontFamily: value });
        }
        return;
      }

      if (!savedRangeRef.current && !lastStyledSpanRef.current) return;

      if (kind === 'COLOR') {
        applyStyleToSelectedWords((span) => {
          span.style.color = value;
          if (span.style.textDecorationLine && span.style.textDecorationLine.includes('underline')) {
            span.style.textDecorationColor = value;
          }
        });
      } else if (kind === 'UNDERLINE') {
        applyStyleToSelectedWords((span) => {
          const activeColor = span.style.color || '#000000';
          span.style.textDecoration = 'underline';
          span.style.textDecorationColor = activeColor;
          span.style.textUnderlineOffset = '2px';
        });
      } else if (kind === 'BOLD') {
        applyStyleToSelectedWords((span) => {
          if (value === 'EXTRA_BOLD') {
            span.style.fontWeight = '900';
            span.style.textShadow = '0.5px 0.5px 0px rgba(0,0,0,0.4)';
          } else if (value === 'MEDIUM_BOLD') {
            span.style.fontWeight = '600';
            span.style.textShadow = 'none';
          } else if (value === 'NORMAL_BOLD') {
            span.style.fontWeight = 'bold';
            span.style.textShadow = 'none';
          } else {
            span.style.fontWeight = 'normal';
            span.style.textShadow = 'none';
          }
        });
      } else if (kind === 'FONT_SIZE') {
        applyStyleToSelectedWords((span) => {
          span.style.fontSize = `${value}pt`;
        });
      }
    };

    window.addEventListener('SATHVIKA_APPLY_FORMAT', handleExternalFormat);
    return () => window.removeEventListener('SATHVIKA_APPLY_FORMAT', handleExternalFormat);
  }, [selectedElementId, editingId, onUpdateElement]);

  const handleMouseMove = (e) => {
    if (!canvasRef.current || activeTool === 'TEXT' || selectedShape) return;
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
    saveCurrentSelection();
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
          const diameter = Math.max(el.width || 140, el.height || 140, 120);
          if (onUpdateElement) {
            onUpdateElement(el.id, { 
              imageUrl: event.target.result,
              width: diameter,
              height: diameter,
              photoZoom: 1,
              photoOffsetY: 0,
              isVerticalPhoto: isVertical
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
          if (selectedShape) {
            if (onCanvasClick) onCanvasClick(e);
            if (onClearShape) onClearShape();
            return;
          }

          if (activeTool === 'TEXT' || editingId !== null) return;
          if (activeTool === 'POINTER') {
            setEditingId(null);
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
          cursor: selectedShape ? 'crosshair' : (activeTool === 'TEXT' ? 'text' : 'default'),
          userSelect: activeTool === 'TEXT' || editingId !== null ? 'text' : 'none'
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

        {canvasElements.map((el) => {
          const isSelected = selectedElementId === el.id;
          const isTextEditableBox = el.type === 'RECTANGLE' || el.type === 'HEADLINE' || el.type === 'SUB_HEADLINE';
          const isEditing = editingId === el.id || (activeTool === 'TEXT' && isSelected) || (el.type === 'RECTANGLE' && isSelected);
          const overlappingImages = el.type === 'RECTANGLE' ? getOverlappingImages(el) : [];
          const isPageOne = pageNumber === 1;

          const flowResult = (el.type === 'RECTANGLE' && isPageOne && el.text)
            ? handleTextFlow(el.text, el.height, el.fontSize || fontSize, 1)
            : { page1Content: el.text, hasOverflow: false };

          const currentZoom = el.photoZoom || 1;
          const currentOffsetY = el.photoOffsetY || 0;

          // సబ్-హెడ్‌లైన్ పెట్టినప్పుడు/టైప్ చేసినప్పుడు గ్రిడ్ కిందకి పెరిగేలా ఎత్తు లెక్కింపు
          const computedHeight =
            el.type === 'SUB_HEADLINE'
              ? Math.max(el.height || 34, ((el.text || '').split('\n').length) * ((el.fontSize || 16) * 1.35) + 12)
              : el.height;

          return (
            <div
              key={el.id}
              onMouseDown={(e) => {
                if (selectedShape) return;

                if (activeTool === 'TEXT') {
                  e.stopPropagation();
                  if (onSelectElement) onSelectElement(el.id);
                  if (isTextEditableBox) {
                    setEditingId(el.id);
                    setTimeout(() => editableRefs.current[el.id]?.focus(), 0);
                  }
                  return;
                }
                if (activeTool !== 'POINTER') return;

                e.stopPropagation();
                if (onSelectElement) onSelectElement(el.id);

                const rect = e.currentTarget.getBoundingClientRect();
                setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                setDraggingId(el.id);
              }}
              onClick={(e) => {
                if (selectedShape) return;
                if (activeTool !== 'POINTER' && activeTool !== 'TEXT') return;

                e.stopPropagation();
                if (onSelectElement) onSelectElement(el.id);
                if (isTextEditableBox) {
                  setEditingId(el.id);
                  setTimeout(() => editableRefs.current[el.id]?.focus(), 0);
                }
              }}
              style={{
                position: 'absolute',
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: `${el.width}px`,
                height: (el.type === 'RECTANGLE' && !isPageOne) ? 'auto' : `${computedHeight}px`,
                minHeight: `${el.height}px`,
                border: isSelected ? '2px solid #1976d2' : '1px solid #888',
                background: el.bgColor || (el.type === 'PICTURE' || el.type === 'CIRCLE_PHOTO' ? '#f0f0f0' : 'transparent'),
                color: el.color || '#000',
                borderRadius: el.type === 'CIRCLE' || el.type === 'CIRCLE_PHOTO' ? '50%' : el.type === 'OVAL' ? '50% / 30%' : '0px',
                padding: el.type === 'CIRCLE_PHOTO' ? '0px' : '4px 6px',
                boxSizing: 'border-box',
                cursor: selectedShape ? 'crosshair' : (activeTool === 'TEXT' && isTextEditableBox ? 'text' : (activeTool === 'POINTER' ? 'move' : 'default')),
                zIndex: (el.type === 'PICTURE' || el.type === 'CIRCLE_PHOTO') ? 10 : 5,
                overflow: 'hidden',
                userSelect: isTextEditableBox ? 'text' : 'none'
              }}
            >
              {isSelected && activeTool === 'POINTER' && !selectedShape && (
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
                    title="ఈ గ్రిడ్ బాక్స్ బ్యాక్‌గ్రౌండ్ కలర్ మారుతుంది"
                    style={{ width: '18px', height: '18px', border: 'none', padding: 0, cursor: 'pointer', background: 'transparent' }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteElement) onDeleteElement(el.id);
                    }}
                    title="ఈ గ్రిడ్ డిలీట్ చేయండి"
                    style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', padding: '0 5px' }}
                  >
                    ×
                  </button>
                </div>
              )}

              {isSelected && el.type === 'CIRCLE_PHOTO' && el.imageUrl && (
                <div
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    bottom: '-28px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '3px',
                    background: '#222',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    zIndex: 70,
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                  }}
                >
                  <button
                    onClick={() => {
                      const nextSize = Math.max(60, el.width - 15);
                      onUpdateElement(el.id, { width: nextSize, height: nextSize });
                    }}
                    title="రౌండ్ ఫోటో సైజ్ తగ్గించండి"
                    style={{ background: '#444', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '10px', padding: '2px 5px', cursor: 'pointer' }}
                  >
                    సైజ్-
                  </button>
                  <button
                    onClick={() => {
                      const nextSize = Math.min(360, el.width + 15);
                      onUpdateElement(el.id, { width: nextSize, height: nextSize });
                    }}
                    title="రౌండ్ ఫోటో సైజ్ పెంచండి"
                    style={{ background: '#444', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '10px', padding: '2px 5px', cursor: 'pointer' }}
                  >
                    సైజ్+
                  </button>
                  <button
                    onClick={() => onUpdateElement(el.id, { photoZoom: Math.max(1, +(currentZoom - 0.2).toFixed(1)) })}
                    title="లోపలి ఫోటో జూమ్ అవుట్"
                    style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '10px', padding: '2px 5px', cursor: 'pointer' }}
                  >
                    🔍-
                  </button>
                  <button
                    onClick={() => onUpdateElement(el.id, { photoZoom: Math.min(3, +(currentZoom + 0.2).toFixed(1)) })}
                    title="లోపలి ఫోటో జూమ్ ఇన్"
                    style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '10px', padding: '2px 5px', cursor: 'pointer' }}
                  >
                    🔍+
                  </button>
                  <button
                    onClick={() => onUpdateElement(el.id, { photoOffsetY: currentOffsetY - 8 })}
                    title="లోపలి ఫోటో పైకి జరపండి"
                    style={{ background: '#555', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '10px', padding: '2px 5px', cursor: 'pointer' }}
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => onUpdateElement(el.id, { photoOffsetY: currentOffsetY + 8 })}
                    title="లోపలి ఫోటో కిందకి జరపండి"
                    style={{ background: '#555', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '10px', padding: '2px 5px', cursor: 'pointer' }}
                  >
                    ▼
                  </button>
                </div>
              )}

              {(el.type === 'PICTURE' || el.type === 'CIRCLE_PHOTO') && (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderRadius: el.type === 'CIRCLE_PHOTO' ? '50%' : '0px' }}>
                  {!el.imageUrl ? (
                    <label style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: 0 }}>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, el)} style={{ display: 'none' }} />
                      <span style={{ fontSize: '11px', color: '#555', textAlign: 'center', padding: '4px' }}>
                        {el.type === 'CIRCLE_PHOTO' ? '⊗ బంతి ఆకారం ఫోటో' : '📷 ఫోటో అప్‌లోడ్ చేయండి'}
                      </span>
                    </label>
                  ) : (
                    <img
                      src={el.imageUrl}
                      alt="Uploaded"
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: el.type === 'CIRCLE_PHOTO' ? '50%' : '0px',
                        transform: el.type === 'CIRCLE_PHOTO'
                          ? `scale(${currentZoom}) translateY(${currentOffsetY}px)`
                          : 'none',
                        transformOrigin: 'center center',
                        transition: 'transform 0.12s ease-out',
                        pointerEvents: 'none'
                      }}
                    />
                  )}
                </div>
              )}

              {el.type === 'DIVIDER' && <div style={{ width: '100%', height: '2px', background: el.color || '#000' }} />}
              
              {isTextEditableBox && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    textAlign: el.textAlign || (el.type === 'RECTANGLE' ? 'justify' : 'left'),
                    lineHeight: (el.type === 'HEADLINE' || el.type === 'SUB_HEADLINE') ? '1.15' : '1.35',
                    overflow: 'hidden'
                  }}
                >
                  {overlappingImages.map(imgEl => {
                    const relLeft = imgEl.x - el.x;
                    const isRightSide = relLeft > (el.width / 2);
                    const wrapCSS = getWrapStyle(isRightSide ? 'FLOAT_RIGHT' : 'FLOAT_LEFT', imgEl.type === 'CIRCLE_PHOTO' ? 'CIRCLE' : 'RECTANGLE', imgEl.isVerticalPhoto);
                    return (
                      <div key={`wrap-${imgEl.id}`} style={{ ...wrapCSS, width: `${Math.min(imgEl.width + 10, el.width * 0.7)}px`, height: `${imgEl.height + 10}px`, shapeOutside: imgEl.type === 'CIRCLE_PHOTO' ? 'circle(50%)' : 'none', pointerEvents: 'none' }} />
                    );
                  })}

                  <div
                    ref={(node) => { editableRefs.current[el.id] = node; }}
                    contentEditable={!selectedShape && (isEditing || activeTool === 'TEXT' || el.type === 'RECTANGLE')}
                    suppressContentEditableWarning={true}
                    onMouseDown={(e) => {
                      if (selectedShape) return;
                      e.stopPropagation();
                      if (onSelectElement) onSelectElement(el.id);
                      setEditingId(el.id);
                    }}
                    onClick={(e) => {
                      if (selectedShape) return;
                      e.stopPropagation();
                      if (onSelectElement) onSelectElement(el.id);
                      setEditingId(el.id);
                      saveCurrentSelection();
                      e.currentTarget.focus();
                    }}
                    onPaste={(e) => {
                      if (!el.singleLine) return;
                      e.preventDefault();
                      const pastedText = (e.clipboardData || window.clipboardData).getData('text/plain') || '';
                      const cleanSingleLine = pastedText.replace(/\s+/g, ' ').trim();
                      e.currentTarget.innerText = cleanSingleLine;
                      const autoSize = calculateSingleLineFontSize(
                        cleanSingleLine,
                        el.width,
                        el.type === 'SUB_HEADLINE'
                      );
                      e.currentTarget.style.fontSize = `${autoSize}pt`;
                      if (onUpdateElement) {
                        onUpdateElement(el.id, {
                          text: cleanSingleLine,
                          fontSize: autoSize,
                          manualFontSize: false
                        });
                      }
                    }}
                    onInput={(e) => {
                      const currentText = e.currentTarget.innerText || '';
                      if (el.singleLine) {
                        const autoSize = calculateSingleLineFontSize(
                          currentText,
                          el.width,
                          el.type === 'SUB_HEADLINE'
                        );
                        e.currentTarget.style.fontSize = `${autoSize}pt`;
                      }
                    }}
                    onMouseUp={handleTextSelection}
                    onKeyUp={handleTextSelection}
                    onBlur={(e) => {
                      saveCurrentSelection();
                      const finalText = e.currentTarget.innerText;
                      if (onUpdateElement) {
                        onUpdateElement(el.id, { text: finalText, htmlContent: e.currentTarget.innerHTML });
                      }
                    }}
                    style={{
                      width: '100%',
                      minHeight: '100%',
                      margin: 0,
                      padding: 0,
                      outline: 'none',
                      fontFamily: el.fontFamily || selectedFont,
                      fontSize: `${el.fontSize || fontSize}pt`,
                      color: el.color || '#000',
                      fontWeight: el.type === 'HEADLINE' ? '900' : (el.type === 'SUB_HEADLINE' ? '600' : 'normal'),
                      lineHeight: (el.type === 'HEADLINE' || el.type === 'SUB_HEADLINE') ? '1.15' : '1.35',
                      wordBreak: el.singleLine ? 'normal' : 'break-word',
                      cursor: selectedShape ? 'crosshair' : 'text',
                      userSelect: 'text',
                      whiteSpace: el.singleLine ? 'nowrap' : 'normal',
                      overflow: el.singleLine ? 'hidden' : 'visible',
                      textOverflow: el.singleLine ? 'clip' : 'clip'
                    }}
                  >
                    {flowResult.page1Content || (el.type === 'HEADLINE' ? "ఇక్కడ హెడ్‌లైన్ టైప్ చేయండి..." : (el.type === 'SUB_HEADLINE' ? "ఇక్కడ సబ్-హెడ్‌లైన్ టైప్ చేయండి..." : "ఇక్కడ మీ వార్త టైప్ చేయండి..."))}
                  </div>
                </div>
              )}

              {isSelected && activeTool === 'POINTER' && !selectedShape && (
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setResizingId(el.id);
                  }}
                  title="లాగి సైజ్ పెంచండి / తగ్గించండి"
                  style={{ position: 'absolute', right: '-6px', bottom: '-6px', width: '12px', height: '12px', background: '#1976d2', border: '2px solid #fff', borderRadius: '50%', cursor: 'nwse-resize', zIndex: 60 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
            }
                  
