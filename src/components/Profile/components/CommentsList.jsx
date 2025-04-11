// components/CommentsList.jsx
import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions,
  Avatar,
  Button,
  List,
  Divider
} from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const CommentsList = ({ comments = [], navigate }) => {
  // Format date for display
  const formatDate = (dateValue) => {
    if (!dateValue) return "Unknown date";
    
    let date;
    if (dateValue.toDate) {
      // Firestore timestamp
      date = dateValue.toDate();
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      // Try to parse as date string
      date = new Date(dateValue);
    }
    
    return date.toLocaleString();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Comments
      </Typography>
      
      {comments.length > 0 ? (
        <List>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 2 }}>
              <Card variant="outlined" sx={{ 
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 2
                }
              }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "#8e24aa" }}>
                      {comment.resourceName.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={comment.resourceName}
                  subheader={formatDate(comment.createdAt)}
                />
                <Divider sx={{ mx: 2 }} />
                <CardContent>
                  <Typography variant="body1">{comment.text}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() =>
                      navigate(`/resource-details/${comment.resourceId}`, {
                        state: { resourceId: comment.resourceId },
                      })
                    }
                  >
                    View Resource
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </List>
      ) : (
        <Box 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            backgroundColor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            You have not commented on any resources yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Share your thoughts and join the conversation.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CommentsList;