// components/BreedSelect.jsx
import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  TextField
} from "@mui/material";

// Dog breeds list
const DOG_BREEDS = [
  'Affenpinscher', 'Afghan Hound', 'Airedale Terrier', 'Akita', 'Alaskan Malamute',
  'American Bulldog', 'American Eskimo Dog', 'American Foxhound', 'American Pit Bull Terrier',
  'American Staffordshire Terrier', 'Australian Cattle Dog', 'Australian Shepherd',
  'Australian Terrier', 'Basenji', 'Basset Hound', 'Beagle', 'Bearded Collie',
  'Bedlington Terrier', 'Belgian Malinois', 'Belgian Sheepdog', 'Belgian Tervuren',
  'Bernese Mountain Dog', 'Bichon Frise', 'Bloodhound', 'Border Collie', 'Border Terrier',
  'Borzoi', 'Boston Terrier', 'Boxer', 'Boykin Spaniel', 'Brittany', 'Brussels Griffon',
  'Bull Terrier', 'Bulldog', 'Bullmastiff', 'Cairn Terrier', 'Canaan Dog', 'Cane Corso',
  'Cavalier King Charles Spaniel', 'Chesapeake Bay Retriever', 'Chihuahua', 'Chinese Crested',
  'Chinese Shar-Pei', 'Chow Chow', 'Cocker Spaniel', 'Collie', 'Dachshund', 'Dalmatian',
  'Doberman Pinscher', 'English Setter', 'English Springer Spaniel', 'French Bulldog',
  'German Pinscher', 'German Shepherd Dog', 'German Shorthaired Pointer', 'Golden Retriever',
  'Great Dane', 'Great Pyrenees', 'Greyhound', 'Havanese', 'Irish Setter', 'Irish Wolfhound',
  'Italian Greyhound', 'Jack Russell Terrier', 'Japanese Chin', 'Labrador Retriever',
  'Lhasa Apso', 'Maltese', 'Mastiff', 'Miniature Pinscher', 'Miniature Schnauzer',
  'Mixed Breed', 'Newfoundland', 'Norfolk Terrier', 'Norwegian Elkhound', 'Norwich Terrier',
  'Old English Sheepdog', 'Papillon', 'Pekingese', 'Pembroke Welsh Corgi', 'Pomeranian',
  'Poodle', 'Portuguese Water Dog', 'Pug', 'Rottweiler', 'Saint Bernard', 'Samoyed',
  'Schipperke', 'Scottish Terrier', 'Shetland Sheepdog', 'Shiba Inu', 'Shih Tzu',
  'Siberian Husky', 'Silky Terrier', 'Staffordshire Bull Terrier', 'Standard Schnauzer',
  'Tibetan Mastiff', 'Tibetan Spaniel', 'Vizsla', 'Weimaraner', 'Welsh Springer Spaniel',
  'West Highland White Terrier', 'Whippet', 'Yorkshire Terrier'
];

// Cat breeds list
const CAT_BREEDS = [
  'Abyssinian', 'American Bobtail', 'American Curl', 'American Shorthair', 'American Wirehair',
  'Balinese', 'Bengal', 'Birman', 'Bombay', 'British Shorthair', 'Burmese', 'Chartreux',
  'Cornish Rex', 'Devon Rex', 'Egyptian Mau', 'European Burmese', 'Exotic', 'Havana Brown',
  'Himalayan', 'Japanese Bobtail', 'Korat', 'LaPerm', 'Maine Coon', 'Manx', 'Mixed Breed',
  'Norwegian Forest', 'Ocicat', 'Oriental', 'Persian', 'Ragamuffin', 'Ragdoll', 'Russian Blue',
  'Scottish Fold', 'Selkirk Rex', 'Siamese', 'Siberian', 'Singapura', 'Somali', 'Sphynx',
  'Tonkinese', 'Turkish Angora', 'Turkish Van'
];

const BreedSelect = ({ petType, value, onChange, otherValue, onOtherChange, error }) => {
  // Determine which breed list to use based on pet type
  const breedList = petType === 'dog' ? DOG_BREEDS : 
                   petType === 'cat' ? CAT_BREEDS : 
                   [];
  
  // Check if "Other" is selected
  const isOtherSelected = value === 'Other';

  return (
    <>
      <FormControl fullWidth error={!!error} margin="normal">
        <InputLabel id="breed-select-label">Breed</InputLabel>
        <Select
          labelId="breed-select-label"
          id="breed-select"
          value={value || ''}
          label="Breed"
          onChange={onChange}
          disabled={!petType || !['dog', 'cat'].includes(petType)}
        >
          <MenuItem value="">
            <em>Select breed</em>
          </MenuItem>
          {breedList.map((breed) => (
            <MenuItem key={breed} value={breed}>
              {breed}
            </MenuItem>
          ))}
          <MenuItem value="Other">Other</MenuItem>
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
      
      {/* Show text field for "Other" breed input */}
      {isOtherSelected && (
        <TextField
          label="Specify Breed"
          fullWidth
          value={otherValue || ''}
          onChange={onOtherChange}
          margin="normal"
          placeholder="Enter breed name"
        />
      )}
    </>
  );
};

export default BreedSelect;