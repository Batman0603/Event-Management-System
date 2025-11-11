import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { getSystemLogs } from '../../services/logService';

const SystemLogsView = () => {
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const logData = await getSystemLogs();
        setLogs(logData);
      } catch (err) {
        setError(err.message || 'Failed to fetch system logs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        System Logs
      </Typography>

      {loading && <CircularProgress />}

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {!loading && !error && (
        <Paper elevation={3} sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', overflowX: 'auto' }}>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', margin: 0 }}>
            <code>{logs || 'Log file is empty.'}</code>
          </pre>
        </Paper>
      )}
    </Box>
  );
};

export default SystemLogsView;