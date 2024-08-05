import React, { useState } from 'react';
import { Form, Button, ToggleButton, ToggleButtonGroup, Row, Col, Dropdown } from 'react-bootstrap';
import Grid from './PositionGrid';

const SelectComponent = ({ controlId, label, value, onChange, options }) => (
  <Form.Group controlId={controlId} style={{width:'30%'}}>
    <Form.Label>{label}</Form.Label>
    <Form.Control as="select" value={value} onChange={onChange}>
      <option value="">Select an option</option>
      {options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </Form.Control>
  </Form.Group>
);

const SearchOption = () => {
  const [selectedOption, setSelectedOption] = useState(1);
  const [selectValues, setSelectValues] = useState({ select1: '', select2: '', select3: '' });
  const [textareaValues, setTextareaValues] = useState({});

  const formGroups = {
    1: { controlId: "searchText", placeholder: "Enter query here...", res: NaN},
    3: { controlId: "ocrText", placeholder: "Enter OCR text here...", res: NaN},
    4: { controlId: "asrText", placeholder: "Enter ASR text here...", res: NaN},
    5: { controlId: "objectText", placeholder: "Enter object text here...", res:[] }
  };

  const classes = ["Dog", "Cat"]

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

  return (
    <Row className="justify-content-center">
      <Col>
        <Form className="border p-3">
          <Dropdown className="row mb-3">
            <Dropdown.Toggle
              id="dropdown-basic"
              style={{ backgroundColor: 'white', color: 'green', borderRadius: 0, borderColor: 'green' }}
            >
              Search options
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Text to image</Dropdown.Item>
              <Dropdown.Item href="#/action-2">VQA</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <ToggleButtonGroup
            type="radio"
            name="options"
            defaultValue={1}
            className="mb-2 w-100"
            onChange={setSelectedOption}
          >
            <ToggleButton className="btn-success" id="tbg-radio-1" value={1}>QUERY</ToggleButton>
            <ToggleButton className="btn-success" id="tbg-radio-3" value={3}>OCR</ToggleButton>
            <ToggleButton className="btn-success" id="tbg-radio-4" value={4}>ASR</ToggleButton>
            <ToggleButton className="btn-success" id="tbg-radio-5" value={5}>OBJECT</ToggleButton>
          </ToggleButtonGroup>

          {formGroups[selectedOption] && selectedOption !== 5 && (
            <Form.Group controlId={formGroups[selectedOption].controlId}>
              <Form.Control 
              as="textarea" 
              rows={3} 
              value={textareaValues[formGroups[selectedOption].controlId] || ""}
              onChange={handleTextChange(formGroups[selectedOption].controlId)} />
            </Form.Group>
          )}

          {selectedOption === 5 && (
            ['select1', 'select2', 'select3'].map((selectKey, index) => (
              <Col>
                <SelectComponent
                  key={selectKey}
                  controlId={selectKey}
                  // label={`Select ${index + 1}`}
                  value={selectValues[selectKey]}
                  onChange={e => handleSelectChange(selectKey, e.target.value)}
                  options={classes}
                />
                <Grid/>
              </Col>
            ))
          )}

          <div className="text-center">
            <Button variant="primary" className="mt-1">SEARCH</Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default SearchOption;