// src/utils/autoPushEngine.js
// వార్తల నిడివిని బట్టి ఆటోమేటిక్‌గా గ్యాప్ సర్దుబాటు చేసే డైనమిక్ పుష్/పుల్ ఇంజిన్

/**
 * వార్తా బాక్స్ ఎత్తు (Height) మారినప్పుడు తదుపరి బాక్స్‌ల పొజిషన్‌ను లెక్కించడం
 * @param {number} currentBoxHeight - ప్రస్తుత వార్తా బాక్స్ కొత్త ఎత్తు
 * @param {number} defaultHeight - సాధారణ డిఫాల్ట్ ఎత్తు
 * @param {number} gutter - గ్రిడ్ మధ్య గ్యాప్ (అంతరం)
 */
export const calculateDynamicPushPull = (currentBoxHeight, defaultHeight, gutter = 15) => {
  const heightDifference = currentBoxHeight - defaultHeight;
  
  return {
    isPushed: heightDifference > 0,
    offset: heightDifference + gutter
  };
};

/**
 * పేజీలోని అన్ని వార్తా బాక్సుల ఆర్డర్‌ను బట్టి వాటి ఫ్లోను అడ్జస్ట్ చేయడం
 * @param {Array} boxes - మొత్తం వార్తా బాక్సుల జాబితా
 * @param {string} activeBoxId - మార్పు జరుగుతున్న వార్త ఐడీ
 * @param {number} newHeight - కొత్త ఎత్తు
 */
export const adjustLayoutFlow = (boxes, activeBoxId, newHeight) => {
  let accumulatedOffset = 0;

  return boxes.map((box) => {
    if (box.id === activeBoxId) {
      accumulatedOffset += (newHeight - (box.defaultHeight || 200));
      return { ...box, height: newHeight, dynamicOffset: accumulatedOffset };
    }
    
    return {
      ...box,
      yPos: (box.yPos || 0) + accumulatedOffset
    };
  });
};
