// components/ResourcesList.jsx
import React from 'react';
import {
  Box,
  Typography,
  Grid
} from "@mui/material";
import ResourceCard from "../../Resources/ResourceCard/ResourceCard";

const ResourcesList = ({ resources = [] }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Liked Resources
      </Typography>

      {resources.length > 0 ? (
        <Grid container spacing={2}>
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <ResourceCard resource={resource} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: '#f5f5f5',
            textAlign: 'center'
          }}
        >
          <Typography variant="body1" color="text.secondary">
            You have not liked any resources yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Explore resources in our collection and save your favorites here.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResourcesList;