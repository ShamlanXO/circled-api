// @mui
import { styled } from '@mui/material/styles';
import { useState, useEffect, useRef } from 'react';
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
  Drawer,
  TextField,
  InputAdornment,
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Iconify from 'src/components/Iconify';
import VideosElement from 'src/components/Library/Videos';
import PublicVideos from 'src/components/Library/PublicVideos';
import WorkoutElement from 'src/components/Library/Workout';
import Container from 'src/components/Layout/Container';
import Content from 'src/components/Layout/Content';
import Header from 'src/components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Footer from 'src/components/onboarding/footer';
import FooterBase from 'src/components/Layout/Footer';
import { fetchVideoLibrary, fetchWorkoutLibrary, fetchPublicLibrary } from 'src/redux/actions/figgsLibrary';

import { useOutletContext } from 'react-router-dom';

import ArrowLeft from 'src/assets/IconSet/ArrowLeft';

// ----------------------------------------------------------------------

function CreateProgramPage({ handleBack, onSelection, mode, slectionMode }) {
  const { state } = useLocation();

  const [workoutData, setWorkoutData] = useOutletContext();
  const [currentTab, setCurrentTab] = useState('public');
  const [selectedWorkout, setSelectedWorkout] = useState([]);
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = useState('');
  const navigate = useNavigate();
  const videos = useSelector((s) => s.Library.videos);
  const workouts = useSelector((s) => s.Library.workouts);
  const publicVideos = useSelector((s) => s.Library.publicVideos);
  useEffect(() => {
    setSearchKey('');
    dispatch(fetchVideoLibrary());
    dispatch(fetchWorkoutLibrary());
    dispatch(fetchPublicLibrary());
  }, []);
  return (
    <Page title=" Simplified Online Fitness Training ">
      <Container style={{ height: '100vh' }}>
        <Header
          style={{
            borderRadius: '8px',
            backgroundColor: 'white',

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
                  onClick={() => handleBack()}
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
                      Library
                    </Typography>
                  </Box>
                </Typography>{' '}
              </Box>{' '}
            </Box>
          </Box>
          <Box
            mt={0}
            px={2}
            mb={2}
          >
            <TextField
              fullWidth
              placeholder={
                mode == 'videos' || mode == 'publicVideos' ? 'Search by exercise name' : 'Search by workout name'
              }
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
          {(mode == 'videos' || mode == 'publicVideos') && (
            <Box px={2}>
              <Tabs
                value={currentTab}
                onChange={(event, newValue) => setCurrentTab(newValue)}
                variant="fullWidth"
              >
                <Tab
                  label={
                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: currentTab == 'public' ? 'bold' : 300,
                      }}
                    >
                      {`Public`}
                    </Typography>
                  }
                  value="public"
                />
                <Tab
                  label={
                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: currentTab == 'videos' ? 'bold' : 300,
                      }}
                    >
                      {`Uploads `}
                    </Typography>
                  }
                  value="videos"
                />
              </Tabs>
            </Box>
          )}
        </Header>
        <Content withoutPadding={true}>
          <Box
            sx={{
              paddingTop: 2,
            }}
            height={'100%'}
          >
            <Box
              width={'100%'}
              bgcolor={'#000'}
              sx={{
                height: 8,
                background: '#F5F7FA',
              }}
            ></Box>
            <Box
              padding={2}
              height={'100%'}
            >
              {mode == 'videos' || mode == 'publicVideos' ? (
                <>
                  {currentTab == 'videos' ? (
                    <VideosElement
                      setWorkoutData={setWorkoutData}
                      slectionMode
                      searchKey={searchKey}
                      selectedWorkout={selectedWorkout}
                      setSelectedWorkout={setSelectedWorkout}
                    />
                  ) : (
                    <PublicVideos
                      setWorkoutData={setWorkoutData}
                      slectionMode
                      searchKey={searchKey}
                      selectedWorkout={selectedWorkout}
                      setSelectedWorkout={setSelectedWorkout}
                    />
                  )}
                </>
              ) : (
                <WorkoutElement
                  setWorkoutData={setWorkoutData}
                  slectionMode
                  searchKey={searchKey}
                  selectedWorkout={selectedWorkout}
                  setSelectedWorkout={setSelectedWorkout}
                />
              )}
            </Box>
          </Box>
        </Content>
        <FooterBase>
          <Footer
            next
            nextText={'Done'}
            nextClick={() => {
              handleBack();
              onSelection(mode == 'videos' || mode == 'publicVideos' ? selectedWorkout : selectedWorkout[0]);
            }}
            disabledNext={selectedWorkout?.length == 0}
          />
        </FooterBase>
      </Container>
    </Page>
  );
}

export default function LibrarySelectorDrawer(props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Function to toggle the drawer open/closed
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const handleBack = () => {
    setIsOpen((prevState) => !prevState);
    props.onBack();
  };
  return (
    <>
      {/* Button to open the drawer */}

      <div onClick={toggleDrawer}>{props.children}</div>
      {/* The drawer */}
      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}

        // Add any other styling or props you want for the drawer
      >
        {/* Pass necessary props and state to CreateProgramPage */}
        <CreateProgramPage
          handleBack={handleBack}
          onSelection={props.onSelection}
          slectionMode={props.slectionMode}
          mode={props?.mode}
        />
      </Drawer>
    </>
  );
}
