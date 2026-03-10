// @mui
import { styled } from '@mui/material/styles';
// components
import { useRef, useMemo } from 'react';
import Page from 'src/components/Page';
import Axios from 'axios';
import { memo, useEffect } from 'react';
import ImageWithFallback from 'src/components/Labs/ImageWithFallback';
import BottomSelection from 'src/components/instructor/exerciseCardBottomSelection';
import CircularProgress from 'src/components/progress/Circular';
import { getFileFormat } from 'src/utils/getFileFormat';
import { Box, Typography, Button, IconButton, InputBase, Badge } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import Container from 'src/components/Layout/Container';
import { updateFeedback } from 'src/redux/actions/feedback';
import { updateRecord, deleteRecord } from 'src/redux/actions/sync';
import { useState } from 'react';
import Iconify from 'src/components/Iconify';
import MuscleHighlighterDrawer from 'src/components/muscleHighlighter/bottomDrawer';
import { getProcessedvideoLink, getThumbnail, getYoutubeVideoTHumbnail } from 'src/utils/convertToLink';
import Model from 'src/components/body-highlight2/src';
import ReactPlayer from 'react-player';
import ReactPlayerVimeo from 'src/components/Labs/ReactPlayerWithFallback';
import axios from 'src/utils/axios';
import api from 'src/utils/api';
import { deleteVideos } from 'src/redux/actions/createProgram';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import union from 'lodash/union';
import CloseRedIcon from 'src/assets/IconSet/CloseRedIcon';
import Slider from '@mui/material/Slider';
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
  const playerRef = useRef(null);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [workoutData, setWorkoutData] = useOutletContext();
  const [showDetails, setShowDwtails] = useState(true);
  const [bottomBox, setBottomBox] = useState(true);

  const videos = useSelector((s) => s.Library.videos);
  let Exercise = workoutData.Exercise[state?.index || 0];
  console.log(Exercise);
  const [currentExercise, setCurrentExercise] = useState(0);

  const [exercise, setExercise] = useState(state.file ? [...state.file] : Exercise?.media);

  const setMuscellData = (mdata) => {
    let AllExercise = [...exercise];
    if (AllExercise[currentExercise]) {
      AllExercise[currentExercise].triggerMuscle = mdata;
    }

    setExercise(AllExercise);
  };

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

  const editExercise = (val, index) => {
    let program = { ...workoutData };
    program.Exercise[index] = {
      ...program.Exercise[index],
      ...val,
    };

    setWorkoutData(program);
  };

  const uploadVideo = async (File) => {
    const file = File;
    let id = new Date().getTime();
    const formData = new FormData();
    formData.append('file', file);

    let upload = axios
      .post(`${api.protocol}${api.baseUrl}${api.getSignedUrl}`, {
        title: file.title || Exercise?.title || file.name,
        name: file.name,
        type: 'application/octet-stream',
      })
      .then((res) => {
        const CancelToken = Axios.CancelToken;
        const source = CancelToken.source();
        dispatch(
          updateRecord(id, {
            source: source,
            ...state,
          }),
        );
        Axios.put(res.data, file, {
          cancelToken: source.token,
          headers: { 'Content-Type': 'application/octet-stream' },
          onUploadProgress: (progressEvent) => {
            dispatch(
              updateRecord(id, {
                upload: upload,

                progress: Math.round((progressEvent.loaded / progressEvent.total) * 100),
                ...state,
              }),
            );
          },
        })
          .then((response) => {
            editExercise(
              {
                media: workoutData.Exercise[state.index].media
                  ? [
                      ...workoutData.Exercise[state.index].media,
                      {
                        file: res.data.split('?')[0],
                        title: file.title || file.name,
                        triggerMuscle: file.triggerMuscle || [],
                      },
                    ]
                  : [
                      {
                        file: res.data.split('?')[0],
                        title: file.title || file.name,
                        triggerMuscle: file.triggerMuscle || [],
                      },
                    ],
              },
              state.index,
            );
            dispatch(deleteRecord(id));
          })
          .catch((err) => {
            dispatch(deleteRecord(id));
          });
      })

      .catch((err) => {
        console.log(err);
        dispatch(deleteRecord(id));
        dispatch(
          updateFeedback({
            message: 'Error uploading video',
            type: 'error',
          }),
        );
      });
  };
  const uploadMediasFromLib = (items) => {
    let program = { ...workoutData };
    let media = [
      ...(program.Exercise[state.index]?.media ? program.Exercise[state.index].media : []),
      ...items.map((i) => ({ file: i.media, type: i.type, title: i.title, triggerMuscle: i.triggerMuscle })),
    ];
    let triggerMuscle = union(program.Exercise[state.index].triggerMuscle, ...items.map((i) => i.triggerMuscle));

    setExercise([
      ...exercise,
      ...items.map((i) => ({ file: i.media, type: i.type, title: i.title, triggerMuscle: i.triggerMuscle })),
    ]);

    program.Exercise[state.index] = {
      ...program.Exercise[state.index],
      media: media,
      triggerMuscle: triggerMuscle,
    };
    setWorkoutData(program);
  };

  const uploadAll = async () => {
    dispatch(updateFeedback({ loading: true }));
    if ([...exercise].filter((i) => !i.file).length == 0) {
      let modifiedWorkoutData = { ...workoutData };
      modifiedWorkoutData.Exercise[state.index] = {
        ...modifiedWorkoutData.Exercise[state.index],
        media: [...exercise],
      };
      setWorkoutData(modifiedWorkoutData);
      dispatch(updateFeedback({ loading: false }));
      navigate(-1);
    } else {
      for (const file of [...exercise].filter((i) => !i.file)) {
        await uploadVideo(file);
      }
      dispatch(updateFeedback({ loading: false }));
      navigate(-1);
    }
  };

  const addNewVideo = (e) => {
    setExercise([...exercise, ...e.target.files]);
  };

  const removeVideo = (indexR) => {
    if (typeof exercise[indexR] == 'string') {
      deleteOneVideo(exercise[indexR]);
    } else {
      if (currentExercise == indexR && currentExercise) {
        setCurrentExercise(currentExercise - 1);
      }
    }
    let AllExercise = [...exercise];
    AllExercise.splice(indexR, 1);
    setExercise(AllExercise);
  };

  const deleteOneVideo = (item) => {
    dispatch(deleteVideos([item.split('https://vimeo.com/')[1]]))
      .then((res) => {
        editExercise({ media: Exercise?.media.filter((i) => i !== item) }, state.index);
      })
      .catch((err) => {
        if (err.response.status == 404) {
          editExercise({ media: Exercise?.media.filter((i) => i !== item) }, state.index);
        }
      });
  };

  useEffect(() => {
    if (Exercise?.media?.length == 0 || !Exercise?.media) {
      editExercise({ triggerMuscle: [] }, state.index);
    }
  }, []);

  let uploadableFiles = [...exercise].filter((i) => !i.file);
  console.log(exercise?.[currentExercise], 'exercise');
  const exerciseUrl = useMemo(() => {
    if (exercise?.[currentExercise]?.file) {
      return getProcessedvideoLink(exercise?.[currentExercise] ? exercise[currentExercise] : '');
    }
    return exercise?.[currentExercise] ? URL.createObjectURL(exercise[currentExercise]) : '';
  }, [exercise, currentExercise]);

  const addVideoToLibrary = (item) => {
    console.log(item);
  };

  const updateMediaTitle = (title, index) => {
    let AllExercise = [...exercise];
    if (AllExercise[currentExercise]) {
      AllExercise[currentExercise].title = title;
    }

    setExercise(AllExercise);
  };

  return (
    <Page title=" Simplified Online Fitness Training ">
      <input
        type="file"
        accept="video/* , image/*"
        style={{ display: 'none' }}
        id={'media-add-new-video'}
        onChange={addNewVideo}
      />
      <RootStyle>
        <Container>
          <div style={Object.assign({}, styles.slide, styles.slide3)}>
            <Box position={'relative'}>
              {' '}
              {exercise?.[currentExercise] &&
              getFileFormat(exercise?.[currentExercise]?.name || exercise?.[currentExercise]) == 'video' ? (
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
                  {exercise?.[currentExercise] && typeof exercise?.[currentExercise]?.file == 'string' ? (
                    <ReactPlayerVimeo
                      url={getProcessedvideoLink(exercise?.[currentExercise] ? exercise[currentExercise] : '')}
                      raw={exercise?.[currentExercise] ? exercise[currentExercise].file : ''}
                      //   controls
                      loop
                      controls={false}
                      // autoPlay={true}
                      responsive={true}
                      playsinline={true}
                      ref={playerRef}
                      playing={isPlaying}
                      onProgress={(progress) => {
                        setProgress(progress.playedSeconds);
                      }}
                      onDuration={(duration) => {
                        setDuration(duration);
                      }}
                      progressInterval={100}
                      width="100vw"
                      height={'100vh'}
                      style={{
                        'zIndex': 0,

                        'display': 'flex',
                        'justifyContent': 'center',
                        'alignItems': 'center',
                        'width': '100vw',
                        'height': '100vh',
                        '& video': {
                          width: '100vw',
                          height: '100vh',
                        },
                      }}
                    />
                  ) : (
                    <ReactPlayerVimeo
                      ref={playerRef}
                      url={exerciseUrl}
                      //   controls
                      loop
                      // ref={playerRef}
                      controls={false}
                      // autoPlay={true}
                      responsive={true}
                      playsinline={true}
                      playing={true}
                      width="100vw"
                      height={'auto'}
                      onProgress={(progress) => {
                        setProgress(progress.playedSeconds);
                      }}
                      onDuration={(duration) => {
                        setDuration(duration);
                      }}
                      progressInterval={100}
                      style={{
                        'display': 'flex',
                        'justifyContent': 'center',
                        'alignItems': 'center',
                        'width': '100vw',
                        'height': '100vh',
                        '& video': {},
                      }}
                    />
                  )}
                </Box>
              ) : exercise?.[currentExercise] ? (
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
                  {exercise?.[currentExercise] && typeof exercise?.[currentExercise].file == 'string' ? (
                    <ImageWithFallback
                      variant="rounded"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                      src={exercise?.[currentExercise].file}
                    />
                  ) : (
                    <ImageWithFallback
                      variant="rounded"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                      src={URL.createObjectURL(exercise[currentExercise])}
                    />
                  )}
                </Box>
              ) : null}
              <Box
                position={'absolute'}
                zIndex={1000}
                width={'100vw'}
                height={'100vh'}
                top={0}
                onClick={() => setShowDwtails(!showDetails)}
              >
                <TopBox sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box
                    display={'flex'}
                    alignItems={'center'}
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
                      Exercise {state.index + 1}
                    </Typography>
                  </Box>
                  {exercise?.[currentExercise] && exercise?.[currentExercise]?.type != 'youtube' && (
                    <Button
                      type="text"
                      disabled={exercise?.[currentExercise]?.isUploading}
                      sx={{ fontSize: 16, color: 'white', px: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addVideoToLibrary(exercise?.[currentExercise]);
                      }}
                    >
                      {videos.find(
                        (vi) =>
                          `https://circled-videos.s3.us-east-1.amazonaws.com/${vi.key}` ==
                          exercise?.[currentExercise]?.file,
                      )
                        ? ''
                        : exercise?.[currentExercise] &&
                          getFileFormat(exercise?.[currentExercise]?.name || exercise?.[currentExercise]) == 'video' &&
                          !exercise?.[currentExercise].isSaved
                        ? exercise?.[currentExercise]?.isUploading
                          ? 'Saving to library'
                          : 'Save to library'
                        : ''}
                    </Button>
                  )}
                </TopBox>
                <Box
                  style={{
                    position: 'absolute',
                    top: '50vh',
                    right: 0,
                    paddingRight: 10,
                  }}
                ></Box>
                {props.clientInstructorView && (
                  <Box
                    pr={1}
                    sx={{ marginTop: '50vh' }}
                    display={'flex'}
                    width={'100%'}
                    justifyContent={'flex-end'}
                    zIndex={2000}
                    position={'absolute'}
                  ></Box>
                )}

                {showDetails && (
                  <BottomBox
                    style={{
                      display: bottomBox ? 'block' : 'none',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MuscleHighlighterDrawer
                      setMData={setMuscellData}
                      data={[
                        {
                          muscles: exercise?.[currentExercise]?.triggerMuscle || [],
                        },
                      ]}
                    >
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                      >
                        <Model
                          data={[
                            {
                              name: Exercise?.title || '',
                              muscles: exercise?.[currentExercise]?.triggerMuscle || [],
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
                              name: Exercise?.title,
                              muscles: exercise?.[currentExercise]?.triggerMuscle || [],
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

                    <CreateMediaCarousel
                      videos={exercise}
                      updateMediaTitle={updateMediaTitle}
                      uploadMediasFromLib={uploadMediasFromLib}
                      currentExercise={currentExercise}
                      setCurrent={(i) => {
                        setCurrentExercise(i);
                      }}
                      state={state}
                      removeVideo={removeVideo}
                    />
                    {exercise?.[currentExercise] &&
                      getFileFormat(exercise?.[currentExercise]?.name || exercise?.[currentExercise]) == 'video' && (
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
                              setIsPlaying(false);
                              playerRef.current.seekTo(value, 'seconds');
                              setProgress(value);
                            }}
                          />
                        </Box>
                      )}
                    <Box
                      display={'flex'}
                      justifyContent="space-between"
                      //   color={"#000"}
                      alignItems={'center'}
                      style={{
                        color: '#959FAB !important',
                      }}
                    >
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                        ml={2}
                      >
                        <Typography
                          variant="subtitle1"
                          color={exercise?.length > 0 ? 'common.white' : 'muted.text'}
                        >
                          {exercise?.length ?? 0}
                        </Typography>

                        <Typography ml={1}>Media uploaded</Typography>
                      </Box>
                      <Button
                        disabled={exercise?.length == 0 || !exercise}
                        variant="contained"
                        onClick={uploadAll}
                        sx={{ height: 40, pl: 3, pr: 3 }}
                      >
                        <Typography
                          variant="body1"
                          color={exercise?.length > 0 ? 'common.white' : 'muted.text'}
                        >
                          {uploadableFiles.length ? 'Upload' : 'Done'}
                        </Typography>
                        &nbsp;
                      </Button>
                    </Box>
                  </BottomBox>
                )}
              </Box>
            </Box>
          </div>
        </Container>
      </RootStyle>
    </Page>
  );
}
const CreateMediaCarousel = (props) => {
  const uploadData = useSelector((s) =>
    Object.values(s.Sync.programs).filter(
      (i) => i.week == props.state.week && i.day == props.state.day && i.index == props.state.index,
    ),
  );

  const inputRef = useRef(null);

  useEffect(() => {
    console.log('currentExercise', inputRef.current);
    inputRef.current.value = props.videos[props.currentExercise]?.title || null;
  }, [props.currentExercise]);
  return (
    <Box>
      <Box
        display={'flex'}
        my={2}
        pt={2}
        pb={1}
        width={'100%'}
        overflow={'auto'}
      >
        <BottomSelection
          title={`Add media`}
          w={props.w}
          d={props.d}
          Program={props.plan}
          onSelection={(videos) => props.uploadMediasFromLib(videos)}
          onUploadNew={() => document.getElementById('media-add-new-video').click()}
        >
          <Box
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
        </BottomSelection>
        {props.videos?.map((item, index) => {
          let uploadLogs = uploadData.find((i) => i.currentExercise == props.currentExercise);
          return (
            <Box
              mx={1}
              height={'66px'}
              width={'100px'}
              display={'flex'}
              flexDirection={'row'}
              alignItems={'center'}
              position={'relative'}
              overflowY={'auto'}
              onClick={() => props.setCurrent(index)}
            >
              <Box position={'relative'}>
                {uploadLogs?.progress ? (
                  <Box
                    position={'absolute'}
                    borderRadius={1}
                    height={'100%'}
                    bgcolor={'rgba(255,255,255,0.7)'}
                    width={'100%'}
                    zIndex={100}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                  >
                    <CircularProgress
                      value={uploadLogs?.progress}
                      size={40}
                    />
                  </Box>
                ) : (
                  ''
                )}
                {props.currentExercise == index && !uploadLogs ? (
                  <IconButton
                    style={{
                      position: 'absolute',
                      top: -16,
                      right: -16,
                      zIndex: 100,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      props.removeVideo(index);
                    }}
                  >
                    <CloseRedIcon />
                  </IconButton>
                ) : (
                  ''
                )}
                <Box
                  borderRadius={1}
                  border={2}
                  borderColor={props.currentExercise == index ? '#fff' : 'rgba(255, 255, 255, 0)'}
                  position={'relative'}
                  overflow={'hidden'}
                  bgcolor={'none'}
                >
                  {getFileFormat(item?.name || item) == 'video' ? (
                    <Box
                      borderRadius={1}
                      overflow={'hidden'}
                      height={66}
                      width={100}
                    >
                      {typeof item.file == 'string' ? (
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
                            'borderRadius': '8px',
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
                          alignItems: 'flex-start',
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
                      width={100}
                    >
                      <ImageWithFallback
                        variant="rounded"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        src={typeof item?.file == 'string' ? item.file : URL.createObjectURL(item)}
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
      <InputBase
        placeholder="Write exercise name here"
        fullWidth
        inputRef={inputRef}
        defaultValue={props.videos[props.currentExercise]?.title}
        onBlur={(e) => {
          props.updateMediaTitle(e.target.value, props.currentExercise);
        }}
        sx={{
          py: 1,
          px: 1.5,
          mb: 3,

          fontSize: 16,
          color: 'common.white',
          border: '1px solid #fff',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: 1,
          background: 'rgba(43, 64, 87, 0.5)',
        }}
      ></InputBase>
      <br />
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
    if (props.link.type == 'youtube') {
      setUrl(getYoutubeVideoTHumbnail(props.link.file));
    } else {
      setUrl(getThumbnail(props.link));
    }
  }, [props.link]);

  return (
    <ImageWithFallback
      onClick={props.onClick}
      variant="rounded"
      style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#fafafa' }}
      src={url || '/images/instructor/exerciseImage.png'}
    />
  );
};
