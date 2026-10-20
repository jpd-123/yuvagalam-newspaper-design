import React from 'react';

export const FrontHeaderBar = ({ logoUrl, volume, issue, price, totalPages }) => {
  const currentDate = new Date().toLocaleDateString('te-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ width: '100%', borderBottom: '2px solid #000', marginBottom: '15px', background: '#fff' }}>
      {/* టాప్ సెంటర్ మెయిన్ లోగో */}
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Main Logo" style={{ maxHeight: '70px', objectFit: 'contain' }} />
        ) : (
          <h1 style={{ margin: 0, fontSize: '36px', color: '#CC0000', fontFamily: 'serif' }}>[ యువగళం లోగో ]</h1>
        )}
      </div>

      {/* బ్రాండింగ్ స్ట్రిప్ (సంపుటి, సంచిక, తేదీ, వెల) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', color: '#fff', padding: '6px 15px', fontSize: '13px' }}>
        <div>సంపుటి: {volume || '02'} &nbsp;|&nbsp; సంచిక: {issue || '108'}</div>
        <div style={{ fontWeight: 'bold', color: '#ffcc00' }}>{currentDate}</div>
        <div>పేజీలు: {totalPages || '4'} &nbsp;|&nbsp; వెల: ₹ {price || '3.00'}</div>
      </div>
    </div>
  );
};
