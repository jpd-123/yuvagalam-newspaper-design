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
  // గ్రిడ్‌లో పట్టే అక్షరాల అంచనా లెక్కింపు
  const charsPerLine = 35; // సగటున ఒక లైన్‌కు అక్షరాలు
  const totalLinesAllowed = Math.floor(boxHeight / (fontSize * 1.3));
  const maxChars = totalLinesAllowed * charsPerLine;

  if (currentText.length > maxChars) {
    // వాక్యం ఆగిపోయిన పదాన్ని కనుగొనడం
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
