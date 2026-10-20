import React from 'react';

export const ShapeContainer = ({ shapeType, children, isNeighborFlexible, style = {} }) => {
  // షేప్ టైప్ ఆధారంగా CSS Border/Radius అప్లై చేసే లాజిక్
  const getShapeStyle = () => {
    switch (shapeType) {
      case 'CIRCLE': // 2. బంతి వార్త (ఫిక్స్డ్ గుండ్రటి ఆకారం)
        return {
          borderRadius: '50%',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          border: '2px solid #000'
        };
      case 'OVAL': // 3. కోడిగుడ్డు వార్త (ఫిక్స్డ్ ఓవల్ ఆకారం)
        return {
          borderRadius: '50% / 40%',
          aspectRatio: '1.2 / 1',
          overflow: 'hidden',
          border: '2px solid #000'
        };
      case 'HALF_OVAL_LEFT': // 4. హాఫ్ కోడిగుడ్డు లెఫ్ట్
        return {
          borderRadius: '100% 0 0 100% / 50%',
          overflow: 'hidden',
          border: '2px solid #000'
        };
      case 'HALF_OVAL_RIGHT': // 5. హాఫ్ కోడిగుడ్డు రైట్
        return {
          borderRadius: '0 100% 100% 0 / 50%',
          overflow: 'hidden',
          border: '2px solid #000'
        };
      case 'RECTANGLE': // 1. ఫ్లెక్సిబుల్ చతురస్రం (పక్కన వేరే షేప్ ఉంటే వంగుతుంది)
      default:
        return {
          borderRadius: isNeighborFlexible ? '0px 30px 30px 0px' : '0px',
          border: '1px solid #ccc',
          transition: 'all 0.3s ease'
        };
    }
  };

  return (
    <div style={{ ...getShapeStyle(), padding: '12px', background: '#fff', boxSizing: 'border-box', ...style }}>
      {children}
    </div>
  );
};
    
