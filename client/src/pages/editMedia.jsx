// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
import Axios from 'axios';
import { useCallback, memo, useEffect, useRef, useMemo } from 'react';
import ImageWithFallback from 'src/components/Labs/ImageWithFallback';
import CloseRedIcon from 'src/assets/IconSet/CloseRedIcon';
import BottomSelection from 'src/components/instructor/exerciseCardBottomSelection';
// sections
import { Box, Typography, Button, IconButton, InputBase, Badge, ButtonBase } from '@mui/material';
import CircularProgress from 'src/components/progress/Circular';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import Container from '../components/Layout/Container';
import { updateFeedback } from 'src/redux/actions/feedback';
import { updateRecord, deleteRecord } from 'src/redux/actions/sync';
import { useState } from 'react';
import Iconify from 'src/components/Iconify';
import MuscleHighlighterDrawer from 'src/components/muscleHighlighter/bottomDrawer';
import { getProcessedvideoLink, getThumbnail, getYoutubeVideoTHumbnail } from 'src/utils/convertToLink';
import Model from '../components/body-highlight2/src';
import ReactPlayer from 'react-player';
import ReactPlayerVimeo from 'src/components/Labs/ReactPlayerWithFallback';
import SwipeableViews from 'react-swipeable-views';
import axios from 'src/utils/axios';
import api from 'src/utils/api';
import { getFileFormat } from 'src/utils/getFileFormat';
import union from 'lodash/union';
import { saveVideoToLib } from 'src/redux/actions/figgsLibrary';
import { deleteVideos } from 'src/redux/actions/createProgram';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import LogsDrawer from 'src/components/client/LogsDrawer';
import Slider from '@mui/material/Slider';
import { title } from 'src/_mock/text';
import { tr } from 'date-fns/locale';
const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: '#3b579d',
}));

const BottomBox = styled('div')(({ theme }) => ({
  background:
    'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 30%,rgba(0, 0, 0, 0.6) 60% ,rgba(0, 0, 0, 0.7) 70%,rgba(0, 0, 0, 9) 100%)',

  padding: '0px 24px 24px 24px',
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

  // const [data, setData] = useState([]);
  const navigate = useNavigate();

  const [Program, updateProgram, mode] = useOutletContext();
  const [showDetails, setShowDwtails] = useState(false);
  const [bottomBox, setBottomBox] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const clientData = useSelector((state) => state.ProgramList.clientData);
  let Exercise = Program.ExercisePlan.weeks[state.week].days[state.day].Exercise[state.index];
  const videos = useSelector((s) => s.Library.videos);
  const [currentExercise, setCurrentExercise] = useState(state.video || 0);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [exercise, setExercise] = useState(state.file ? [...state.file] : Exercise?.media);

  const setMuscellData = (mdata) => {
    // let program = { ...Program }
    // program.ExercisePlan.weeks[state.week].days[state.day].Exercise[
    //     state.index
    // ]?.media?.[currentExercise].triggerMuscle = mdata
    // dispatch(updateProgram({ ExercisePlan: program.ExercisePlan }))

    let AllExercise = [...exercise];
    if (AllExercise[currentExercise]) {
      AllExercise[currentExercise].triggerMuscle = mdata;
    }

    setExercise(AllExercise);
  };
  const reference = useRef(null);
  reference.current = { ...Program };
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
    let program = { ...Program };
    program.ExercisePlan.weeks[state.week].days[state.day].Exercise[index] = {
      ...program.ExercisePlan.weeks[state.week].days[state.day].Exercise[index],
      ...val,
    };
    dispatch(updateProgram({ ExercisePlan: program.ExercisePlan }));
  };

  const uploadMediasFromLib = (items) => {
    let program = { ...Program };
    let media = [
      ...(program.ExercisePlan.weeks[state.week].days[state.day].Exercise[state.index]?.media
        ? program.ExercisePlan.weeks[state.week].days[state.day].Exercise[state.index].media
        : []),
      ...items.map((i) => ({ file: i.media, type: i.type, title: i.title })),
    ];
    let triggerMuscle = union(
      program.ExercisePlan.weeks[state.week].days[state.day].Exercise[state.index].triggerMuscle,
      ...items.map((i) => i.triggerMuscle),
    );

    setExercise([...exercise, ...items.map((i) => ({ file: i.media, type: i.type, title: i.title }))]);

    program.ExercisePlan.weeks[state.week].days[state.day].Exercise[state.index] = {
      ...program.ExercisePlan.weeks[state.week].days[state.day].Exercise[state.index],
      media: media,
      triggerMuscle: triggerMuscle,
    };
    reference.current = program;
    dispatch(updateProgram({ ExercisePlan: program.ExercisePlan }));
  };

  const uploadVideo = async (File, exIndex) => {
    const file = File;

    // let allEx=[...exercise]
    //                allEx[exIndex]={
    //                 ...allEx[exIndex],
    //                 progress:20,
    //                 uploading:true
    //                }
    //                setExercise(allEx)

    let id = new Date().getTime();
    // const response = await axios({
    //   method: "get",
    //   url: `${api.protocol}${api.baseUrl}misc/upload-video?fileSize=${fileSize}`,
    // });

    // const id = response.data.data.upload.upload_link;
    // Create a new tus upload

    const formData = new FormData();
    formData.append('file', file);
    if (exIndex > -1) {
      let allEx = [...exercise];
      allEx[exIndex].isUploading = true;
      setExercise(allEx);
    }
    let upload = axios
      .post(`${api.protocol}${api.baseUrl}${api.getSignedUrl}`, {
        title: Exercise?.title,
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
                currentExercise: exIndex,
              }),
            );
          },
        })
          .then((response) => {
            if (exIndex > -1) {
              let allEx = [...exercise];
              allEx[exIndex].isSaved = true;
              allEx[exIndex].isUploading = false;
              setExercise(allEx);
            }
            editExercise(
              {
                media: Program.ExercisePlan.weeks[state.week].days[state.day].Exercise[state.index].media
                  ? [
                      ...Program.ExercisePlan.weeks[state.week].days[state.day].Exercise[state.index].media,
                      {
                        file: decodeURIComponent(res.data.split('?')[0]),
                        title: File?.title,
                        triggerMuscle: File?.triggerMuscle || [],
                      },
                    ]
                  : [
                      {
                        file: decodeURIComponent(res.data.split('?')[0]),
                        title: File?.title,
                        triggerMuscle: File?.triggerMuscle || [],
                      },
                    ],
              },
              state.index,
            );
            if (File.addTolibrary) {
              addVideoToLibrary({
                file: decodeURIComponent(res.data.split('?')[0]),
                title: File?.title,
                triggerMuscle: File?.triggerMuscle || [],
              });
            }
            dispatch(deleteRecord(id));
          })
          .catch((err) => {
            dispatch(deleteRecord(id));
          });
      })

      .catch((err) => {
        dispatch(deleteRecord(id));
        dispatch(
          updateFeedback({
            message: 'Error uploading video',
            type: 'error',
          }),
        );
      });

    // const upload = new tus.Upload(file, {
    //   endPoint: "https://api.vimeo.com/me/videos",
    //   uploadUrl: response.data.data.upload.upload_link,
    //   retryDelays: [0, 3000, 5000, 10000, 20000],
    //   metadata: {
    //     filename: file.name,
    //     filetype: file.type,
    //   },
    //   headers: {},
    //   onError: function (error) {},
    //   onProgress: function (bytesUploaded, bytesTotal) {
    //     let percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);

    //     dispatch(
    //       updateRecord(id, {
    //         upload: upload,
    //         progress: percentage,
    //         ...state,
    //         details: {
    //           url: response.data.data.link,
    //         },
    //       })
    //     );
    //   },
    //   onSuccess: function () {
    //     editExercise(
    //       {
    //         media: Program.ExercisePlan.weeks[state.week].days[state.day]
    //           .Exercise[state.index].media
    //           ? [
    //               ...Program.ExercisePlan.weeks[state.week].days[state.day]
    //                 .Exercise[state.index].media,
    //               response.data.data.link,
    //             ]
    //           : [response.data.data.link],
    //       },
    //       state.index
    //     );
    //     dispatch(deleteRecord(id));
    //   },
    // });

    // Start the upload
    // upload.start();
  };
  const updateMediaTitle = (title, index) => {
    // let program = { ...Program }
    // program.ExercisePlan.weeks[state.week].days[state.day].Exercise[state.index].media[index].title = title
    // dispatch(updateProgram({ ExercisePlan: program.ExercisePlan }))
    let AllExercise = [...exercise];
    AllExercise[index].title = title;
    setExercise(AllExercise);
  };

  const uploadAll = async () => {
    dispatch(updateFeedback({ loading: true }));
    for (const file of [...exercise].filter((i) => !i.file && !i.isSaved)) {
      await uploadVideo(file);
    }
    dispatch(updateFeedback({ loading: false }));
    navigate(-1);
  };

  const addNewVideo = (e) => {
    setExercise([...exercise, ...e.target.files]);
  };

  const removeVideo = (indexR) => {
    if (typeof exercise[indexR].file == 'string') {
      deleteOneVideo(exercise[indexR].file);
      setCurrentExercise(currentExercise - 1);
    } else {
      if (currentExercise == indexR && currentExercise) {
        setCurrentExercise(currentExercise - 1);
      }
    }
    let AllExercise = [...exercise];
    AllExercise.splice(indexR, 1);
    setExercise(AllExercise);
  };
  const handleOnReady = (player) => {
    const videoElement = player.getInternalPlayer();
    if (videoElement) {
      // Get video height when the player is ready
      const height = videoElement.videoHeight;
      const width = videoElement.videoWidth;
      const ratio = width / height;
      const newHeight = `calc(100vw / ${ratio})`;

      if (height) {
        setVideoHeight(newHeight);
      } else {
        // setVideoHeight('auto');
      }
    }
  };

  const deleteOneVideo = (item) => {
    editExercise({ media: Exercise?.media.filter((i) => i.file !== item) }, state.index);
    // dispatch(deleteVideos([item.split('https://vimeo.com/')[1]]))
    //     .then((res) => {
    //         editExercise(
    //             { media: Exercise?.media.filter((i) => i !== item) },
    //             state.index
    //         )
    //     })
    //     .catch((err) => {
    //         if (err.response.status == 404) {
    //             editExercise(
    //                 { media: Exercise?.media.filter((i) => i !== item) },
    //                 state.index
    //             )
    //         }
    //     })
  };

  useEffect(() => {
    if (Exercise?.media?.length == 0 || !Exercise?.media) {
      editExercise({ triggerMuscle: [] }, state.index);
    }
  }, []);

  let uploadableFiles = [...exercise].filter((i) => !i.file);

  const addVideoToLibrary = (item) => {
    if (item.name) {
      item.addTolibrary = true;

      uploadVideo(item, currentExercise);

      return;
    }
    let newStr = item.file.replace('https://circled-videos.s3.us-east-1.amazonaws.com/', '');

    dispatch(
      saveVideoToLib({
        key: newStr,
        name: item.title || 'Untitled',
        title: item.title,
        triggerMuscle: item.triggerMuscle,
      }),
    ).then(() =>
      dispatch(
        updateFeedback({
          snackbar: true,
          severity: 'success',
          message: 'Video saved to library',
        }),
      ),
    );
  };

  const exerciseUrl = useMemo(() => {
    if (exercise?.[currentExercise]?.file) {
      return getProcessedvideoLink(exercise?.[currentExercise] ? exercise[currentExercise] : '');
    }
    return exercise?.[currentExercise] ? URL.createObjectURL(exercise[currentExercise]) : '';
  }, [exercise, currentExercise]);

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
          {props.mode !== 'newMedia' ? (
            <SwipeableViews
              axis="y"
              containerStyle={styles.slideContainer}
              enableMouseEvents
            >
              {Exercise?.media?.map((item, index) => (
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
                      {props.mode == 'newMedia' ? (
                        <ReactPlayer
                          url={URL.createObjectURL(state.file)}
                          //   controls
                          loop
                          controls={false}
                          autoPlay={true}
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
                        <ReactPlayerVimeo
                          url={getProcessedvideoLink(item)}
                          raw={item.file}
                          //   controls
                          loop
                          controls={false}
                          autoPlay={true}
                          responsive={true}
                          playsinline={true}
                          playing={true}
                          width="100vw"
                          height={'100vh'}
                          onProgress={(progress) => {
                            setProgress(progress.playedSeconds);
                          }}
                          onDuration={(duration) => {
                            setDuration(duration);
                          }}
                          style={{
                            'zIndex': 0,
                            'position': 'absolute',
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
                      )}
                      {/* <div
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "100%",
                        width: "100%",
                        opacity: 1,
                      }}
                    >
                      <Box
                        display={"flex"}
                        flexDirection="column"
                        justifyContent={"center"}
                        alignItems="center"
                        height="100%"
                        onClick={() => {
                          if (isPlaying.play && isPlaying.index == index) {
                            setIsPlaying({ play: false, index: null });
                          }
                        }}
                      >
                        {isPlaying.index != index && (
                          <IconButton
                            onClick={() =>
                              setIsPlaying({ play: true, index: index })
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
                    </div> */}
                    </Box>
                    <Box
                      position={'absolute'}
                      zIndex={2000}
                      width={'100vw'}
                      height={'100vh'}
                      top={0}
                      onClick={() => setShowDwtails(!showDetails)}
                    >
                      <TopBox>
                        <IconButton
                          onClick={() => navigate(-1)}
                          sx={{
                            color: 'common.white',
                          }}
                        >
                          <ArrowLeft />
                        </IconButton>
                        &nbsp;
                        <Typography
                          variant="subtitle1"
                          color="common.white"
                        >
                          Exercise {currentExercise + 1}
                        </Typography>
                      </TopBox>

                      <Box
                        style={{
                          position: 'absolute',
                          top: '50vh',
                          right: 0,
                          zIndex: 200,
                          paddingRight: 10,
                        }}
                      ></Box>

                      {showDetails && (
                        <BottomBox onClick={(e) => e.stopPropagation()}>
                          <MuscleHighlighterDrawer
                            setMData={setMuscellData}
                            data={
                              [
                                {
                                  muscles: Exercise?.triggerMuscle,
                                },
                              ] || []
                            }
                          >
                            <Box
                              display={'flex'}
                              alignItems={'center'}
                            >
                              <Model
                                data={[
                                  {
                                    name: Exercise?.title || '',
                                    muscles: Exercise?.triggerMuscle || [],
                                    frequency: 1,
                                  },
                                ]}
                                style={{
                                  width: '68px',
                                  padding: '5px',
                                }}
                                highlightedColors={['#2F86EB']}
                              />
                              <Model
                                type="posterior"
                                data={[
                                  {
                                    name: Exercise?.title,
                                    muscles: Exercise?.triggerMuscle || [],
                                    frequency: 1,
                                  },
                                ]}
                                style={{
                                  width: '68px',
                                  padding: '5px',
                                }}
                                highlightedColors={['#FB8500']}
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
                              defaultValue={Exercise?.title}
                              onBlur={(e) =>
                                editExercise(
                                  {
                                    title: e.target.value,
                                  },
                                  state.index,
                                )
                              }
                              sx={{
                                py: 0.25,
                                fontSize: 18,
                                color: 'common.white',
                              }}
                            />
                            <InputBase
                              placeholder="Description here"
                              fullWidth
                              defaultValue={Exercise?.note}
                              onClick={(e) => e.preventDefault()}
                              onBlur={(e) =>
                                editExercise(
                                  {
                                    note: e.target.value,
                                  },
                                  state.index,
                                )
                              }
                              multiline
                              minRows={3}
                              maxRows={3}
                              sx={{
                                py: 0.25,
                                fontSize: 16,
                                color: 'common.white',
                              }}
                            />
                          </Box>
                          <Box
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            width={'100%'}
                            height={'100%'}
                          ></Box>
                          <Box
                            display={'flex'}
                            justifyContent="center"
                            //   color={"#000"}
                            style={{
                              color: '#959FAB !important',
                            }}
                          >
                            {props.mode == 'newMedia' ? (
                              <Button
                                variant="contained"
                                onClick={uploadVideo}
                              >
                                <Typography
                                  variant="body1"
                                  color="common.white"
                                >
                                  Done
                                </Typography>
                                &nbsp;
                                <Iconify
                                  icon="iconoir:fast-arrow-down"
                                  color="common.white"
                                  width="24px"
                                  height="24px"
                                />
                              </Button>
                            ) : (
                              <Button variant="contained">
                                <Typography
                                  variant="body1"
                                  color="common.white"
                                >
                                  Media&nbsp;
                                  {index + 1 + '/' + Exercise?.media?.length}
                                </Typography>
                                &nbsp;
                                <Iconify
                                  icon="iconoir:fast-arrow-down"
                                  color="common.white"
                                  width="24px"
                                  height="24px"
                                />
                              </Button>
                            )}
                          </Box>
                        </BottomBox>
                      )}
                    </Box>
                  </Box>
                </div>
              ))}
            </SwipeableViews>
          ) : (
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
                    {exercise?.[currentExercise] && typeof exercise?.[currentExercise].file == 'string' ? (
                      <ReactPlayerVimeo
                        url={getProcessedvideoLink(exercise?.[currentExercise] ? exercise[currentExercise] : '')}
                        raw={exercise?.[currentExercise] ? exercise[currentExercise].file : ''}
                        //   controls
                        loop
                        controls={true}
                        autoPlay={true}
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
                        onReady={handleOnReady}
                        progressInterval={100}
                        width="100vw"
                        height={videoHeight ? videoHeight : undefined}
                        style={{
                          'zIndex': 0,

                          'display': 'flex',
                          'justifyContent': 'center',
                          'alignItems': 'center',
                          'width': '100vw',

                          '& video': {
                            width: '100vw',
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
                        controls={true}
                        autoPlay={true}
                        responsive={true}
                        playsinline={true}
                        playing={true}
                        width="100vw"
                        onReady={handleOnReady}
                        height={videoHeight ? videoHeight : undefined}
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

                          '& video': {
                            width: '100vw',
                          },
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
                <TopBox sx={{ position: 'absolute', top: 0, left: 0, zIndex: 2000, width: '100vw',
   display: 'flex',
   justifyContent: 'space-between',



                 }}>
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
                  {exercise?.[currentExercise] && exercise?.[currentExercise].type != 'youtube' && (
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
                {/* {props.clientInstructorView && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 2000,
                      width: '100vw',
                      height: '50vh',
                      pr: 2,
                    }}
                  >
                    <LogsDrawer
                      {...state}
                      exerciseIndex={state.index}
                      Exercise={Program.ExercisePlan.weeks[state.week].days[state.day].Exercise}
                      orderId={clientData?._id}
                    ></LogsDrawer>
                  </Box>
                )} */}
                <Drawer
                  open={showDetails}
                  anchor="bottom"
                  sx={{
                    '& .MuiDrawer-paper': {
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      width: '100vw',
                      height: 'auto',
                      minHeight: '20vh',
                    },
                    '& .MuiBackdrop-root': {
                      backgroundColor: 'transparent',
                      backdropFilter: 'none',
                    },
                  }}
                  onClose={() => setShowDwtails(false)}
                >
                  <BottomBox onClick={(e) => e.stopPropagation()}>
                    {/* <Box
                      display={'flex'}
                      justifyContent={'flex-end'}
                    >
                      <IconButton
                        onClick={() => setShowDwtails(false)}
                        sx={{
                          fontColor: '#fff',
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 32, color: '#fff' }} />
                      </IconButton>
                    </Box> */}
                    {/* <MuscleHighlighterDrawer
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
                    </MuscleHighlighterDrawer> */}

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
                        {/* <Badge
                                                        badgeContent={ */}
                        <Typography
                          variant="subtitle1"
                          color={exercise?.length > 0 ? 'common.white' : 'muted.text'}
                        >
                          {exercise?.length ?? 0}
                        </Typography>
                        {/* }
                                                        showZero
                                                        color={
                                                            exercise?.length
                                                                ? 'primary'
                                                                : 'muted'
                                                        }
                                                    ></Badge> */}
                        <Typography
                          color={exercise?.length > 0 ? 'common.white' : 'muted.text'}
                          ml={1}
                        >
                          Media uploaded
                        </Typography>
                      </Box>
                      <Button
                        disabled={exercise?.length == 0 || !exercise}
                        variant="contained"
                        // color={exercise?.length ? "primary" : "muted"}
                        onClick={uploadAll}
                        sx={{ height: 40, pl: 3, pr: 3 }}
                        // endIcon={
                        //     <Iconify
                        //         icon="ph:caret-circle-right-light"
                        //         color={
                        //             exercise?.length >
                        //             0
                        //                 ? 'common.white'
                        //                 : 'muted.text'
                        //         }
                        //         width="24px"
                        //         height="24px"
                        //     />
                        // }
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
                </Drawer>
                {!showDetails && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      zIndex: 2000,
                      mb: 4,
                      width: '100vw',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <IconButton onClick={() => setShowDwtails(true)}>
                      <Iconify
                        icon="bxs:chevrons-up"
                        color="common.white"
                        width={24}
                        height={24}
                      />
                    </IconButton>
                    <Typography
                      variant="subtitle1"
                      color="common.white"
                    >
                      Show details
                    </Typography>
                  </Box>
                )}
              </Box>
            </div>
          )}
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
    inputRef.current.value = props.videos[props.currentExercise]?.title || null;
  }, [props.currentExercise]);

  return (
    <Box>
      <Box
        display={'flex'}
        mb={2}
        pt={2}
        overflow={'auto'}
        width={'100%'}
        pb={1}
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
            // onClick={() =>
            //     document.getElementById('media-add-new-video').click()
            // }
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
          mb: 1,

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
    } else setUrl(getThumbnail(props.link));
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
