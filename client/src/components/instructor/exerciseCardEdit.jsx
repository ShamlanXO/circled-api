/*
 Copyright ©. All Rights Reserved. Confidential and proprietary.
 XYZ. Contact address: XYZ@xyz.pa .
 */
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
  ListItemButton,
  Popover,
  Popper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Button,
  Box,
  InputBase,
  ButtonBase,
  Divider,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import CloseRedIcon from 'src/assets/IconSet/CloseRedIcon';
import { useEffect, useRef, useState } from 'react';
import Iconify from '../Iconify';
import MenuPopover from '../MenuPopover';
import { useSelector, useDispatch } from 'react-redux';
import { deleteVideos } from 'src/redux/actions/createProgram';
import axios from 'axios';
import { computePath } from 'src/utils/routepath';
import { useConfirmationModalContext } from 'src/utils/Modal';
import { useLocation, useNavigate } from 'react-router';
import { getThumbnail, getYoutubeVideoTHumbnail } from 'src/utils/convertToLink';
import CircularProgress from 'src/components/progress/Circular';
import CameraIcon from 'src/assets/IconSet/camera';
import Delete from 'src/assets/IconSet/Delete';
import MessageCard from '../client/MessageCard';
import LogsDrawer from 'src/components/client/LogsDrawer';
import Log from 'src/assets/IconSet/LogFilled';
import MediaIcon from 'src/assets/IconSet/MediaIcon';
import Send from 'src/assets/IconSet/Send';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { saveVideoToLib } from 'src/redux/actions/figgsLibrary';
import Profile from 'src/assets/IconSet/Profile';
import { updateStatus } from 'src/redux/actions/clientExercise';
import ImageWithFallback from '../Labs/ImageWithFallback';
import UploadIcon from 'src/assets/IconSet/UploadIcon';
import SaveCheck from 'src/assets/IconSet/SaveCheck';
import BottomAction from 'src/components/common/BottomAction';
import BottomSelection from 'src/components/instructor/exerciseCardBottomSelection';
import { updateFeedback } from 'src/redux/actions/feedback';
import PlaySquare from 'src/assets/IconSet/PlarSquare';
import AddVideoIcon from 'src/assets/IconSet/AddVideosIcon';
import { getFileFormat } from 'src/utils/getFileFormat';
const Accordion = styled((props) => (
  <MuiAccordion
    disableGutters
    elevation={0}
    square
    {...props}
  />
))(({ theme }) => ({
  'boxShadow': 'none',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    boxShadow: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ExpandMoreIcon />}
    {...props}
  />
))(({ theme }) => ({
  'boxShadow': 'none',
  'margin': '0 0 0 0',
  'alignItems': 'center',
  'marginBottom': theme.spacing(1),
  // flexDirection: "row-reverse",

  '& .MuiAccordionSummary-content': {
    marginBottom: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(0),
  paddingTop: theme.spacing(2),
  elevation: 0,
}));
const RootStyle = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  // padding: '16px 16px',
  // margin: "12px 0",
  // border: '1.5px solid #C3CBD9',

  // boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
  borderRadius: '8px',
}));
const ProfilePic = styled('div')(({ theme }) => ({
  width: '24px',
  height: '24px',
  borderRadius: '24px',
}));

const CustomButtton = styled(Button)(({ theme }) => ({
  // padding: '10px 20px',
  height: '44px',
  borderRadius: '4px',
  color: theme.palette.error.light,
  backgroundColor: theme.palette.error.lighter,
  margin: '10px 10px 0 0',
}));
const SpaceBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
}));

export default function UpdateWorkoutDay(props) {
  const [openedPopover, setOpenedPopover] = useState(false);
  const popoverAnchor = useRef(null);
  const { newCard } = props;
  const [exerciseName, setExerciseName] = useState('');
  const [media, setmedia] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState('');
  const [latestLog, setLatestLog] = useState({});
  const [logCount, setLogCount] = useState(0);
  const { state, pathname } = useLocation();
  const buttonRef = useRef(null);
  const Profile = useSelector((s) => s.Profile);
  const { showConfirmationModal } = useConfirmationModalContext();
  const AtheletePlan = useSelector((s) => s.AtheletePlan);
  const videos = useSelector((s) => s.Library.videos);
  const Order = useSelector((s) => s.ProgramList.clientData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uploadData = useSelector((s) =>
    Object.values(s.Sync.programs).filter((i) =>
      props?.individualWorkout
        ? i.index == props?.index && i?.workoutId == props?._id
        : i.week == props.w && i.day == props.d && i.index == props.index,
    ),
  );

  //    const [topic, setTopic] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    //  props.selectTopic(topic);
    setOpenedPopover(false);
  };

  const deleteOneVideo = (item) => {
    dispatch(deleteVideos([item.split('https://vimeo.com/')[1]]))
      .then((res) => {
        props.editExercise({
          media: props.plan?.media.filter((i) => i !== item),
        });
      })
      .catch((err) => {
        if (err.response.status == 404) {
          props.editExercise({
            media: props.plan?.media.filter((i) => i !== item),
          });
        }
      });
  };

  const removeVideo = (index) => {
    showConfirmationModal(
      'Are you sure?',
      `You are going to delete this video. This process is irreversible`,
      'Delete',
    ).then((res) => {
      if (res) {
        const currentVideos = props.plan?.media;
        const newVideos = currentVideos.filter((i, indexR) => indexR !== index);
        props.editExercise({
          media: newVideos,
        });
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      if (state?.open & (props.index == state?.exercise)) {
        buttonRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);

    //buttonRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
    if (uploadData.length) {
      setTimeout(() => {
        buttonRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  const onDeleteExercise = () => {
    if (props.plan.title || props.plan.note) {
      showConfirmationModal(
        'Are you sure?',
        `You are going to delete this exercise. This process is irreversible`,
        'Delete',
      ).then((res) => {
        if (res) {
          uploadData.map((item, index) => {
            item.source.cancel();
          });
          props.onClickDelete();
        }
      });
    } else {
      uploadData.map((item, index) => {
        item.source.cancel();
      });
      props.onClickDelete();
    }
  };

  const addVideoToLibrary = (item) => {
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
          message: 'Video saved',
        }),
      ),
    );
  };

  const onClickToggleComplete = () => {
    if (AtheletePlan?.stats?.[`${props.w}-${props.d}-${props.index}`]) {
      dispatch(
        updateStatus({
          _id: AtheletePlan.currentPlan,
          stats: {
            ...AtheletePlan.stats,
            [props.w + '-' + props.d + '-' + props.index]: false,
          },
          currentWeek: props.w,
          currentDay: props.d,
        }),
      );
    } else {
      dispatch(
        updateStatus({
          _id: AtheletePlan.currentPlan,
          stats: {
            ...AtheletePlan.stats,
            [props.w + '-' + props.d + '-' + props.index]: true,
          },
          currentWeek: props.w,
          currentDay: props.d,
        }),
      );
    }
  };

  //let sortedItems=Object.values(s.Sync.programs).filter(i=>i.week==props.w&&i.day==props.d&&i.index==props.index)
  return (
    <RootStyle
      ref={buttonRef}
      //sx={{ border: !props.activeExercise ? '1.5px solid #C3CBD9' : '3px solid #2F86EB' }}
    >
      <Box>
        {props.clientSide ? (
          <SpaceBox>
            <Box display={'flex'}>
              <Typography
                color="text.primary"
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                  my: 0.5,
                  background: 'rgba(245, 247, 250, 1)',
                  color: 'rgba(109, 123, 143, 1)',
                  p: 1,
                  px: 2,
                  borderRadius: 1,
                }}
              >
                Exercise {props.index + 1}
              </Typography>
            </Box>
            {/* <Typography variant="subtitle1" color="text.primary">
                 Warmup
               </Typography> */}
            &nbsp; &nbsp;
            {props.mode !== 'workout' && (
              <>
                {!props.clientSide ? null : AtheletePlan?.stats?.[`${props.w}-${props.d}-${props.index}`] ? (
                  <Iconify
                    icon="icon-park-outline:check-one"
                    color="primary.main"
                    sx={{ width: 32, height: 32 }}
                    onClick={onClickToggleComplete}
                  />
                ) : (
                  <Iconify
                    icon="prime:circle"
                    color="text.secondary"
                    sx={{ width: 36, height: 36, color: 'rgba(195, 203, 217, 1)' }}
                    onClick={onClickToggleComplete}
                  />
                )}
              </>
            )}
          </SpaceBox>
        ) : (
          ''
        )}
        {/* <Divider sx={{ mt: 1 }} /> */}
        <InputBase
          placeholder="Exercise name"
          fullWidth
          readOnly={props.clientSide}
          value={props.plan.title}
          sx={{
            textTransform: 'capitalize',
            fontWeight: 'bold',
            mt: 1.5,
            fontSize: 18,
          }}
          multiline
          onChange={(e) => props.editExercise({ title: e.target.value })}
        />
        <Box sx={{ mt: 2 }}>
          <InputBase
            placeholder="sets / repetitions / details"
            value={props.clientSide ? props.plan.note.replace(/\n\s*\n\s*$/g, '\n') : props.plan.note}
            onChange={(e) => props.editExercise({ note: e.target.value })}
            fullWidth
            readOnly={props.clientSide}
            multiline
            sx={{ fontSize: 16 }}
            minRows={3}
          />
        </Box>
        {/* <Divider sx={{ my: 2 }} /> */}
        {props.clientSide && props.plan?.media?.length == 0 ? (
          ''
        ) : (
          <Box
            display="flex"
            mt={2}
            mb={1}
            alignItems={'center'}
          >
            <MediaIcon />
            &nbsp;{' '}
            <Typography
              color="text.primary"
              sx={{ ml: 0.5 }}
            >
              Media uploaded {props.plan?.media?.length || 0}
            </Typography>
          </Box>
        )}
        {!props.clientSide && <Box
          mt={2}
          display="flex"
          flexWrap={'wrap'}
          justifyContent={'space-between'}
          alignItems={'flex-end'}
          overflowX={'scroll'}
          style={{ overflowX: 'auto' }}
          py={2}
        >
          <Box
            display="flex"
            alignItems={'center'}
          >
            {props.plan?.media?.map((i, index) =>
              props.clientSide ? (
                <Box
                  onClick={() =>
                    props.onMediaClick
                      ? props.onMediaClick(i)
                      : !props.clientSide
                      ? navigate(computePath(props.mode, '/workoutDay/editExercise', props.Program._id), {
                          state: {
                            week: props.w,
                            day: props.d,
                            index: props.index,
                            video: index,
                          },
                        })
                      : props.mode == 'workout'
                      ? navigate('viewExercise', {
                          state: {
                            index: props.index,
                            video: index,
                          },
                        })
                      : navigate('/client/myWorkoutCalendar/workoutDay/exerciseView', {
                          state: {
                            week: props.w,
                            day: props.d,
                            index: props.index,
                            video: index,
                          },
                        })
                  }
                >
                  {getFileFormat(i) == 'video' ? <VideoImage link={i} /> : <ImageItem link={i} />}
                </Box>
              ) : (
                <>
                  {getFileFormat(i) == 'video' ? (
                    i.type == 'youtube' ? (
                      <Box
                        position={'relative'}
                        onClick={() =>
                          props.onMediaClick
                            ? props.onMediaClick(i)
                            : !props.clientSide
                            ? navigate(computePath(props.mode, '/workoutDay/editExercise', props.Program._id), {
                                state: {
                                  week: props.w,
                                  day: props.d,
                                  index: props.index,
                                  video: index,
                                },
                              })
                            : navigate('/client/myWorkoutCalendar/workoutDay/exerciseView', {
                                state: {
                                  week: props.w,
                                  day: props.d,
                                  index: props.index,
                                  video: index,
                                },
                              })
                        }
                      >
                        <IconButton
                          style={{
                            position: 'absolute',
                            top: -16,
                            right: -4,
                            zIndex: 100,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeVideo(index);
                          }}
                        >
                          <CloseRedIcon />
                        </IconButton>
                        <VideoImage link={i} />
                      </Box>
                    ) : (
                      <BottomAction
                        items={[
                          {
                            title: 'Play video',
                            icon: (
                              <PlaySquare
                                icon={'material-symbols:play-circle'}
                                sx={{ mr: 2 }}
                                color="text.primary"
                                width={32}
                                height={32}
                              />
                            ),
                            onClick: () =>
                              props.onMediaClick
                                ? props.onMediaClick(i)
                                : !props.clientSide
                                ? navigate(computePath(props.mode, '/workoutDay/editExercise', props.Program._id), {
                                    state: {
                                      week: props.w,
                                      day: props.d,
                                      index: props.index,
                                      video: index,
                                    },
                                  })
                                : navigate('/client/myWorkoutCalendar/workoutDay/exerciseView', {
                                    state: {
                                      week: props.w,
                                      day: props.d,
                                      index: props.index,
                                      video: index,
                                    },
                                  }),
                          },
                          {
                            title: videos.find(
                              (vi) => `https://circled-videos.s3.us-east-1.amazonaws.com/${vi.key}` == i.file,
                            )
                              ? 'Saved to library'
                              : 'Save video to library',
                            icon: videos.find(
                              (vi) => `https://circled-videos.s3.us-east-1.amazonaws.com/${vi.key}` == i.file,
                            ) ? (
                              <SaveCheck
                                icon="icon-park-outline:dumbbell"
                                sx={{ mr: 2 }}
                              />
                            ) : (
                              <UploadIcon
                                icon="icon-park-outline:dumbbell"
                                sx={{ mr: 2 }}
                              />
                            ),
                            onClick: () => addVideoToLibrary(i),
                          },
                        ]}
                        title={`Exercise ${props.index + 1} | ${i.title || 'Untitled'}`}
                      >
                        {getFileFormat(i) == 'video' ? (
                          <Box position={'relative'}>
                            <IconButton
                              style={{
                                position: 'absolute',
                                top: -16,
                                right: -4,
                                zIndex: 100,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeVideo(index);
                              }}
                            >
                              <CloseRedIcon />
                            </IconButton>
                            <VideoImage
                              link={i}
                              removeVideo={removeVideo}
                              index={index}
                            />
                          </Box>
                        ) : (
                          <ImageItem
                            link={i}
                            removeVideo={removeVideo}
                            index={index}
                          />
                        )}
                      </BottomAction>
                    )
                  ) : (
                    <Box
                      position={'relative'}
                      onClick={() =>
                        props.onMediaClick
                          ? props.onMediaClick(i)
                          : !props.clientSide
                          ? navigate(computePath(props.mode, '/workoutDay/editExercise', props.Program._id), {
                              state: {
                                week: props.w,
                                day: props.d,
                                index: props.index,
                                video: index,
                              },
                            })
                          : navigate('/client/myWorkoutCalendar/workoutDay/exerciseView', {
                              state: {
                                week: props.w,
                                day: props.d,
                                index: props.index,
                                video: index,
                              },
                            })
                      }
                    >
                      <IconButton
                        style={{
                          position: 'absolute',
                          top: -16,
                          right: -4,
                          zIndex: 100,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVideo(index);
                        }}
                      >
                        <CloseRedIcon />
                      </IconButton>
                      <ImageItem link={i} />
                    </Box>
                  )}
                </>
              ),
            )}
            {uploadData.map((item, index) => (
              <Box
                backgroundColor="#f0f0f0"
                borderRadius={1}
                display={'flex'}
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: '60px',
                  height: '60px',
                  marginRight: 1,
                }}
              >
                <CircularProgress value={item.progress} />
              </Box>
            ))}
          </Box>
          {/* 
          {props.plan?.media?.length ? (
            <Box
              onClick={() =>
                !props.clientSide
                  ? navigate(
                      computePath(
                        props.mode,
                        "/workoutDay/editExercise",
                        props.Program._id
                      ),
                      {
                        state: {
                          week: props.w,
                          day: props.d,
                          index: props.index,
                        },
                      }
                    )
                  : null
              }
              display="flex"
              alignItems={"center"}
            >
              <Iconify
                icon={"gridicons:image-multiple"}
                color="text.secondary"
                width={24}
                height={24}
              />
              &nbsp;{" "}
              <Typography variant="body1" color="text.secondary">
                {props.plan?.media?.length || 0} Media Attached
              </Typography>
            </Box>
          ) : null} */}
        </Box>}
        <Box>
          {!props.clientSide && (
            <BottomSelection
              title={`Exercise ${props.index + 1} `}
              w={props.w}
              d={props.d}
              Program={props.plan}
              onUploadNew={() => document.getElementById(props.w + '-' + props.d + '-' + props.index).click()}
              onSelection={(videos) => props.uploadMediasFromLib(videos)}
            >
              <Box
                display="flex"
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                width={'100%'}
                border={'2px dashed rgba(195, 203, 217, 1)'}
                p={3}
                borderRadius={1}
                mt={2}
                mb={2}
              >
                <Iconify
                  icon={'meteor-icons:image'}
                  sx={{ fontSize: 32, mb: 1, color: 'rgba(109, 123, 143, 1)' }}
                />

                <Typography
                  gutterBottom
                  sx={{ color: 'rgba(109, 123, 143, 1)' }}
                >
                  Add media
                </Typography>
                <Typography
                  align="center"
                  sx={{ color: 'rgba(149, 163, 184, 1)', fontSize: 14 }}
                >
                  Click to upload exercise videos or images
                </Typography>
                <Box>
                  <input
                    type="file"
                    accept="video/* , image/*"
                    style={{ display: 'none' }}
                    id={props.w + '-' + props.d + '-' + props.index}
                    onChange={props.onUploadNewMedia}
                  />
                  {/* <ButtonBase
                                            aria-label="upload picture"
                                            component="span"
                                            sx={{
                                                //border: "1.2px dashed #6D7B8F",
                                                borderRadius: '8px',
                                                p: 1,
                                                width: 67,
                                                border: '1.5px solid #2F86EB',
                                                height: 66,
                                                mr: 1,
                                            }}
                                        > */}

                  {/* </ButtonBase> */}
                </Box>
              </Box>
            </BottomSelection>
          )}
        </Box>
       

        {props.mode !== 'edit' && props.mode !== 'send' && props.mode !== 'create' && props.mode !== 'workout' && (
               <LogsDrawer
               week={props.w}
               setLogCount={(_) => setLogCount(_)}
               onClose={() =>
                 navigate(pathname, {
                   state: {
                     open: false,
                     week: props.w,
                     day: props.d,
                     exercise: props.index,
                   },
                   replace: true,
                 })
               }
               openLogs={state.open & (props.index == state.exercise)}
               setLatestLog={setLatestLog}
               day={props.d}
               title={props.plan.title}
               exerciseIndex={props.index}
               Exercise={props.plan}
               Program={props.Program}
               orderId={props.mode ? Order._id : AtheletePlan?.currentPlan}
             >
          <Box
            borderRadius={2}
            onClick={() => {
              navigate(pathname, {
                state: {
                  open: true,
                  week: props.w,
                  day: props.d,
                  exercise: props.index,
                },
                replace: true,
              });
            }}
        
          >
          
                                <Divider sx={{ mt: 2, mb: 3,borderColor: '#C3CBD9' }} />
            <Box
              display={'flex'}
              alignItems={'center'}
              mb={3}
            >
              <Log sx={{ fontSize: 24 }} />
              <Typography ml={1} sx={{fontWeight: '500', fontSize: '18px'}}>
             Comments {logCount ? `(${logCount})` : ''} 
          
              </Typography>
            </Box>
            <Divider sx={{ mt: 2, mb: 3,borderColor: '#C3CBD9' }} />

            </Box>
            </LogsDrawer>)}

        {props.clientSide && props.mode !== 'workout' ? (
          <Box
            mb={1}
            mt={6}
          >
            <Button
              fullWidth
              variant="contained"
  
              disabled={AtheletePlan?.stats?.[`${props.w}-${props.d}-${props.index}`]}
              onClick={onClickToggleComplete}
            >
              Done
            </Button>
          </Box>
        ) : (
          ''
        )}
      </Box>
    </RootStyle>
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
