// components/NearbyMates/NearbyMates.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Alert,
  Paper,
  Button,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Container
} from "@mui/material";
import { ref, get, set } from "firebase/database";
import { database, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PetsIcon from "@mui/icons-material/Pets";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MatingRequestDialog from "../Profile/components/MatingRequestDialog";

const NearbyMates = () => {
  const [loading, setLoading] = useState(true);
  const [loadingUserLocation, setLoadingUserLocation] = useState(true);
  const [availablePets, setAvailablePets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [userPets, setUserPets] = useState([]);
  const [selectedUserPet, setSelectedUserPet] = useState("");
  const [selectedUserPetData, setSelectedUserPetData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [maxDistance, setMaxDistance] = useState(10);
  const [locationError, setLocationError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openMatingRequestDialog, setOpenMatingRequestDialog] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPetOwner, setSelectedPetOwner] = useState(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    setLoadingUserLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLoadingUserLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(error.message);
          setLoadingUserLocation(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setLoadingUserLocation(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserPets = async () => {
      if (!user) {
        navigate("/login", { state: { from: "/nearby-mates" } });
        return;
      }

      try {
        const userPetsRef = ref(database, `userPets/${user.uid}`);
        const snapshot = await get(userPetsRef);

        if (snapshot.exists()) {
          const petsData = snapshot.val();
          const petsArray = Object.keys(petsData).map(petId => ({
            id: petId,
            ...petsData[petId]
          }));

          setUserPets(petsArray);

          if (petsArray.length > 0) {
            setSelectedUserPet(petsArray[0].id);
            setSelectedUserPetData(petsArray[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching user's pets:", error);
      }
    };

    fetchUserPets();
  }, [navigate, user]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  useEffect(() => {
    const fetchAvailablePets = async () => {
      if (!userLocation || !selectedUserPetData) return;

      setLoading(true);
      try {
        const userPetsRef = ref(database, "userPets");
        const snapshot = await get(userPetsRef);

        if (snapshot.exists()) {
          const allPets = [];
          const petsData = snapshot.val();

          Object.keys(petsData).forEach(userId => {
            if (userId === user?.uid) return;

            const userPets = petsData[userId];
            Object.keys(userPets).forEach(petId => {
              const pet = userPets[petId];
              if (pet.availableForMating) {
                const petLocation = {
                  latitude: userLocation.latitude + (Math.random() - 0.5) * 0.1,
                  longitude: userLocation.longitude + (Math.random() - 0.5) * 0.1
                };

                const distance = calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  petLocation.latitude,
                  petLocation.longitude
                );

                const ownerData = {
                  id: userId,
                  displayName: "Pet Owner"
                };

                allPets.push({
                  ...pet,
                  id: petId,
                  userId: userId,
                  distance: distance.toFixed(1),
                  location: petLocation,
                  owner: ownerData
                });
              }
            });
          });

          allPets.sort((a, b) => a.distance - b.distance);

          setAvailablePets(allPets);
        } else {
          setAvailablePets([]);
        }
      } catch (error) {
        console.error("Error fetching available pets:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userLocation && selectedUserPetData) {
      fetchAvailablePets();
    }
  }, [userLocation, selectedUserPetData, user]);

  useEffect(() => {
    if (!selectedUserPetData || availablePets.length === 0) {
      setFilteredPets([]);
      return;
    }

    const filtered = availablePets.filter(pet => {
      if (pet.type !== selectedUserPetData.type) return false;

      if (pet.gender === selectedUserPetData.gender) return false;

      if (parseFloat(pet.distance) > maxDistance) return false;

      return true;
    });

    setFilteredPets(filtered);
  }, [selectedUserPetData, maxDistance, availablePets]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUserPetChange = (event) => {
    const petId = event.target.value;
    setSelectedUserPet(petId);
    const petData = userPets.find(pet => pet.id === petId);
    setSelectedUserPetData(petData);
  };

  const handleDistanceChange = (event, newValue) => {
    setMaxDistance(newValue);
  };

  const handlePetDetail = (pet) => {
    console.log("View pet details:", pet);
  };

  const handleOpenMatingRequest = (pet) => {
    setSelectedPet(pet);
    setSelectedPetOwner(pet.owner);
    setOpenMatingRequestDialog(true);
  };

  const handleSendMatingRequest = async (requestData) => {
    if (!user || !selectedUserPetData || !selectedPet) return;

    try {
      const requestId = Date.now().toString();

      const receiverRequestRef = ref(database, `matingRequests/received/${selectedPet.userId}/${requestId}`);
      await set(receiverRequestRef, {
        id: requestId,
        senderId: user.uid,
        senderName: user.displayName,
        senderPetId: selectedUserPetData.id,
        senderPetName: selectedUserPetData.name,
        receiverId: selectedPet.userId,
        receiverPetId: selectedPet.id,
        receiverPetName: selectedPet.name,
        message: requestData.message,
        status: 'pending',
        createdAt: Date.now(),
        direction: 'incoming'
      });

      const senderRequestRef = ref(database, `matingRequests/sent/${user.uid}/${requestId}`);
      await set(senderRequestRef, {
        id: requestId,
        senderId: user.uid,
        senderName: user.displayName,
        senderPetId: selectedUserPetData.id,
        senderPetName: selectedUserPetData.name,
        receiverId: selectedPet.userId,
        receiverPetId: selectedPet.id,
        receiverPetName: selectedPet.name,
        message: requestData.message,
        status: 'pending',
        createdAt: Date.now(),
        direction: 'outgoing'
      });

      setOpenMatingRequestDialog(false);

      alert("Mating request sent successfully!");
    } catch (error) {
      console.error("Error sending mating request:", error);
      alert("Failed to send mating request. Please try again.");
    }
  };

  if (loadingUserLocation) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Getting your location...</Typography>
      </Box>
    );
  }

  if (locationError) {
    return (
      <Box sx={{ padding: { xs: 2, sm: 4 }, minHeight: "100vh", backgroundColor: "#f9f5ff" }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error: {locationError}. We need your location to find nearby pets.
        </Alert>
        <Typography variant="body1">
          Please enable location services in your browser and try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: { xs: 2, sm: 3 }, minHeight: "100vh", pb: 8 }}>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3
        }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ ml: 2, fontWeight: "bold", display: "flex", alignItems: "center" }}>
              <FavoriteIcon sx={{ mr: 1, color: "#d81b60" }} />
              Nearby Mating Pets
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: 'linear-gradient(145deg, #f9f5ff 0%, #ffe6e6 100%)'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Find Matches For Your Pet
          </Typography>

          {userPets.length === 0 ? (
            <Alert severity="info">
              You don't have any pets in your profile yet. Please add a pet first.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                  <InputLabel id="user-pet-label">Your Pet</InputLabel>
                  <Select
                    labelId="user-pet-label"
                    value={selectedUserPet}
                    label="Your Pet"
                    onChange={handleUserPetChange}
                  >
                    {userPets.map(pet => (
                      <MenuItem key={pet.id} value={pet.id}>
                        {pet.name} ({pet.type} - {pet.gender})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedUserPetData && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={selectedUserPetData.image}
                      alt={selectedUserPetData.name}
                      sx={{ width: 40, height: 40, mr: 1 }}
                    />
                    <Box>
                      <Typography variant="subtitle1">
                        {selectedUserPetData.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedUserPetData.breed || 'Unknown breed'}, {selectedUserPetData.gender}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={7}>
                <Typography gutterBottom>
                  Maximum Distance: <strong>{maxDistance} km</strong>
                </Typography>
                <Slider
                  value={maxDistance}
                  onChange={handleDistanceChange}
                  min={1}
                  max={50}
                  valueLabelDisplay="auto"
                  aria-labelledby="distance-slider"
                  marks={[
                    { value: 5, label: '5km' },
                    { value: 10, label: '10km' },
                    { value: 25, label: '25km' },
                    { value: 50, label: '50km' }
                  ]}
                />

                <Alert severity="info" sx={{ mt: 2 }}>
                  <strong>Finding opposite gender matches</strong>: We're showing {selectedUserPetData?.gender === 'Male' ? 'female' : 'male'} pets for your {selectedUserPetData?.gender?.toLowerCase()} pet.
                </Alert>
              </Grid>
            </Grid>
          )}
        </Paper>

        {userPets.length > 0 && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="pet matches tabs"
              >
                <Tab label="All Matches" />
                <Tab label="Nearby (< 5km)" />
                <Tab label="Same Breed" />
              </Tabs>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                <CircularProgress />
              </Box>
            ) : filteredPets.length > 0 ? (
              <Grid container spacing={3}>
                {filteredPets.map((pet) => (
                  <Grid item xs={12} sm={6} md={4} key={pet.id}>
                    <Card sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: 2,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 4
                      },
                      position: 'relative'
                    }}>
                      <Chip
                        icon={<LocationOnIcon />}
                        label={`${pet.distance} km`}
                        color="primary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          zIndex: 1,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white'
                        }}
                      />

                      <Chip
                        label={pet.gender}
                        color={pet.gender === 'Female' ? 'secondary' : 'info'}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          zIndex: 1
                        }}
                      />

                      <Box sx={{
                        position: 'relative',
                        paddingTop: '56.25%',
                        backgroundColor: '#f5f5f5'
                      }}>
                        {pet.image ? (
                          <CardMedia
                            component="img"
                            image={pet.image}
                            alt={pet.name}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <PetsIcon sx={{ fontSize: 60, color: '#bdbdbd' }} />
                          </Box>
                        )}
                      </Box>

                      {/* Pet info */}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {pet.name}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          <strong>Breed:</strong> {pet.breed || 'Unknown breed'}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          <strong>Age:</strong> {pet.age || 'Unknown age'}
                        </Typography>

                        {pet.description && (
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            {pet.description.length > 100
                              ? `${pet.description.substring(0, 100)}...`
                              : pet.description
                            }
                          </Typography>
                        )}
                      </CardContent>

                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 2,
                        borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                      }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<InfoIcon />}
                          onClick={() => handlePetDetail(pet)}
                        >
                          Details
                        </Button>

                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          startIcon={<FavoriteIcon />}
                          onClick={() => handleOpenMatingRequest(pet)}
                        >
                          Request Mating
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper
                elevation={1}
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: 2,
                  backgroundColor: '#f5f5f5'
                }}
              >
                <PetsIcon sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No Matching Pets Found
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
                  There are no pets available for mating near you that match your pet's profile.
                  Try increasing the distance or checking back later.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/profile')}
                  size="large"
                >
                  Back to Profile
                </Button>
              </Paper>
            )}
          </>
        )}

        {selectedUserPetData && selectedPet && (
          <MatingRequestDialog
            open={openMatingRequestDialog}
            onClose={() => setOpenMatingRequestDialog(false)}
            senderPet={selectedUserPetData}
            receiverPet={selectedPet}
            receiverOwner={selectedPetOwner}
            onSend={handleSendMatingRequest}
          />
        )}
      </Box>
    </Container>
  );
};

export default NearbyMates;