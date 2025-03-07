// import React, { useState, useEffect } from 'react';
// import { Box, Grid, Typography, Paper, CircularProgress, Card, CardContent, Button } from '@mui/material';
// import { Link } from 'react-router-dom';
// import ProgressCard from './ProgressCard';
// import AchievementCard from './AchievementCard';
// import RecentChallengesCard from './RecentChallengesCard';
// import { apiClient,getCookie } from '../../api/apiClient';

// const Dashboard = () => {
//   const [summary, setSummary] = useState(null);
//   const [achievements, setAchievements] = useState([]);
//   const [recentChallenges, setRecentChallenges] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [progressData, achievementsData, challengesData] = await Promise.all([
//           fetchUserProgress(),
//           fetchAchievements(),
//           fetchRecentChallenges()
//         ]);
        
//         setSummary(progressData);
//         setAchievements(achievementsData);
//         setRecentChallenges(challengesData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error loading dashboard data:', error);
//         setLoading(false);
//       }
//     };
//     console.log("Access token after login:", getCookie("access_token"));
//     console.log("Refresh token after login:", getCookie("refresh_token"));

//     loadData();
//   }, []);

//   // Function to fetch user progress summary
//   const fetchUserProgress = async () => {
//     try {
//       const response = await apiClient.get('challenges/progress/user_challenge_summary/');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching user progress:', error);
//       return {
//         total_challenges: 0,
//         completed_challenges: 0,
//         completion_percentage: 0
//       };
//     }
//   };

//   // Function to fetch user achievements
//   const fetchAchievements = async () => {
//     try {
//       const response = await apiClient.get('progress/achievements/user_achievements/');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching achievements:', error);
//       return [];
//     }
//   };

//   // Function to fetch recent challenges
//   const fetchRecentChallenges = async () => {
//     try {
//       // Get challenges with user progress information
//       const response = await apiClient.get('challenges/challenges/');
      
//       // Get user progress to determine status for each challenge
//       const progressResponse = await apiClient.get('challenges/progress/');
//       const userProgress = progressResponse.data;
      
//       // Map progress to challenges
//       const challenges = response.data.slice(0, 5).map(challenge => {
//         const progress = userProgress.find(p => p.challenge.id === challenge.id);
//         return {
//           id: challenge.id,
//           title: challenge.title,
//           category_name: challenge.category_name || 'General',
//           status: progress ? progress.status : 'not_started',
//           difficulty: challenge.difficulty
//         };
//       });
      
//       return challenges;
//     } catch (error) {
//       console.error('Error fetching recent challenges:', error);
//       return [];
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Typography variant="h4">Dashboard</Typography>
//         <Button 
//           component={Link} 
//           to="/challenges" 
//           variant="contained" 
//           color="primary"
//         >
//           Explore Challenges
//         </Button>
//       </Box>
      
//       <Grid container spacing={3}>
//         {/* Progress summary */}
//         <Grid item xs={12} md={8}>
//           <ProgressCard summary={summary} />
//         </Grid>
        
//         {/* Achievements */}
//         <Grid item xs={12} md={4}>
//           <AchievementCard achievements={achievements} />
//         </Grid>
        
//         {/* Recent activities */}
//         <Grid item xs={12}>
//           <RecentChallengesCard challenges={recentChallenges} />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, CircularProgress, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ProgressCard from './ProgressCard';
import AchievementCard from './AchievementCard';
import RecentChallengesCard from './RecentChallengesCard';
import { apiClient, getCookie } from '../../api/apiClient';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [recentChallenges, setRecentChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [progressData, achievementsData, challengesData] = await Promise.all([
          fetchUserProgress(),
          fetchAchievements(),
          fetchRecentChallenges()
        ]);
        
        setSummary(progressData);
        setAchievements(achievementsData);
        setRecentChallenges(challengesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };
    console.log("Access token after login:", getCookie("access_token"));
    console.log("Refresh token after login:", getCookie("refresh_token"));

    loadData();
  }, []);

  // Function to fetch user progress summary
  const fetchUserProgress = async () => {
    try {
      // Using the correct endpoint from your backend
      const response = await apiClient.get('progress/user-progress/user_challenge_summary/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return {
        total_challenges: 0,
        completed_challenges: 0,
        in_progress_challenges: 0,
        completion_percentage: 0,
        total_points_earned: 0,
        difficulty_completion: {},
        category_completion: {}
      };
    }
  };

  // Function to fetch user achievements
  const fetchAchievements = async () => {
    try {
      // Using the correct endpoint from your backend
      const response = await apiClient.get('progress/achievements/user_achievements/');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  };

  // Function to fetch recent challenges
  const fetchRecentChallenges = async () => {
    try {
      // First get all challenges
      const response = await apiClient.get('challenges/challenges/');
      
      // Get user progress to determine status for each challenge
      const progressResponse = await apiClient.get('progress/user-progress/');
      const userProgress = progressResponse.data;
      
      // Map progress to challenges and get the 5 most recent
      const challenges = response.data.slice(0, 5).map(challenge => {
        const progress = userProgress.find(p => p.challenge.id === challenge.id);
        return {
          id: challenge.id,
          title: challenge.title,
          category: challenge.category,
          status: progress ? progress.status : 'not_started',
          difficulty: challenge.difficulty
        };
      });
      
      return challenges;
    } catch (error) {
      console.error('Error fetching recent challenges:', error);
      return [];
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Dashboard</Typography>
        <Button 
          component={Link} 
          to="/challenges" 
          variant="contained" 
          color="primary"
        >
          Explore Challenges
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Progress summary */}
        <Grid item xs={12} md={8}>
          <ProgressCard summary={summary} />
        </Grid>
        
        {/* Achievements */}
        <Grid item xs={12} md={4}>
          <AchievementCard achievements={achievements} />
        </Grid>
        
        {/* Recent challenges */}
        <Grid item xs={12}>
          <RecentChallengesCard challenges={recentChallenges} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;