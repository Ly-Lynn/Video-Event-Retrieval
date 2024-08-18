// src/components/Selection.js
import React from 'react';
import Select from 'react-select';

const ODSelection = ({ objects, selectedObject, onSelectObject }) => {
  // Convert the objects array to the format required by react-select
  const options = objects.map(obj => ({ value: obj, label: obj }));

  // Handle the change event from react-select
  const handleChange = selectedOption => {
    onSelectObject(selectedOption ? selectedOption.value : '');
  };
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '200px', // Set your desired width here
    }),
    control: (provided) => ({
      ...provided,
      width: '100%', // Make sure the control takes up the full width of the container
    }),
  };

  return (
    <Select
    styles={customStyles}
      value={options.find(option => option.value === selectedObject)}
      onChange={handleChange}
      options={options}
      placeholder="Select Object"
    />
  );
};

export default ODSelection;

