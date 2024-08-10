import React from 'react';
import './Grid.css';

const Grid = ({ onGridClick, selectKey, clicks }) => {
  const handleGridClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    onGridClick(selectKey, { x, y });
  };

  return (
    <div className="grid" onClick={handleGridClick}>
      {clicks[selectKey] && clicks[selectKey].map((click, index) => (
        <div
          key={index}
          className="dot"
          style={{ left: click.x - 2 + 'px', top: click.y - 2 + 'px' }}
        ></div>
      ))}
    </div>
  );
};

export default Grid;
