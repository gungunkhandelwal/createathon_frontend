import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Paper, Button, Tabs, Tab,
  CircularProgress, Divider, Chip, Grid, List, ListItem, Avatar, ListItemText,
  TextField
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import ReactMarkdown from 'react-markdown';
import CodeEditor from '../components/challenges/CodeEditor';
import { apiClient } from '../api/apiClient';

const ChallengeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [comments, setComments] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState(null);
  
  // Add these states to your existing state declarations
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        setLoading(true); // Ensure loading is set to true at the start

        // Fetch challenge details
        const response = await apiClient.get(`challenges/challenges/${id}/challenge-details/`);
        console.log(`Response from API challenges/challenges/${id}/challenge-details/:`, response);

        setChallenge(response.data.challenge || {});
        setUserProgress(response.data.user_progress || null);
        setCode(response.data.user_progress?.submission_code || response.data.challenge?.code_template || '');
        setComments(response.data.challenge?.comments || []);

        // Load leaderboard data
        fetchLeaderboard();
        
        // Start timer if challenge is started but not completed
        if (response.data.user_progress?.status === 'started') {
          startTimer();
        }
      } catch (error) {
        console.error('Error loading challenge:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false in the end
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const response = await apiClient.get(`progress/leaderboard/challenge/`, {
          params: { challenge: id }
        });
        setLeaderboard(response.data || []);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    const startTimer = () => {
      const newTimer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      setTimer(newTimer);
    };
  
    loadChallenge();
  
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleStartChallenge = async () => {
    try {
      const response = await apiClient.post(`challenges/challenges/${id}/start_challenge/`);
      setUserProgress(response.data);
      startTimer();
    } catch (error) {
      console.error('Error starting challenge:', error);
    }
  };

  const handleSubmitChallenge = async () => {
    try {
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
      
      const response = await apiClient.post(`challenges/challenges/${id}/submit_challenge/`, { 
        submission_code: code,
        time_spent: timeSpent
      });
      
      setUserProgress(response.data.user_progress);
      setSubmissionResult(response.data.validation_result);
      if (response.data.validation_result?.passed) {
        // Only fetch leaderboard if submission was successful
        fetchLeaderboard();
      }
    } catch (error) {
      console.error('Error submitting challenge:', error);
    }
  };

  const handleAddComment = async (text, parentId = null) => {
    try {
      const response = await apiClient.post(`challenges/challenges/${id}/add_comment/`, {
        text,
        parent_id: parentId
      });
      if (parentId) {
        setComments(prevComments => {
          return prevComments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), response.data]
              };
            }
            return comment;
          });
        });
      } else {
        setComments(prevComments => [...prevComments, response.data]);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleNewCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await handleAddComment(newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText('');
  };

  const handleReplyTextChange = (e) => {
    setReplyText(e.target.value);
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyText.trim()) return;
    
    try {
      await handleAddComment(replyText, parentId);
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!challenge) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h6">Challenge not found</Typography>
      </Box>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4">{challenge.title || "Untitled Challenge"}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip 
              label={challenge.difficulty || "Unknown"} 
              color={getDifficultyColor(challenge.difficulty)}
              size="small"
            />
            <Chip 
              label={challenge.category?.name || "Uncategorized"} 
              variant="outlined"
              size="small"
            />
            <Chip 
              label={`${challenge.points || 0} Points`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {userProgress?.status === 'started' && (
            <Typography variant="body2">
              Time: {formatTime(timeSpent)}
            </Typography>
          )}
          <Button variant="outlined" onClick={() => navigate('/challenges')}>
            Back to Challenges
          </Button>
        </Box>
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
              <ReactMarkdown>{challenge.markdown_content || challenge.description || "No description available."}</ReactMarkdown>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Your Solution</Typography>
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                language="javascript" // You might want to make this dynamic based on challenge
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
                <Box sx={{ mt: 2, p: 2, bgcolor: submissionResult.passed ? 'success.light' : 'error.light', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Submission Result:
                  </Typography>
                  <Typography color={submissionResult.passed ? 'success.dark' : 'error.dark'}>
                    {submissionResult.passed ? 'All tests passed!' : 'Some tests failed.'}
                  </Typography>
                  {submissionResult.details && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                      <ReactMarkdown>{submissionResult.details}</ReactMarkdown>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Leaderboard</Typography>
          {leaderboard.length > 0 ? (
            <List>
              {leaderboard.map((entry, index) => (
                <ListItem key={entry.user_id} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body1" sx={{ minWidth: 30 }}>#{index + 1}</Typography>
                  <Avatar sx={{ mr: 2 }}>{entry.username?.charAt(0) || 'U'}</Avatar>
                  <ListItemText 
                    primary={entry.username || 'Anonymous'}
                    secondary={`Completed in ${entry.time_spent || 0} seconds`}
                  />
                  <Typography variant="body1" color="primary.main">{entry.score || 0} pts</Typography>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No entries in the leaderboard yet. Be the first to complete this challenge!
            </Typography>
          )}
        </Paper>
      )}

      {/* Discussion Tab */}
      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Discussion</Typography>
          
          {/* Comment form */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add your comment..."
              value={newComment}
              onChange={handleNewCommentChange}
              multiline
              rows={3}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </Box>
          </Box>
          
          {comments.length > 0 ? (
            <List>
              {comments.map(comment => (
                <Box key={comment.id} sx={{ mb: 2 }}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ mr: 2 }}>{comment.user?.username?.charAt(0) || 'U'}</Avatar>
                      <Box>
                        <Typography variant="subtitle2">{comment.user?.username || 'Anonymous'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2">{comment.text}</Typography>
                    
                    {/* Show replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <List sx={{ pl: 4 }}>
                        {comment.replies.map(reply => (
                          <Paper key={reply.id} sx={{ p: 2, mb: 1, bgcolor: 'background.default' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Avatar sx={{ mr: 2, width: 24, height: 24 }}>{reply.user?.username?.charAt(0) || 'U'}</Avatar>
                              <Box>
                                <Typography variant="subtitle2">{reply.user?.username || 'Anonymous'}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(reply.created_at).toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2">{reply.text}</Typography>
                          </Paper>
                        ))}
                      </List>
                    )}
                    
                    {/* Reply button */}
                    <Button 
                      size="small" 
                      sx={{ mt: 1 }}
                      startIcon={<ReplyIcon />}
                      onClick={() => setReplyingTo(comment.id)}
                    >
                      Reply
                    </Button>
                    
                    {/* Reply form */}
                    {replyingTo === comment.id && (
                      <Box sx={{ mt: 2, ml: 4 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Add your reply..."
                          value={replyText}
                          onChange={handleReplyTextChange}
                          multiline
                          rows={2}
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={!replyText.trim()}
                          >
                            Submit Reply
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Box>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No comments yet. Be the first to start the discussion!
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ChallengeDetails;
