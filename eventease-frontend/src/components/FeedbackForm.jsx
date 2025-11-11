import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Rating, 
  TextField, 
  Box, 
  Typography 
} from '@mui/material';

const FeedbackForm = ({ open, onClose, eventTitle, onSubmit, isSubmitting }) => {
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');

  const handleSubmit = () => {
    onSubmit({ rating, comment });
  };

  React.useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setRating(0);
      setComment('');
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Provide Feedback</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Event: {eventTitle}
          </Typography>
        </Box>
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="legend">Your Rating</Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
            sx={{ fontSize: '2rem' }}
          />
        </Box>
        <TextField
          autoFocus
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          label="Your Comments"
          placeholder="Share your experience and suggestions..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isSubmitting || !rating || !comment.trim()}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackForm;