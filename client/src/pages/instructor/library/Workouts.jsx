// @mui
import { useState, useEffect } from 'react';
// components
import Page from 'src/components/Page';
// sections
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import Iconify from 'src/components/Iconify';
import WorkoutElement from 'src/components/Library/Workout';
import Container from 'src/components/Layout/Container';
import Content from 'src/components/Layout/Content';
import Header from 'src/components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';
import { useOutletContext } from 'react-router-dom';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';

// ----------------------------------------------------------------------

export default function WorkoutsPage() {
  const { state } = useLocation();
  const [workoutData, setWorkoutData, currentTab, setCurrentTab] = useOutletContext();
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    setSearchKey('');
  }, [currentTab]);

  useEffect(() => {
    setCurrentTab(state?.mode);
  }, [state?.mode, setCurrentTab]);

  return (
    <Page title="Simplified Online Fitness Training">
      <Container>
        <Header
          style={{
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0px 4px 4px rgba(127, 127, 127, 0.1)',
            overflow: 'hidden',
          }}
          reducedHeight={16}
        >
          <Box
            pt={2}
            borderRadius={4}
            overflow="hidden"
          >
            <Box
              width="100%"
              display="flex"
              px={2}
              mb={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() => navigate(-1)}
                  sx={{ color: 'text.primary' }}
                >
                  <ArrowLeft />
                </IconButton>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  Workouts
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box mb={2} px={2}>
            <TextField
              fullWidth
              placeholder="Search by workout name"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              InputProps={{
                sx: { height: 48 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Iconify
                        icon="eva:search-fill"
                        width={24}
                        height={24}
                        color="text.secondary"
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Header>
        
        <Content withoutPadding={true}>
          <Box
            sx={{
              paddingTop: 2,
            }}
            height="100%"
          >
            <Box
              paddingLeft={2}
              paddingRight={2}
              pt={1}
              height="100%"
            >
              <WorkoutElement
                searchKey={searchKey}
                setWorkoutData={setWorkoutData}
              />
            </Box>
          </Box>
        </Content>
      </Container>
    </Page>
  );
}
