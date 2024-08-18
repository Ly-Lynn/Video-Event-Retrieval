// src/components/Grid.js
import React, { useEffect, useState, useRef } from 'react';
import './Grid.css';

const Grid = ({ onAddBox, selectedObject, onReset, confirmedRes}) => {
  const [boxes, setBoxes] = useState([]);
  const [currentBox, setCurrentBox] = useState(null);
  const [confirmedBoxes, setConfirmedBoxes] = useState([]);
  const resetRef = useRef(false);

  // console.log(confirmedRes)

  useEffect(() => {
    if (resetRef.current) {
      setBoxes([]);
      setCurrentBox(null);
      setConfirmedBoxes([]);
      resetRef.current = false;
    }
  }, [resetRef.current]);

  const handleMouseDown = (e) => {
    const startX = e.nativeEvent.offsetX;
    const startY = e.nativeEvent.offsetY;
    setCurrentBox({ startX, startY, endX: startX, endY: startY });
  };

  const handleMouseMove = (e) => {
    if (currentBox) {
      setCurrentBox({
        ...currentBox,
        endX: e.nativeEvent.offsetX,
        endY: e.nativeEvent.offsetY,
      });
    }
  };

  const handleMouseUp = () => {
    if (currentBox) {
      setBoxes([...boxes, currentBox]);
      setCurrentBox(null);
    }
  };

  const handleConfirm = (index) => {
    const confirmedBox = boxes[index];
    setConfirmedBoxes([...confirmedBoxes, confirmedBox]);
    setBoxes([]); 
    onAddBox(confirmedBox);
  };
  // useEffect(() => {
  //   console.log("Kết quả OD: ", confirmedBoxes, boxes, currentBox);
  // }, [confirmedBoxes, boxes, currentBox]);

  const handleCancel = (index) => {
    setBoxes([]);
  };

  const triggerReset = () => {
    resetRef.current = true;
    setBoxes([]); // Ensure boxes are cleared
  };

  useEffect(() => {
    if (onReset) {
      triggerReset();
    }
  }, [onReset]);

  return (
      <div
        className="grid"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Render confirmed boxes */}
        {confirmedRes && confirmedRes.map((box, index) => (
  <div
    key={`confirmed-${index}`}
    className="box confirmed"
    style={{
      left: Math.min(box['coordinates'][0], box['coordinates'][2]),
      top: Math.min(box['coordinates'][1], box['coordinates'][3]),
      width: Math.abs(box['coordinates'][2] - box['coordinates'][0]),
      height: Math.abs(box['coordinates'][3] - box['coordinates'][1]),
      position: 'absolute',  // Đảm bảo hộp được định vị chính xác
    }}
  >
    {/* Nhãn */}
    <span
      className="box-label"
      style={{
        position: 'absolute',
        top: '-15px',  // Đặt nhãn bên trên hộp, không đè lên hộp
        left: '2px',
        backgroundColor: 'rgba(255, 255, 255, 255)',
        padding: '2px 4px',
        fontSize: '12px',
        borderRadius: '3px',
        pointerEvents: 'none',
        border:'solid thin',
      }}
    >
      {box['object']}
    </span>
  </div>
))}


        {/* Render active boxes with buttons */}
        {boxes.map((box, index) => (
          <div
            key={`active-${index}`}
            className="box active"
            style={{
              left: Math.min(box.startX, box.endX),
              top: Math.min(box.startY, box.endY),
              width: Math.abs(box.endX - box.startX),
              height: Math.abs(box.endY - box.startY),
            }}
          >
            <button type="button" className="confirm-btn" onClick={() => handleConfirm(index)} disabled={!selectedObject}>✔</button>
            <button type="button" className="cancel-btn" onClick={() => handleCancel(index)}>✘</button>
          </div>
        ))} 

        {/* Render currently being drawn box */}
        {currentBox && (
          <div
            className="box"
            style={{
              left: Math.min(currentBox.startX, currentBox.endX),
              top: Math.min(currentBox.startY, currentBox.endY),
              width: Math.abs(currentBox.endX - currentBox.startX),
              height: Math.abs(currentBox.endY - currentBox.startY),
              pointerEvents: 'none', // Prevent interaction with the current box
            }}
          />
        )}
      </div>
  );
};

export default Grid;
