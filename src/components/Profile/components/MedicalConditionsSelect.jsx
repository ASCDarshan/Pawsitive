// components/Profile/components/MedicalConditionsSelect.jsx
import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Box,
  Chip,
  OutlinedInput
} from "@mui/material";

// Common medical conditions for pets
const COMMON_CONDITIONS = [
  'Allergies', 'Arthritis', 'Asthma', 'Cancer', 'Cataracts', 'Dental Disease',
  'Diabetes', 'Ear Infections', 'Epilepsy', 'Heart Disease', 'Hip Dysplasia',
  'Hypothyroidism', 'Kidney Disease', 'Obesity', 'Pancreatitis', 'Skin Infections'
];

const MedicalConditionsSelect = ({ value = [], onChange, otherValue, onOtherChange }) => {
  // Check if "Other" is selected
  const isOtherSelected = value.includes('Other');

  const handleChange = (event) => {
    const selectedValues = event.target.value;
    onChange(selectedValues);
  };

  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="medical-conditions-label">Medical Conditions</InputLabel>
        <Select
          labelId="medical-conditions-label"
          id="medical-conditions"
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label="Medical Conditions" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((condition) => (
                <Chip key={condition} label={condition} />
              ))}
            </Box>
          )}
        >
          {COMMON_CONDITIONS.map((condition) => (
            <MenuItem key={condition} value={condition}>
              {condition}
            </MenuItem>
          ))}
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
      
      {/* Show text field for "Other" condition input */}
      {isOtherSelected && (
        <TextField
          label="Specify Other Conditions"
          fullWidth
          value={otherValue || ''}
          onChange={onOtherChange}
          margin="normal"
          placeholder="Enter other medical conditions"
          multiline
          rows={2}
        />
      )}
    </>
  );
};

export default MedicalConditionsSelect;