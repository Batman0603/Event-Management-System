import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Rating, Alert } from '@mui/material';
import { getFeedbacksByUser } from '../../services/feedbackService';

const MyFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await getFeedbacksByUser();

        // handle unexpected shapes safely
        let feedbackArray = [];
        if (Array.isArray(data)) {
          feedbackArray = data;
        } else if (data && Array.isArray(data.feedbacks)) {
          feedbackArray = data.feedbacks;
        } else if (data) {
          feedbackArray = [data]; // if a single feedback object is returned
        }

        setFeedbacks(feedbackArray);
      } catch (err) {
        console.error('Error loading feedbacks:', err);
        setError(err.message || 'Failed to load feedbacks');
      }
    };

    loadFeedbacks();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Feedbacks
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {feedbacks.length === 0 && !error ? (
          <Typography>You haven't provided any feedback yet.</Typography>
        ) : (
          feedbacks.map((feedback, index) => (
            <Card key={feedback.id || index} elevation={3} sx={{ borderRadius: '12px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {feedback.event_title || 'Untitled Event'}
                </Typography>
                <Rating
                  value={Number(feedback.rating) || 0}
                  readOnly
                  sx={{ mb: 1 }}
                />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    backgroundColor: 'grey.50',
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  {feedback.message || 'No comment provided.'}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  Submitted on{' '}
                  {feedback.created_at
                    ? new Date(feedback.created_at).toLocaleDateString()
                    : 'Unknown date'}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default MyFeedbacks;
