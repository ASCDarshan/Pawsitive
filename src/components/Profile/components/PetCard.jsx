// components/PetCard.jsx
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions, 
  Avatar, 
  Typography, 
  IconButton, 
  Button, 
  Grid, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Badge,
  Chip,
  Switch,
  FormControlLabel
} from "@mui/material";
import { styled } from '@mui/material/styles';
import PetsIcon from "@mui/icons-material/Pets";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import VaccinesIcon from "@mui/icons-material/Vaccines";

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  borderRadius: 16,
  border: '1px solid #EAE4FF',
  overflow: 'visible',
  position: 'relative',
  background: 'linear-gradient(135deg, #F9F7FF 0%, #FFFFFF 100%)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 24px rgba(144, 120, 226, 0.15)',
  }
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  '& .MuiCardHeader-title': {
    color: '#6247AA',
    fontWeight: 600,
    fontSize: '1.1rem',
  },
  '& .MuiCardHeader-subheader': {
    color: '#7A7790',
    fontSize: '0.9rem',
  },
  padding: '16px 16px 8px 16px',
  backgroundColor: 'rgba(210, 199, 249, 0.2)',
  borderBottom: '1px solid rgba(210, 199, 249, 0.4)',
}));

const PetAvatar = styled(Avatar)(({ petType }) => {
  let gradient = 'linear-gradient(135deg, #8A6CE0 0%, #6247AA 100%)';
  
  if (petType === 'dog') {
    gradient = 'linear-gradient(135deg, #8A6CE0 0%, #6247AA 100%)'; // Purple gradient for dogs
  } else if (petType === 'cat') {
    gradient = 'linear-gradient(135deg, #9D8BE0 0%, #8068C6 100%)'; // Lighter purple gradient for cats
  } else if (petType === 'bird') {
    gradient = 'linear-gradient(135deg, #B3A4EC 0%, #9D8BE0 100%)'; // Even lighter purple gradient for birds
  }
  
  return {
    background: gradient,
    width: 50,
    height: 50,
    boxShadow: '0 4px 12px rgba(144, 120, 226, 0.3)',
    border: '2px solid #FFFFFF',
  };
});

const StyledChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: -12,
  right: 16,
  zIndex: 10,
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRadius: 12,
  backgroundColor: '#FF7BAC',
  color: '#FFFFFF',
  '& .MuiChip-icon': {
    color: '#FFFFFF',
  },
  boxShadow: '0 4px 12px rgba(255, 123, 172, 0.4)',
  border: '2px solid #FFFFFF',
  height: '28px',
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  height: 180,
  overflow: 'hidden',
  margin: '0 16px',
  borderRadius: 12,
  marginBottom: 16,
  boxShadow: '0 4px 12px rgba(144, 120, 226, 0.1)',
}));

const PlaceholderImage = styled(Box)(({ theme }) => ({
  height: 180,
  background: 'linear-gradient(135deg, #E6E0FF 0%, #D2C7F9 30%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 16px',
  borderRadius: 12,
  marginBottom: 16,
  border: '1px dashed rgba(255, 255, 255, 0.6)',
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  '&:before': { 
    display: 'none' 
  },
  backgroundColor: 'transparent',
  '& .MuiAccordionSummary-root': {
    minHeight: 40,
    padding: '0 8px',
    '&.Mui-expanded': {
      minHeight: 40,
    },
    '&:hover': {
      backgroundColor: 'rgba(210, 199, 249, 0.2)',
      borderRadius: 8,
    },
  },
  '& .MuiAccordionSummary-content': {
    margin: '8px 0',
    '&.Mui-expanded': {
      margin: '8px 0',
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: '0 8px 8px 8px',
  },
}));

const InfoGrid = styled(Grid)(({ theme }) => ({
  '& .MuiGrid-item': {
    paddingTop: 4,
    paddingBottom: 4,
  },
}));

const LabelText = styled(Typography)(({ theme }) => ({
  color: '#7A7790',
  fontSize: '0.75rem',
  fontWeight: 500,
}));

const ValueText = styled(Typography)(({ theme }) => ({
  color: '#5D5A72',
  fontSize: '0.875rem',
  fontWeight: 500,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#6247AA',
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '1.125rem',
    marginRight: 6,
    color: '#8A6CE0',
  },
}));

const VaccineBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -15,
    top: 4,
    backgroundColor: '#8A6CE0',
    color: 'white',
    fontWeight: 600,
  },
}));

const EditButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#8A6CE0',
  color: '#FFFFFF',
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: 12,
  paddingLeft: 16,
  paddingRight: 16,
  '&:hover': {
    backgroundColor: '#6247AA',
    boxShadow: '0 4px 12px rgba(138, 108, 224, 0.3)',
  },
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: '12px 16px',
  backgroundColor: 'rgba(210, 199, 249, 0.2)',
  borderTop: '1px solid rgba(210, 199, 249, 0.4)',
}));

const PetCard = ({ pet, onEdit, onDelete }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to check if vaccination is due soon (within 30 days)
  const isVaccinationDue = (nextDue) => {
    if (!nextDue) return false;
    
    const dueDate = new Date(nextDue);
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);
    
    return dueDate <= oneMonthFromNow && dueDate > now;
  };
  
  // Function to check if vaccination is overdue
  const isVaccinationOverdue = (nextDue) => {
    if (!nextDue) return false;
    
    const dueDate = new Date(nextDue);
    const now = new Date();
    
    return dueDate < now;
  };

  // Get vaccination status chip color
  const getVaccinationStatusChip = (vaccination) => {
    if (isVaccinationOverdue(vaccination.nextDue)) {
      return (
        <Chip 
          label="Overdue" 
          size="small" 
          sx={{ 
            backgroundColor: '#FFE0E0', 
            color: '#D46363',
            fontWeight: 500,
            fontSize: '0.7rem',
            height: 20,
            borderRadius: 6
          }} 
        />
      );
    } else if (isVaccinationDue(vaccination.nextDue)) {
      return (
        <Chip 
          label="Due Soon" 
          size="small" 
          sx={{ 
            backgroundColor: '#FFF4DD', 
            color: '#D49A40',
            fontWeight: 500,
            fontSize: '0.7rem',
            height: 20,
            borderRadius: 6
          }} 
        />
      );
    } else {
      return (
        <Chip 
          label="Up to Date" 
          size="small" 
          sx={{ 
            backgroundColor: '#E0F5E9', 
            color: '#4B9E6F',
            fontWeight: 500,
            fontSize: '0.7rem',
            height: 20,
            borderRadius: 6
          }} 
        />
      );
    }
  };

  return (
    <StyledCard>
      {/* Removed Mating Status Badge from top */}
      
      <StyledCardHeader
        avatar={
          <PetAvatar petType={pet.type}>
            <PetsIcon />
          </PetAvatar>
        }
        title={pet.name}
        subheader={`${pet.breed || ''} ${pet.type}`}
        action={
          <Box>
            <IconButton 
              onClick={() => onEdit(pet)} 
              size="small"
              sx={{ 
                color: '#8A6CE0',
                '&:hover': { 
                  backgroundColor: 'rgba(138, 108, 224, 0.08)' 
                } 
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              onClick={() => onDelete(pet.id)} 
              size="small"
              sx={{ 
                color: '#F87171',
                '&:hover': { 
                  backgroundColor: 'rgba(248, 113, 113, 0.08)' 
                } 
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      />
      
      {/* Pet Image */}
      {pet.image ? (
        <ImageContainer>
          <img 
            src={pet.image} 
            alt={pet.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover'
            }} 
          />
        </ImageContainer>
      ) : (
        <PlaceholderImage>
          <PetsIcon sx={{ fontSize: 60, color: '#C4B3F6' }} />
        </PlaceholderImage>
      )}
      
      <CardContent sx={{ pt: 0, flexGrow: 1, px: 2 }}>
        <InfoGrid container spacing={2}>
          {pet.gender && (
            <Grid item xs={6}>
              <LabelText>Gender</LabelText>
              <ValueText>{pet.gender}</ValueText>
            </Grid>
          )}
          {pet.age && (
            <Grid item xs={6}>
              <LabelText>Age</LabelText>
              <ValueText>{pet.age}</ValueText>
            </Grid>
          )}
          {pet.color && (
            <Grid item xs={6}>
              <LabelText>Color</LabelText>
              <ValueText>{pet.color}</ValueText>
            </Grid>
          )}
          {pet.weight && (
            <Grid item xs={6}>
              <LabelText>Weight</LabelText>
              <ValueText>{pet.weight}</ValueText>
            </Grid>
          )}
        </InfoGrid>

        {pet.description && (
          <Box sx={{ mt: 2 }}>
            <LabelText>Description</LabelText>
            <Typography variant="body2" sx={{ color: '#5D5A72', fontSize: '0.875rem' }}>
              {pet.description}
            </Typography>
          </Box>
        )}

        {/* Medical info accordion */}
        <StyledAccordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#8A6CE0' }} />}>
            <SectionTitle>
              <MedicalServicesIcon /> Medical Information
            </SectionTitle>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ 
              background: 'linear-gradient(135deg, #F6F2FF 0%, #EAE4FF 100%)', 
              p: 1.5, 
              borderRadius: 2,
              mb: 1,
              border: '1px solid rgba(210, 199, 249, 0.6)'
            }}>
              {pet.medical?.conditions ? (
                <Box sx={{ mb: 1.5 }}>
                  <LabelText>Conditions</LabelText>
                  <Typography variant="body2" sx={{ color: '#5D5A72', fontSize: '0.875rem' }}>
                    {pet.medical.conditions}
                  </Typography>
                </Box>
              ) : null}

              {pet.medical?.allergies ? (
                <Box sx={{ mb: 1.5 }}>
                  <LabelText>Allergies</LabelText>
                  <Typography variant="body2" sx={{ color: '#5D5A72', fontSize: '0.875rem' }}>
                    {pet.medical.allergies}
                  </Typography>
                </Box>
              ) : null}

              {pet.medical?.medications ? (
                <Box>
                  <LabelText>Medications</LabelText>
                  <Typography variant="body2" sx={{ color: '#5D5A72', fontSize: '0.875rem' }}>
                    {pet.medical.medications}
                  </Typography>
                </Box>
              ) : null}

              {!pet.medical?.conditions && !pet.medical?.allergies && !pet.medical?.medications && (
                <Typography variant="body2" sx={{ color: '#5D5A72', fontSize: '0.875rem', fontStyle: 'italic' }}>
                  No medical information provided.
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </StyledAccordion>

        {/* Vaccination accordion */}
        <StyledAccordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#8A6CE0' }} />}>
            <VaccineBadge 
              badgeContent={pet.vaccinations?.length || 0} 
            >
              <SectionTitle>
                <VaccinesIcon /> Vaccination Records
              </SectionTitle>
            </VaccineBadge>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ 
              background: 'linear-gradient(135deg, #F6F2FF 0%, #EAE4FF 100%)', 
              p: 1.5, 
              borderRadius: 2,
              border: '1px solid rgba(210, 199, 249, 0.6)'
            }}>
              {pet.vaccinations && pet.vaccinations.length > 0 ? (
                <Box>
                  {pet.vaccinations.map((vaccination, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        mb: index < pet.vaccinations.length - 1 ? 1.5 : 0,
                        pb: index < pet.vaccinations.length - 1 ? 1.5 : 0,
                        borderBottom: index < pet.vaccinations.length - 1 ? '1px solid #EAE4FF' : 'none' 
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <ValueText sx={{ color: '#6247AA' }}>{vaccination.name}</ValueText>
                        {vaccination.nextDue && getVaccinationStatusChip(vaccination)}
                      </Box>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <LabelText>Date</LabelText>
                          <Typography variant="body2" sx={{ color: '#5D5A72', fontSize: '0.875rem' }}>
                            {formatDate(vaccination.date)}
                          </Typography>
                        </Grid>
                        {vaccination.nextDue && (
                          <Grid item xs={6}>
                            <LabelText>Next Due</LabelText>
                            <Typography variant="body2" sx={{ color: '#5D5A72', fontSize: '0.875rem' }}>
                              {formatDate(vaccination.nextDue)}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: '#5D5A72', fontSize: '0.875rem', fontStyle: 'italic' }}>
                  No vaccination records available.
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </StyledAccordion>
      </CardContent>
      
      <StyledCardActions sx={{ justifyContent: 'space-between' }}>
        <FormControlLabel
          control={
            <Switch
              checked={pet.availableForMating || false}
              onChange={(e) => onEdit({...pet, availableForMating: e.target.checked})}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#FF7BAC',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 123, 172, 0.08)',
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#FF7BAC',
                },
              }}
            />
          }
          label={
            <Typography sx={{ color: '#5D5A72', fontWeight: 500, fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
              <FavoriteIcon sx={{ color: '#FF7BAC', fontSize: '1rem', mr: 0.5 }} /> Mating
            </Typography>
          }
        />
        <EditButton
          size="small" 
          onClick={() => onEdit(pet)}
          startIcon={<EditIcon />}
          variant="contained"
        >
          Edit Profile
        </EditButton>
      </StyledCardActions>
    </StyledCard>
  );
};

export default PetCard;