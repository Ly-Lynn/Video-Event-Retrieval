import React, { useState } from 'react';
import { Form, Button, ToggleButton, ToggleButtonGroup, Row, Col } from 'react-bootstrap';
import Grid from './PositionGrid';
import Select from 'react-select';
import { Slider } from '@mui/material';

const SelectComponent = ({ value, onChange, options }) => {
  const selectOptions = options.map(option => ({ value: option, label: option }));

  return (
    <div style={{ width: '50%' }}>
      <Select
        value={selectOptions.find(option => option.value === value)}
        onChange={selectedOption => onChange(selectedOption.value)}
        options={selectOptions}
        placeholder="Select an option"
      />
    </div>
  );
};

const SearchOption = () => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectValues, setSelectValues] = useState({ select1: '', select2: '', select3: '' });
  const [textareaValues, setTextareaValues] = useState({});
  const [clicks, setClicks] = useState({});
  const [w, setW] = useState({ OCR: 50, ASR: 50, OD: 50 });
  
  const options = [
    { name: 'query', controlId: "searchText", placeholder: "Enter query here..." },
    { name: 'OCR', controlId: "ocrText", placeholder: "Enter OCR text here..." },
    { name: 'ASR', controlId: "asrText", placeholder: "Enter ASR text here..." },
    { name: 'OD', controlId: "objectText", placeholder: "Enter object text here..." }
  ];

  const classes = ['Person', 'Vehicle', 'Outdoor', 'Animal', 'Sea Creature', 'Accessory', 'Sports', 'Kitchen', 'Food', 'Furniture', 'Electronic', 'Appliance', 'Indoor'];

  const handleSelectChange = (key, value) => {
    setSelectValues(prevValues => {
      const newValues = { ...prevValues, [key]: value };
      return newValues;
    });
  };

  const handleTextChange = (controlId) => (event) => {
    setTextareaValues((prevValues) => {
      const newValues = {...prevValues, [controlId]: event.target.value};
      // console.log(newValues)
      return newValues;
    });
  };

  const handleGridClick = (selectKey, coords) => {
    setClicks((prevClicks) => {
      const newClicks = { ...prevClicks };
      newClicks[selectKey] = [coords];
      console.log(newClicks)
      return newClicks;
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
        objects: Object.keys(selectValues).map(selectKey => ({
          name: selectValues[selectKey],
          position: clicks[selectKey] || []
        })),
        weight: w.OD
      }
    };
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
            ['select1', 'select2', 'select3'].map((selectKey) => (
              <Col key={selectKey} className='d-flex mb-3'>
                <SelectComponent
                  controlId={selectKey}
                  value={selectValues[selectKey]}
                  onChange={value => handleSelectChange(selectKey, value)}
                  options={classes}
                />
                <Grid selectKey={selectKey} clicks={clicks} onGridClick={handleGridClick} />
              </Col>
            ))
          )}
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