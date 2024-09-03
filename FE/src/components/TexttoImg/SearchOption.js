import React, { useState, useEffect } from 'react';
import { Form, Button, ToggleButton, ToggleButtonGroup, Row, Col } from 'react-bootstrap';
import Grid from './OD/PositionGrid';
import { Slider, Stack } from '@mui/material';
import ODSelection from './OD/ODSelection';
import ODRes from './OD/ODRes';
import ErrorBoundary from '../debug/ErrorBoundary';

const SearchOption = ({ state, setState, onSearch }) => {
  // console.log("Kết quả: ", state);
  // useEffect(() => {
  //   console.log("Kết quả: ", state);
  // }, [state]);

  const options = [
    { name: 'query', controlId: "searchText" },
    { name: 'OCR', controlId: "ocrText" },
    { name: 'ASR', controlId: "asrText" },
    { name: 'OD', controlId: "objectText" }
  ];

  const objects = ['Person', 'Vehicle', 'Outdoor', 'Animal', 'Sea Creature', 'Accessory', 'Sports', 'Kitchen', 'Food', 'Furniture', 'Electronic', 'Appliance', 'Indoor'];

  const handleAddBox = (box) => {
    if (state.selectedObject) {
      const newResults = [...state.results, { object: state.selectedObject, coordinates: [box.startX, box.startY, box.endX, box.endY] }];
      setState(prevState => ({ ...prevState, results: newResults, selectedObject: '' }));
    }
  };


  const handleReset = () => {
    setState(prevState => ({ ...prevState, results: [], reset: true }));
  };

  const handleTextChange = (controlId) => (event) => {
    const newValues = { ...state.textareaValues, [controlId]: event.target.value };
    setState(prevState => ({ ...prevState, textareaValues: newValues }));
  };

  const handleSliderChange = (feature) => (event, newValue) => {
    const newWeights = { ...state.weights, [feature]: newValue };
    setState(prevState => ({ ...prevState, weights: newWeights }));
  };

  const handleConfirmSearch = async () => {
    const inputSearch = {
      query: state.textareaValues.searchText || '',
      ocr: {
        query: state.textareaValues.ocrText || '',
        weight: state.weights.OCR,
      },
      asr: {
        query: state.textareaValues.asrText || '',
        weight: state.weights.ASR,
      },
      od: {
        results: state.results,
        weight: state.weights.OD,
      },
    };
    try {
      const response = await fetch('/api/get-single', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputSearch),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Result trả về",result)
        onSearch(result);  // Gửi dữ liệu kết quả đến component hiển thị kết quả
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.log(inputSearch)
      console.error('Error:', error);
    }
    
  };

  return (
    <Row className="justify-content-center">
      <Col className='mt-3 mb-3'>
        <Form className="border p-3">
        <ErrorBoundary>
          <ToggleButtonGroup
            type="radio"
            name="options"
            value={state.selectedOption}
            className="mb-2 w-100"
            onChange={(value) => setState(prevState => ({ ...prevState, selectedOption: value }))}
          >
            <ToggleButton className="btn-success" id="tbg-radio-1" value={0}>QUERY</ToggleButton>
            <ToggleButton className="btn-success" id="tbg-radio-2" value={1}>OCR</ToggleButton>
            <ToggleButton className="btn-success" id="tbg-radio-3" value={2}>ASR</ToggleButton>
            <ToggleButton className="btn-success" id="tbg-radio-4" value={3}>OBJECT</ToggleButton>
          </ToggleButtonGroup>
          </ErrorBoundary>
          {options[state.selectedOption] && state.selectedOption !== 3 && (
            <Form.Group controlId={options[state.selectedOption].controlId}>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={state.textareaValues[options[state.selectedOption].controlId] || ""}
                onChange={handleTextChange(options[state.selectedOption].controlId)} 
              />
            </Form.Group>
          )}
          {state.selectedOption === 3 && (
            <Stack spacing={2} alignItems='center' justifyContent="center">
              <Stack spacing={2} direction="row">
                <ODSelection
                  objects={objects}
                  selectedObject={state.selectedObject}
                  onSelectObject={(object) => setState(prevState => ({ ...prevState, selectedObject: object }))}
                />
                <Button onClick={handleReset}>Reset</Button>
              </Stack>
              <Grid onAddBox={handleAddBox} selectedObject={state.selectedObject} onReset={state.reset} confirmedRes={state.results}/>
              <ODRes results={state.results} />
            </Stack>
          )}
          <div style={{padding:"0.5rem"}} />
          {state.selectedOption !== 0 && (
            <Form.Group>
              <Form.Label>{options[state.selectedOption].name} Weight: {state.weights[options[state.selectedOption].name]}</Form.Label>
              <Slider 
                value={state.weights[options[state.selectedOption].name]} 
                onChange={handleSliderChange(options[state.selectedOption].name)} 
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
