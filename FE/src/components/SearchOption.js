import React, { useState } from 'react';
import { Form, Button, ToggleButton, ToggleButtonGroup, Row, Col, Dropdown } from 'react-bootstrap';
import Grid from './PositionGrid';
import Select from 'react-select';

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
  const [selectedOption, setSelectedOption] = useState(1);
  const [selectValues, setSelectValues] = useState({ select1: '', select2: '', select3: '' });
  const [textareaValues, setTextareaValues] = useState({});
  const [clicks, setClicks] = useState({});

  const formGroups = {
    1: { controlId: "searchText", placeholder: "Enter query here...", res: NaN},
    3: { controlId: "ocrText", placeholder: "Enter OCR text here...", res: NaN},
    4: { controlId: "asrText", placeholder: "Enter ASR text here...", res: NaN},
    5: { controlId: "objectText", placeholder: "Enter object text here...", res:[] }
  };

  const classes = ['Person',
    'Vehicle',
    'Outdoor',
    'Animal',
    'Accessory',
    'Sports',
    'Kitchen',
    'Food',
    'Furniture',
    'Electronic',
    'Appliance',
    'Indoor']

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


  return (
    <Row className="justify-content-center">
      <Col className='mt-3 mb-3'>
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

          <Col className="text-center d-flex justify-content-center">
            <Button variant="primary" className="mt-1">SEARCH</Button>
            <div style={{paddingLeft:'5%'}}></div> 
            <Button variant='danger' className='mt-1'>RESET</Button>
          </Col>
        </Form>
      </Col>
    </Row>
  );
};

export default SearchOption;