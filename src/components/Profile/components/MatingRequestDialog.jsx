// components/Profile/components/MatingRequestDialog.jsx
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Avatar,
  Grid
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const MatingRequestDialog = ({
  open,
  onClose,
  onSend,
  senderPet,
  receiverPet,
  receiverOwner
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    onSend({
      senderPetId: senderPet.id,
      receiverPetId: receiverPet.id,
      receiverId: receiverOwner.id,
      message: message,
      createdAt: Date.now(),
      status: 'pending'
    });
    setMessage('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Send Mating Request
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Request Details
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            alignItems: 'center',
            my: 2
          }}>
            {/* Sender pet */}
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                src={senderPet?.image}
                alt={senderPet?.name}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 1, border: '3px solid #fff', boxShadow: 2 }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {senderPet?.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your pet ({senderPet?.gender})
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {senderPet?.breed}
              </Typography>
            </Box>
            
            {/* Heart icon */}
            <FavoriteIcon 
              color="error" 
              sx={{ 
                fontSize: 40,
                mx: 2,
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(0.95)',
                    opacity: 0.7
                  },
                  '70%': {
                    transform: 'scale(1.1)',
                    opacity: 1
                  },
                  '100%': {
                    transform: 'scale(0.95)',
                    opacity: 0.7
                  }
                }
              }} 
            />
            
            {/* Receiver pet */}
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                src={receiverPet?.image}
                alt={receiverPet?.name}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 1, border: '3px solid #fff', boxShadow: 2 }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {receiverPet?.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {receiverOwner?.displayName}'s pet ({receiverPet?.gender})
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {receiverPet?.breed}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Include a message to the owner
            </Typography>
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce your pet and explain why you think they would be a good match..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSend} 
          variant="contained" 
          color="primary"
          disabled={!message.trim()}
        >
          Send Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatingRequestDialog;