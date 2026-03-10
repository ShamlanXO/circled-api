// @mui
import { styled } from '@mui/material/styles';
import { useEffect, useState, useRef, useMemo } from 'react';
// components
import Page from 'src/components/Page';
// sections
import { Box, Button, Typography, IconButton, Stack, TextField, InputBase } from '@mui/material';

import Container from 'src/components/Layout/Container';
import Content from 'src/components/Layout/Content';
import Header from 'src/components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';
import { updateLibRecord, deleteLibRecord } from 'src/redux/actions/sync';
import Slider from '@mui/material/Slider';
import { useDispatch, useSelector } from 'react-redux';
import CircularStatic from 'src/components/progress/Circular';
import { useOutletContext } from 'react-router-dom';
import Axios from 'axios';
import axios from 'src/utils/axios';
import api from 'src/utils/api';
import { deleteVideos } from 'src/redux/actions/createProgram';
import { getProcessedvideoLink } from 'src/utils/convertToLink';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import ReactPlayerVimeo from 'src/components/Labs/ReactPlayerWithFallback';
import MuscleHighlighterDrawer from 'src/components/muscleHighlighter/bottomDrawer';
import { updateVideo, addVideo } from 'src/redux/actions/figgsLibrary';
import { updateFeedback } from 'src/redux/actions/feedback';

import Model from 'src/components/body-highlight2/src';
const RootStyle = styled('div')(() => ({
  backgroundColor: '#F2F5F9',
  height: '100%',
}));

const BoxHeader = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
  boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
  borderRadius: '0px 0px 8px 8px',
}));
// ----------------------------------------------------------------------

export default function WorkoutDay() {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const playerRef = useRef(null);
  const navigate = useNavigate();
  const [triggerMuscle, setTriggerMuscel] = useState(state?.triggerMuscle);
  const [title, setTitle] = useState(state?.title);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [source, setSource] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const updateVideoData = () => {
    if (state.mode == 'add') {
      uploadVideo(state.file);
    } else
      dispatch(
        updateVideo({
          ...state,
          title: title,
          triggerMuscle: triggerMuscle,
        }),
      ).then(() => navigate(-1));
  };

  const uploadVideo = async (File) => {
    const file = File;

    let id = new Date().getTime();

    const formData = new FormData();
    formData.append('file', file);

    let upload = axios
      .post(`${api.protocol}${api.baseUrl}${api.getSignedUrl}`, {
        title: title,
        name: file.name,
        type: 'application/octet-stream',
        savedToLibrary: true,
      })
      .then((res) => {
        setIsUploading(true);
        const CancelToken = Axios.CancelToken;
        let source = CancelToken.source();
        setSource(source);
        setProgress(0);
        dispatch(
          updateLibRecord(id, {
            source: source,
            ...state,
            mode: 'upload',
            type: 'video',
            progress: 0,
            title: title,
            id: id,
          }),
        );
        Axios.put(res.data, file, {
          cancelToken: source.token,
          headers: { 'Content-Type': 'application/octet-stream' },
          onUploadProgress: (progressEvent) => {
            setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));

            dispatch(
              updateLibRecord(id, {
                progress: Math.round((progressEvent.loaded / progressEvent.total) * 100),
              }),
            );
          },
        })
          .then((response) => {
            dispatch(deleteLibRecord(id));
            setIsUploading(false);
            setProgress(100);
            dispatch(
              addVideo({
                ...state,
                key: decodeURI(
                  res.data.split('?')[0].replace('https://circled-videos.s3.us-east-1.amazonaws.com/', ''),
                ),
                title: title,
                triggerMuscle: triggerMuscle,
              }),
            ).then(() => navigate(-1));
          })
          .catch((err) => {
            dispatch(deleteLibRecord(id));
            setProgress(0);
            setIsUploading(false);
          });

        navigate(-1);
      })

      .catch((err) => {
        console.log(err);
        setIsUploading(false);
        dispatch(
          updateFeedback({
            message: 'Error uploading video',
            type: 'error',
          }),
        );
      });
  };

  const videoUrl = useMemo(() => {
    if (state?.key) {
      return getProcessedvideoLink(state?.key, '/');
    }
    return URL.createObjectURL(state.file);
  }, [state?.key, state.file]);

  return (
    <RootStyle>
      <Page title=" Simplified Online Fitness Training ">
        <Container>
          {' '}
          <Content
            style={{
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <Header
              position="absolute"
              noColor
            >
              <BoxHeader
                px={2}
                py={2}
                style={{ background: 'linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0.1))' }}
              >
                <Box
                  width={'100%'}
                  display={'flex'}
                  alignItems={'center'}
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                >
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    flexDirection={'row'}
                  >
                    <IconButton
                      onClick={() =>
                        navigate(-1, {
                          replace: true,
                          state: { tab: 1, sds: 2 },
                        })
                      }
                      sx={{ color: 'common.white' }}
                    >
                      <ArrowLeft />
                    </IconButton>
                    <Typography
                      variant="body1"
                      color="text.primary"
                    >
                      {/* Week {state?.week + 1} &gt; */}
                      <Typography
                        component={'span'}
                        variant="h6"
                        color="common.white"
                      >
                        {state.mode == 'edit' ? 'Edit' : 'Upload'} video
                        {/* &nbsp;{days[state?.day]} */}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              </BoxHeader>
            </Header>
            {isUploading ? (
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                height={'100vh'}
              >
                <Stack spacing={1}>
                  <center>
                    <CircularStatic
                      variant="determinate"
                      value={progress}
                      size={120}
                    />
                  </center>
                  <center>
                    <Typography>Uploading video...</Typography>
                  </center>
                  <Button
                    color="error"
                    onClick={() => {
                      source?.cancel();
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Box
                display={'flex'}
                position={'relative'}
              >
                <div
                  className="player-wrapper"
                  style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center' }}
                >
                  <ReactPlayerVimeo
                    //   controls
                    url={videoUrl}
                    raw={'https://circled-videos.s3.us-east-1.amazonaws.com/' + state?.key}
                    loop
                    controls={false}
                    autoPlay={true}
                    responsive={true}
                    playsinline={true}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    onProgress={(progress) => {
                      setProgress(progress.playedSeconds);
                    }}
                    onDuration={(duration) => {
                      setDuration(duration);
                    }}
                    progressInterval={100}
                    ref={playerRef}
                  />
                </div>
                <Box
                  position={'absolute'}
                  bottom={0}
                  width={'100vw'}
                  px={2}
                  style={{ background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0))' }}
                >
                  <Stack mt={4}>
                    <MuscleHighlighterDrawer
                      setMData={(data) => setTriggerMuscel(data)}
                      data={[
                        {
                          name: state?.title || '',
                          muscles: triggerMuscle || [],
                          frequency: 1,
                        },
                      ]}
                      width={150}
                    >
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                      >
                        <Model
                          data={[
                            {
                              name: state?.title || '',
                              muscles: triggerMuscle || [],
                              frequency: 1,
                            },
                          ]}
                          style={{
                            width: '220px',
                            padding: '5px',
                          }}
                          highlightedColors={['#EE3737']}
                        />
                        <Model
                          type="posterior"
                          data={[
                            {
                              name: state?.title,
                              muscles: triggerMuscle || [],
                              frequency: 1,
                            },
                          ]}
                          style={{
                            width: '220px',
                            padding: '5px',
                          }}
                          highlightedColors={['#EE3737']}
                        />
                      </Box>
                    </MuscleHighlighterDrawer>
                    <InputBase
                      value={title}
                      disabled={isUploading}
                      onChange={(e) => setTitle(e.target.value)}
                      defaultValue={state?.title}
                      placeholder="Write here"
                      fullWidth
                      sx={{
                        'mt': 2,
                        'mb': 2,
                        'borderRadius': 1,
                        'py': 0.5,
                        'background': 'rgba(0,0,0,0.5)',
                        'border': '2px solid #fff',
                        '& input': {
                          color: '#fff',
                          paddingLeft: 2,
                          textAlign: 'left',
                        },
                      }}
                      InputProps={{
                        sx: {
                          '& input': {
                            color: '#fff',
                            textAlign: 'left',
                          },
                        },
                      }}
                    />

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

                    <Box
                      mb={4}
                      display={'flex'}
                      justifyContent={'flex-end'}
                      width={'100%'}
                    >
                      <Button
                        sx={{ px: 4, fontSize: 18, fontWeight: 500 }}
                        size={'small'}
                        variant="contained"
                        disabled={isUploading}
                        onClick={updateVideoData}
                      >
                        {state.mode == 'edit' ? 'Save' : 'Upload'}
                      </Button>
                    </Box>
                    {/* <Typography
                                variant="subtitle1"
                                gutterBottom
                                sx={{ mt: 4, mb: 2 }}
                            >
                                Target muscles{' '}
                                <Typography
                                    variant="body"
                                    sx={{
                                        fontWeight: 'normal',
                                        color: 'text.secondary',
                                    }}
                                >
                                    optional
                                </Typography>
                            </Typography> */}
                  </Stack>
                </Box>
              </Box>
            )}
          </Content>
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
