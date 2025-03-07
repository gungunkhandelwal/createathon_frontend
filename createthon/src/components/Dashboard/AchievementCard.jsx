// import React from 'react';
// import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar } from '@mui/material';
// import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

// const AchievementCard = ({ achievements = [] }) => {
//   return (
//     <Card sx={{ height: '100%' }}>
//       <CardContent>
//         <Typography variant="h6" gutterBottom>Achievements</Typography>
        
//         {achievements.length > 0 ? (
//           <List>
//             {achievements.slice(0, 5).map((achievement) => (
//               <ListItem key={achievement.id}>
//                 <ListItemIcon>
//                   <Avatar sx={{ bgcolor: 'primary.main' }}>
//                     <TrophyIcon />
//                   </Avatar>
//                 </ListItemIcon>
//                 <ListItemText 
//                   primary={achievement.name} 
//                   secondary={achievement.description} 
//                 />
//               </ListItem>
//             ))}
//           </List>
//         ) : (
//           <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
//             Complete challenges to earn achievements!
//           </Typography>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default AchievementCard;


import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar, Box, Button } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const AchievementCard = ({ achievements = [] }) => {
  // Process the achievement data from the API
  // The user_achievements endpoint returns UserAchievement objects
  // which have an achievement field containing the actual achievement data
  const processedAchievements = achievements.map(userAchievement => {
    return {
      id: userAchievement.id,
      name: userAchievement.achievement.name,
      description: userAchievement.achievement.description,
      icon: userAchievement.achievement.icon,
      date_earned: userAchievement.date_earned
    };
  });

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Achievements</Typography>
          <Button component={Link} to="/achievements" size="small">View All</Button>
        </Box>
        
        {processedAchievements.length > 0 ? (
          <List>
            {processedAchievements.slice(0, 5).map((achievement) => (
              <ListItem key={achievement.id}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {achievement.icon ? (
                      <img src={achievement.icon} alt={achievement.name} style={{ width: 24, height: 24 }} />
                    ) : (
                      <TrophyIcon />
                    )}
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