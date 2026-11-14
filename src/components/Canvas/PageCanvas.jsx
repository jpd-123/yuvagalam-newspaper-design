import React, { useState, useRef, useEffect } from 'react';
import { getWrapStyle, getHeadlineStyle, handleTextFlow } from '../../utils/gridEngine';
import { getNewspaperDate } from '../../utils/dateEngine';

export default function PageCanvas({ 
  pageTitle, 
  pageNumber = 1, // 1వ పేజీ అయితే Fixed Grid + Overflow, 2+ పేజీలు అయితే Dynamic Growth
  children, 
  bgColor = '#ffffff', 
  selectedFont = 'Gidugu', 
  dimensions = { width: '820px', minHeight: '1160px' },
  onCanvasClick,
  canvasElements = [],
  onUpdateElement,   // గ్రిడ్ పొజిషన్, సైజ్, టెక్స్ట్, ఇమేజ్ అప్‌డేట్ చేయడానికి
  onDeleteElement,   // అనవసర గ్రిడ్ డిలీట్ చేయడానికి
  selectedElementId,
  onSelectElement,
  fontSize = 12,
  isMasterDesignMode = false,
  volume = 1,
  issue = 12
}) {
  const { dateString } = getNewspaperDate();
  const canvasRef = useRef(null);

  // డ్రాగ్, రీసైజ్ మరియు ఎడిటింగ్ స్టేట్స్
  const [draggingId, setDraggingId] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectionToolbar, setSelectionToolbar] = useState({ show: false, x: 0, y: 0 });

  // కీబోర్డ్ Delete బటన్ ద్వారా సెలెక్ట్ చేసిన గ్రిడ్ డిలీట్ చేయడం
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId && !editingId) {
        if (onDeleteElement) onDeleteElement(selectedElementId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, editingId, onDeleteElement]);

  // మౌస్ మూవ్ అయినప్పుడు గ్రిడ్ కదలిక (Drag) లేదా సైజ్ మార్పు (Resize)
  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
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
        // సర్కిల్ ఫోటో అయితే వెడల్పు, ఎత్తు సమానంగా (బంతి ఆకారం) ఉండేలా లాక్ చేయడం
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

  // టెక్స్ట్ సెలెక్ట్ చేసినప్పుడు ఫ్లోటింగ్ ఫార్మాట్ టూల్‌బార్ చూపించడం
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

  // సెలెక్ట్ చేసిన పదాలకు స్టైల్ (బోల్డ్, షాడో, కలర్, సైజ్) అప్లై చేయడం
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
      // ఒకవేళ మల్టీ-లైన్ సెలెక్షన్ అయితే execCommand ద్వారా అప్లై చేయడం
      if (styleType === 'COLOR') document.execCommand('foreColor', false, value);
      if (styleType === 'MAIN_HEADLINE' || styleType === 'SUB_HEADLINE') document.execCommand('bold', false, null);
    }
    setSelectionToolbar({ show: false, x: 0, y: 0 });
  };

  // ఫోటో అప్‌లోడ్ మరియు ఫోటో ఆకారాన్ని బట్టి గ్రిడ్ సర్దుబాటు
  const handleImageUpload = (e, el) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const isVertical = img.height > img.width;
        const aspectRatio = img.width / img.height;

        // బంతి ఆకారం (CIRCLE_PHOTO) అయితే ఆకారం మారదు, అలాగే లాక్ అయి ఉంటుంది
        if (el.type === 'CIRCLE_PHOTO') {
          if (onUpdateElement) {
            onUpdateElement(el.id, { imageUrl: event.target.result });
          }
        } else {
          // సాధారణ ఫోటో అయితే ఫోటో నిష్పత్తి (Ratio) ప్రకారం గ్రిడ్ ఆకారం మారుతుంది
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

  // వార్త గ్రిడ్ లోపలికి ఏదైనా ఇమేజ్ గ్రిడ్ వచ్చిందా అని చెక్ చేయడం (Text Wrapping కోసం)
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
          setEditingId(null);
          setSelectionToolbar({ show: false, x: 0, y: 0 });
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
          cursor: 'default',
          userSelect: editingId ? 'text' : 'none'
        }}
      >
        {/* మాస్టర్ డిజైన్ మోడ్ కాకపోతే హెడర్ చూపించడం */}
        {!isMasterDesignMode && (
          <div style={{ borderBottom: '2px solid #333', paddingBottom: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
            <div>సంపుటి: {volume} | సంచిక: {issue}</div>
            <div style={{ color: '#d32f2f', fontSize: '14px' }}>{pageTitle || "యువగళం దినపత్రిక"}</div>
            <div>తేదీ: {dateString}</div>
          </div>
        )}

        {children}

        {/* సెలెక్ట్ చేసిన పదాలకు ఫార్మాట్ మార్చుకోవడానికి ఫ్లోటింగ్ టూల్‌బార్ */}
        {selectionToolbar.show && (
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
            <button onClick={() => applyInlineStyle('MAIN_HEADLINE')} style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }} title="హెడ్‌లైన్ (Extra Bold + Shadow)">H1</button>
            <button onClick={() => applyInlineStyle('SUB_HEADLINE')} style={{ background: '#444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer', fontWeight: '600' }} title="సబ్ హెడ్‌లైన్ (Medium Bold)">H2</button>
            <button onClick={() => applyInlineStyle('DATELINE')} style={{ background: '#444', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer' }} title="సాధారణ అక్షరాలు">Body</button>
            <span style={{ color: '#666' }}>|</span>
            <button onClick={() => applyInlineStyle('FONT_SIZE', fontSize + 4)} style={{ background: '#333', color: '#fff', border: '1px solid #555', padding: '2px 5px', cursor: 'pointer' }}>A+</button>
            <button onClick={() => applyInlineStyle('FONT_SIZE', Math.max(9, fontSize - 2))} style={{ background: '#333', color: '#fff', border: '1px solid #555', padding: '2px 5px', cursor: 'pointer' }}>A-</button>
            <input 
              type="color" 
              onChange={(e) => applyInlineStyle('COLOR', e.target.value)} 
              title="అక్షరాల రంగు మార్చండి"
              style={{ width: '20px', height: '20px', border: 'none', background: 'transparent', cursor: 'pointer' }} 
            />
          </div>
        )}

        {/* కాన్వాస్ ఎలిమెంట్స్ (వార్త గ్రిడ్స్ & ఇమేజ్ గ్రిడ్స్) */}
        {canvasElements.map((el) => {
          const isSelected = selectedElementId === el.id;
          const isEditing = editingId === el.id;
          const overlappingImages = el.type === 'RECTANGLE' ? getOverlappingImages(el) : [];

          // 1వ పేజీ అయితే ఫిక్సెడ్ హైట్ + ఓవర్‌ఫ్లో లాజిక్, 2+ పేజీ అయితే వార్త నిడివి బట్టి పెరిగే హైట్
          const isPageOne = pageNumber === 1;
          const flowResult = (el.type === 'RECTANGLE' && isPageOne && el.text)
            ? handleTextFlow(el.text, el.height, fontSize, 1)
            : { page1Content: el.text, hasOverflow: false };

          return (
            <div
              key={el.id}
              onMouseDown={(e) => {
                if (isEditing) return; // టెక్స్ట్ ఎడిట్ చేస్తున్నప్పుడు డ్రాగ్ అవ్వకుండా ఆపడం
                e.stopPropagation();
                if (onSelectElement) onSelectElement(el.id);
                const rect = e.currentTarget.getBoundingClientRect();
                setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                setDraggingId(el.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (el.type === 'RECTANGLE') {
                  setEditingId(el.id);
                }
              }}
              style={{
                position: 'absolute',
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: `${el.width}px`,
                // 1వ పేజీలో ఫిక్సెడ్ హైట్, 2వ పేజీ నుండి వార్త నిడివి ఆధారంగా auto-expand
                height: (el.type === 'RECTANGLE' && !isPageOne) ? 'auto' : `${el.height}px`,
                minHeight: `${el.height}px`,
                border: isSelected ? '2px solid #1976d2' : '1px solid #888',
                background: el.bgColor || (el.type === 'PICTURE' || el.type === 'CIRCLE_PHOTO' ? '#f0f0f0' : 'transparent'),
                color: el.color || '#000',
                borderRadius: el.type === 'CIRCLE' || el.type === 'CIRCLE_PHOTO' ? '50%' : el.type === 'OVAL' ? '50% / 30%' : '0px',
                padding: '6px',
                boxSizing: 'border-box',
                cursor: isEditing ? 'text' : 'move',
                zIndex: (el.type === 'PICTURE' || el.type === 'CIRCLE_PHOTO') ? 10 : 5,
                overflow: (el.type === 'PICTURE' || el.type === 'CIRCLE_PHOTO') ? 'hidden' : 'visible'
              }}
            >
              {/* సెలెక్ట్ చేసినప్పుడు పైన కనిపించే డిలీట్ (×) & టూల్స్ బార్ */}
              {isSelected && (
                <div 
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: '-24px',
                    right: '0px',
                    display: 'flex',
                    gap: '4px',
                    background: '#1976d2',
                    padding: '2px 6px',
                    borderRadius: '4px 4px 0 0',
                    zIndex: 50
                  }}
                >
                  {/* గ్రిడ్ బ్యాక్‌గ్రౌండ్ కలర్ మార్చుకోవడానికి */}
                  <input 
                    type="color" 
                    value={el.bgColor || '#ffffff'}
                    onChange={(e) => onUpdateElement && onUpdateElement(el.id, { bgColor: e.target.value })}
                    title="గ్రిడ్ బ్యాక్‌గ్రౌండ్ కలర్"
                    style={{ width: '16px', height: '16px', border: 'none', padding: 0, cursor: 'pointer' }}
                  />
                  {/* అనవసర గ్రిడ్ డిలీట్ చేయడానికి */}
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

              {/* పిక్చర్ బాక్స్ & సర్కిల్ (బంతి ఆకారం) ఫోటో గ్రిడ్ */}
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
                      {el.type === 'CIRCLE_PHOTO' ? '⊗ బంతి ఆకారం ఫోటో (క్లిక్ చేసి అప్‌లోడ్ చేయండి)' : '📷 ఫోటో అప్‌లోడ్ చేయండి'}
                    </span>
                  )}
                </label>
              )}

              {/* డివైడర్ లైన్ */}
              {el.type === 'DIVIDER' && <div style={{ width: '100%', height: '2px', background: el.color || '#000' }} />}
              
              {/* వార్త గ్రిడ్ (Text Box with Wrap Around Image & Rich Editing) */}
              {el.type === 'RECTANGLE' && (
                <div style={{ width: '100%', height: '100%', position: 'relative', textAlign: 'justify', lineHeight: '1.35' }}>
                  {/* వార్త గ్రిడ్ లోపలికి ఇమేజ్ గ్రిడ్ వస్తే, అక్షరాలు ఫోటో వెనక దాక్కోకుండా చుట్టూ ఫ్లో అయ్యేలా ఖాళీ స్పేసర్ */}
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

                  {/* డబుల్ క్లిక్ చేసినప్పుడు కర్సర్ వచ్చి నేరుగా టైప్/పేస్ట్/సెలెక్ట్ చేసే ప్రాంతం */}
                  <div
                    contentEditable={isEditing}
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
                      wordBreak: 'break-word'
                    }}
                  >
                    {flowResult.page1Content || "డబుల్ క్లిక్ చేసి వార్త రాయండి లేదా పేస్ట్ చేయండి..."}
                  </div>
                </div>
              )}

              {/* గ్రిడ్ సైజ్ పెంచడానికి/తగ్గించడానికి కుడివైపు కింది మూలన రీసైజ్ హ్యాండిల్ */}
              {isSelected && (
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
                    cursor: 'nwse-resize',
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
