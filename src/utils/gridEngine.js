// ==========================================
// 1. గ్రిడ్ సరిహద్దులు మరియు కాలమ్స్ లెక్కింపు
// ==========================================
export const calculateGridBounds = (containerWidth, columnsCount = 1, gutter = 10) => {
  const availableWidth = containerWidth - (gutter * (columnsCount - 1));
  const columnWidth = availableWidth / columnsCount;
  return { columnWidth, gutter };
};

// ==========================================
// 2. ఫోటో చుట్టూ టెక్స్ట్ రాపింగ్ స్టైల్స్ (L-షేప్ మరియు షేప్ రాపింగ్ తో సహా)
// ==========================================
export const getWrapStyle = (wrapMode, shapeType = 'RECTANGLE', isVerticalPhoto = false) => {
  let style = {};

  switch (wrapMode) {
    case 'FLOAT_LEFT':
      style = { float: 'left', marginRight: '12px', marginBottom: '10px' };
      break;

    case 'FLOAT_RIGHT':
      style = { float: 'right', marginLeft: '12px', marginBottom: '10px' };
      break;

    case 'CENTER_TOP':
      style = { display: 'block', margin: '0 auto 10px auto', width: '100%' };
      break;

    default:
      style = { float: 'none', marginBottom: '10px' };
  }

  // నిలువు ఫోటో (Vertical Photo) అయినప్పుడు 'L-షేప్' రాపింగ్ లేదా ప్రత్యేక ఆకారాలు వర్తింపజేయడం
  if (isVerticalPhoto || shapeType === 'VERTICAL_PHOTO') {
    style.float = 'left';
    style.marginRight = '15px';
    style.marginBottom = '12px';
    style.maxWidth = '45%'; // నిలువు ఫోటో గ్రిడ్‌లో సగం భాగం తీసుకునేలా
  } else if (shapeType === 'CIRCLE' || shapeType === 'CIRCLE_PHOTO') {
    style.shapeOutside = 'circle(50%)';
    style.borderRadius = '50%';
  } else if (shapeType === 'OVAL') {
    style.shapeOutside = 'ellipse(50% 40%)';
    style.borderRadius = '50%';
  }

  return style;
};

// ==========================================
// 3. ఆటోమేటిక్ టెక్స్ట్ ఫ్లో & జంప్ లైన్ లాజిక్ (1వ పేజీ నుండి 2వ పేజీకి వార్తా ఫ్లో)
// ==========================================
export const handleTextFlow = (currentText, boxHeight, fontSize, currentPage = 1) => {
  const charsPerLine = 35; 
  const totalLinesAllowed = Math.floor(boxHeight / (fontSize * 1.3));
  const maxChars = totalLinesAllowed * charsPerLine;

  if (currentText.length > maxChars) {
    const splitIndex = currentText.lastIndexOf(' ', maxChars);
    
    const page1Text = currentText.substring(0, splitIndex) + " ... (తరువాయి 2వ పేజీలో)";
    const page2Text = "(1వ పేజీ నుండి సశేషం...) " + currentText.substring(splitIndex);

    return {
      page1Content: page1Text,
      page2Content: page2Text,
      hasOverflow: true
    };
  }

  return {
    page1Content: currentText,
    page2Content: "",
    hasOverflow: false
  };
};

// ==========================================
// 4. కాలమ్ డివైడర్ గీతల పొజిషనింగ్ లెక్కింపు
// ==========================================
export const calculateColumnDividers = (containerWidth, columnsCount, gutter = 10) => {
  const { columnWidth } = calculateGridBounds(containerWidth, columnsCount, gutter);
  const dividers = [];

  for (let i = 1; i < columnsCount; i++) {
    const leftPos = (columnWidth * i) + (gutter * (i - 0.5));
    dividers.push(leftPos);
  }

  return dividers;
};

// ==========================================
// 5. సెక్షన్-వైజ్ రౌటింగ్ & L-షేప్ కాలమ్ మేనేజ్‌మెంట్
// ==========================================
export const routeNewsToSection = (newsItem, sectionType) => {
  let targetCol = 'COLUMN_SINGLE_BRIEF'; // చిన్న వార్తలు (Single Column)
  
  if (sectionType === 'MEDIUM_STORY') {
    targetCol = 'COLUMN_MEDIUM_DOUBLE'; // మధ్యస్థ వార్తలు (Double Column)
  } else if (sectionType === 'MAIN_STORY') {
    targetCol = 'COLUMN_MAIN_TRIPLE'; // పెద్ద వార్తలు (Double/Triple Column)
  }

  return {
    ...newsItem,
    targetSection: targetCol,
    columnSpan: sectionType === 'BRIEF' ? 1 : 2, 
    timestamp: Date.now()
  };
};

// ==========================================
// 6. రియల్ టైమ్ ఆటో-ఫిట్ ఇంజిన్ & రేషియో అడ్జస్ట్‌మెంట్
// ==========================================
export const autoFitSectionContent = (contentLength, boxHeight, currentFontSize, currentPhotoSize, isVertical = false) => {
  const estimatedCapacity = Math.floor(boxHeight * 0.82); 
  
  let adjustedFontSize = currentFontSize;
  let adjustedPhotoSize = currentPhotoSize;

  if (contentLength < estimatedCapacity && contentLength > 40) {
    adjustedFontSize = Math.min(currentFontSize + 1, 14); 
    adjustedPhotoSize = isVertical ? Math.round(currentPhotoSize * 1.08) : Math.round(currentPhotoSize * 1.05);
  }

  return {
    adjustedFontSize,
    adjustedPhotoSize,
    isFitOptimized: true
  };
};

// ==========================================
// 7. నైట్-షిఫ్ట్ డేట్ & ఎడిషన్ మెటాడేటా ఇంజిన్ (కొత్తగా చేర్చబడినది)
// ==========================================
export const getNewspaperEditionMetadata = (lastVolume = 1, lastIssue = 1, lastDateStr = null) => {
  const now = new Date();
  
  // రాత్రి 12 గంటలలోపు అప్‌లోడ్ చేసినా మరుసటి రోజు తేదీ రావాలనే రూల్ ప్రకారం (+1 day)
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  const formattedDate = tomorrow.toLocaleDateString('te-IN', options);
  const rawDateStr = tomorrow.toISOString().split('T')[0];

  let currentVolume = lastVolume;
  let currentIssue = lastIssue;

  // తేదీ మారితే సంచిక నంబర్ ఆటోమేటిక్‌గా +1 పెరగడం
  if (lastDateStr && lastDateStr !== rawDateStr) {
    currentIssue += 1;
  }

  return {
    dateString: formattedDate,
    rawDate: rawDateStr,
    volume: currentVolume,
    issue: currentIssue
  };
};
