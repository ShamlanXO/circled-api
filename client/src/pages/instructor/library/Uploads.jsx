// @mui
import { styled } from '@mui/material/styles';
import { useState, useEffect, useRef, useMemo } from 'react';
import { searchItemByKey } from 'src/utils/search.js';
// components
import Page from 'src/components/Page';
// sections
import {
  Box,
  Button,
  Typography,
  Stack,
  Avatar,
  ButtonBase,
  IconButton,
  TextField,
  InputAdornment,
  BottomNavigation,
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Iconify from 'src/components/Iconify';
import VideosElement from 'src/components/Library/Videos';
import WorkoutElement from 'src/components/Library/Workout';
import PublicVideosElement from 'src/components/Library/PublicVideos';
import Container from 'src/components/Layout/Container';
import Content from 'src/components/Layout/Content';
import Header from 'src/components/Layout/Header';
import FooterBase from 'src/components/Layout/Footer';
import ProgramIcon from 'src/assets/IconSet/Program';
import ClientIcon from 'src/assets/IconSet/Client';
import { useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import Footer from 'src/components/onboarding/footer';
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useOutletContext } from 'react-router-dom';
import DbIcon from 'src/assets/IconSet/DB';

import ArrowLeft from 'src/assets/IconSet/ArrowLeft';

// ----------------------------------------------------------------------
const BottomNavigationAction = styled(MuiBottomNavigationAction)({
  ' &.Mui-selected': {
    fontWeight: 600,
  },
});

export default function CreateProgramPage({}) {
  const { state } = useLocation();
  const [tabValue, setTabValue] = useState('library');
  const [workoutData, setWorkoutData, currentTab, setCurrentTab] = useOutletContext();
  const navigate = useNavigate();

  const [searchKey, setSearchKey] = useState('');

  useEffect(() => {
    setSearchKey('');
  }, [currentTab]);

useEffect(()=>{
  setCurrentTab(state?.mode)
},[state?.mode])

  return (
    <Page title=" Simplified Online Fitness Training ">
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
            overflow={'hidden'}
          >
            <Box
              width={'100%'}
              display={'flex'}
              px={2}
              mb={2}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box
                display={'flex'}
                alignItems={'center'}
              >
                {' '}
                <IconButton
                                    onClick={() => navigate(-1)}
                                    sx={{ color: 'text.primary' }}
                                >
                                    <ArrowLeft />
                                </IconButton>
                <Typography
                  variant="body1"
                  color="text.primary"
                >
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                  >
                    {/* {mode == "edit"
                      ? "Program Overview"
                      : mode === "customize"
                      ? "Client Profile"
                      : "Home"}
                    &nbsp;&gt;&nbsp; */}
                    <Typography
                      color="text.primary"
                      sx={{
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}
                    >
                      My videos
                    </Typography>
                  </Box>
                </Typography>{' '}
              </Box>{' '}
            </Box>
          </Box>
          <Box
           
            mb={2}
            px={2}
          >
            <TextField
              fullWidth
              placeholder={`Search by videos`}
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              InputProps={{
                sx: { height: 48 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Iconify
                        icon={'eva:search-fill'}
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
            height={'100%'}
          >
            
            <Box
              paddingLeft={2}
              paddingRight={2}
              pt={1}
              pb={5}
              height={'100%'}
            >
              
                <VideosElement searchKey={searchKey} />
              
            </Box>
          </Box>
        </Content>
 
      </Container>
    </Page>
  );
}
