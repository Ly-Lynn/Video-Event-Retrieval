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
                {results.map((result, index) => (
                    <div key={index}>
                        <Col className='d-flex'>
                            <span class="material-symbols-outlined" style={{color:"red", cursor:"pointer"}} onClick={() => onDeleteResult(result.tabId)}>delete</span>
                            <div style={{fontWeight:"bolder"}}>Stage {result.tabId}:</div>
                        </Col>
                        <dl>
                        {/* <pre>{JSON.stringify(result.data, null, 2)}</pre> */}
                            <li>Query: {result.data['query']}</li>
                            <li>OCR:
                                <ul>- query: {result.data['ocr']['query']}</ul>
                                <ul>- weight: {result.data['ocr']['weight']}</ul>
                            </li>
                            <li>ASR:
                                <ul>- query: {result.data['asr']['query']}</ul>
                                <ul>- weight: {result.data['asr']['weight']}</ul>
                            </li>
                            <li>Object Detection:
                                <ol>- objects: 
                                {result.data['od']['results'].map((res, index) => (
                                    <li>{res['object']}: [{res['coordinates'][0]}, {res['coordinates'][1]}, {res['coordinates'][2]}, {res['coordinates'][3]}]</li>
                                ))}
                                </ol>
                                <ul>- weight: {result.data['od']['weight']}</ul>                            
                            </li>
                        </dl>
                    </div>
                ))}
                </div>
                <div className="custom-modal-footer">
                <Button variant="primary" onClick={onConfirm}>
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
