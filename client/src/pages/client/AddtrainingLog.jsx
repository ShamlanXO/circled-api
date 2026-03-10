// @mui
import { styled } from '@mui/material/styles';
// components
import Page from 'src/components/Page';
import Axios from 'axios';
import { memo, useEffect, useRef, useMemo } from 'react';
import ImageWithFallback from 'src/components/Labs/ImageWithFallback';
import { Box, Typography, Button, IconButton, InputBase, Badge, TextField, Slider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { newUpload, addMediaToLog } from 'src/redux/actions/ProgressLogs';
import Container from 'src/components/Layout/Container';
import Footer from 'src/components/Layout/Footer';
import { updateFeedback } from 'src/redux/actions/feedback';
import { updateMediaRecord, deleteMediaRecord } from 'src/redux/actions/sync';
import { useState } from 'react';
import Iconify from 'src/components/Iconify';
import MuscleHighlighterDrawer from 'src/components/muscleHighlighter/bottomDrawer';
import { getProcessedvideoLinkOfLogs, getThumbnailOfLogs } from 'src/utils/convertToLink';
import Model from 'src/components/body-highlight2/src';
import ReactPlayer from 'react-player';
import CloseIcon from 'src/assets/IconSet/CloseRedIcon';
import ReactPlayerVimeo from 'src/components/Labs/ReactPlayerWithFallback';
import SwipeableViews from 'react-swipeable-views';
import axios from 'src/utils/axios';
import api from 'src/utils/api';
import { debounce } from 'lodash';
import { deleteVideos } from 'src/redux/actions/createProgram';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import useLocalStorage from 'src/hooks/useLocalStorage';
import LogsDrawer from 'src/components/client/LogsDrawer';
import { getFileFormat } from 'src/utils/getFileFormat';
const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: '#3b579d',
}));

const BottomBox = styled('div')(({ theme }) => ({
  background: 'linear-gradient(180deg, rgba(43, 64, 87, 0) 0%, rgba(43, 64, 87, 0.7) 89.84%)',
  position: 'absolute',
  bottom: 0,
  left: 0,
  zIndex: 1000,
  padding: '12px 24px 24px',
  width: '100%',
}));

const TopBox = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '20px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

export default function EditMediaPage(props) {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const inputRef = useRef();
  const [comments, setComments] = useLocalStorage(`logs-upload-${state.orderId}`, []);

  const navigate = useNavigate();

  const [bottomBox, setBottomBox] = useState(true);
  // const clientData = useSelector((state) => state.ProgramList.clientData)

  const [currentIndex, setCurrentIndex] = useState(state?.index || 0);

  const [media, setMedia] = useState(state.file ? [...state.file] : []);

  // Video progress tracking state
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isSliderDragging, setIsSliderDragging] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const playerRef = useRef(null);
  const progressRef = useRef(0); // Use ref to track progress without causing re-renders

  // Memoize the video URL to prevent unnecessary re-renders
  const videoUrl = useMemo(() => {
    if (getFileFormat(media?.[currentIndex]?.name || media?.[currentIndex]) !== 'video') return null;
    return typeof media?.[currentIndex] === 'string'
      ? getProcessedvideoLinkOfLogs(media?.[currentIndex])
      : URL.createObjectURL(media[currentIndex]);
  }, [media, currentIndex]);

  // Reset video state when current index changes
  useEffect(() => {
    setProgress(0);
    progressRef.current = 0;
    setDuration(0);
    setIsVideoReady(false);
    setIsVideoLoading(true);
    setIsPlaying(true);
  }, [currentIndex]);

  // Update progress state from ref periodically (less frequent updates)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSliderDragging && isVideoReady) {
        setProgress(progressRef.current);
      }
    }, 200); // Update every 200ms instead of every 100ms

    return () => clearInterval(interval);
  }, [isSliderDragging, isVideoReady]);

  const styles = {
    slideContainer: {
      height: '100vh',
      textShadow: '0px 2px 2px rgba(43, 64, 87, 0.25)',
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

  const addLog = () => {
    newUpload({
      _id: state._id,
      exercise: state.exercise,
      orderId: state.orderId,
      message: inputRef?.current?.value,
      day: state.day,
      week: state.week,
      name: state.name,
      profilePic: state.profilePic,
      type: state.type,
      createdBy: state.Profile,
      isUploaded: false,
      media: [],
    });

    uploadAll();
  };

  const uploadVideo = (File) => {
    return new Promise((resolve, reject) => {
      const file = File;
      let id = new Date().getTime();

      const formData = new FormData();
      formData.append('file', file);

      let upload = axios
        .post(`${api.protocol}${api.baseUrl}${api.getMediaUploadSignedUrl}`, {
          name: file.name,
          type: 'application/octet-stream',
        })
        .then((res) => {
          const CancelToken = Axios.CancelToken;
          const source = CancelToken.source();
          dispatch(
            updateMediaRecord(id, {
              source: source,
              ...state,
            }),
          );
          resolve();
          Axios.put(res.data, file, {
            cancelToken: source.token,
            headers: { 'Content-Type': 'application/octet-stream' },
            onUploadProgress: (progressEvent) => {
              dispatch(
                updateMediaRecord(id, {
                  upload: upload,
                  id:id,
                  source,
                  progress: Math.round((progressEvent.loaded / progressEvent.total) * 100),
                  ...state,
                }),
              );
            },
          })
            .then((response) => {
              // editExercise(
              //     {
              //         media: Program.ExercisePlan.weeks[state.week]
              //             .days[state.day].Exercise[state.index].media
              //             ? [
              //                   ...Program.ExercisePlan.weeks[
              //                       state.week
              //                   ].days[state.day].Exercise[
              //                       state.index
              //                   ].media,
              //                   res.data.split('?')[0],
              //               ]
              //             : [res.data.split('?')[0]],
              //     },
              //     state.index
              // )
              addMediaToLog(state._id, res.data.split('?')[0]);
              dispatch(deleteMediaRecord(id));
            })
            .catch((err) => {
              reject();
              console.log(err)
              dispatch(deleteMediaRecord(id));
            });
        })

        .catch((err) => {
          console.log(err);
          dispatch(deleteMediaRecord(id));
          dispatch(
            updateFeedback({
              message: 'Error uploading video',
              type: 'error',
            }),
          );
        });
    });
  };

  const uploadAll = async () => {
    dispatch(updateFeedback({ loading: true }));
    for (const file of [...media].filter((i) => typeof i !== 'string')) {
      await uploadVideo(file);
    }
    dispatch(updateFeedback({ loading: false }));
    navigate(-1);
  };

  const addNewVideo = (e) => {
    setMedia([...media, ...e.target.files]);
  };

  const removeVideo = (indexR) => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else {
      return navigate(-1);
    }

    let AllExercise = [...media];
    AllExercise.splice(indexR, 1);
    setMedia(AllExercise);
  };

  // Handle slider value change
  const handleSliderChange = (event, newValue) => {
    if (!isSliderDragging) return;
    progressRef.current = newValue;
    setProgress(newValue);
  };

  // Handle slider drag start
  const handleSliderDragStart = () => {
    setIsSliderDragging(true);
    setIsPlaying(false);
  };

  // Handle slider drag end
  const handleSliderDragEnd = () => {
    setIsSliderDragging(false);
    if (playerRef.current) {
      playerRef.current.seekTo(progressRef.current, 'seconds');
    }
    // Small delay to ensure seek completes before resuming playback
    setTimeout(() => {
      setIsPlaying(true);
    }, 100);
  };

  // Handle slider change committed (when user releases slider)
  const handleSliderChangeCommitted = (event, newValue) => {
    progressRef.current = newValue;
    setProgress(newValue);
    if (playerRef.current) {
      playerRef.current.seekTo(newValue, 'seconds');
    }
    setIsPlaying(true);
  };

  // useEffect(() => {
  //     if (Exercise?.media?.length == 0 || !Exercise?.media) {
  //         editExercise({ triggerMuscle: [] }, state.index)
  //     }
  // }, [])

  // let uploadableFiles = [...exercise].filter((i) => typeof i !== 'string')

  return (
    <Page title=" Simplified Online Fitness Training ">
      <input
        type="file"
        accept="image/* , video/*"
        style={{ display: 'none' }}
        id={'media-add-new-video'}
        onChange={addNewVideo}
      />
      <RootStyle>
        <Container>
          <div style={Object.assign({}, styles.slide, styles.slide3)}>
            <Box position={'relative'}>
              {' '}
              <Box
                style={{
                  width: '100vw',
                  height: '100vh',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {getFileFormat(media?.[currentIndex]?.name || media?.[currentIndex]) == 'video' ? (
                  <ReactPlayerVimeo
                    key={`video-${currentIndex}-${typeof media?.[currentIndex] === 'string' ? 'url' : 'file'}`}
                    url={videoUrl}
                    loop
                    raw={media?.[currentIndex]}
                    controls={false}
                    responsive={true}
                    playsinline={true}
                    playing={isPlaying}
                    ref={playerRef}
                    onProgress={(progressData) => {
                      progressRef.current = progressData.playedSeconds;
                    }}
                    onDuration={(duration) => {
                      setDuration(duration);
                    }}
                    onReady={() => {
                      setIsVideoReady(true);
                      setIsVideoLoading(false);
                    }}
                    onError={(error) => {
                      console.error('Video playback error:', error);
                      setIsVideoReady(false);
                      setIsVideoLoading(false);
                    }}
                    onBuffer={() => {
                      setIsVideoLoading(true);
                    }}
                    onBufferEnd={() => {
                      setIsVideoLoading(false);
                    }}
                    progressInterval={500}
                    width="100vw"
                    height={'auto'}
                    style={{
                      'display': 'flex',
                      'justifyContent': 'center',
                      'alignItems': 'center',
                      'width': '100vw',
                      'height': '100vh',
                      '& video': {},
                    }}
                  />
                ) : (
                  <img
                    src={
                      typeof media?.[currentIndex] == 'string'
                        ? media?.[currentIndex]
                        : URL.createObjectURL(media[currentIndex])
                    }
                    width={'100%'}
                    height={'auto'}
                    style={{ maxHeight: '100vh' }}
                  />
                )}
              </Box>
              <Box
                position={'absolute'}
                zIndex={1000}
                width={'100vw'}
                height={'10vh'}
                top={0}
                //onClick={() => setShowDwtails(!showDetails)}
              >
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
                    {props.mode == 'view' ? '' : 'Add Media'}
                  </Typography>
                </TopBox>
              </Box>
            </Box>
          </div>

          <Box
            zIndex={100}
            position={'absolute'}
            bottom={0}
            px={2}
            pb={4}
            width={'100%'}
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%,  rgba(0,0,0,1) 100%)' }}
          >
            <CreateMediaCarousel
              videos={media}
              setCurrentIndex={setCurrentIndex}
              currentIndex={currentIndex}
              mode={props.mode}
              removeVideo={removeVideo}
            />
            {getFileFormat(media?.[currentIndex]?.name || media?.[currentIndex]) == 'video' && isVideoReady && duration > 0 && (
              <Box sx={{ mb: 2 }}>
                {isVideoLoading && (
                  <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Typography variant="caption" color="common.white">
                      Loading...
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => setIsPlaying(!isPlaying)}
                    sx={{ color: 'common.white' }}
                    disabled={isVideoLoading}
                  >
                    <Iconify
                      icon={isPlaying ? 'eva:pause-fill' : 'eva:play-fill'}
                      width={24}
                      height={24}
                    />
                  </IconButton>
                  <Slider
                    size="large"
                    min={0}
                    max={duration}
                    value={progress}
                    onDragStart={handleSliderDragStart}
                    onDragEnd={handleSliderDragEnd}
                    onChange={handleSliderChange}
                    onChangeCommitted={handleSliderChangeCommitted}
                    disabled={isVideoLoading}
                    sx={{
                      color: 'primary.main',
                      flex: 1,
                      '& .MuiSlider-thumb': {
                        backgroundColor: 'primary.main',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: 'primary.main',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
            {props.mode == 'view' ? (
              <Box sx={{ background: '#13202F', borderRadius: 1, mb: 3, px: 2, color: 'white', py: 1 }}>
                {state.comment || 'No comments'}
              </Box>
            ) : (
              <InputBase
                sx={{
                  background: '#13202F',
                  border: '1.5px solid white',
                  borderRadius: 1,
                  mb: 3,
                  px: 2,
                  color: 'white',
                  minHeight: 48,
                }}
                fullWidth
                placeholder="Add comment..."
                multiline
                defaultValue={state.comment}
                inputRef={inputRef}
                maxRows={5}
              />
            )}

            {props.mode == 'view' ? (
              ''
            ) : (
              <Box
                width={'100%'}
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Typography color={'common.white'}>1 Media selected</Typography>
                <Button
                  variant="contained"
                  sx={{ px: 4 }}
                  onClick={addLog}
                >
                  Post
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}

const CreateMediaCarousel = (props) => {
  return (
    <Box overflow={'auto'}>
      <Box
        display={'flex'}
        my={2}
      >
        {props.mode == 'view' ? (
          ''
        ) : (
          <Box
            onClick={() => document.getElementById('media-add-new-video').click()}
            mx={1}
            height={66}
            width={66}
            display={'flex'}
            flexDirection={'row'}
            alignItems={'center'}
            overflowY={'auto'}
            borderRadius={1}
            bgcolor={'rgba(217, 217, 217, 0.5)'}
            border={2}
            borderColor={'#fff'}
          >
            <Box ml={1.1}>
              <IconButton>
                <Iconify
                  icon={'ant-design:plus-outlined'}
                  width={28}
                  height={28}
                  color="common.white"
                />
              </IconButton>
              <Box
                borderRadius={1}
                overflow={'hidden'}
              ></Box>
            </Box>
          </Box>
        )}
        {props.videos?.map((item, index) => {
          return (
            <Box
              mx={1}
              height={'66px'}
              width={'66px'}
              display={'flex'}
              flexDirection={'row'}
              alignItems={'center'}
              overflowY={'auto'}
              onClick={() => props.setCurrentIndex(index)}
            >
              <Box position={'relative'}>
                {props.mode == 'view' ? (
                  ''
                ) : (
                  <IconButton
                    style={{
                      position: 'absolute',
                      top: -16,
                      right: -16,
                      zIndex: 100,
                    }}
                  >
                    {props.currentIndex == index ? (
                      <CloseIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          props.removeVideo(index);
                        }}
                      />
                    ) : null}
                  </IconButton>
                )}
                <Box
                  borderRadius={1}
                  border={2}
                  borderColor={props.currentIndex == index ? '#fff' : 'rgba(255, 255, 255, 0)'}
                  position={'relative'}
                  overflow={'hidden'}
                  bgcolor={'none'}
                >
                  {getFileFormat(item?.name || item) == 'video' ? (
                    <Box
                      borderRadius={1}
                      overflow={'hidden'}
                      height={66}
                      width={66}
                    >
                      {typeof item == 'string' ? (
                        <VideoImage link={item} />
                      ) : (
                        <VideoComponent
                          component={ReactPlayer}
                          fileName={item.name}
                          url={URL.createObjectURL(item)}
                          //   controls
                          loop
                          controls={false}
                          autoPlay={true}
                          responsive={true}
                          playsinline={true}
                          playing={false}
                          width="100%"
                          height={'100%'}
                          style={{
                            'display': 'flex',
                            'justifyContent': 'center',
                            'alignItems': 'center',
                            'borderRadius': '20px',
                            'width': '100%',
                            'height': '100%',
                            '& video': {
                              borderRadius: '20px',
                            },
                          }}
                        />
                      )}
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
                          alignItems: 'flex-end',
                          padding: 8,

                          background: 'rgba(0,0,0,0.15)',
                        }}
                      >
                        <Iconify
                          icon="majesticons:video"
                          color="common.white"
                          width={18}
                          height={18}
                        />
                      </div>
                    </Box>
                  ) : (
                    <Box
                      borderRadius={1}
                      overflow={'hidden'}
                      height={66}
                      width={66}
                    >
                      <ImageWithFallback
                        variant="rounded"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        src={typeof item == 'string' ? item : URL.createObjectURL(item)}
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
                          alignItems: 'flex-end',
                          padding: 8,

                          background: 'rgba(0,0,0,0.15)',
                        }}
                      >
                        <Iconify
                          icon="bi:image-fill"
                          color="common.white"
                          width={18}
                          height={18}
                        />
                      </div>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const VideoComponent = memo(
  (props) => {
    let Video = props.component;
    return <Video {...props} />;
  },
  (p, n) => p.fileName == n.fileName,
);

const VideoImage = (props) => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    setUrl(getThumbnailOfLogs(props.link));
  }, [props.link]);

  return (
    <ImageWithFallback
      onClick={props.onClick}
      variant="rounded"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      src={url || '/images/instructor/exerciseImage.png'}
    />
  );
};
