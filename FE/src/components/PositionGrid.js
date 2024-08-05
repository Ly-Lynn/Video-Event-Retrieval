import React from 'react';
import './Grid.css';

const Grid = ({ onClick }) => {
  const handleGridClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    onClick({ x, y });
  };

  return (
    <div className="grid" onClick={handleGridClick}></div>
  );
};

export default Grid;
