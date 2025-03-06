import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, 
  CardActions, Button, Chip, FormControl, 
  InputLabel, Select, MenuItem, TextField,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/apiClient';

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    search: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [challengesData, categoriesData] = await Promise.all([
          fetchChallenges(filters.difficulty, filters.category, filters.search),
          fetchCategories()
        ]);
        
        setChallenges(challengesData || []); // Ensure challenges is an array
        setCategories(categoriesData || []); // Ensure categories is an array
        setLoading(false);
      } catch (error) {
        console.error('Error loading challenges:', error);
        setLoading(false);
      }
    };

    const fetchChallenges = async (difficulty = '', category = '', search = '') => {
      try {
        const response = await apiClient.get('challenges/challenge/', {
          params: {
            difficulty: difficulty,
            category: category,
            search: search
          }
        });
        return response.data || []; // Ensure response.data is an array
      } catch (error) {
        console.error("Error fetching challenges:", error);
        return []; // Return an empty array on error
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('challenges/categories/');
        return response.data || []; // Ensure response.data is an array
      } catch (error) {
        console.error("Error fetching categories:", error);
        return []; // Return an empty array on error
      }
    };

    loadData();
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const filteredChallenges = challenges?.filter(challenge => {
    return (
      (filters.difficulty === '' || challenge.difficulty === filters.difficulty) &&
      (filters.category === '' || challenge.category === filters.category) &&
      (filters.search === '' || 
        challenge.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        challenge.description?.toLowerCase().includes(filters.search.toLowerCase()))
    );
  }) || [];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
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
      <Typography variant="h4" sx={{ mb: 3 }}>Challenges</Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            name="difficulty"
            value={filters.difficulty}
            label="Difficulty"
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="easy">Beginner</MenuItem>
            <MenuItem value="medium">Intermediate</MenuItem>
            <MenuItem value="hard">Advanced</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={filters.category}
            label="Category"
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          label="Search"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          sx={{ flexGrow: 1 }}
        />
      </Box>
      
      {/* Challenge Grid */}
      <Grid container spacing={3}>
        {filteredChallenges.map(challenge => (
          <Grid item xs={12} sm={6} md={4} key={challenge.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {challenge.title}
                </Typography>
                <Chip 
                  label={challenge.difficulty} 
                  color={getDifficultyColor(challenge.difficulty)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {challenge.category_name}
                </Typography>
                <Typography variant="body2">
                  {challenge.description.substring(0, 100)}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  component={Link} 
                  to={`/challenges/${challenge.id}`}
                  variant="contained"
                >
                  Start Challenge
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {filteredChallenges.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1">No challenges found matching your criteria.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChallengeList;
