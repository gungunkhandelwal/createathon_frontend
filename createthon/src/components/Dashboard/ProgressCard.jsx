// import React from 'react';
// import { Card, CardContent, Typography, Box, LinearProgress, Grid, Paper } from '@mui/material';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// const ProgressCard = ({ summary }) => {
//   if (!summary) return null;

//   const { total_challenges, completed_challenges, completion_percentage } = summary;
  
//   const pieData = [
//     { name: 'Completed', value: completed_challenges },
//     { name: 'Remaining', value: total_challenges - completed_challenges }
//   ];
  
//   const COLORS = ['#3f51b5', '#e0e0e0'];
  
//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h6" gutterBottom>Your Progress</Typography>
        
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={4}>
//             <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     dataKey="value"
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </Box>
//           </Grid>
          
//           <Grid item xs={12} md={8}>
//             <Box sx={{ mb: 3 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                 <Typography variant="body2">Completion Rate</Typography>
//                 <Typography variant="body2">{completion_percentage.toFixed(1)}%</Typography>
//               </Box>
//               <LinearProgress 
//                 variant="determinate" 
//                 value={completion_percentage} 
//                 sx={{ height: 10, borderRadius: 5 }}
//               />
//             </Box>
            
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Paper sx={{ p: 2, textAlign: 'center' }}>
//                   <Typography variant="h4">{completed_challenges}</Typography>
//                   <Typography variant="body2">Completed</Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={6}>
//                 <Paper sx={{ p: 2, textAlign: 'center' }}>
//                   <Typography variant="h4">{total_challenges}</Typography>
//                   <Typography variant="body2">Total Challenges</Typography>
//                 </Paper>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProgressCard;


import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Grid, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ProgressCard = ({ summary }) => {
  if (!summary) return null;

  const { 
    total_challenges, 
    completed_challenges, 
    in_progress_challenges,
    completion_percentage,
    total_points_earned,
    difficulty_completion,
    category_completion
  } = summary;
  
  // Data for pie chart
  const pieData = [
    { name: 'Completed', value: completed_challenges },
    { name: 'In Progress', value: in_progress_challenges },
    { name: 'Not Started', value: total_challenges - completed_challenges - in_progress_challenges }
  ].filter(item => item.value > 0);
  
  const COLORS = ['#4caf50', '#ff9800', '#e0e0e0'];
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Your Progress</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Challenges']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Completion Rate</Typography>
                <Typography variant="body2">{completion_percentage.toFixed(1)}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={completion_percentage} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4">{completed_challenges}</Typography>
                  <Typography variant="body2">Completed</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4">{in_progress_challenges}</Typography>
                  <Typography variant="body2">In Progress</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4">{total_points_earned}</Typography>
                  <Typography variant="body2">Points Earned</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;