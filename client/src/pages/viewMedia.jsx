// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// sections
import {
  Box,
  Typography,
  Stack,
  ButtonBase,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  Tabs,
  Tab,
  Divider,
  IconButton,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';
import Container from '../components/Layout/Container';
import Content from '../components/Layout/Content';

import { useState } from 'react';
import { TabContext, TabPanel } from '@mui/lab';
import Iconify from 'src/components/Iconify';
import IconMuscleTrigger from 'src/assets/muscleHighlighter/Icon_MuscleTrigger';
import MuscleHighlighterDrawer from 'src/components/muscleHighlighter/bottomDrawer';
import Model from '../components/body-highlight2/src';
import ReactPlayer from 'react-player/vimeo';
import SwipeableViews from 'react-swipeable-views';
import VideoCover from 'react-video-cover';
import { ArrowBack } from '@mui/icons-material';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: '#3b579d',
}));

const BottomBox = styled('div')(({ theme }) => ({
  background: 'linear-gradient(180deg, rgba(43, 64, 87, 0) 0%, #2B4057 69.84%)',
  position: 'absolute',
  bottom: 0,
  left: 0,
  padding: '12px 24px 24px',
  width: '100%',
  textShadow: '0px 2px 2px rgba(43, 64, 87, 0.25)',
}));

const TopBox = styled('div')(({ theme }) => ({
  background: 'linear-gradient(180deg, #2B4057 0%, rgba(43, 64, 87, 0) 100%)',
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '20px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  textShadow: '0px 2px 2px rgba(43, 64, 87, 0.25)',
}));

// ----------------------------------------------------------------------

export default function ViewMedia() {
  const dispatch = useDispatch();

  // const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [data, setData] = useState([
    {
      name: 'Bench Press',
      muscles: ['chest', 'triceps', 'front-deltoids'],
      frequency: 10,
    },
    {
      name: 'Tricep Pushdown',
      muscles: ['triceps'],
      frequency: 4,
    },
    {
      name: 'Tricep Pushdown',
      muscles: ['back-deltoids'],
      frequency: 3,
    },
    {
      name: 'Tricep Pushdown',
      muscles: ['obliques', 'lower-back'],
      frequency: 2,
    },
    {
      name: 'Tricep Pushdown',
      muscles: ['abs', 'upper-back'],
      frequency: 3,
    },
    //   {
    //     name: "Running",
    //     muscles: [
    //       "chest",
    //       "triceps",
    //       "front-deltoids",
    //       "trapezius",
    //       "upper-back",
    //       "lower-back",
    //       "biceps",
    //       "forearm",
    //       "back-deltoids",
    //       "abs",
    //       "obliques",
    //       "adductor",
    //       "hamstring",
    //       "quadriceps",
    //       "abductors",
    //       "calves",
    //       "gluteal",
    //       "head",
    //       "neck",
    //       "knees",
    //       "left-soleus",
    //       "right-soleus",
    //     ],
    //     frequency: 1,
    //   },
  ]);
  const exercise = {
    items: ['https://vimeo.com/265111898', 'https://vimeo.com/357788702', 'https://vimeo.com/613729649'],
    triggerMuscle: ['biceps', 'front-deltoids'],
    Title: 'Upperbody',
    Description: 'Lorem ipsum dolor sit amet sed lectus. Lorem ipsum dolor sit amet sed lectus. ',
  };

  const styles = {
    slideContainer: {
      height: '100vh',
    },
    slide: {
      minHeight: '100vh',
      color: '#fff',
    },
    slide1: {
      background: '#FEA900',
    },
    slide2: {
      background: '#B3DC4A',
    },
    slide3: {
      background: '#000',
    },
  };

  const [isPlaying, setIsPlaying] = useState({ play: false, index: null });

  return (
    <Page title=" Simplified Online Fitness Training ">
      <RootStyle>
        <Container>
          <SwipeableViews
            axis="y"
            containerStyle={styles.slideContainer}
            enableMouseEvents
          >
            {exercise.items.map((item, index) => (
              <div style={Object.assign({}, styles.slide, styles.slide3)}>
                <Box position={'relative'}>
                  {' '}
                  <Box
                    style={{
                      width: '100vw',
                      height: '100vh',
                      position: 'relative',
                    }}
                  >
                    <ReactPlayer
                      url={item}
                      //   controls
                      loop
                      playing={isPlaying.play && isPlaying.index == index}
                      width="100%"
                      height="100%"
                      style={{
                        'width': '100%',
                        'height': '100%',
                        '& video': {
                          objectFit: 'cover',
                        },
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '100%',
                        width: '100%',
                        opacity: 1,
                      }}
                    >
                      <Box
                        display={'flex'}
                        flexDirection="column"
                        justifyContent={'center'}
                        alignItems="center"
                        height="100%"
                        onClick={() => {
                          if (isPlaying.play && isPlaying.index == index) {
                            setIsPlaying({
                              play: false,
                              index: null,
                            });
                          }
                        }}
                      >
                        {isPlaying.index != index && (
                          <IconButton
                            onClick={() =>
                              setIsPlaying({
                                play: true,
                                index: index,
                              })
                            }
                          >
                            <Iconify
                              icon="fluent:play-circle-48-filled"
                              color="common.white"
                              width="48px"
                              height="48px"
                            />
                          </IconButton>
                        )}
                      </Box>
                    </div>
                  </Box>
                  <TopBox>
                    <IconButton
                      onClick={() => navigate(-1)}
                      sx={{ color: 'common.white' }}
                    >
                      <ArrowLeft />
                    </IconButton>
                    &nbsp;
                    <Typography
                      variant="subtitle1"
                      color="common.white"
                    >
                      Exercise {index + 1}
                    </Typography>
                  </TopBox>
                  <BottomBox>
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                    >
                      <Model
                        data={[
                          {
                            name: exercise.Title,
                            muscles: exercise.triggerMuscle,
                            frequency: 1,
                          },
                        ]}
                        style={{
                          width: '88px',
                          padding: '5px',
                        }}
                        highlightedColors={['#2F86EB']}
                      />
                      {/* <Model
                        type="posterior"
                        data={data}
                        style={{ width: "50px", padding: "5px" }}
                        highlightedColors={["#FB8500"]}
                      /> */}
                      <Box
                        width="70%"
                        marginLeft={'20px'}
                      >
                        <Typography
                          variant="subtitle1"
                          color="common.white"
                          gutterBottom
                        >
                          {exercise.Title}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="common.white"
                        >
                          {exercise.Description}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      display={'flex'}
                      justifyContent="center"
                      //   color={"#000"}
                      style={{
                        color: '#959FAB !important',
                      }}
                    >
                      <Button
                        color="inherit"
                        variant="contained"
                      >
                        <Typography
                          variant="body1"
                          color="common.white"
                        >
                          Media&nbsp;
                          {index + 1 + '/' + exercise.items.length}
                        </Typography>
                        &nbsp;
                        <Iconify
                          icon="iconoir:fast-arrow-down"
                          color="common.white"
                          width="24px"
                          height="24px"
                        />
                      </Button>
                    </Box>
                  </BottomBox>
                </Box>
              </div>
            ))}
          </SwipeableViews>
        </Container>
      </RootStyle>
    </Page>
  );
}
