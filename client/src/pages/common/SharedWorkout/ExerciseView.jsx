// @mui
import { styled } from '@mui/material/styles';
import Page from 'src/components/Page';
import { Box, Typography, Button, IconButton, InputBase } from '@mui/material';
import { useNavigate, useLocation, useOutletContext } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'src/components/Layout/Container';
import { updateFeedback } from 'src/redux/actions/feedback';
import { useEffect, useState } from 'react';
import Stepper from 'src/components/stepper2';
import Iconify from 'src/components/Iconify';
import MuscleHighlighterDrawer from 'src/components/muscleHighlighter/bottomDrawer';
import Model from 'src/components/body-highlight2/src';
import ReactPlayerVimeo from 'src/components/Labs/ReactPlayerWithFallback';
import SwipeableViews from 'react-swipeable-views';

import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import { getProcessedvideoLink } from 'src/utils/convertToLink';
import ReactReadMoreReadLess from 'react-read-more-read-less';
const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: '#3b579d',
}));

const BottomBox = styled('div')(({ theme }) => ({
  background: 'linear-gradient(180deg, rgba(43, 64, 87, 0) 10%, #2B4057 100.00%)',
  position: 'absolute',
  bottom: 0,
  left: 0,
  zIndex: 1000,
  padding: '12px 24px 24px',
  width: '100%',
}));

const TopBox = styled('div')(({ theme }) => ({
  background: 'linear-gradient(180deg, #2B4057 0%, rgba(43, 64, 87, 0) 100%)',
  position: 'absolute',
  dispatch: 'flex',
  flexDirection: 'column',
  top: 0,
  left: 0,
  paddingLeft: 12,
  paddingRight: 12,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

export default function EditMediaPage(props) {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [exerciseIndex, setExerciseIndex] = useState(state?.index || 0);
  const [videoIndex, setIndex] = useState(0);
  const navigate = useNavigate();
  const [workoutData] = useOutletContext();

  const [progress, setProgress] = useState(0);
  const [showDetails, setShowDwtails] = useState(true);
  let Exercise = workoutData.Exercise;

  const styles = {
    slideContainer: {
      height: window.innerHeight,
      textShadow: '0px 2px 2px rgba(43, 64, 87, 0.25)',
    },
    slide: {
      minHeight: window.innerHeight,
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

  const handleChangeIndex = (i, li, meta) => {
    setIndex(i);
  };

  const onClickNext = (media, index) => {
    if (media[index + 1]) {
      setIndex(index + 1);
    } else if (Exercise[exerciseIndex + 1]) {
      setExerciseIndex(exerciseIndex + 1);
      setIndex(0);
    } else {
      dispatch(
        updateFeedback({
          type: 'success',
          message: 'Great job!',
          sAnimate: true,
          description: 'You have completed this exercise',
        }),
      );

      navigate(-1);
    }
  };

  const onClickPrev = (media, index) => {
    if (media[index - 1]) {
      setIndex(index - 1);
    } else if (Exercise[exerciseIndex - 1]) {
      setExerciseIndex(exerciseIndex - 1);
      setIndex(Exercise[exerciseIndex - 1].media.length - 1);
    }
  };

  useEffect(() => {
    if (!Exercise.length) {
      navigate(-1);
    }
  }, []);

  return (
    <Page title=" Simplified Online Fitness Training ">
      <RootStyle>
        <Container>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              zIndex: 1000,
              width: '100%',
              px: 2,
            }}
          >
            <TopBox
              display={'flex'}
              flexDirection={'column'}
            >
              <Stepper
                px={1}
                noClose
                progress={progress}
                noBack
                steps={Exercise?.[exerciseIndex]?.media?.length || 0}
                active={videoIndex + 1}
              />
              <Box
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
                pt={1}
              >
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
                  {Exercise?.[exerciseIndex]?.title}
                  &nbsp;/&nbsp;exercise {1 + exerciseIndex}
                </Typography>
              </Box>
            </TopBox>
          </Box>

          <SwipeableViews
            axis="y"
            index={exerciseIndex}
            containerStyle={styles.slideContainer}
            enableMouseEvents
            onChangeIndex={(i) => {
              setIndex(0);
              setExerciseIndex(i);
            }}
          >
            {Exercise.map((ex, exIndex) => {
              if (!ex.media.length) {
                ex.media = ['https://media.publit.io/file/MPsWb1VJ.mp4'];
              }
              return (
                <SwipeableViews
                  axis="x"
                  index={videoIndex}
                  containerStyle={styles.slideContainer}
                  enableMouseEvents
                  onChangeIndex={handleChangeIndex}
                >
                  {ex.media.map((item, index) => (
                    <div style={Object.assign({}, styles.slide, styles.slide3)}>
                      <Box position={'relative'}>
                        {' '}
                        <Box
                          style={{
                            width: '100vw',
                            height: window.innerHeight,
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            filter: item == 'https://media.publit.io/file/MPsWb1VJ.mp4' && 'opacity(15%)',
                          }}
                        >
                          <ReactPlayerVimeo
                            url={getProcessedvideoLink(item)}
                            raw={item}
                            //   controls
                            loop
                            onProgress={(e) => {
                              setProgress(e.played * 100);
                            }}
                            progressInterval={100}
                            controls={false}
                            autoPlay={true}
                            responsive={true}
                            playsinline={true}
                            playing={exerciseIndex == exIndex && videoIndex == index}
                            width="100vw"
                            height={window.innerHeight}
                            style={{
                              'zIndex': 0,
                              'position': 'absolute',
                              'display': 'flex',
                              'justifyContent': 'center',
                              'alignItems': 'center',
                              'width': '100vw',
                              'height': window.innerHeight,
                              '& video': {
                                width: '100vw',
                                height: window.innerHeight,
                              },
                            }}
                          />
                        </Box>
                        <Box
                          position={'absolute'}
                          zIndex={2000}
                          width={'100vw'}
                          height={window.innerHeight}
                          top={0}
                          onClick={() => setShowDwtails(!showDetails)}
                        >
                          {showDetails && (
                            <BottomBox onClick={(e) => e.stopPropagation()}>
                              <MuscleHighlighterDrawer
                                setMData={() => {}}
                                data={
                                  [
                                    {
                                      muscles: ex.triggerMuscle,
                                    },
                                  ] || []
                                }
                                viewMode
                              >
                                <Box
                                  display={'flex'}
                                  alignItems={'center'}
                                >
                                  <Model
                                    data={[
                                      {
                                        name: ex?.title || '',
                                        muscles: ex?.triggerMuscle || [],
                                        frequency: 1,
                                      },
                                    ]}
                                    style={{
                                      width: '68px',
                                      padding: '5px',
                                    }}
                                    highlightedColors={['#EE3737']}
                                  />
                                  <Model
                                    type="posterior"
                                    data={[
                                      {
                                        name: ex.title,
                                        muscles: ex?.triggerMuscle || [],
                                        frequency: 1,
                                      },
                                    ]}
                                    style={{
                                      width: '68px',
                                      padding: '5px',
                                    }}
                                    highlightedColors={['#EE3737']}
                                  />
                                </Box>
                              </MuscleHighlighterDrawer>
                              <Box
                                width="100%"
                                marginLeft={'5px'}
                              >
                                <InputBase
                                  placeholder="Title here"
                                  fullWidth
                                  readOnly
                                  defaultValue={ex.title}
                                  sx={{
                                    py: 0.25,
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                    color: 'common.white',
                                  }}
                                />
                                <Typography
                                  sx={{
                                    py: 0.25,
                                    fontSize: 16,
                                    width: '70%',
                                    pb: 2,
                                    color: 'common.white',
                                    whiteSpace: 'pre-wrap',
                                  }}
                                >
                                  <ReactReadMoreReadLess
                                    charLimit={130}
                                    readMoreText={'more'}
                                    readLessText={'less'}
                                    readMoreStyle={{
                                      fontWeight: 'bold',
                                      color: '#fff',
                                      marginLeft: 6,
                                    }}
                                    readLessStyle={{
                                      fontWeight: 'bold',
                                      color: '#fff',
                                      marginLeft: 6,
                                    }}
                                  >
                                    {ex.note || ''}
                                  </ReactReadMoreReadLess>
                                </Typography>
                              </Box>
                              <Box
                                display={'flex'}
                                justifyContent="space-between"
                                //   color={"#000"}

                                zIndex={2000}
                                style={{
                                  color: '#959FAB !important',
                                }}
                              >
                                <Button
                                  variant="outlined"
                                  sx={{
                                    color: '#95A3B8',
                                    borderColor: '#95A3B8',
                                    height: '48px',
                                  }}
                                  onClick={() => {
                                    onClickPrev(ex.media, index);
                                  }}
                                >
                                  <Iconify
                                    icon={'akar-icons:circle-chevron-left'}
                                    color="#95A3B8"
                                    width={20}
                                    height={20}
                                    disabled={!ex.media[index - 1] && !Exercise[exerciseIndex - 1]}
                                  />
                                  &nbsp;Back
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    onClickNext(ex.media, index);
                                  }}
                                  sx={{
                                    height: '48px',
                                  }}
                                >
                                  {!ex.media[index + 1] && !Exercise[exerciseIndex + 1] ? 'Complete' : 'Next'} &nbsp;
                                  <Iconify
                                    icon={'akar-icons:circle-chevron-right'}
                                    color="white"
                                    width={20}
                                    height={20}
                                  />
                                </Button>
                              </Box>
                            </BottomBox>
                          )}
                        </Box>
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            ex.media?.[index + 1] && setIndex(index + 1);
                          }}
                          display={'flex'}
                          alignItems={'center'}
                          zIndex={100000}
                          position={'absolute'}
                          top={0}
                          right={0}
                          height={'60vh'}
                          width={'25vw'}
                        ></Box>
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            ex.media?.[index - 1] && setIndex(index - 1);
                          }}
                          zIndex={100000}
                          position={'absolute'}
                          top={0}
                          left={0}
                          height={'80vh'}
                          width={'15vw'}
                        ></Box>
                      </Box>
                    </div>
                  ))}
                </SwipeableViews>
              );
            })}
          </SwipeableViews>
        </Container>
      </RootStyle>
    </Page>
  );
}
