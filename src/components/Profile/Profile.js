/* eslint-disable react-hooks/exhaustive-deps */
// Profile.jsx - Redesigned component
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Fab,
  Tabs,
  Tab,
  Paper,
  Badge,
  Button,
  Avatar,
  Card,
  CardContent,
  Chip,
  Container,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { auth, db, database } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, set, get, update, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import ArrowforwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import PetsIcon from "@mui/icons-material/Pets";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChatIcon from "@mui/icons-material/Chat";
import UserInfo from "./components/UserInfo";
import PetCard from "./components/PetCard";
import PetDialog from "./components/PetDialog";
import ResourcesList from "./components/ResourcesList";
import CommentsList from "./components/CommentsList";
import VaccinationDialog from "./components/VaccinationDialog";
import MessageDialog from "./components/MessageDialog";
import ConversationsList from "./components/ConversationsList";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [likedResources, setLikedResources] = useState([]);
  const [comments, setComments] = useState([]);
  const [pets, setPets] = useState([]);
  const [openPetDialog, setOpenPetDialog] = useState(false);
  const [profileTabValue, setProfileTabValue] = useState(0);
  const [matingRequests, setMatingRequests] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [currentMessage, setCurrentMessage] = useState({
    text: "",
    recipientId: "",
    petId: "",
    receiverPetId: "",
  });
  const [currentPet, setCurrentPet] = useState({
    id: "",
    name: "",
    type: "dog",
    breed: "",
    gender: "",
    age: "",
    weight: "",
    color: "",
    description: "",
    image: "",
    availableForMating: false,
    availableForAdoption: false,
    medical: {
      conditions: [],
      allergies: [],
      medications: "",
    },
    vaccinations: [],
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [openVaccinationDialog, setOpenVaccinationDialog] = useState(false);

  const [currentVaccination, setCurrentVaccination] = useState({
    name: "",
    date: null,
    nextDue: null,
    notes: "",
  });

  const [vaccinationEditIndex, setVaccinationEditIndex] = useState(-1);

  const fetchLikedResources = async () => {
    if (!user) return;

    try {
      const userLikesRef = ref(database, `userLikes/${user.uid}`);
      const snapshot = await get(userLikesRef);

      if (snapshot.exists()) {
        const likedResourceIds = Object.keys(snapshot.val());
        const likedResourcesArray = [];

        for (const resourceId of likedResourceIds) {
          const resourceRef = ref(database, `resources/${resourceId}`);
          const resourceSnapshot = await get(resourceRef);

          if (resourceSnapshot.exists()) {
            const resourceData = resourceSnapshot.val();
            likedResourcesArray.push({
              id: resourceId,
              ...resourceData,
            });
          } else {
            try {
              const resourceDoc = await getDoc(
                doc(db, "resources", resourceId)
              );
              if (resourceDoc.exists()) {
                likedResourcesArray.push({
                  id: resourceId,
                  ...resourceDoc.data(),
                });
              }
            } catch (err) {
              console.warn("Could not fetch resource from Firestore:", err);
            }
          }
        }

        setLikedResources(likedResourcesArray);
      } else {
        const resourcesCollection = collection(db, "resources");
        const q = query(resourcesCollection);
        const querySnapshot = await getDocs(q);
        const likedResourcesArray = [];

        for (const resourceDoc of querySnapshot.docs) {
          const likesCollection = collection(
            db,
            "resources",
            resourceDoc.id,
            "likes"
          );
          const likeDocRef = doc(likesCollection, user.uid);
          const likeDoc = await getDoc(likeDocRef);
          if (likeDoc.exists()) {
            const resourceData = resourceDoc.data();
            likedResourcesArray.push({
              id: resourceDoc.id,
              ...resourceData,
            });
          }
        }

        setLikedResources(likedResourcesArray);
      }
    } catch (error) {
      console.error("Error fetching liked resources:", error);
    }
  };

  const fetchUserComments = async () => {
    if (!user) return;

    try {
      const userCommentsRef = ref(database, `userComments/${user.uid}`);
      const snapshot = await get(userCommentsRef);

      if (snapshot.exists()) {
        const commentsData = snapshot.val();
        const commentsArray = [];

        for (const resourceId in commentsData) {
          for (const commentId in commentsData[resourceId]) {
            const comment = commentsData[resourceId][commentId];

            try {
              const resourceRef = ref(database, `resources/${resourceId}`);
              const resourceSnapshot = await get(resourceRef);
              const resourceName = resourceSnapshot.exists()
                ? resourceSnapshot.val().name
                : "Unknown Resource";

              commentsArray.push({
                id: commentId,
                resourceId,
                resourceName,
                ...comment,
              });
            } catch (err) {
              console.warn("Error fetching resource for comment:", err);
            }
          }
        }

        setComments(commentsArray);
      } else {
        const commentsArray = [];
        const resourcesCollection = collection(db, "resources");
        const q = query(resourcesCollection);
        const querySnapshot = await getDocs(q);

        for (const resourceDoc of querySnapshot.docs) {
          const commentsCollection = collection(
            db,
            "resources",
            resourceDoc.id,
            "comments"
          );
          const userCommentsQuery = query(
            commentsCollection,
            where("userId", "==", user.uid)
          );
          const commentsSnapshot = await getDocs(userCommentsQuery);
          commentsSnapshot.forEach((commentDoc) => {
            commentsArray.push({
              id: commentDoc.id,
              resourceId: resourceDoc.id,
              resourceName: resourceDoc.data().name,
              ...commentDoc.data(),
            });
          });
        }

        setComments(commentsArray);
      }
    } catch (error) {
      console.error("Error fetching user comments:", error);
    }
  };

  const fetchUserPets = async () => {
    if (!user) return;

    try {
      const userPetsRef = ref(database, `userPets/${user.uid}`);
      const snapshot = await get(userPetsRef);

      if (snapshot.exists()) {
        const petsData = snapshot.val();
        const petsArray = Object.keys(petsData).map((petId) => ({
          id: petId,
          ...petsData[petId],
        }));

        setPets(petsArray);
      } else {
        setPets([]);
      }
    } catch (error) {
      console.error("Error fetching user pets:", error);
    }
  };

  const fetchMatingRequests = async () => {
    if (!user) return;

    try {
      const incomingRequestsRef = ref(
        database,
        `matingRequests/received/${user.uid}`
      );
      const sentRequestsRef = ref(database, `matingRequests/sent/${user.uid}`);

      const incomingSnapshot = await get(incomingRequestsRef);
      const sentSnapshot = await get(sentRequestsRef);

      const requests = [];

      if (incomingSnapshot.exists()) {
        const incomingData = incomingSnapshot.val();

        for (const requestId in incomingData) {
          const request = incomingData[requestId];

          const senderUserRef = ref(database, `users/${request.senderId}`);
          const senderSnapshot = await get(senderUserRef);
          const senderData = senderSnapshot.exists()
            ? senderSnapshot.val()
            : { displayName: "Unknown User" };

          const senderPetRef = ref(
            database,
            `userPets/${request.senderId}/${request.senderPetId}`
          );
          const senderPetSnapshot = await get(senderPetRef);
          const senderPetData = senderPetSnapshot.exists()
            ? senderPetSnapshot.val()
            : { name: "Unknown Pet" };

          const receiverPetRef = ref(
            database,
            `userPets/${user.uid}/${request.receiverPetId}`
          );
          const receiverPetSnapshot = await get(receiverPetRef);
          const receiverPetData = receiverPetSnapshot.exists()
            ? receiverPetSnapshot.val()
            : { name: "Unknown Pet" };

          requests.push({
            id: requestId,
            ...request,
            direction: "incoming",
            senderName: senderData.displayName,
            senderPetName: senderPetData.name,
            senderPetImage: senderPetData.image,
            senderPetBreed: senderPetData.breed,
            receiverPetName: receiverPetData.name,
            receiverPetImage: receiverPetData.image,
          });
        }
      }

      if (sentSnapshot.exists()) {
        const sentData = sentSnapshot.val();

        for (const requestId in sentData) {
          const request = sentData[requestId];

          const receiverUserRef = ref(database, `users/${request.receiverId}`);
          const receiverSnapshot = await get(receiverUserRef);
          const receiverData = receiverSnapshot.exists()
            ? receiverSnapshot.val()
            : { displayName: "Unknown User" };

          const senderPetRef = ref(
            database,
            `userPets/${user.uid}/${request.senderPetId}`
          );
          const senderPetSnapshot = await get(senderPetRef);
          const senderPetData = senderPetSnapshot.exists()
            ? senderPetSnapshot.val()
            : { name: "Unknown Pet" };

          const receiverPetRef = ref(
            database,
            `userPets/${request.receiverId}/${request.receiverPetId}`
          );
          const receiverPetSnapshot = await get(receiverPetRef);
          const receiverPetData = receiverPetSnapshot.exists()
            ? receiverPetSnapshot.val()
            : { name: "Unknown Pet" };

          requests.push({
            id: requestId,
            ...request,
            direction: "outgoing",
            receiverName: receiverData.displayName,
            senderPetName: senderPetData.name,
            senderPetImage: senderPetData.image,
            receiverPetName: receiverPetData.name,
            receiverPetImage: receiverPetData.image,
            receiverPetBreed: receiverPetData.breed,
          });
        }
      }

      requests.sort((a, b) => b.createdAt - a.createdAt);

      setMatingRequests(requests);
    } catch (error) {
      console.error("Error fetching mating requests:", error);
    }
  };

  const handleProfileTabChange = (event, newValue) => {
    setProfileTabValue(newValue);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddPet = () => {
    setCurrentPet({
      id: Date.now().toString(),
      name: "",
      type: "dog",
      breed: "",
      gender: "",
      age: "",
      weight: "",
      color: "",
      description: "",
      image: "",
      availableForMating: false,
      availableForAdoption: false,
      medical: {
        conditions: [],
        allergies: [],
        medications: "",
      },
      vaccinations: [],
    });
    setIsEditMode(false);
    setOpenPetDialog(true);
  };

  const handleEditPet = (pet) => {
    setCurrentPet({ ...pet });
    setIsEditMode(true);
    setOpenPetDialog(true);
  };

  const handleSavePet = async () => {
    if (!user || !currentPet.name) return;

    try {
      const petRef = ref(database, `userPets/${user.uid}/${currentPet.id}`);
      await set(petRef, currentPet);

      if (isEditMode) {
        setPets(
          pets.map((pet) => (pet.id === currentPet.id ? currentPet : pet))
        );
      } else {
        setPets([...pets, currentPet]);
      }

      setOpenPetDialog(false);
    } catch (error) {
      console.error("Error saving pet:", error);
      alert("Failed to save pet information. Please try again.");
    }
  };

  const handleDeletePet = async (petId) => {
    if (!user || !window.confirm("Are you sure you want to delete this pet?"))
      return;

    try {
      const petRef = ref(database, `userPets/${user.uid}/${petId}`);
      await remove(petRef);

      setPets(pets.filter((pet) => pet.id !== petId));
    } catch (error) {
      console.error("Error deleting pet:", error);
      alert("Failed to delete pet. Please try again.");
    }
  };

  const handleAddVaccination = () => {
    console.log("Adding vaccination for pet type:", currentPet.type);

    setCurrentVaccination({
      name: "",
      date: null,
      nextDue: null,
      notes: "",
    });
    setVaccinationEditIndex(-1);
    setOpenVaccinationDialog(true);
  };

  const handleEditVaccination = (vaccination, index) => {
    setCurrentVaccination({ ...vaccination });
    setVaccinationEditIndex(index);
    setOpenVaccinationDialog(true);
  };

  const handleSaveVaccination = () => {
    if (!currentVaccination.name || !currentVaccination.date) return;

    const updatedPet = { ...currentPet };
    updatedPet.vaccinations = updatedPet.vaccinations || [];

    if (vaccinationEditIndex >= 0) {
      updatedPet.vaccinations[vaccinationEditIndex] = currentVaccination;
    } else {
      updatedPet.vaccinations.push(currentVaccination);
    }

    setCurrentPet(updatedPet);
    setOpenVaccinationDialog(false);
  };

  const handleDeleteVaccination = (index) => {
    const updatedPet = { ...currentPet };
    updatedPet.vaccinations.splice(index, 1);
    setCurrentPet(updatedPet);
  };

  const handleRequestMenuOpen = (event, request) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(request);
  };

  const handleRequestMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenConversationFromList = (conversation) => {
    setCurrentMessage({
      text: "",
      recipientId: conversation.otherParticipantId,
      recipientName: conversation.otherParticipantName,
      senderPet: conversation.senderPet,
      receiverPet: conversation.receiverPet,
      matingRequestId: conversation.matingRequestId,
      conversationId: conversation.id,
    });

    setOpenMessageDialog(true);
  };

  const handleAcceptRequest = async () => {
    if (!selectedRequest) return;

    try {
      const requestRef = ref(
        database,
        `matingRequests/received/${user.uid}/${selectedRequest.id}`
      );
      await update(requestRef, {
        status: "accepted",
        updatedAt: Date.now(),
      });

      const senderRequestRef = ref(
        database,
        `matingRequests/sent/${selectedRequest.senderId}/${selectedRequest.id}`
      );
      await update(senderRequestRef, {
        status: "accepted",
        updatedAt: Date.now(),
      });

      setMatingRequests(
        matingRequests.map((req) =>
          req.id === selectedRequest.id
            ? { ...req, status: "accepted", updatedAt: Date.now() }
            : req
        )
      );

      handleRequestMenuClose();
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request. Please try again.");
    }
  };

  const handleDeclineRequest = async () => {
    if (!selectedRequest) return;

    try {
      const requestRef = ref(
        database,
        `matingRequests/received/${user.uid}/${selectedRequest.id}`
      );
      await update(requestRef, {
        status: "declined",
        updatedAt: Date.now(),
      });

      const senderRequestRef = ref(
        database,
        `matingRequests/sent/${selectedRequest.senderId}/${selectedRequest.id}`
      );
      await update(senderRequestRef, {
        status: "declined",
        updatedAt: Date.now(),
      });

      setMatingRequests(
        matingRequests.map((req) =>
          req.id === selectedRequest.id
            ? { ...req, status: "declined", updatedAt: Date.now() }
            : req
        )
      );

      handleRequestMenuClose();
    } catch (error) {
      console.error("Error declining request:", error);
      alert("Failed to decline request. Please try again.");
    }
  };

  const handleOpenMessageDialog = (request) => {
    const conversationId = `mating_${request.id}`;

    const senderPet = pets.find(
      (pet) =>
        pet.id ===
        (request.direction === "incoming"
          ? request.receiverPetId
          : request.senderPetId)
    );

    setCurrentMessage({
      text: "",
      recipientId:
        request.direction === "incoming"
          ? request.senderId
          : request.receiverId,
      recipientName:
        request.direction === "incoming"
          ? request.senderName
          : request.receiverName,
      petId:
        request.direction === "incoming"
          ? request.receiverPetId
          : request.senderPetId,
      receiverPetId:
        request.direction === "incoming"
          ? request.senderPetId
          : request.receiverPetId,
      matingRequestId: request.id,
      conversationId: conversationId,
      senderPet: senderPet,
      receiverPet: {
        name:
          request.direction === "incoming"
            ? request.senderPetName
            : request.receiverPetName,
        image:
          request.direction === "incoming"
            ? request.senderPetImage
            : request.receiverPetImage,
      },
    });

    setOpenMessageDialog(true);
  };

  useEffect(() => {
    if (user) {
      fetchLikedResources();
      fetchUserComments();
      fetchUserPets();
      fetchMatingRequests();
    }
  }, [user]);

  const pendingRequestsCount = matingRequests.filter(
    (req) => req.direction === "incoming" && req.status === "pending"
  ).length;

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: { xs: 2, sm: 3 }, pb: 8 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ ml: 2, fontWeight: "bold" }}>
              My Profile
            </Typography>
          </Box>
          <Badge badgeContent={pendingRequestsCount} color="error">
            <Chip
              icon={<NotificationsIcon />}
              label={`Pending Requests`}
              color={pendingRequestsCount > 0 ? "primary" : "default"}
              onClick={() => setProfileTabValue(2)}
              sx={{ display: { xs: "none", sm: "flex" } }}
            />
          </Badge>
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: "linear-gradient(145deg, #f9f5ff 0%, #e6f7ff 100%)",
          }}
        >
          <UserInfo user={user} />
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={profileTabValue}
            onChange={handleProfileTabChange}
            aria-label="profile tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<PetsIcon />} label="My Pets" id="profile-tab-0" />
            <Tab icon={<FavoriteIcon />} label="Resources" id="profile-tab-1" />
            <Tab
              icon={
                <Badge badgeContent={pendingRequestsCount} color="error">
                  <NotificationsIcon />
                </Badge>
              }
              label="Mating Requests"
              id="profile-tab-2"
            />
            <Tab
              icon={<MessageIcon />}
              label="Adoption Messages"
              id="profile-tab-3"
            />
          </Tabs>
        </Box>

        <TabPanel value={profileTabValue} index={3}>
          {" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography variant="h5" fontWeight="medium">
              Messages
            </Typography>
          </Box>
          <ConversationsList
            onOpenConversation={handleOpenConversationFromList}
          />
        </TabPanel>

        <TabPanel value={profileTabValue} index={0}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography variant="h5" fontWeight="medium">
              My Pets
            </Typography>
            <Fab
              color="primary"
              size="medium"
              onClick={handleAddPet}
              aria-label="add pet"
              sx={{ boxShadow: 3 }}
            >
              <AddIcon />
            </Fab>
          </Box>

          {pets.length > 0 ? (
            <Grid container spacing={3}>
              {pets.map((pet) => (
                <Grid item xs={12} sm={6} md={4} key={pet.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 2,
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <PetCard
                      pet={pet}
                      onEdit={handleEditPet}
                      onDelete={handleDeletePet}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              elevation={1}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
              }}
            >
              <PetsIcon sx={{ fontSize: 48, color: "#aaa", mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                You haven't added any pets yet
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mb: 3, textAlign: "center" }}
              >
                Add your pets to discover resources, find mating partners, and
                track their health.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddPet}
                size="large"
              >
                Add Your First Pet
              </Button>
            </Paper>
          )}
        </TabPanel>

        <TabPanel value={profileTabValue} index={1}>
          <ResourcesList resources={likedResources} />
        </TabPanel>

        <TabPanel value={profileTabValue} index={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography variant="h5" fontWeight="medium">
              Mating Requests
            </Typography>
          </Box>

          {matingRequests.length > 0 ? (
            <Grid container spacing={3}>
              {matingRequests.map((request) => (
                <Grid item xs={12} sm={6} key={request.id}>
                  <Card
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 2,
                      border:
                        request.status === "pending" &&
                        request.direction === "incoming"
                          ? "2px solid #f50057"
                          : "none",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 1,
                        display: "flex",
                        alignItems: "center",
                        backgroundColor:
                          request.status === "accepted"
                            ? "success.main"
                            : request.status === "declined"
                            ? "error.main"
                            : request.direction === "incoming"
                            ? "warning.main"
                            : "info.main",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 5,
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      {request.status === "accepted" ? (
                        <>
                          <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                          Accepted
                        </>
                      ) : request.status === "declined" ? (
                        <>
                          <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
                          Declined
                        </>
                      ) : request.direction === "incoming" ? (
                        <>
                          <NotificationsIcon
                            fontSize="small"
                            sx={{ mr: 0.5 }}
                          />
                          Pending
                        </>
                      ) : (
                        <>
                          <ArrowforwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                          Sent
                        </>
                      )}
                    </Box>

                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        zIndex: 1,
                        backgroundColor:
                          request.direction === "incoming"
                            ? "#304ffe"
                            : "#00bfa5",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 5,
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {request.direction === "incoming" ? "Received" : "Sent"}
                    </Box>

                    <Box sx={{ display: "flex", p: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 2,
                          width: "40%",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: 120,
                          }}
                        >
                          <Avatar
                            src={
                              request.direction === "incoming"
                                ? request.senderPetImage
                                : request.senderPetImage
                            }
                            alt={
                              request.direction === "incoming"
                                ? request.senderPetName
                                : request.senderPetName
                            }
                            sx={{
                              width: 80,
                              height: 80,
                              position: "absolute",
                              top: 10,
                              left: 10,
                              border: "3px solid #fff",
                              boxShadow: 2,
                            }}
                          />

                          <Avatar
                            src={
                              request.direction === "incoming"
                                ? request.receiverPetImage
                                : request.receiverPetImage
                            }
                            alt={
                              request.direction === "incoming"
                                ? request.receiverPetName
                                : request.receiverPetName
                            }
                            sx={{
                              width: 80,
                              height: 80,
                              position: "absolute",
                              top: 40,
                              right: 10,
                              border: "3px solid #fff",
                              boxShadow: 2,
                            }}
                          />

                          <FavoriteIcon
                            sx={{
                              position: "absolute",
                              top: 40,
                              left: "calc(50% - 12px)",
                              color: "#f50057",
                              fontSize: 24,
                              zIndex: 1,
                              backgroundColor: "white",
                              borderRadius: "50%",
                              padding: "2px",
                            }}
                          />
                        </Box>
                      </Box>

                      <CardContent sx={{ width: "60%", mt: 3 }}>
                        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                          {request.direction === "incoming"
                            ? `${request.senderPetName} ➔ ${request.receiverPetName}`
                            : `${request.senderPetName} ➔ ${request.receiverPetName}`}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          <strong>From:</strong>{" "}
                          {request.direction === "incoming"
                            ? request.senderName
                            : user.displayName}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          <strong>To:</strong>{" "}
                          {request.direction === "incoming"
                            ? user.displayName
                            : request.receiverName}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          <strong>Date:</strong>{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          <strong>Message:</strong>{" "}
                          {request.message || "No message"}
                        </Typography>
                      </CardContent>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 2,
                        borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <Box>
                        {request.direction === "incoming" &&
                          request.status === "pending" && (
                            <>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                startIcon={<CheckCircleIcon />}
                                onClick={handleAcceptRequest}
                                sx={{ mr: 1 }}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<CancelIcon />}
                                onClick={handleDeclineRequest}
                              >
                                Decline
                              </Button>
                            </>
                          )}
                      </Box>
                      <Box>
                        {request.status === "accepted" && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<ChatIcon />}
                            onClick={() => handleOpenMessageDialog(request)}
                          >
                            Message
                          </Button>
                        )}

                        {request.status === "accepted" && (
                          <IconButton
                            size="small"
                            onClick={(e) => handleRequestMenuOpen(e, request)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        )}
                      </Box>
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
              }}
            >
              <FavoriteIcon sx={{ fontSize: 48, color: "#aaa", mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                No mating requests yet
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mb: 3, textAlign: "center" }}
              >
                Visit "Find Nearby Mates" to browse available pets and send
                mating requests.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FavoriteIcon />}
                onClick={() => navigate("/nearby-mates")}
                size="large"
              >
                Find Mating Partners
              </Button>
            </Paper>
          )}
        </TabPanel>

        <TabPanel value={profileTabValue} index={3}>
          <CommentsList comments={comments} navigate={navigate} />
        </TabPanel>

        <PetDialog
          open={openPetDialog}
          onClose={() => setOpenPetDialog(false)}
          currentPet={currentPet}
          setCurrentPet={setCurrentPet}
          isEditMode={isEditMode}
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          onSave={handleSavePet}
          onAddVaccination={handleAddVaccination}
          onEditVaccination={handleEditVaccination}
          onDeleteVaccination={handleDeleteVaccination}
          vaccinations={currentPet.vaccinations}
          petType={currentPet.type}
        />

        <VaccinationDialog
          open={openVaccinationDialog}
          onClose={() => setOpenVaccinationDialog(false)}
          currentVaccination={currentVaccination}
          setCurrentVaccination={setCurrentVaccination}
          vaccinationEditIndex={vaccinationEditIndex}
          onSave={handleSaveVaccination}
          petType={currentPet.type}
        />

        <MessageDialog
          open={openMessageDialog}
          onClose={() => setOpenMessageDialog(false)}
          conversationId={currentMessage.conversationId}
          recipientId={currentMessage.recipientId}
          recipientName={currentMessage.recipientName}
          senderPet={currentMessage.senderPet}
          matingRequestId={currentMessage.matingRequestId}
          tabValue={tabValue}
        />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleRequestMenuClose}
        >
          {selectedRequest?.direction === "incoming" &&
            selectedRequest?.status === "pending" && (
              <>
                <MenuItem onClick={handleAcceptRequest}>
                  <ListItemIcon>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Accept Request</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeclineRequest}>
                  <ListItemIcon>
                    <CancelIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Decline Request</ListItemText>
                </MenuItem>
              </>
            )}

          {selectedRequest?.status === "accepted" && (
            <MenuItem onClick={() => handleOpenMessageDialog(selectedRequest)}>
              <ListItemIcon>
                <ChatIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Send Message</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Container>
  );
};

export default Profile;
