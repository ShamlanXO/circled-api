// @mui
import { styled } from '@mui/material/styles';

// components
import Page from 'src/components/Page';
import Container from 'src/components/Layout/Container';
import Content from 'src/components/Layout/Content';
import Header from 'src/components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';
import Iconify from 'src/components/Iconify';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import ReactPlayer from 'react-player';
import trainer from './trainer.json';
import client from './athlete.json';
import { useSelector } from 'react-redux';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));
const BoxHeader = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
}));
// ----------------------------------------------------------------------

export default function Contact() {
  const navigate = useNavigate();
  const mode = useSelector((state) => state.Profile.type);
  const guide = trainer;
  return (
    <Page title="Contact us">
      <Container>
        <Header
          style={{
            borderRadius: '0px 0px 8px 8px',
            boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
            overflow: 'hidden',
          }}
        >
          <BoxHeader
            px={2}
            py={2}
          >
            <Box
              display={'flex'}
              alignItems={'center'}
            >
              {' '}
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ color: 'text.primary' }}
              >
                <ArrowLeft />
              </IconButton>
              <Typography
                variant="h6"
                color="text.primary"
              >
                Guide
              </Typography>{' '}
            </Box>{' '}
          </BoxHeader>
        </Header>
        <Content>
          {/* How to Create a Workout Program Section */}
          <Box
            mt={2}
            p={3}
            bgcolor="white"
            borderRadius={2}
          >
            <Typography
              variant="h2"
              fontWeight={600}
              align="left"
            >
              Your guide as trainer how to build and manage your clients programs.
            </Typography>
          </Box>

          {guide.map((item, index) => (
            <Box
              p={3}
              bgcolor="white"
              borderRadius={2}
            >
              <div style={{ position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                <ReactPlayer
                  url="https://youtu.be/VvK2sVbhKJQ"
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  controls
                />
              </div>
              <Typography
                variant="h3"
                fontWeight={600}
                mt={2}
              >
                {`${index + 1}. ${item.title}`}
              </Typography>
              <Typography
                variant="body1"
                mt={1}
                color="text.secondary"
              >
                {item.description}
              </Typography>
            </Box>
          ))}
        </Content>
      </Container>
    </Page>
  );
}
