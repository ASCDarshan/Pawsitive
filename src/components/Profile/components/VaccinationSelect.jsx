// components/Profile/components/VaccinationSelect.jsx
import React, { useEffect } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem
} from "@mui/material";

// Common vaccinations for dogs
const DOG_VACCINATIONS = [
  'Rabies', 'Distemper', 'Parvovirus', 'Adenovirus/Hepatitis', 'Parainfluenza',
  'Bordetella (Kennel Cough)', 'Leptospirosis', 'Canine Influenza', 'Lyme Disease',
  'Coronavirus'
];

// Common vaccinations for cats
const CAT_VACCINATIONS = [
  'Rabies', 'Feline Viral Rhinotracheitis', 'Calicivirus', 'Panleukopenia',
  'Feline Leukemia Virus (FeLV)', 'Chlamydia', 'Bordetella', 'Feline Immunodeficiency Virus (FIV)'
];

const VaccinationSelect = ({ petType, value, onChange }) => {
  // For debugging
  useEffect(() => {
    console.log("VaccinationSelect - petType:", petType);
    console.log("VaccinationSelect - value:", value);
  }, [petType, value]);

  // Determine which vaccination list to use based on pet type
  const vaccinationList = petType === 'dog' ? DOG_VACCINATIONS : 
                          petType === 'cat' ? CAT_VACCINATIONS : 
                          [];
  
  // For debugging
  useEffect(() => {
    console.log("Vaccination list:", vaccinationList);
  }, [vaccinationList]);

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="vaccination-select-label">Vaccination Type</InputLabel>
      <Select
        labelId="vaccination-select-label"
        id="vaccination-select"
        value={value || ''}
        label="Vaccination Type"
        onChange={onChange}
        disabled={!petType || !['dog', 'cat'].includes(petType)}
      >
        <MenuItem value="">
          <em>Select vaccination</em>
        </MenuItem>
        {vaccinationList.map((vaccination) => (
          <MenuItem key={vaccination} value={vaccination}>
            {vaccination}
          </MenuItem>
        ))}
        <MenuItem value="Other">Other</MenuItem>
      </Select>
    </FormControl>
  );
};

export default VaccinationSelect;