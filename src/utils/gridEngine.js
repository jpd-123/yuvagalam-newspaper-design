// 1. గ్రిడ్ సరిహద్దులు మరియు కాలమ్స్ లెక్కింపు
export const calculateGridBounds = (containerWidth, columnsCount = 1, gutter = 10) => {
  const availableWidth = containerWidth - (gutter * (columnsCount - 1));
  const columnWidth = availableWidth / columnsCount;
  return { columnWidth, gutter };
};

// 2. ఫోటో చుట్టూ టెక్స్ట్ రాపింగ్ స్టైల్స్ (షేప్ రాపింగ్ తో సహా)
export const getWrapStyle = (wrapMode, shapeType = 'RECTANGLE') => {
  let style = {};

  switch (wrapMode) {
    case 'FLOAT_LEFT':
      style = { float: 'left', marginRight: '10px', marginBottom: '10px' };
      break;

    case 'FLOAT_RIGHT':
      style = { float: 'right', marginLeft: '10px', marginBottom: '10px' };
      break;

    case 'CENTER_TOP':
      style = { display: 'block', margin: '0 auto 10px auto', width: '100%' };
      break;

    default:
      style = { float: 'none', marginBottom: '10px' };
  }

  // గుండ్రని / అండాకార ఫోటోల చుట్టూ టెక్స్ట్ ఆకారానికి తగ్గట్లు వంగడానికి
  if (shapeType === 'CIRCLE' || shapeType === 'CIRCLE_PHOTO') {
    style.shapeOutside = 'circle(50%)';
    style.borderRadius = '50%';
  } else if (shapeType === 'OVAL') {
    style.shapeOutside = 'ellipse(50% 40%)';
    style.borderRadius = '50%';
  }

  return style;
};

// 3. ఆటోమేటిక్ టెక్స్ట్ ఫ్లో & జంప్ లైన్ లాజిక్ (1వ పేజీ నుండి 2వ పేజీకి వార్తా ఫ్లో)
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

// 4. కాలమ్ డివైడర్ గీతల పొజిషనింగ్ లెక్కింపు
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
// 5. కొత్త ఫీచర్: సెక్షన్-వైజ్ రౌటింగ్ & రియల్ టైమ్ ఆటో-ఫిట్ ఇంజిన్
// ==========================================

// వార్త రకాన్ని బట్టి సరైన విభాగంలోకి (Column) పంపడం
export const routeNewsToSection = (newsItem, sectionType) => {
  return {
    ...newsItem,
    targetSection: sectionType === 'BRIEF' ? 'COLUMN_SHORT_NEWS' : 'COLUMN_MAIN_STORY',
    timestamp: Date.now()
  };
};

// గ్రిడ్ అడుగుభాగం వరకు టెక్స్ట్ రాగానే ఖాళీ లేకుండా ఫాంట్ & ఫోటో నిష్పత్తిని ఆటో-అడ్జస్ట్ చేయడం
export const autoFitSectionContent = (contentLength, boxHeight, currentFontSize, currentPhotoSize) => {
  const estimatedCapacity = Math.floor(boxHeight * 0.8); // గ్రిడ్ సామర్థ్య అంచనా
  
  let adjustedFontSize = currentFontSize;
  let adjustedPhotoSize = currentPhotoSize;

  // ఒకవేళ టెక్స్ట్ బాక్స్ సామర్థ్యానికి తక్కువగా ఉండి, అడుగున గ్యాప్ వస్తుంటే నిష్పత్తి ప్రకారం సర్దుబాటు
  if (contentLength < estimatedCapacity && contentLength > 50) {
    // ఖాళీని భర్తీ చేయడానికి ఫాంట్ సైజ్ లేదా ఫోటో సైజును స్వల్పంగా సర్దుబాటు చేయడం
    adjustedFontSize = Math.min(currentFontSize + 1, 14); // గరిష్టంగా 14pt దాటకుండా
    adjustedPhotoSize = Math.round(currentPhotoSize * 1.05); // ఫోటో సైజ్ 5% పెంచడం
  }

  return {
    adjustedFontSize,
    adjustedPhotoSize,
    isFitOptimized: true
  };
};
