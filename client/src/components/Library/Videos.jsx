import { Box, Divider, IconButton, Stack, Typography, Button, Checkbox, ButtonBase, Dialog } from '@mui/material';

import React, { useMemo, useEffect } from 'react';
import Iconify from '../Iconify';
import { useDispatch, useSelector } from 'react-redux';
import { getProcessedvideoLink, getThumbnail } from '../../utils/convertToLink';
import ImageWithFallback from '../Labs/ImageWithFallback';
import BottomAction from 'src/components/common/BottomAction';
import CircularProgress from 'src/components/progress/Circular';
import { useConfirmationModalContext } from 'src/utils/Modal';
import More from 'src/assets/IconSet/More';
import EditIcon from 'src/assets/IconSet/edit';
import ShareIcon from 'src/assets/IconSet/Share';
import RemoveIcon from 'src/assets/IconSet/Delete';
import CopyIcon from 'src/assets/IconSet/CopyLink';
import ReactPlayerVimeo from 'src/components/Labs/ReactPlayerWithFallback';
import { updateFeedback } from 'src/redux/actions/feedback';
import { deleteVideo } from 'src/redux/actions/figgsLibrary';
import { searchItemByKey } from 'src/utils/search.js';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
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
export default function Videos(props) {
  const videos = useSelector((s) => s.Library.videos);
  const libMedia = useSelector((s) => s.Sync.libMedia);
  const [open, setOpen] = React.useState(false);
  const [videoHeight, setVideoHeight] = React.useState('');
  const [selectedVideo, setSelectedVideo] = React.useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showConfirmationModal } = useConfirmationModalContext();
  const onChangeSelection = (workout) => {
    let existIndex = props?.selectedWorkout?.findIndex((i) => i._id == workout._id);
    let arr = [...props.selectedWorkout];
    if (existIndex > -1) {
      arr.splice(existIndex, 1);
    } else {
      arr.push({
        ...workout,
        media: `https://circled-videos.s3.us-east-1.amazonaws.com/${workout.key}`,
      });
    }

    props.setSelectedWorkout(arr);
  };
  const delettheVideo = (id) => {
    showConfirmationModal('Are you sure?', `You are going to delete this video`, 'Delete').then((res) => {
      dispatch(
        deleteVideo({
          _id: id,
          savedToLibrary: false,
        }),
      );
    });
  };
  const videosList = useMemo(() => {
    if (props.searchKey == '') {
      return [...Object.values(libMedia), ...videos];
    }
    return searchItemByKey([...Object.values(libMedia), ...videos], ['title'], props.searchKey);
  }, [props.searchKey, videos, libMedia]);

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
  return (
    <Box
      height={videosList.length == 0 ? '100%' : 'auto'}
      display={videosList.length == 0 ? 'flex' : 'block'}
      flexDirection={'column'}
      alignItems={'flex-start'}
      pb={12}
    >
      {!props?.slectionMode ? (
        <Button
          
          color="primary"
          variant="outlined"
          fullWidth
          sx={{mt:2}}
          onClick={(e) => document.getElementById('addvideoinput').click()}
        >
          <input
            id="addvideoinput"
            accept="video/*"
            type="file"
            onChange={(e) =>
              navigate('/library/editvideo', {
                state: { mode: 'add', file: e.target.files[0] },
              })
            }
            style={{ display: 'none' }}
          />
          {/* <Iconify icon="mingcute:add-fill" sx={{ fontSize: 18 }} />
                    &nbsp;{' '} */}
          <Typography
            sx={{
              fontSize: 22,
              color: 'primary.main',
              fontWeight: 600,
           
          
            }}
          >
            Add video
          </Typography>
        </Button>
      ) : null}
      {videosList.length == 0 ? (
        <Box
          flexGrow={1}
          width={'100%'}
          height={'100%'}
          flexDirection={'column'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Typography
            align="center"
            color={'grey.600'}
          >
            No saved videos! <br />
            Add from phone or workouts.
          </Typography>
        </Box>
      ) : (
        videosList?.map((i, index) => (
          <VideoCard
            title={i.title || 'unamed'}
            id={i._id || i.id}
            url={i.key}
            mode={i.mode}
            type={i.type}
            progress={i.progress}
            onClick={() => {
              if (props?.slectionMode) {
                setOpen(true);
                setSelectedVideo({ ...i });
              } else
                navigate(`/library/editvideo`, {
                  state: {
                    mode: 'edit',
                    ...i,
                  },
                });
            }}
            onChangeSelection={() => onChangeSelection(i)}
            checked={props?.selectedWorkout?.find((vi) => vi._id == i._id) ? true : false}
            deleteVideo={() => delettheVideo(i._id)}
            slectionMode={props?.slectionMode}
            selectedWorkout={props?.selectedWorkout}
            setSelectedWorkout={props?.setSelectedWorkout}
          />
        ))
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        fullScreen
      >
        <Box sx={{ bgcolor: '#000', width: '100%', height: '100%' }}>
          <TopBox
            display={'flex'}
            flexDirection={'column'}
          >
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
                  onClick={() => handleClose()}
                  sx={{ color: 'common.white' }}
                >
                  <ArrowLeft />
                </IconButton>
                &nbsp;
                <Typography
                  variant="subtitle1"
                  color="common.white"
                >
                  {selectedVideo?.title}
                </Typography>
              </Box>
            </Box>
          </TopBox>
          <Box
            height={'100%'}
            width={'100%'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <ReactPlayerVimeo
              url={selectedVideo?.key ? getProcessedvideoLink(selectedVideo?.key, '/') : ''}
              width="100%"
              controls={true}
              playing
              onReady={handleOnReady}
              //onReady={handleOnReady}
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
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

const VideoCard = ({
  title,
  url,
  onClick,
  slectionMode,
  deleteVideo,
  checked,
  onChangeSelection,
  mode,
  type,
  progress,
  id,
}) => {
  const dispatch = useDispatch();
  const copy = () => {
    if (navigator && navigator.clipboard != undefined) {
      navigator.clipboard.writeText('hrefLink');
    }
    dispatch(
      updateFeedback({
        snackbar: true,
        severity: 'success',
        message: 'Link copied to clipboard',
      }),
    );
  };

  let progressItem = useSelector((s) => s.Sync.libMedia[id]);

  return (
    <>
      <Box py={3}>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          onClick={onClick}
        >
          <Box
            display={'flex'}
            alignItems={'center'}
          >
            <Box
              bgcolor={'#f0f0f0'}
              borderRadius={1}
              width={100}
              height={65}
              mr={1}
              position={'relative'}
              sx={{ overflow: 'hidden' }}
            >
              {mode == 'upload' ? (
                <Box
                  position={'absolute'}
                  top={0}
                  left={0}
                  width={'100%'}
                  height={'100%'}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <CircularProgress value={progressItem?.progress} />
                </Box>
              ) : (
                <ImageWithFallback
                  //onClick={props.onClick}
                  variant="rounded"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  src={getThumbnail(url, '/') || '/images/instructor/exerciseImage.png'}
                />
              )}
            </Box>
            <Typography sx={{ textTransform: 'capitalize' }}>{title}</Typography>
          </Box>
          {slectionMode ? (
            <Checkbox
              color="primary"
              checked={checked}
              onChange={onChangeSelection}
            />
          ) : mode == 'upload' ? (
            ''
          ) : (
            <Box onClick={(e) => e.stopPropagation()}>
              <BottomAction
                items={[
                  // {
                  //     title: 'Copy link',
                  //     icon: <CopyIcon sx={{ mr: 2 }} />,
                  //     onClick: copy,
                  // },
                  // {
                  //     title: 'Share',
                  //     icon: <ShareIcon sx={{ mr: 2 }} />,
                  // },
                  {
                    title: 'Edit video',
                    icon: <EditIcon sx={{ mr: 2 }} />,
                    onClick: onClick,
                  },
                  {
                    title: 'Remove',
                    icon: <RemoveIcon sx={{ mr: 2, color: 'error.main' }} />,
                    onClick: deleteVideo,
                    isError: true,
                  },
                ]}
                title={title}
              >
                <IconButton>
                  <More
                    sx={{
                      fontSize: 32,
                      color: 'text.primary',
                    }}
                  />
                </IconButton>
              </BottomAction>
            </Box>
          )}
        </Stack>
      </Box>
      <Divider sx={{ borderColor: 'rgba(231, 238, 248, 1)' }} />
    </>
  );
};
