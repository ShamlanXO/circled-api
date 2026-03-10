// @mui
import { styled } from '@mui/material/styles';
// components
import Page from 'src/components/Page';
import { memo, useEffect } from 'react';
import ImageWithFallback from 'src/components/Labs/ImageWithFallback';

import { Box, Typography, Button, IconButton, InputBase, Badge } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';

import { useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import Container from 'src/components/Layout/Container';
import { useState } from 'react';
import Iconify from 'src/components/Iconify';
import MuscleHighlighterDrawer from 'src/components/muscleHighlighter/bottomDrawer';
import { getProcessedvideoLink, getThumbnail } from 'src/utils/convertToLink';
import Model from 'src/components/body-highlight2/src';
import ReactPlayer from 'react-player';
import ReactPlayerVimeo from 'src/components/Labs/ReactPlayerWithFallback';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
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
  const { state } = useLocation();

  // const [data, setData] = useState([]);
  const navigate = useNavigate();

  const [showDetails, setShowDwtails] = useState(true);
  const [bottomBox, setBottomBox] = useState(true);

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

  return (
    <Page title=" Simplified Online Fitness Training ">
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
                <ReactPlayerVimeo
                  url={getProcessedvideoLink(state?.key, '/')}
                  raw={state?.key}
                  //   controls
                  loop
                  controls={false}
                  //autoPlay={true}
                  responsive={true}
                  playsinline={true}
                  playing={true}
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
              </Box>
              <Box
                position={'absolute'}
                zIndex={1000}
                width={'100vw'}
                height={'100vh'}
                top={0}
                onClick={() => setShowDwtails(!showDetails)}
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
                    {state.title}
                  </Typography>
                </TopBox>
                <Box
                  style={{
                    position: 'absolute',
                    top: '50vh',
                    right: 0,
                    paddingRight: 10,
                  }}
                ></Box>

                {showDetails && (
                  <BottomBox
                    style={{
                      display: bottomBox ? 'block' : 'none',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MuscleHighlighterDrawer
                      setMData={() => {}}
                      data={[
                        {
                          muscles: state?.triggerMuscle || [],
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
                              name: state?.title || '',
                              muscles: state?.triggerMuscle || [],
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
                              name: state?.title,
                              muscles: state?.triggerMuscle || [],
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
                      pb={10}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          py: 0.25,
                          fontSize: 18,
                          color: 'common.white',
                        }}
                      >
                        {state?.title}
                      </Typography>
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
    setUrl(getThumbnail(props.link));
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
