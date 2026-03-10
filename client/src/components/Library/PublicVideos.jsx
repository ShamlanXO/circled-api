import { Box, Divider, IconButton, Stack, Typography, Button, Checkbox, ButtonBase, Dialog } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import Iconify from '../Iconify';
import { useDispatch, useSelector } from 'react-redux';
import { getYoutubeVideoTHumbnail } from '../../utils/convertToLink';
import ImageWithFallback from '../Labs/ImageWithFallback';
import BottomAction from 'src/components/common/BottomAction';
import { useConfirmationModalContext } from 'src/utils/Modal';
import More from 'src/assets/IconSet/More';
import EditIcon from 'src/assets/IconSet/edit';
import ShareIcon from 'src/assets/IconSet/Share';
import RemoveIcon from 'src/assets/IconSet/Delete';
import CopyIcon from 'src/assets/IconSet/CopyLink';
import { useNavigate } from 'react-router';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import { updateFeedback } from 'src/redux/actions/feedback';
import { deleteVideo } from 'src/redux/actions/figgsLibrary';
import ReactPlayer from 'react-player/youtube';
import { searchItemByKey } from 'src/utils/search.js';
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
  const videos = useSelector((s) => s.Library.publicVideos);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showConfirmationModal } = useConfirmationModalContext();
  
  // State for dynamic height calculation
  const [containerHeight, setContainerHeight] = React.useState(600);
  const itemHeight = 100; // Height of each video card
  
  // Calculate dynamic height based on viewport
  React.useEffect(() => {
    const calculateHeight = () => {
      const viewportHeight = window.innerHeight;
      // Reserve space for header, padding, etc. - adjust as needed
      const reservedSpace = 200;
      const availableHeight = viewportHeight - reservedSpace;
      setContainerHeight(Math.max(400, availableHeight)); // Minimum height of 400px
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  const onChangeSelection = (workout) => {
    let existIndex = props?.selectedWorkout?.findIndex((i) => i._id == workout._id);
    let arr = [...props.selectedWorkout];
    if (existIndex > -1) {
      arr.splice(existIndex, 1);
    } else {
      arr.push({
        ...workout,
        media: workout.href,
        type: 'youtube',
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
  const videoList = useMemo(() => {
    if (props.searchKey == '') {
      return videos;
    }
    return searchItemByKey(videos, ['title'], props.searchKey);
  }, [props.searchKey, videos]);

  // Render function for React Window
  const renderVideoItem = ({ index, style }) => {
    const video = videoList[index];
    return (
      <VideoCard
        title={video.title || 'unamed'}
        id={video._id}
        url={video.href}
        onChangeSelection={() => onChangeSelection(video)}
        checked={props?.selectedWorkout?.find((vi) => vi._id == video._id) ? true : false}
        slectionMode={props?.slectionMode}
        selectedWorkout={props?.selectedWorkout}
        setSelectedWorkout={props?.setSelectedWorkout}
        style={style}
      />
    );
  };

  return (
    <Box
      height={videoList.length == 0 ? '100%' : 'auto'}
      display={videoList.length == 0 ? 'flex' : 'block'}
      flexDirection={'column'}
      alignItems={'flex-start'}
      pb={12}
    >
      {videoList.length == 0 ? (
        <Box
          flexGrow={1}
          width={'100%'}
          flexDirection={'column'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          height={containerHeight}
        >
          <Typography
            align="center"
            color={'grey.600'}
          >
            No public videos! <br />
          </Typography>
        </Box>
      ) : (
        <List
          height={Math.min(containerHeight, videoList.length * itemHeight)}
          itemCount={videoList.length}
          itemSize={itemHeight}
          width={'100%'}
          overscanCount={5}
        >
          {renderVideoItem}
        </List>
      )}
    </Box>
  );
}

const VideoCard = ({ title, url, onClick, onChangeSelection, checked, slectionMode, style }) => {
  const [open, setOpen] = React.useState(false);
  const [videoHeight, setVideoHeight] = React.useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const handleOnReady = (player) => {
  //   const videoElement = player.getInternalPlayer();
  //   if (videoElement) {
  //     console.log(videoElement, videoElement.getSize(), 'videoElement');
  //     // Get video height when the player is ready
  //     const height = videoElement.getSize().height;
  //     const width = videoElement.getSize().width;
  //     const ratio = width / height;
  //     const newHeight = `calc(100vw / ${ratio})`;

  //     console.log(height, width, ratio, newHeight, 'video props');
  //     if (height) {
  //       setVideoHeight(newHeight);
  //     } else {
  //       setVideoHeight('');
  //       // setVideoHeight('auto');
  //     }
  //   }
  // };

  return (
    <>
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
                  {title}
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
            <ReactPlayer
              url={url}
              width="100%"
              controls={true}
              playing
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
      <Box py={2} style={style}>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
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
              sx={{ overflow: 'hidden' }}
              onClick={handleOpen}
            >
              <ImageWithFallback
                //onClick={props.onClick}
                variant="rounded"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                src={getYoutubeVideoTHumbnail(url) || '/images/instructor/exerciseImage.png'}
              />
            </Box>
            <Typography
              onClick={handleOpen}
              sx={{ textTransform: 'capitalize' }}
            >
              {title}
            </Typography>
          </Box>
          {slectionMode && (
            <Checkbox
              color="primary"
              checked={checked}
              onChange={onChangeSelection}
            />
          )}
        </Stack>
      </Box>
    </>
  );
};
