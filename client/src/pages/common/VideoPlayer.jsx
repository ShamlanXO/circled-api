// @mui
import { styled } from '@mui/material/styles';
// components
import Page from 'src/components/Page';

import { Box, Typography, Button, IconButton, InputBase, ButtonBase } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import Container from 'src/components/Layout/Container';
import { updateFeedback } from 'src/redux/actions/feedback';

import { useState, useRef } from 'react';

import Iconify from 'src/components/Iconify';
import MuscleHighlighterDrawer from 'src/components/muscleHighlighter/bottomDrawer';
import Model from '../../components/body-highlight2/src';
import ReactPlayerVimeo from 'src/components/Labs/ReactPlayerWithFallback';
import SwipeableViews from 'react-swipeable-views';
import { updateStatus } from 'src/redux/actions/clientExercise';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import { getProcessedvideoLink } from 'src/utils/convertToLink';
import Slider from '@mui/material/Slider';
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

  const [muted, setMuted] = useState(true);
  // const [data, setData] = useState([]);
  const navigate = useNavigate();

  const playerRef = useRef(null);

  const exercise = state.exercise;

  if (!exercise) {
    return navigate(-1);
  }

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
                    {exercise.title}
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

          <ReactPlayerVimeo
            url={getProcessedvideoLink(exercise.href)}
            raw={exercise.href}
            ref={playerRef}
            onPlay={() => setIsPlaying(true)}
            loop
            muted={muted}
            progressInterval={100}
            controls={false}
            autoPlay={true}
            responsive={true}
            playsinline={true}
            onDuration={(duration) => {
              setDuration(duration);
            }}
            playing={true}
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
        </Container>
      </RootStyle>
    </Page>
  );
}
