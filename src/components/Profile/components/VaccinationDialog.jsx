// components/Profile/components/VaccinationDialog.jsx
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Grid,
  TextField,
  Box
} from "@mui/material";
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import VaccinationSelect from './VaccinationSelect';

const VaccinationDialog = ({
  open,
  onClose,
  currentVaccination,
  setCurrentVaccination,
  vaccinationEditIndex,
  onSave,
  petType
}) => {
  const [otherVaccination, setOtherVaccination] = useState('');

  // For debugging
  useEffect(() => {
    console.log("VaccinationDialog - petType:", petType);
    console.log("VaccinationDialog - currentVaccination:", currentVaccination);
  }, [petType, currentVaccination]);

  // Handle vaccination selection
  const handleVaccinationChange = (event) => {
    const selectedVaccination = event.target.value;
    console.log("Selected vaccination:", selectedVaccination);
    
    setCurrentVaccination({
      ...currentVaccination,
      name: selectedVaccination
    });

    // Reset other vaccination if not "Other"
    if (selectedVaccination !== 'Other') {
      setOtherVaccination('');
    }
  };

  // Handle other vaccination name input
  const handleOtherVaccinationChange = (event) => {
    const value = event.target.value;
    setOtherVaccination(value);
    
    // If they select "Other" but then specify a custom vaccination,
    // we update the name with the custom value
    if (currentVaccination.name === 'Other') {
      setCurrentVaccination({
        ...currentVaccination,
        name: value
      });
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {vaccinationEditIndex >= 0 ? "Edit Vaccination Record" : "Add Vaccination Record"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Use VaccinationSelect component */}
            <VaccinationSelect
              petType={petType}
              value={currentVaccination.name || ''}
              onChange={handleVaccinationChange}
            />
            
            {/* Show text field for "Other" vaccination input */}
            {currentVaccination.name === 'Other' && (
              <TextField
                label="Specify Vaccination Name"
                fullWidth
                value={otherVaccination}
                onChange={handleOtherVaccinationChange}
                margin="normal"
                placeholder="Enter vaccination name"
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePicker
                label="Date Administered"
                value={currentVaccination.date}
                onChange={(newDate) => setCurrentVaccination({...currentVaccination, date: newDate})}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DatePicker
                label="Next Due Date"
                value={currentVaccination.nextDue}
                onChange={(newDate) => setCurrentVaccination({...currentVaccination, nextDue: newDate})}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={2}
              value={currentVaccination.notes || ''}
              onChange={(e) => setCurrentVaccination({...currentVaccination, notes: e.target.value})}
              margin="normal"
              placeholder="Additional information, reactions, etc."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={onSave} 
          variant="contained" 
          disabled={!currentVaccination.name || !currentVaccination.date}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VaccinationDialog;