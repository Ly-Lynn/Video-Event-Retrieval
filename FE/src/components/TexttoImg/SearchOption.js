import React, { useState, useEffect } from 'react';
import { Form, Button, ToggleButton, ToggleButtonGroup, Row, Col } from 'react-bootstrap';
import Grid from './OD/PositionGrid';
import { Slider, Box, Stack } from '@mui/material';
import ODSelection from './OD/ODSelection';
import ODRes from './OD/ODRes';

const SearchOption = () => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [textareaValues, setTextareaValues] = useState({});
  const [w, setW] = useState({ OCR: 50, ASR: 50, OD: 50 });
  
  const options = [
    { name: 'query', controlId: "searchText", placeholder: "Enter query here..." },
    { name: 'OCR', controlId: "ocrText", placeholder: "Enter OCR text here..." },
    { name: 'ASR', controlId: "asrText", placeholder: "Enter ASR text here..." },
    { name: 'OD', controlId: "objectText", placeholder: "Enter object text here..." }
  ];

  const objects = ['Person', 'Vehicle', 'Outdoor', 'Animal', 'Sea Creature', 'Accessory', 'Sports', 'Kitchen', 'Food', 'Furniture', 'Electronic', 'Appliance', 'Indoor'];
  const [selectedObject, setSelectedObject] = useState('');
  const [results, setResults] = useState([]);
  const [reset, setReset] = useState(false);

  const handleAddBox = (box) => {
    if (selectedObject) {
      const newVal = [...results, { object: selectedObject, coordinates: [box.startX, box.startY, box.endX, box.endY] }]; 
      setResults(newVal);
      setSelectedObject(''); // Reset selection after confirmation
    }
  };
  // useEffect(() => {
  //   console.log("Kết quả OD: ", results);
  // }, [results]);

  const handleReset = () => {
    setResults([]); // Clear results
    setReset(true); // Trigger reset
  };
  // useEffect(() => {
  //   if (reset) {
  //     setReset(false); // Reset state flag
  //   }
  // }, [reset]);

  const handleTextChange = (controlId) => (event) => {
    setTextareaValues((prevValues) => {
      const newValues = {...prevValues, [controlId]: event.target.value};
      // console.log(newValues)
      return newValues;
    });
  };

  const handleSliderChange = (feature) => (event, newValue) => {
    console.log(feature, newValue, w)      
    setW(prevW => {
      const newVal = {...prevW, [feature]: newValue};
      return newVal;
    });
  };

  const handleConfirmSearch = () => {
    const result = {
      query: textareaValues.searchText || '',
      ocr: {
        query: textareaValues.ocrText || '',
        weight: w.OCR
      },
      asr: {
        query: textareaValues.asrText || '',
        weight: w.ASR
      },
      od: {
        results,
        weight: w.OD
      }
    };
    // setReset(false);
    console.log(result);
  };
  return (
    <Row className="justify-content-center">
      <Col className='mt-3 mb-3'>
        <Form className="border p-3">
          <ToggleButtonGroup
            type="radio"
            name="options"
            defaultValue={0}
            className="mb-2 w-100"
            onChange={setSelectedOption}
          >
            <ToggleButton className="btn-success" id="tbg-radio-1" value={0}>QUERY</ToggleButton>
            <ToggleButton className="btn-success" id="tbg-radio-2" value={1}>OCR</ToggleButton>
            <ToggleButton className="btn-success" id="tbg-radio-3" value={2}>ASR</ToggleButton>
            <ToggleButton className="btn-success" id="tbg-radio-4" value={3}>OBJECT</ToggleButton>
          </ToggleButtonGroup>
          {options[selectedOption] && selectedOption !== 3 && (
            <Form.Group controlId={options[selectedOption].controlId}>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={textareaValues[options[selectedOption].controlId] || ""}
                onChange={handleTextChange(options[selectedOption].controlId)} 
              />
            </Form.Group>
          )}
          {selectedOption === 3 && (
            <Stack spacing={2} alignItems='center' justifyContent="center">
              <Stack spacing={2} direction="row">
                <ODSelection
                  objects={objects}
                  selectedObject={selectedObject}
                  onSelectObject={setSelectedObject}
                />
                <Button onClick={handleReset}>Reset</Button>
              </Stack>
              <Grid onAddBox={handleAddBox} selectedObject={selectedObject} onReset={reset} confirmedRes={results}/>
              <ODRes results={results} />
            </Stack>
          )}
          <div style={{padding:"0.5rem"}} />
          {selectedOption !== 0 && (
                <Form.Group>
                  <Form.Label>{options[selectedOption].name} Weight: {w[options[selectedOption].name]}</Form.Label>
                  <Slider 
                    value={w[options[selectedOption].name]} 
                    onChange={handleSliderChange(options[selectedOption].name)} 
                    min={0}
                    step={5}
                    marks
                    max={100}
                  />
                </Form.Group>
              )}
          <Col className="text-center d-flex justify-content-center">
            <Button variant="primary" className="mt-1" onClick={handleConfirmSearch}>SEARCH</Button>
            <div style={{ paddingLeft: '5%' }}></div> 
            <Button variant='danger' className='mt-1' onClick={() => window.location.reload()}>RESET</Button>
          </Col>
        </Form>
      </Col>
    </Row>
  );
};

export default SearchOption;