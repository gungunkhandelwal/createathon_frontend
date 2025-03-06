import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Paper, Button, Tabs, Tab,
  CircularProgress, Divider, Chip, Grid
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import CodeEditor from '../components/challenges/CodeEditor';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        // Fetch challenge details
        const response = await apiClient.get(`challenges/challenge/${id}/challenge_details/`);
        setChallenge(response.data.challenge || {}); // Ensure challenge is never null
        setUserProgress(response.data.user_progress || null);
        setCode(response.data.user_progress?.submission_code || response.data.challenge?.starter_code || '');
        setLoading(false);
      } catch (error) {
        console.error('Error loading challenge:', error);
        setLoading(false);
      }
    };

    loadChallenge();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleStartChallenge = async () => {
    try {
      const response = await apiClient.post(`challenges/challenge/${id}/start_challenge/`);
      setUserProgress(response.data);
    } catch (error) {
      console.error('Error starting challenge:', error);
    }
  };

  const handleSubmitChallenge = async () => {
    try {
      setSubmitting(true);
      const response = await apiClient.post(`challenges/challenge/${id}/submit_challenge/`, { submission_code: code });
      setUserProgress(response.data.user_progress);
      setSubmissionResult(response.data.validation_result);
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting challenge:', error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Ensure challenge is defined before accessing its properties
  if (!challenge) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h6">Challenge not found</Typography>
      </Box>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) { // Use optional chaining
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4">{challenge.title || "Untitled Challenge"}</Typography> {/* Fallback title */}
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip 
              label={challenge.difficulty || "Unknown"} 
              color={getDifficultyColor(challenge.difficulty)}
              size="small"
            />
            <Chip 
              label={challenge.category_name || "Uncategorized"} 
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
        <Button variant="outlined" onClick={() => navigate('/challenges')}>
          Back to Challenges
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Challenge" />
          <Tab label="Leaderboard" />
          <Tab label="Discussion" />
        </Tabs>
      </Box>

      {/* Challenge Tab */}
      {activeTab === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Description</Typography>
              <ReactMarkdown>{challenge.description || "No description available."}</ReactMarkdown> {/* Fallback content */}
              
              {challenge.examples && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Examples</Typography>
                  <ReactMarkdown>{challenge.examples}</ReactMarkdown>
                </>
              )}
              
              {challenge.constraints && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Constraints</Typography>
                  <ReactMarkdown>{challenge.constraints}</ReactMarkdown>
                </>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Your Solution</Typography>
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                language="javascript"
                height="400px"
              />
              
              <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between' }}>
                {!userProgress?.status && (
                  <Button 
                    variant="outlined" 
                    onClick={handleStartChallenge}
                  >
                    Start Challenge
                  </Button>
                )}
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleSubmitChallenge}
                  disabled={submitting || !userProgress?.status}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Submit Solution'}
                </Button>
              </Box>
              
              {submissionResult && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Submission Result:
                  </Typography>
                  <Typography color={submissionResult.passed ? 'success.main' : 'error.main'}>
                    {submissionResult.passed ? 'All tests passed!' : 'Some tests failed.'}
                  </Typography>
                  {submissionResult.details && (
                    <ReactMarkdown>{submissionResult.details}</ReactMarkdown>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ChallengeDetail;
