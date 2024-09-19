import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Button, Col } from 'react-bootstrap';
import './StageSearch.css'; // Import a CSS file for custom styling
import SearchIcon from '../assests/images/SearchIcon.jpg'

const StageSearch = ({ results, onConfirm, show, onDeleteResult }) => {
    const nodeRef = useRef(null);
    const [minimized, setMinimized] = useState(false);


    const onMinimize = () => {
        setMinimized(true);
    };

    const onRestore = () => {
        setMinimized(false);
    };

    if (!show) return null;

    const handleConfirmSearchStage = async () => {
        const finalRes = {}
        Object.entries(results).map(([key, value]) => (
            finalRes[key] = {
                query: value.textareaValues['searchText'],
                ocr: {
                    query: value.textareaValues['ocrText'],
                    weight: value.weights['OCR']
                },
                asr: {
                    query: value.textareaValues['asrText'],
                    weight: value.weights['ASR']
                },
                od: {
                    results: value.results,
                    weight: value.weights['OD']
                }
            }
        ))
    
        try {
          const response = await fetch('/api/get-stages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalRes),
          });
    
          if (response.ok) {
            const result = await response.json();
            console.log("Result of stages", result)
            onConfirm(result);  
          } else {
            console.error('Error:', response.statusText);
          }
        } catch (error) {
          console.log(finalRes)
          console.error('Error:', error);
        } 
      };
      
    return (
        <>
        {!minimized ? (
            <Draggable nodeRef={nodeRef} handle=".custom-modal-header" defaultPosition={{x: 50, y: 50}}>
            <div ref={nodeRef} className={`custom-modal ${minimized ? 'minimized' : 'expanded'}`}>
                <div className="custom-modal-header d-flex justify-content-between">
                <h5>Stage Search Tracking</h5>
                <span className="material-symbols-outlined" onClick={onMinimize} style={{cursor:"pointer"}}>
                remove
                </span>
                </div>
                <div className="custom-modal-body">
                {Object.entries(results).map(([key, value]) => (
                    <div key={key}>
                    <Col className="d-flex">
                        <div style={{ fontWeight: "bolder" }}>Stage {key}:</div>
                    </Col>
                    <dl>
                        <li>
                            Query: <span style={{ fontWeight: "bold", color: "red" }}>{value.textareaValues['searchText']}</span>
                        </li>
                        <li>
                            OCR:
                            <ul>
                                - query: <span style={{ fontWeight: "bold", color: "blue" }}>{value.textareaValues['ocrText']}</span>
                            </ul>
                            <ul>
                                - weight: <span style={{ fontWeight: "bold", color: "green" }}>{value.weights['OCR']}</span>
                            </ul>
                        </li>
                        <li>
                            ASR:
                            <ul>
                                - query: <span style={{ fontWeight: "bold", color: "blue" }}>{value.textareaValues['asrText']}</span>
                            </ul>
                            <ul>
                                - weight: <span style={{ fontWeight: "bold", color: "green" }}>{value.weights['ASR']}</span>
                            </ul>
                        </li>
                        <li>
                            Object Detection:
                            <ol>
                                - objects:
                                {value.results.map((res, index) => (
                                    <li key={index}>
                                        <span style={{ fontWeight: "bold", color: "blue" }}>{res['object']}</span>: [
                                        <span style={{ fontWeight: "bold", color: "black" }}>{res['coordinates'][0]}</span>, 
                                        <span style={{ fontWeight: "bold", color: "black" }}>{res['coordinates'][1]}</span>, 
                                        <span style={{ fontWeight: "bold", color: "black" }}>{res['coordinates'][2]}</span>, 
                                        <span style={{ fontWeight: "bold", color: "black" }}>{res['coordinates'][3]}</span>]
                                    </li>
                                ))}
                            </ol>
                            <ul>
                                - weight: <span style={{ fontWeight: "bold", color: "green" }}>{value.weights['OD']}</span>
                            </ul>
                        </li>
                    </dl>
                </div>
                
                ))}
                </div>
                <div className="custom-modal-footer">
                <Button variant="primary" onClick={handleConfirmSearchStage}>
                    Confirm
                </Button>
                </div>
            </div>
            </Draggable>
        ) : (
            <div className="minimized-icon" onClick={onRestore}>
                <img src={SearchIcon} style={{width:"50px", height:"50px"}}/>
            </div>
        )}
        </>
    );
};

export default StageSearch;
