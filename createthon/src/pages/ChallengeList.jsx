// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Box, Typography, Grid, Card, CardContent, CardActionArea,
//   Chip, CircularProgress, FormControl, InputLabel, Select,
//   MenuItem, TextField, InputAdornment, IconButton, Pagination,
//   Button, Table, TableBody, TableCell, TableContainer, TableHead,
//   TableRow, Paper
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import { apiClient } from '../api/apiClient';

// const ChallengeList = () => {
//   const navigate = useNavigate();
//   const [challenges, setChallenges] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     difficulty: '',
//     category: '',
//     tags: [],
//     search: ''
//   });
//   const [userProgress, setUserProgress] = useState({});
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const ITEMS_PER_PAGE = 12;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch all needed data in parallel
//         const [challengesResponse, categoriesResponse, tagsResponse, progressResponse] = await Promise.all([
//           apiClient.get('challenges/challenges/', { params: buildQueryParams() }),
//           apiClient.get('challenges/categories/with_challenge_count/'),
//           apiClient.get('challenges/tags/'),
//           apiClient.get('progress/user-progress/user_challenge_summary/')
//         ]);

//         // Process challenge data and pagination
//         const allChallenges = challengesResponse.data;
//         setTotalPages(Math.ceil(allChallenges.length / ITEMS_PER_PAGE));
//         setChallenges(allChallenges);
        
//         // Process other data
//         setCategories(categoriesResponse.data);
//         setTags(tagsResponse.data);
        
//         // Process user progress to track completed/in-progress challenges
//         const progressMap = {};
//         if (progressResponse.data && progressResponse.data.progress) {
//           progressResponse.data.progress.forEach(item => {
//             progressMap[item.challenge] = item.status;
//           });
//         }
//         setUserProgress(progressMap);
        
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [filters, page]);

//   const buildQueryParams = () => {
//     const params = {};
//     if (filters.difficulty) params.difficulty = filters.difficulty;
//     if (filters.category) params.category = filters.category;
//     if (filters.tags.length > 0) params.tags = filters.tags.join(',');
//     if (filters.search) params.search = filters.search;
//     return params;
//   };

//   const handleFilterChange = (field, value) => {
//     setFilters(prev => ({ ...prev, [field]: value }));
//     setPage(1); // Reset to first page when filters change
//   };

//   const handleSearchChange = (event) => {
//     setFilters(prev => ({ ...prev, search: event.target.value }));
//     setPage(1);
//   };

//   const handlePageChange = (event, value) => {
//     setPage(value);
//   };

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty?.toLowerCase()) {
//       case 'beginner': return 'success';
//       case 'intermediate': return 'warning';
//       case 'advanced': return 'error';
//       default: return 'default';
//     }
//   };

//   const getChallengeStatusColor = (challengeId) => {
//     const status = userProgress[challengeId];
//     if (!status) return 'default';
//     switch (status) {
//       case 'completed': return 'success';
//       case 'started': return 'info';
//       case 'failed': return 'error';
//       default: return 'default';
//     }
//   };

//   const getChallengeStatusLabel = (challengeId) => {
//     const status = userProgress[challengeId];
//     if (!status) return 'New';
//     switch (status) {
//       case 'completed': return 'Completed';
//       case 'started': return 'In Progress';
//       case 'failed': return 'Try Again';
//       default: return 'New';
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // Get paginated challenges
//   const startIndex = (page - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const displayedChallenges = challenges.slice(startIndex, endIndex);
//   return (
//     <Box>
//       <Typography variant="h4" sx={{ mb: 3 }}>Coding Challenges</Typography>
      
//       {/* Filters Section */}
//       <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} sm={6} md={3}>
//             <FormControl fullWidth variant="outlined" size="small">
//               <InputLabel>Difficulty</InputLabel>
//               <Select
//                 value={filters.difficulty}
//                 onChange={(e) => handleFilterChange('difficulty', e.target.value)}
//                 label="Difficulty"
//               >
//                 <MenuItem value="">All Difficulties</MenuItem>
//                 <MenuItem value="easy">Beginner</MenuItem>
//                 <MenuItem value="medium">Intermediate</MenuItem>
//                 <MenuItem value="hard">Advanced</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
          
//           <Grid item xs={12} sm={6} md={3}>
//             <FormControl fullWidth variant="outlined" size="small">
//               <InputLabel>Category</InputLabel>
//               <Select
//                 value={filters.category}
//                 onChange={(e) => handleFilterChange('category', e.target.value)}
//                 label="Category"
//               >
//                 <MenuItem value="">All Categories</MenuItem>
//                 {categories.map(category => (
//                   <MenuItem key={category.id} value={category.id}>
//                     {category.name} ({category.challenge_count})
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
          
//           <Grid item xs={12} sm={12} md={6}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               size="small"
//               placeholder="Search challenges..."
//               value={filters.search}
//               onChange={handleSearchChange}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//         </Grid>
//       </Box>
      
//       {/* Challenge Table */}
//       {displayedChallenges.length > 0 ? (
//         <TableContainer component={Paper}>
//           <Table aria-label="challenge table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Title</TableCell>
//                 <TableCell align="center">Difficulty</TableCell>
//                 <TableCell align="center">Category</TableCell>
//                 <TableCell align="center">Status</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {displayedChallenges.map(challenge => (
//                 <TableRow
//                   key={challenge.id}
//                   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                 >
//                   <TableCell component="th" scope="row">
//                     {challenge.title}
//                   </TableCell>
//                   <TableCell align="center">
//                     <Chip 
//                       label={challenge.difficulty || "Unknown"} 
//                       color={getDifficultyColor(challenge.difficulty)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell align="center">{challenge.category?.name || "Uncategorized"}</TableCell>
//                   <TableCell align="center">
//                     <Chip
//                       label={getChallengeStatusLabel(challenge.id)}
//                       size="small"
//                       color={getChallengeStatusColor(challenge.id)}
//                       variant={getChallengeStatusColor(challenge.id) === 'default' ? 'outlined' : 'filled'}
//                     />
//                   </TableCell>
//                   <TableCell align="center">
//                     <Button
//                       variant="contained"
//                       size="small"
//                       color="primary"
//                       endIcon={<ArrowForwardIcon />}
//                       onClick={() => navigate(`/challenges/${challenge.id}`)}
//                     >
//                       View Details
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <Box sx={{ textAlign: 'center', py: 4 }}>
//           <Typography variant="h6" color="text.secondary">
//             No challenges found matching your filters.
//           </Typography>
//         </Box>
//       )}
      
//       {/* Pagination */}
//       {totalPages > 1 && (
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//           <Pagination 
//             count={totalPages} 
//             page={page} 
//             onChange={handlePageChange}
//             color="primary"
//           />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ChallengeList;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, CardActionArea,
  Chip, CircularProgress, FormControl, InputLabel, Select,
  MenuItem, TextField, InputAdornment, IconButton, Pagination,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { apiClient } from '../api/apiClient';

const ChallengeList = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    tags: [],
    search: ''
  });
  const [userProgress, setUserProgress] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all needed data in parallel
        const [challengesResponse, categoriesResponse, tagsResponse, progressResponse] = await Promise.all([
          apiClient.get('challenges/challenges/', { params: buildQueryParams() }),
          apiClient.get('challenges/categories/with_challenge_count/'),
          apiClient.get('challenges/tags/'),
          apiClient.get('progress/user-progress/user_challenge_summary/')
        ]);

        // Process challenge data and pagination
        const allChallenges = challengesResponse.data;
        setTotalPages(Math.ceil(allChallenges.length / ITEMS_PER_PAGE));
        setChallenges(allChallenges);
        
        // Process other data
        setCategories(categoriesResponse.data);
        setTags(tagsResponse.data);
        
        // Process user progress to track completed/in-progress challenges
        const progressMap = {};
        if (progressResponse.data && progressResponse.data.progress) {
          progressResponse.data.progress.forEach(item => {
            progressMap[item.challenge] = item.status;
          });
        }
        setUserProgress(progressMap);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, page]);

  const buildQueryParams = () => {
    const params = {};
    if (filters.difficulty) params.difficulty = filters.difficulty;
    if (filters.category) params.category = filters.category;
    if (filters.tags.length > 0) params.tags = filters.tags.join(',');
    if (filters.search) params.search = filters.search;
    return params;
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (event) => {
    setFilters(prev => ({ ...prev, search: event.target.value }));
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getChallengeStatusColor = (challengeId) => {
    const status = userProgress[challengeId];
    if (!status) return 'default';
    switch (status) {
      case 'completed': return 'success';
      case 'started': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getChallengeStatusLabel = (challengeId) => {
    const status = userProgress[challengeId];
    if (!status) return 'New';
    switch (status) {
      case 'completed': return 'Completed';
      case 'started': return 'In Progress';
      case 'failed': return 'Try Again';
      default: return 'New';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Get paginated challenges
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedChallenges = challenges.slice(startIndex, endIndex);
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Coding Challenges</Typography>
      
      {/* Filters Section */}
      <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                label="Difficulty"
              >
                <MenuItem value="">All Difficulties</MenuItem>
                <MenuItem value="easy">Beginner</MenuItem>
                <MenuItem value="medium">Intermediate</MenuItem>
                <MenuItem value="hard">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name} ({category.challenge_count})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search challenges..."
              value={filters.search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* Challenge Table */}
      {displayedChallenges.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="challenge table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="center">Difficulty</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedChallenges.map(challenge => (
                <TableRow
                  key={challenge.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {challenge.title}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={challenge.difficulty || "Unknown"} 
                      color={getDifficultyColor(challenge.difficulty)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">{challenge.category?.name || "Uncategorized"}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={getChallengeStatusLabel(challenge.id)}
                      size="small"
                      color={getChallengeStatusColor(challenge.id)}
                      variant={getChallengeStatusColor(challenge.id) === 'default' ? 'outlined' : 'filled'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/challenges/challenges/${challenge.id}/challenge_details/`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No challenges found matching your filters.
          </Typography>
        </Box>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default ChallengeList;

