// components/UserInfo.jsx
import React from 'react';
import { 
  Box, 
  Avatar, 
  Typography, 
  Card, 
  CardContent 
} from "@mui/material";

const UserInfo = ({ user }) => {
  return (
    <Card variant="outlined" sx={{ mb: 4, overflow: 'visible' }}>
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            padding: 3,
            position: 'relative',
            borderRadius: 1,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
          }}
        >
          <Avatar
            alt={user?.displayName || user?.email}
            src={user?.photoURL}
            sx={{ 
              width: 100, 
              height: 100, 
              mr: { sm: 4 }, 
              mb: { xs: 2, sm: 0 },
              border: '4px solid #fff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          />
          <Box>
            <Typography variant="h5" fontWeight="500" gutterBottom>
              {user?.displayName || "Pet Owner"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email}
            </Typography>
            {user?.phoneNumber && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Phone: {user.phoneNumber}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserInfo;