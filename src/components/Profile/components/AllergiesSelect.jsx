// components/Profile/components/AllergiesSelect.jsx
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

// Common allergies for pets
const COMMON_ALLERGIES = [
  'Beef', 'Chicken', 'Dairy', 'Dust Mites', 'Eggs', 'Fish', 'Fleas', 
  'Grain', 'Grass', 'Lamb', 'Mold', 'Pollen', 'Pork', 'Soy', 'Wheat'
];

const AllergiesSelect = ({ value = [], onChange, otherValue, onOtherChange }) => {
  // Check if "Other" is selected
  const isOtherSelected = value.includes('Other');

  const handleChange = (event) => {
    const selectedValues = event.target.value;
    onChange(selectedValues);
  };

  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="allergies-label">Allergies</InputLabel>
        <Select
          labelId="allergies-label"
          id="allergies"
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label="Allergies" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((allergy) => (
                <Chip key={allergy} label={allergy} />
              ))}
            </Box>
          )}
        >
          {COMMON_ALLERGIES.map((allergy) => (
            <MenuItem key={allergy} value={allergy}>
              {allergy}
            </MenuItem>
          ))}
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
      
      {/* Show text field for "Other" allergy input */}
      {isOtherSelected && (
        <TextField
          label="Specify Other Allergies"
          fullWidth
          value={otherValue || ''}
          onChange={onOtherChange}
          margin="normal"
          placeholder="Enter other allergies"
          multiline
          rows={2}
        />
      )}
    </>
  );
};

export default AllergiesSelect;