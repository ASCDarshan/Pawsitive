// components/PetDialog.jsx
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CardActions,
  FormControlLabel,
  Switch,
  IconButton,
  Paper,
  Avatar,
  Chip
} from "@mui/material";
import { styled } from '@mui/material/styles';
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PetsIcon from "@mui/icons-material/Pets";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import BreedSelect from './BreedSelect';
import MedicalConditionsSelect from './MedicalConditionsSelect';
import AllergiesSelect from './AllergiesSelect';
import VaccinationSelect from './VaccinationSelect';

// Custom styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(144, 120, 226, 0.15)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #E6E0FF 0%, #D2C7F9 100%)',
  color: '#6247AA',
  padding: theme.spacing(3),
  fontWeight: 600,
  borderBottom: '1px solid #EAE4FF',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#8A6CE0',
    height: 3,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '1rem',
    color: '#5D5A72',
    '&.Mui-selected': {
      color: '#6247AA',
    },
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
  },
}));

const ImageUploadBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px dashed #D2C7F9',
  borderRadius: 16,
  padding: theme.spacing(3),
  position: 'relative',
  backgroundColor: '#F9F7FF',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#8A6CE0',
    backgroundColor: '#F6F2FF',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(144, 120, 226, 0.12)',
  transition: 'all 0.3s ease',
  border: '1px solid #EAE4FF',
  overflow: 'visible',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(144, 120, 226, 0.2)',
  },
}));

const VaccineAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: '#8A6CE0',
  position: 'absolute',
  top: -20,
  right: 20,
  height: 40,
  width: 40,
  boxShadow: '0 4px 8px rgba(144, 120, 226, 0.2)',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(0, 2, 2, 2),
  justifyContent: 'flex-end',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  boxShadow: 'none',
  padding: '8px 16px',
  fontWeight: 500,
}));

const PrimaryButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: '#8A6CE0',
  '&:hover': {
    backgroundColor: '#6247AA',
    boxShadow: '0 4px 12px rgba(144, 120, 226, 0.2)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    '& fieldset': {
      borderColor: '#E0DFF0',
    },
    '&:hover fieldset': {
      borderColor: '#C0B7E8',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8A6CE0',
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    '& fieldset': {
      borderColor: '#E0DFF0',
    },
    '&:hover fieldset': {
      borderColor: '#C0B7E8',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8A6CE0',
    },
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 8,
  fontWeight: 500,
  backgroundColor: status === 'due' ? '#FFE0EC' : '#E0F5E9',
  color: status === 'due' ? '#D4638F' : '#4B9E6F',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
}));

// Tab Panel component for the pet profile
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pet-tabpanel-${index}`}
      aria-labelledby={`pet-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PetDialog = ({ 
  open, 
  onClose, 
  currentPet, 
  setCurrentPet, 
  isEditMode, 
  tabValue, 
  handleTabChange, 
  onSave, 
  onAddVaccination,
  onEditVaccination,
  onDeleteVaccination,
  vaccinations = [] 
}) => {
  // Local state for other/custom values
  const [otherBreed, setOtherBreed] = useState('');
  const [otherConditions, setOtherConditions] = useState('');
  const [otherAllergies, setOtherAllergies] = useState('');
  
  // Initialize medical fields as arrays if not already
  useEffect(() => {
    if (currentPet) {
      if (!currentPet.medical) {
        setCurrentPet({
          ...currentPet,
          medical: {
            conditions: [],
            allergies: [],
            medications: ''
          }
        });
      } else if (!Array.isArray(currentPet.medical.conditions)) {
        // Convert strings to arrays if needed
        const conditionsArray = currentPet.medical.conditions ? 
          [currentPet.medical.conditions] : [];
        
        const allergiesArray = currentPet.medical.allergies ?
          [currentPet.medical.allergies] : [];
          
        setCurrentPet({
          ...currentPet,
          medical: {
            ...currentPet.medical,
            conditions: conditionsArray,
            allergies: allergiesArray,
          }
        });
      }
    }
  }, [currentPet?.id]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Check if vaccination is due
  const isVaccinationDue = (nextDue) => {
    if (!nextDue) return false;
    
    const dueDate = new Date(nextDue);
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);
    
    return dueDate <= oneMonthFromNow;
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentPet({...currentPet, image: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle breed change
  const handleBreedChange = (event) => {
    const selectedBreed = event.target.value;
    setCurrentPet({...currentPet, breed: selectedBreed});
    
    // Reset other breed if not "Other"
    if (selectedBreed !== 'Other') {
      setOtherBreed('');
    }
  };

  // Handle other breed change
  const handleOtherBreedChange = (event) => {
    const value = event.target.value;
    setOtherBreed(value);
    
    // If they select "Other" but then specify a custom breed,
    // we store the custom breed in the pet data
    if (currentPet.breed === 'Other') {
      setCurrentPet({...currentPet, customBreed: value});
    }
  };

  // Handle medical conditions change
  const handleConditionsChange = (selectedConditions) => {
    setCurrentPet({
      ...currentPet,
      medical: {
        ...currentPet.medical,
        conditions: selectedConditions
      }
    });
    
    // Reset other conditions if "Other" is not selected
    if (!selectedConditions.includes('Other')) {
      setOtherConditions('');
    }
  };

  // Handle other conditions change
  const handleOtherConditionsChange = (event) => {
    const value = event.target.value;
    setOtherConditions(value);
    
    setCurrentPet({
      ...currentPet,
      medical: {
        ...currentPet.medical,
        otherConditions: value
      }
    });
  };

  // Handle allergies change
  const handleAllergiesChange = (selectedAllergies) => {
    setCurrentPet({
      ...currentPet,
      medical: {
        ...currentPet.medical,
        allergies: selectedAllergies
      }
    });
    
    // Reset other allergies if "Other" is not selected
    if (!selectedAllergies.includes('Other')) {
      setOtherAllergies('');
    }
  };

  // Handle other allergies change
  const handleOtherAllergiesChange = (event) => {
    const value = event.target.value;
    setOtherAllergies(value);
    
    setCurrentPet({
      ...currentPet,
      medical: {
        ...currentPet.medical,
        otherAllergies: value
      }
    });
  };

  // Handle vaccination selection
  const handleVaccinationTypeChange = (event) => {
    const selectedVaccination = event.target.value;
    
    // This assumes we're in a context where current vaccination is being edited
    if (onAddVaccination) {
      // This is just changing the dropdown - actual vaccination handling is in the parent
      console.log("Selected vaccination:", selectedVaccination);
    }
  };

  return (
    <StyledDialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <StyledDialogTitle>
        {isEditMode ? `Edit ${currentPet.name}'s Profile` : "Add New Pet"}
      </StyledDialogTitle>
      <DialogContent sx={{ padding: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: '#EAE4FF' }}>
          <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="pet profile tabs">
            <StyledTab icon={<PetsIcon />} label="General Information" id="pet-tab-0" />
            <StyledTab icon={<MedicalServicesIcon />} label="Medical Profile" id="pet-tab-1" />
            <StyledTab icon={<VaccinesIcon />} label="Vaccination Records" id="pet-tab-2" />
          </StyledTabs>
        </Box>

        {/* General Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Pet Image Upload */}
            <Grid item xs={12} sx={{ mb: 1 }}>
              <ImageUploadBox>
                {currentPet.image ? (
                  <Box sx={{ position: 'relative', width: '100%', maxWidth: 300, maxHeight: 200 }}>
                    <img 
                      src={currentPet.image} 
                      alt="Pet preview" 
                      style={{ 
                        width: '100%', 
                        maxHeight: 200, 
                        objectFit: 'cover',
                        borderRadius: '16px'
                      }} 
                    />
                    <PrimaryButton
                      variant="contained"
                      component="label"
                      startIcon={<EditIcon />}
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        bottom: 10, 
                        right: 10,
                        backgroundColor: 'rgba(138, 108, 224, 0.85)',
                        '&:hover': {
                          backgroundColor: 'rgba(98, 71, 170, 0.9)',
                        }
                      }}
                    >
                      Change
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </PrimaryButton>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        mb: 2,
                        backgroundColor: '#E6E0FF',
                        color: '#8A6CE0'
                      }}
                    >
                      <AddAPhotoIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="body1" sx={{ mb: 2, color: '#6247AA', fontWeight: 500 }}>
                      Upload a photo of your pet
                    </Typography>
                    <PrimaryButton
                      variant="contained"
                      component="label"
                      startIcon={<AddIcon />}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </PrimaryButton>
                  </Box>
                )}
              </ImageUploadBox>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Pet Name"
                fullWidth
                required
                value={currentPet.name || ''}
                onChange={(e) => setCurrentPet({...currentPet, name: e.target.value})}
                margin="normal"
                InputLabelProps={{
                  sx: { color: '#7A7790' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledFormControl fullWidth margin="normal">
                <InputLabel id="pet-type-label" sx={{ color: '#7A7790' }}>Pet Type</InputLabel>
                <Select
                  labelId="pet-type-label"
                  value={currentPet.type || ''}
                  onChange={(e) => setCurrentPet({...currentPet, type: e.target.value, breed: ''})}
                  label="Pet Type"
                  sx={{ borderRadius: 12 }}
                >
                  <MenuItem value="dog">Dog</MenuItem>
                  <MenuItem value="cat">Cat</MenuItem>
                  <MenuItem value="bird">Bird</MenuItem>
                  <MenuItem value="fish">Fish</MenuItem>
                  <MenuItem value="rabbit">Rabbit</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </StyledFormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Use the BreedSelect component - would need to update this component to match the new style */}
              <BreedSelect
                petType={currentPet.type}
                value={currentPet.breed || ''}
                onChange={handleBreedChange}
                otherValue={otherBreed}
                onOtherChange={handleOtherBreedChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledFormControl fullWidth margin="normal">
                <InputLabel id="pet-gender-label" sx={{ color: '#7A7790' }}>Gender</InputLabel>
                <Select
                  labelId="pet-gender-label"
                  value={currentPet.gender || ''}
                  onChange={(e) => setCurrentPet({...currentPet, gender: e.target.value})}
                  label="Gender"
                  sx={{ borderRadius: 12 }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Unknown">Unknown</MenuItem>
                </Select>
              </StyledFormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Age"
                fullWidth
                value={currentPet.age || ''}
                onChange={(e) => setCurrentPet({...currentPet, age: e.target.value})}
                margin="normal"
                placeholder="e.g., 2 years"
                InputLabelProps={{
                  sx: { color: '#7A7790' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Weight"
                fullWidth
                value={currentPet.weight || ''}
                onChange={(e) => setCurrentPet({...currentPet, weight: e.target.value})}
                margin="normal"
                placeholder="e.g., 15 kg"
                InputLabelProps={{
                  sx: { color: '#7A7790' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Color/Markings"
                fullWidth
                value={currentPet.color || ''}
                onChange={(e) => setCurrentPet({...currentPet, color: e.target.value})}
                margin="normal"
                InputLabelProps={{
                  sx: { color: '#7A7790' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentPet.availableForMating || false}
                    onChange={(e) => setCurrentPet({...currentPet, availableForMating: e.target.checked})}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#8A6CE0',
                        '&:hover': {
                          backgroundColor: 'rgba(138, 108, 224, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#8A6CE0',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: '#5D5A72', fontWeight: 500 }}>
                    Available for Mating
                  </Typography>
                }
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={currentPet.description || ''}
                onChange={(e) => setCurrentPet({...currentPet, description: e.target.value})}
                margin="normal"
                placeholder="Special traits, personality, etc."
                InputLabelProps={{
                  sx: { color: '#7A7790' }
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Medical Profile Tab */}
        <TabPanel value={tabValue} index={1}>
          <Paper 
            elevation={0} 
            sx={{ 
              backgroundColor: '#F9F7FF', 
              p: 3, 
              borderRadius: 4,
              mb: 3
            }}
          >
            <Typography variant="h6" sx={{ color: '#6247AA', mb: 2, fontWeight: 600 }}>
              Medical Information
            </Typography>
            <Typography variant="body2" sx={{ color: '#5D5A72', mb: 1 }}>
              Keep track of your pet's health conditions, allergies, and medications.
            </Typography>
          </Paper>
        
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {/* Use MedicalConditionsSelect component - would need to update this component to match the new style */}
              <MedicalConditionsSelect
                value={currentPet.medical?.conditions || []}
                onChange={handleConditionsChange}
                otherValue={otherConditions}
                onOtherChange={handleOtherConditionsChange}
              />
            </Grid>
            <Grid item xs={12}>
              {/* Use AllergiesSelect component - would need to update this component to match the new style */}
              <AllergiesSelect
                value={currentPet.medical?.allergies || []}
                onChange={handleAllergiesChange}
                otherValue={otherAllergies}
                onOtherChange={handleOtherAllergiesChange}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                label="Medications"
                fullWidth
                multiline
                rows={2}
                value={currentPet.medical?.medications || ''}
                onChange={(e) => setCurrentPet({
                  ...currentPet, 
                  medical: {...(currentPet.medical || {}), medications: e.target.value}
                })}
                margin="normal"
                placeholder="Current medications and dosage"
                InputLabelProps={{
                  sx: { color: '#7A7790' }
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Vaccination Records Tab */}
        <TabPanel value={tabValue} index={2}>
          <Paper 
            elevation={0} 
            sx={{ 
              backgroundColor: '#F9F7FF', 
              p: 3, 
              borderRadius: 4,
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ color: '#6247AA', fontWeight: 600 }}>
                Vaccination Records
              </Typography>
              <Typography variant="body2" sx={{ color: '#5D5A72' }}>
                Keep track of your pet's vaccinations and upcoming renewal dates.
              </Typography>
            </Box>
            <PrimaryButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddVaccination}
              sx={{ 
                minWidth: '150px',
                backgroundColor: '#8A6CE0',
                borderRadius: 12,
                '&:hover': {
                  backgroundColor: '#6247AA',
                }
              }}
            >
              Add Vaccination
            </PrimaryButton>
          </Paper>
          
          {vaccinations && vaccinations.length > 0 ? (
            <Grid container spacing={3}>
              {vaccinations.map((vaccine, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <StyledCard>
                    <VaccineAvatar>
                      <VaccinesIcon />
                    </VaccineAvatar>
                    <StyledCardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ color: '#6247AA', fontWeight: 600 }}>
                          {vaccine.name}
                        </Typography>
                        {vaccine.nextDue && (
                          <StatusChip
                            label={isVaccinationDue(vaccine.nextDue) ? "Due Soon" : "Up to Date"}
                            status={isVaccinationDue(vaccine.nextDue) ? "due" : "ok"}
                            size="small"
                          />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#7A7790' }}>
                            Date Administered
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {formatDate(vaccine.date)}
                          </Typography>
                        </Box>
                        {vaccine.nextDue && (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#7A7790' }}>
                              Next Due
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {formatDate(vaccine.nextDue)}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      {vaccine.notes && (
                        <Typography variant="body2" sx={{ mt: 1, color: '#5D5A72' }}>
                          {vaccine.notes}
                        </Typography>
                      )}
                    </StyledCardContent>
                    <StyledCardActions>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />}
                        onClick={() => onEditVaccination(vaccine, index)}
                        sx={{ 
                          color: '#8A6CE0',
                          '&:hover': {
                            backgroundColor: 'rgba(138, 108, 224, 0.08)',
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => onDeleteVaccination(index)}
                        sx={{ 
                          '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.08)',
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </StyledCardActions>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                backgroundColor: '#F6F2FF', 
                borderRadius: 4,
                border: '2px dashed #D2C7F9'
              }}
            >
              <VaccinesIcon sx={{ fontSize: 48, color: '#8A6CE0', mb: 2, opacity: 0.6 }} />
              <Typography variant="body1" sx={{ color: '#6247AA', fontWeight: 500, mb: 1 }}>
                No vaccination records added yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#7A7790', mb: 2 }}>
                Add vaccination records to keep track of your pet's immunization schedule
              </Typography>
              <PrimaryButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAddVaccination}
                sx={{ backgroundColor: '#8A6CE0' }}
              >
                Add First Vaccination
              </PrimaryButton>
            </Box>
          )}
        </TabPanel>
      </DialogContent>
      <DialogActions sx={{ padding: 3, borderTop: '1px solid #EAE4FF', justifyContent: 'flex-end' }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: '#5D5A72', 
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(93, 90, 114, 0.08)',
            }
          }}
        >
          Cancel
        </Button>
        <PrimaryButton 
          onClick={onSave} 
          variant="contained" 
          disabled={!currentPet.name}
          sx={{ 
            backgroundColor: '#8A6CE0',
            '&:hover': {
              backgroundColor: '#6247AA',
            }
          }}
        >
          Save Pet Profile
        </PrimaryButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default PetDialog;