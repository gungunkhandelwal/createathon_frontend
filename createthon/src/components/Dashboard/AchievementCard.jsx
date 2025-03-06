import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

const AchievementCard = ({ achievements = [] }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Achievements</Typography>
        
        {achievements.length > 0 ? (
          <List>
            {achievements.slice(0, 5).map((achievement) => (
              <ListItem key={achievement.id}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <TrophyIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary={achievement.name} 
                  secondary={achievement.description} 
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
            Complete challenges to earn achievements!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
