import React from 'react';

const DebugEnv = () => {
  const backendUrl = import.meta.env.VITE_REACT_APP_SERVER_DOMAIN;
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'red', 
      color: 'white', 
      padding: '10px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <div>Backend URL: {backendUrl || 'UNDEFINED'}</div>
      <div>Mode: {import.meta.env.MODE}</div>
      <div>Dev: {import.meta.env.DEV ? 'true' : 'false'}</div>
    </div>
  );
};

export default DebugEnv;