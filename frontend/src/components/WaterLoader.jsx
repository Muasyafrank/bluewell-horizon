import React from 'react';
import './WaterLoader.css';

const WaterLoader = ({ text = 'Loading...', size = 'large' }) => {
  const sizeClass = size === 'small' ? 'water-loader-small' : '';
  
  return (
    <div className="water-loader-container">
      <div className={`water-loader ${sizeClass}`}>
        <div className="water-droplet"></div>
        <div className="water-ripple"></div>
        <div className="water-ripple"></div>
        <div className="water-ripple"></div>
      </div>
      {text && <div className="water-loader-text">{text}</div>}
    </div>
  );
};

export default WaterLoader;