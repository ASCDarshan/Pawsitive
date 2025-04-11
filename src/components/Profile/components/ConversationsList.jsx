// components/Profile/components/ConversationsList.jsx
import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Divider, 
  Box, 
  Paper, 
  IconButton,
  Badge,
  Chip
} from '@mui/material';
import { ref, onValue, off, get } from 'firebase/database';
import { database, auth } from '../../../firebase';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PetsIcon from '@mui/icons-material/Pets';

const ConversationsList = ({ onOpenConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    
    const conversationsRef = ref(database, 'conversations');
    
    const handleConversationsSnapshot = async (snapshot) => {
      if (snapshot.exists()) {
        const conversationsData = snapshot.val();
        const relevantConversations = [];
        
        for (const conversationId in conversationsData) {
          const conversation = conversationsData[conversationId];
          
          // Check if user is a participant
          if (conversation.participants && conversation.participants[user.uid]) {
            // Get the other participant's ID
            const otherParticipantId = Object.keys(conversation.participants)
              .find(id => id !== user.uid);
            
            if (!otherParticipantId) continue;
            
            // Get other participant details
            let otherParticipantName = "Unknown User";
            let senderPet = null;
            let receiverPet = null;
            
            try {
              // Get user info
              const userRef = ref(database, `users/${otherParticipantId}`);
              const userSnapshot = await get(userRef);
              
              if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                otherParticipantName = userData.displayName || "Unknown User";
              }
              
              // Get mating request info if available
              if (conversation.matingRequestId) {
                // Try to find in sent requests
                const sentRef = ref(database, `matingRequests/sent/${user.uid}/${conversation.matingRequestId}`);
                const sentSnapshot = await get(sentRef);
                
                if (sentSnapshot.exists()) {
                  const request = sentSnapshot.val();
                  
                  // Get pet info
                  const userPetRef = ref(database, `userPets/${user.uid}/${request.senderPetId}`);
                  const otherPetRef = ref(database, `userPets/${otherParticipantId}/${request.receiverPetId}`);
                  
                  const [userPetSnapshot, otherPetSnapshot] = await Promise.all([
                    get(userPetRef),
                    get(otherPetRef)
                  ]);
                  
                  senderPet = userPetSnapshot.exists() ? 
                    { id: request.senderPetId, ...userPetSnapshot.val() } : 
                    { name: request.senderPetName };
                  
                  receiverPet = otherPetSnapshot.exists() ? 
                    { id: request.receiverPetId, ...otherPetSnapshot.val() } : 
                    { name: request.receiverPetName, image: request.receiverPetImage };
                
                } else {
                  // Try received requests
                  const receivedRef = ref(database, `matingRequests/received/${user.uid}/${conversation.matingRequestId}`);
                  const receivedSnapshot = await get(receivedRef);
                  
                  if (receivedSnapshot.exists()) {
                    const request = receivedSnapshot.val();
                    
                    // Get pet info
                    const userPetRef = ref(database, `userPets/${user.uid}/${request.receiverPetId}`);
                    const otherPetRef = ref(database, `userPets/${otherParticipantId}/${request.senderPetId}`);
                    
                    const [userPetSnapshot, otherPetSnapshot] = await Promise.all([
                      get(userPetRef),
                      get(otherPetRef)
                    ]);
                    
                    receiverPet = userPetSnapshot.exists() ? 
                      { id: request.receiverPetId, ...userPetSnapshot.val() } : 
                      { name: request.receiverPetName };
                    
                    senderPet = otherPetSnapshot.exists() ? 
                      { id: request.senderPetId, ...otherPetSnapshot.val() } : 
                      { name: request.senderPetName, image: request.senderPetImage };
                  }
                }
              }
            } catch (error) {
              console.error("Error getting conversation details:", error);
            }
            
            relevantConversations.push({
              id: conversationId,
              otherParticipantId,
              otherParticipantName,
              senderPet,
              receiverPet,
              lastMessage: conversation.lastMessageText || "No messages yet",
              lastMessageTime: conversation.lastMessageTimestamp || 0,
              matingRequestId: conversation.matingRequestId
            });
          }
        }
        
        // Sort by last message time (most recent first)
        relevantConversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        
        setConversations(relevantConversations);
      }
      
      setLoading(false);
    };
    
    onValue(conversationsRef, handleConversationsSnapshot);
    
    return () => {
      off(conversationsRef, 'value', handleConversationsSnapshot);
    };
  }, [user]);

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now - date) / 1000; // difference in seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return date.toLocaleDateString([], { weekday: 'short' });
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading conversations...</Typography>
      </Box>
    );
  }

  if (conversations.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
        <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>No Conversations Yet</Typography>
        <Typography variant="body2" color="textSecondary">
          When you start messaging with pet owners, your conversations will appear here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <List sx={{ p: 0 }}>
        {conversations.map((conversation, index) => (
          <React.Fragment key={conversation.id}>
            {index > 0 && <Divider component="li" />}
            <ListItem 
              alignItems="flex-start" 
              button
              onClick={() => onOpenConversation(conversation)}
              sx={{ 
                p: 2,
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Avatar 
                      alt={conversation.receiverPet?.name} 
                      src={conversation.receiverPet?.image}
                      sx={{ width: 22, height: 22, border: '2px solid white' }}
                    >
                      <PetsIcon fontSize="small" />
                    </Avatar>
                  }
                >
                  <Avatar 
                    alt={conversation.senderPet?.name} 
                    src={conversation.senderPet?.image}
                    sx={{ width: 40, height: 40 }}
                  >
                    <PetsIcon />
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" component="div">
                      {conversation.otherParticipantName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatLastMessageTime(conversation.lastMessageTime)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {conversation.lastMessage}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {conversation.matingRequestId && (
                        <Chip
                          icon={<FavoriteIcon fontSize="small" />}
                          label="Mating Request"
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ height: 24, mr: 1 }}
                        />
                      )}
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {conversation.senderPet?.name} 
                        <ArrowForwardIcon fontSize="inherit" sx={{ mx: 0.5, fontSize: '0.7rem' }} />
                        {conversation.receiverPet?.name}
                      </Typography>
                    </Box>
                  </React.Fragment>
                }
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ConversationsList;