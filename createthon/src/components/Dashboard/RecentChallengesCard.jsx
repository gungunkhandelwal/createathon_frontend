import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const RecentChallengesCard = ({ challenges = [] }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'started': return 'info';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Recent Challenges</Typography>
          <Button component={Link} to="/challenges" size="small">View All</Button>
        </Box>
        
        {challenges.length > 0 ? (
          <List>
            {challenges.map((challenge) => (
              <ListItem 
                key={challenge.id}
                secondaryAction={
                  <Button 
                    component={Link} 
                    to={`/challenges/${challenge.id}`}
                    size="small"
                    variant="outlined"
                  >
                    Continue
                  </Button>
                }
                sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  borderRadius: 1, 
                  mb: 1 
                }}
              >
                <ListItemText 
                  primary={challenge.title}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        {challenge.category_name} • 
                      </Typography>
                      <Chip 
                        label={challenge.status} 
                        color={getStatusColor(challenge.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            No recent challenges. Start one now!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentChallengesCard;