// గ్రిడ్ సరిహద్దుల లెక్కింపు
export const calculateGridBounds = (containerWidth, columnsCount = 1, gutter = 10) => {
  const availableWidth = containerWidth - (gutter * (columnsCount - 1));
  const columnWidth = availableWidth / columnsCount;
  return { columnWidth, gutter };
};

// ఫోటో చుట్టూ టెక్స్ట్ రాపింగ్ స్టైల్స్
export const getWrapStyle = (wrapMode) => {
  switch (wrapMode) {
    case 'FLOAT_LEFT':
      return { float: 'left', marginRight: '10px', marginBottom: '10px' };
    case 'FLOAT_RIGHT':
      return { float: 'right', marginLeft: '10px', marginBottom: '10px' };
    case 'CENTER_TOP':
      return { display: 'block', margin: '0 auto 10px auto', width: '100%' };
    default:
      return { float: 'none', marginBottom: '10px' };
  }
};
