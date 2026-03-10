// @mui
import { styled } from '@mui/material/styles';
// components
import Page from 'src/components/Page';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// sections
import { Box, Typography, Button, IconButton, InputBase, ButtonBase } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { updateProgram } from 'src/redux/actions/createProgram';
import Container from 'src/components/Layout/Container';
import Header from 'src/components/Layout/Header';
import { updateFeedback } from 'src/redux/actions/feedback';
import { updateRecord, deleteRecord } from 'src/redux/actions/sync';
import { useState, useRef } from 'react';
import Stepper from 'src/components/stepper2';
import Iconify from 'src/components/Iconify';
import IconMuscleTrigger from 'src/assets/muscleHighlighter/Icon_MuscleTrigger';
import MuscleHighlighterDrawer from 'src/components/muscleHighlighter/bottomDrawer';
import Model from '../../components/body-highlight2/src';
import { getThumbnail, getYoutubeVideoTHumbnail } from 'src/utils/convertToLink';
import ReactPlayerVimeo from 'src/components/Labs/ReactPlayerWithFallback';
import SwipeableViews from 'react-swipeable-views';
import ImageWithFallback from 'src/components/Labs/ImageWithFallback';
import { updateStatus } from 'src/redux/actions/clientExercise';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import ForwardIcon from 'src/assets/IconSet/ForwardIcon';
import Log from 'src/assets/IconSet/Log';
import TodayWorkoutIcon from 'src/assets/IconSet/TodayWorkoutIcon';
import Anatomy from 'src/assets/IconSet/Anatomy';
import LogsDrawer from 'src/components/client/LogsDrawer';
import { getProcessedvideoLink } from 'src/utils/convertToLink';
import Slider from '@mui/material/Slider';
import Content from 'src/components/Layout/Content';
import MobileStepper from '@mui/material/MobileStepper';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import { getFileFormat } from 'src/utils/getFileFormat';
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

const BottomButton = styled(ButtonBase)(({ theme }) => ({
  background: '#53647A',
  borderRadius: '8px',
  width: '100%',
  paddingTop: 6,
  paddingBottom: 6,
  paddingLeft: 16,
  paddingRight: 16,
  display: 'flex',

  justifyContent: 'space-between',
}));

const BottomButtonCompleted = styled(ButtonBase)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: '8px',
  width: '100%',
  paddingTop: 6,
  paddingBottom: 6,
  paddingLeft: 16,
  paddingRight: 16,
  display: 'flex',

  justifyContent: 'center',
}));

// ----------------------------------------------------------------------

export default function EditMediaPage(props) {
  const dispatch = useDispatch();
  const { state, pathname } = useLocation();

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [videoIndex, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  // const [data, setData] = useState([]);
  const navigate = useNavigate();
  const Program = useSelector((s) => s.AtheletePlan.Exercises);
  const AtheletePlan = useSelector((s) => s.AtheletePlan);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showDetails, setShowDwtails] = useState(true);
  let Exercise = Program.ExercisePlan.weeks[state.week].days[state.day].Exercise;

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
  useEffect(() => {
    setTimeout(() => {
      setExerciseIndex(state?.index || 0);
    }, 500);
  }, []);

  const updateVideoStatus = () => {
    dispatch(
      updateStatus({
        _id: AtheletePlan.currentPlan,
        stats: {
          ...AtheletePlan.stats,
          [state.week + '-' + state.day + '-' + state.index]: true,
        },
        currentWeek: state.week,
        currentDay: state.day,
      }),
    );
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
      dispatch(
        updateStatus({
          _id: AtheletePlan.currentPlan,
          stats: {
            ...AtheletePlan.stats,
            [state.week + '-' + state.day + '-' + exerciseIndex]: true,
          },
          currentWeek: state.week,
          currentDay: state.day,
        }),
      );
    } else {
      dispatch(
        updateFeedback({
          type: 'success',
          message: 'Great job!',
          sAnimate: true,
          description: 'You have completed this exercise',
        }),
      );

      dispatch(
        updateStatus({
          _id: AtheletePlan.currentPlan,
          stats: {
            ...AtheletePlan.stats,
            [state.week + '-' + state.day]: true,
            [state.week + '-' + state.day + '-' + exerciseIndex]: true,
          },
          currentWeek: state.week,
          currentDay: state.day,
        }),
      );
      // navigate('/client/myWorkoutCalendar',{replace:true})
      navigate(-1);
    }
  };

  const onClickSkip = (media, index) => {
    if (media[index + 1]) {
      setIndex(index + 1);
    } else if (Exercise[exerciseIndex + 1]) {
      setExerciseIndex(exerciseIndex + 1);
      setIndex(0);
      // dispatch(
      //     updateStatus({
      //         _id: AtheletePlan.currentPlan,
      //         stats: {
      //             ...AtheletePlan.stats,
      //             [state.week + '-' + state.day+"-"+exerciseIndex]: true,
      //         },
      //         currentWeek: state.week,
      //         currentDay: state.day,
      //     })
      // )
    } else {
      // dispatch(
      //     updateFeedback({
      //         type: 'success',
      //         message: 'Great job!',
      //         sAnimate: true,
      //         description: 'You have completed this exercise',
      //     })
      // )
      // dispatch(
      //     updateStatus({
      //         _id: AtheletePlan.currentPlan,
      //         stats: {
      //             ...AtheletePlan.stats,
      //             [state.week + '-' + state.day]: true,
      //         },
      //         currentWeek: state.week,
      //         currentDay: state.day,
      //     })
      // )
      navigate('/client/myWorkoutCalendar');
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
              {/* <Stepper
                                px={1}
                                noClose
                                //handleClose={() => navigate("/",{state})}
                                progress={progress}
                                noBack
                                steps={Exercise[exerciseIndex].media.length}
                                active={videoIndex + 1}
                            /> */}
              <Box
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
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
                    {Exercise[exerciseIndex].title}
                    &nbsp;/&nbsp;exercise {1 + exerciseIndex}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setMuted(!muted)}
                  size="large"
                  sx={{ mt: 1 }}
                >
                  {muted ? (
                    <Iconify
                      icon={'lucide:volume-x'}
                      color={'#fff'}
                      sx={{ fontSize: 32 }}
                    />
                  ) : (
                    <Iconify
                      icon={'lucide:volume-2'}
                      color={'#fff'}
                      sx={{ fontSize: 32 }}
                    />
                  )}
                </IconButton>
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
                  disabled={true}
                  draggable={false}
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
                          {getFileFormat(item) == 'video' && exerciseIndex == exIndex && videoIndex == index ? (
                            <ReactPlayerVimeo
                              url={getProcessedvideoLink(item)}
                              raw={item}
                              ref={playerRef}
                              onPlay={() => setIsPlaying(true)}
                              onProgress={(progress) => {
                                setProgress(progress.playedSeconds);
                              }}
                              //   controls
                              loop
                              // onProgress={(e) => {
                              //     setProgress(
                              //         e.played * 100
                              //     )
                              // }}
                              muted={muted}
                              progressInterval={100}
                              controls={false}
                              autoPlay={true}
                              responsive={true}
                              playsinline={true}
                              onDuration={(duration) => {
                                setDuration(duration);
                              }}
                              playing={exerciseIndex == exIndex && videoIndex == index && isPlaying}
                              // onReady={
                              //     updateVideoStatus
                              // }
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
                          ) : (
                            <img
                              src={item}
                              style={{
                                zIndex: 0,
                                position: 'absolute',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100vw',
                                height: window.innerHeight,
                                objectFit: 'contain',
                              }}
                            />
                          )}
                        </Box>
                        <Box
                          position={'absolute'}
                          zIndex={2000}
                          width={'100vw'}
                          height={window.innerHeight}
                          top={0}
                          onClick={() => setShowDwtails(!showDetails)}
                        >
                          {/* <Box
                          style={{
                            position: "absolute",
                            top: "45vh",
                            right: 0,
                            zIndex: 200,
                            width: "100px",
                            height: "10vh",
                          }}
                          onClick={() => setCleanScreen(!cleanScreen)}
                        /> */}

                          {showDetails && (
                            <BottomBox onClick={(e) => e.stopPropagation()}>
                              <MuscleHighlighterDrawer
                                setMData={() => {}}
                                data={
                                  [
                                    {
                                      muscles: ex.media?.[index].triggerMuscle || [],
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
                                        muscles: ex.media?.[index].triggerMuscle || [],
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
                                        muscles: ex.media?.[index].triggerMuscle || [],
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
                                {/* <ButtonBase
                                                                  sx={{
                                                                    background: 'rgba(0,0,0,0.25)',
                                                                    padding: '12px 32px',
                                                                    mb:1,
                                                                    borderRadius: '8px',
                                                                    fontSize: 14,
                                                                  }}
                                                                  >
                                                                Exercise {exerciseIndex + 1} 
                                                            </ButtonBase> */}
                                <InputBase
                                  placeholder="Title here"
                                  fullWidth
                                  readOnly
                                  defaultValue={ex.title}
                                  sx={{
                                    py: 0.25,
                                    mb: 2,
                                    fontWeight: 'bold',
                                    fontSize: 24,
                                    color: 'common.white',
                                  }}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',

                                  alignItems: 'center',
                                  mb: 2,
                                  overflowX: 'auto',
                                }}
                              >
                                {ex?.media?.map((i, index) => (
                                  <Box onClick={() => setIndex(index)}>
                                    {getFileFormat(i) == 'video' ? (
                                      <VideoImage
                                        link={i}
                                        currentIndex={index}
                                        videoIndex={videoIndex}
                                      />
                                    ) : (
                                      <ImageItem
                                        link={i}
                                        currentIndex={index}
                                        videoIndex={videoIndex}
                                      />
                                    )}
                                  </Box>
                                ))}
                              </Box>
                              <Box>
                                <Slider
                                  size="large"
                                  min={0}
                                  max={duration}
                                  value={progress}
                                  onDragStart={(e) => {
                                    setIsPlaying(false);
                                  }}
                                  onDragEnd={(e) => {
                                    setIsPlaying(true);
                                  }}
                                  onChangeCommitted={(e, value) => {
                                    setIsPlaying(true);
                                  }}
                                  onChange={(e, value) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    setIsPlaying(false);

                                    playerRef.current.seekTo(value, 'seconds');
                                    setProgress(value);
                                  }}
                                />
                              </Box>
                              {/* { Exercise?.[exerciseIndex]?.media?.length>1&& <MobileStepper
      variant="dots"
      steps={Exercise?.[exerciseIndex]?.media?.length||0}
      activeStep={videoIndex}
      position="static"
      sx={{bgcolor:'transparent',width:'100%',justifyContent:'center',paddingBottom:4}}
      
      />} */}

                              {/* <Box
                                                                display={'flex'}
                                                                justifyContent="space-between"
                                                                alignItems="center"
                                                       

                                                                zIndex={2000}
                                                                style={{
                                                                    color: '#959FAB !important',
                                                                }}
                                                            >
                                                               
                                                                <Typography variant='subtitle1' align='center'>Exercise<br/>
                                                                {exerciseIndex +
                                                                            1} out {Exercise.length}
                                                                </Typography>
                                                                <Box display={"flex"}>
                                                                    <Button variant='outlined' size='small' onClick={()=>onClickSkip(
                                                                            ex.media,
                                                                            index
                                                                        )} sx={{pr:5,pl:2.5}}>
                                                                        Skip
                                                                        &nbsp;
                                                              
                                                                    </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    size='small'
                                                                    onClick={() => {
                                                                        onClickNext(
                                                                            ex.media,
                                                                            index
                                                                        )
                                                                    }}
                                                                    sx={{
                                                                        pr:2.5,
                                                                        pl:2.5,
                                                                     ml:-5,
                                                                    
                                                                        
                                                                    }}
                                                                >
                                                                    {!ex.media[
                                                                        index +
                                                                            1
                                                                    ] &&
                                                                    !Exercise[
                                                                        exerciseIndex +
                                                                            1
                                                                    ]
                                                                        ? 'Done'
                                                                        : 'Next'}{' '}
                                                                
                                                                </Button>
                                                                </Box>
                                                             
                                  
                                                            </Box> */}
                            </BottomBox>
                          )}
                        </Box>
                        {/* <Box
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        ex.media?.[index + 1] &&
                                                            setIndex(index + 1)
                                                    }}
                                                    display={'flex'}
                                                    alignItems={'center'}
                                                    zIndex={100000}
                                                    position={'absolute'}
                                                    top={0}
                                                    right={0}
                                                    height={'60vh'}
                                                    width={'25vw'}
                                                >
                                                    <Box
                                                    bgcolor={'rgba(0,0,0,0.25)'}
                                                     
                                                        py={2}
                                                        borderRadius={1}
                                                        display={"flex"}
                                                        flexDirection={"column"}
                                                        alignItems={"center"}
                                                        justifyContent={"center"}
                                                        sx={{
                                                            marginTop: '35vh',
                                                        }}
                                                    >
                                                      
                                                        <Box mb={3}>
                                                        <MuscleHighlighterDrawer
                                                    
                                                                setMData={() => {}}
                                                                data={
                                                                    [
                                                                        {
                                                                            muscles:
                                                                                ex.media?.[index].triggerMuscle||[],
                                                                        },
                                                                    ] || []
                                                                }
                                                                viewMode
                                                            >
<center><Anatomy style={{fontSize:72}} 
/></center>
<Typography

                            sx={{   
                                color: '#fff',
                                fontWeight: 'bold',
                                opacity: 1,
                                fontSize: 14,
                                mt: 0.5,
                            }}
                            align='center'
                        >

                            Anatomy
                        </Typography>
                        </MuscleHighlighterDrawer>
</Box>

                                                        <Box mb={3}>
                                                          <center><TodayWorkoutIcon style={{fontSize:38}} onClick={()=>{
                                                            navigate("/client/myWorkoutCalendar/workoutDay",{state:{week:state.week,day:state.day}})
                                                          }}/></center>  
                                                            <Typography
                            sx={{
                                color: '#fff',
                                fontWeight: 'bold',
                                opacity: 1,
                                fontSize: 14,
                                mt: 0.5,
                            }}
                            align='center'
                        >
                           Workout
                        </Typography>
                                                        </Box>





                                                        <LogsDrawer
                                                            {...state}
                                                            onClose={()=>navigate(pathname,{state:{...state,openDrawer:false},replace:true})}
                                                            exerciseIndex={
                                                                exIndex
                                                            }
                                                            openLogs={state.openDrawer&&(exIndex==exerciseIndex)}
                                                            onClickLog={()=>navigate(pathname,{state:{...state,openDrawer:true},replace:true})}
                                                            Exercise={Exercise}
                                                            orderId={
                                                                AtheletePlan.currentPlan
                                                            }
                                                        ></LogsDrawer>
                                                    </Box>
                                                </Box> */}
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

const VideoImage = (props) => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (props.link.type == 'youtube') {
      setUrl(getYoutubeVideoTHumbnail(props.link.file));
    } else setUrl(getThumbnail(props.link));
    // axios
    //   .get(
    //     `https://vimeo.com/api/oembed.json?url=https://player.vimeo.com/video/${
    //       props?.link?.split("https://vimeo.com/")[1]
    //     }`
    //   )
    //   .then((res) => {
    //     console.log(res.data);
    //     setUrl(
    //       props.withPlay
    //         ? res.data.thumbnail_url_with_play_button
    //         : res.data.thumbnail_url
    //     );
    //   });
  }, [props.link]);

  return (
    <Box
      position={'relative'}
      mr={1.5}
      onClick={props.onClick}
      width={100}
      height={66}
      borderRadius={1}
      bgcolor={'#fff'}
      overflow={'hidden'}
      sx={{
        borderColor: props.currentIndex == props.videoIndex ? '#fff' : 'transparent',
        border: props.currentIndex == props.videoIndex ? 2 : 0,
      }}
    >
      <ImageWithFallback
        src={url}
        style={{
          width: '100px',

          height: '66px',
          objectFit: 'cover',
          borderRadius: 8,
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
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          padding: 8,
        }}
      >
        <Iconify
          icon="majesticons:video"
          color="common.white"
          width={18}
          height={18}
        />
      </div>
      <div
        style={{
          position: 'absolute',

          bottom: 0,

          width: '100%',
          borderRadius: 8,
          padding: 4,

          background: 'rgba(0,0,0,0.20)',
        }}
      >
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ fontWeight: 'bold', fontSize: 10, textTransform: 'capitalize' }}
          color="common.white"
        >
          {props.link.title || 'Untitled'}
        </Typography>
      </div>
    </Box>
  );
};

const ImageItem = (props) => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    setUrl(props.link.file);
  }, [props.link]);

  return (
    <Box
      position={'relative'}
      mr={1.5}
      onClick={props.onClick}
      width={100}
      height={66}
      borderRadius={8}
    >
      <ImageWithFallback
        src={url}
        style={{
          width: '100px',
          overflow: 'hidden',
          height: '66px',
          objectFit: 'cover',
          borderRadius: 8,
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
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          padding: 8,
        }}
      >
        <Iconify
          icon="bi:image-fill"
          color="common.white"
          width={18}
          height={18}
        />
      </div>
      <div
        style={{
          position: 'absolute',

          bottom: 0,

          width: '100%',
          borderRadius: 8,
          padding: 4,

          background: 'rgba(0,0,0,0.20)',
        }}
      >
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ fontWeight: 'bold', fontSize: 10 }}
          color="common.white"
        >
          {props.link.title || 'Untitled'}
        </Typography>
      </div>
    </Box>
  );
};
