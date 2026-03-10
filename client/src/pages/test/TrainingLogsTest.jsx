import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Test component to demonstrate TrainingLogs functionality
 * This component provides buttons to navigate to TrainingLogs with different URL state parameters
 */
const TrainingLogsTest = () => {
  const navigate = useNavigate();

  const testCases = [
    {
      name: 'Week 0, Day 1, Exercise 0',
      state: { week: 0, day: 1, exercise: 0 },
      description: 'Navigate to first week, second day, first exercise'
    },
    {
      name: 'Week 1, Day 3, Exercise 2',
      state: { week: 1, day: 3, exercise: 2 },
      description: 'Navigate to second week, fourth day, third exercise'
    },
    {
      name: 'Week 2, Day 0, Exercise 1',
      state: { week: 2, day: 0, exercise: 1 },
      description: 'Navigate to third week, first day, second exercise'
    },
    {
      name: 'Query Params Test',
      query: '?week=1&day=2&exercise=1',
      description: 'Navigate using query parameters instead of state'
    }
  ];

  const handleNavigateWithState = (state) => {
    navigate('/trainingLogs', { state });
  };

  const handleNavigateWithQuery = (query) => {
    navigate(`/trainingLogs${query}`);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        TrainingLogs Navigation Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        This page demonstrates how to navigate to the TrainingLogs page with specific week, day, and exercise parameters.
        When you click any button below, it will navigate to the TrainingLogs page and automatically:
      </Typography>
      
      <Box component="ul" sx={{ mb: 3 }}>
        <li>Expand the target week accordion</li>
        <li>Expand the target day accordion</li>
        <li>Scroll to the target exercise</li>
        <li>Highlight the target exercise with visual indicators</li>
      </Box>

      <Stack spacing={2}>
        {testCases.map((testCase, index) => (
          <Box key={index} sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              {testCase.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              {testCase.description}
            </Typography>
            
            {testCase.state ? (
              <Button
                variant="contained"
                onClick={() => handleNavigateWithState(testCase.state)}
                sx={{ mr: 1 }}
              >
                Navigate with State
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => handleNavigateWithQuery(testCase.query)}
                sx={{ mr: 1 }}
              >
                Navigate with Query
              </Button>
            )}
            
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              {testCase.state 
                ? `State: ${JSON.stringify(testCase.state)}`
                : `Query: ${testCase.query}`
              }
            </Typography>
          </Box>
        ))}
      </Stack>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          How to Use in Your Code
        </Typography>
        <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
{`// Navigate with state
navigate('/trainingLogs', { 
  state: { week: 0, day: 1, exercise: 2 } 
});

// Navigate with query parameters
navigate('/trainingLogs?week=0&day=1&exercise=2');

// From another component
<Link to="/trainingLogs" state={{ week: 0, day: 1, exercise: 2 }}>
  Go to Training Logs
</Link>`}
        </Typography>
      </Box>
    </Box>
  );
};

export default TrainingLogsTest; 