import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Box, Link, Divider, Typography, Stack, ButtonBase } from '@mui/material';
// routes

import { MotionContainer, varFade } from '../components/animate';
import Backsvg from 'src/assets/onboarding/Hero2';
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router';
import axios from '../utils/axios';
import api from '../utils/api';
import { updateFeedback } from '../redux/actions/feedback';
import { useDispatch } from 'react-redux';
import { updateOnboarding } from '../redux/actions/Onboarding';
import { useConfirmationModalContext } from '../utils/Modal';
import Iconify from 'src/components/Iconify';
import { initProfile } from './../redux/actions/Profile';
import Logo from '../assets/figgslogo.png';
import ModeSelection from '../components/auth/ModeSelection';
import ImageBanner from '../assets/fitnessBanner';
import Content from '../components/Layout/Content';
import Container from '../components/Layout/Container';
import Icon1 from 'src/assets/IconSet/homescreen/Icon1';
import Icon2 from 'src/assets/IconSet/homescreen/Icon2';
import Icon3 from 'src/assets/IconSet/homescreen/Icon3';
import Icon4 from 'src/assets/IconSet/homescreen/Icon4';
import Icon5 from 'src/assets/IconSet/homescreen/Icon5';
import Icon6 from 'src/assets/IconSet/homescreen/Icon6';
import HomeImg1 from 'src/assets/homeScreen/home1.svg';
import HomeImg2 from 'src/assets/homeScreen/home2.svg';
import HomeImg3 from 'src/assets/homeScreen/home1.png';
import HomeImg4 from 'src/assets/homeScreen/home2.png';
import HomeImg5 from 'src/assets/homeScreen/home5.png';
import HomeImg6 from 'src/assets/homeScreen/home3.png';
import HomeImg7 from 'src/assets/homeScreen/home4.png';
// ----------------------------------------------------------------------
import { useLocation } from 'react-router';
import { useState } from 'react';
const RootStyle = styled(m.div)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#fff',
  pb: 2,
  overflowY: 'auto',
}));

const ContentStyle = styled((props) => (
  <Stack
    spacing={2}
    {...props}
  />
))(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',

  maxWidth: 520,
  margin: 'auto',
  width: '100%',
  textAlign: 'center',
  paddingLeft: 8,
  paddingRight: 8,

  paddingTop: theme.spacing(3),
}));

const UnderlinedText = styled(Typography)(({ theme }) => ({
  'position': 'relative',
  'marginRight': 1,
  '&:after': {
    content: "''",
    position: 'absolute',
    bottom: '-5px',
    left: 0,
    height: '7px',
    width: '100%',
    border: 'solid 2px #cb1829',
    borderColor: '#cb1829 transparent transparent transparent',
    borderTopColor: theme.palette.primary.main,
    borderRadius: '50%',
  },
}));
const SocialButton = styled(Button)(({ theme }) => ({
  height: 52,
  alignItems: 'center',
  borderRadius: 40,
  background: '#fff',
  border: '1.5px solid #C3CBD9',
  borderColor: '#C3CBD9',
  //boxShadow: '0px 4px 4px rgba(43, 64, 87, 0.1)',
  fontFamily: 'Proxima Nova',
  paddingLeft: '12px',
  /* Dark primary / 50% */
  color: '#172A44',
  fontSize: 16,
  fontWeight: 'bold',

  border: '1.5px solid ',
}));
// ----------------------------------------------------------------------

export default function HomeHero({ mode }) {
  const dispatch = useDispatch();
  const modalContext = useConfirmationModalContext();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const responseGoogleSignIn = (res) => {
    dispatch(
      updateFeedback({
        loading: true,
      }),
    );
    axios
      .post(`${api.protocol}${api.baseUrl}${api.userLogin}`, {
        email: res?.profileObj.email,
        authType: 'gmail',
        phone: '',
        tokenId: res.tokenId,
      })
      .then((response) => {
        dispatch(
          updateFeedback({
            loading: false,
            snackbar: true,
            message: 'Login successfuly',
            severity: 'success',
          }),
        );
        let { _id, category, name, bio, type, DOB, privatePlan, profilePic, location, links, email, phone } =
          response.data.userData;
        // if (props.location.state && props.location.state.return) {
        //   setTimeout(() => {
        //     props.history.push(props.location.state.return);
        //     console.log(props.location.state.return);
        //   }, 1000);
        // }

        axios.defaults.headers.common['Authorization'] = response.data.token;
        localStorage.setItem('token', response.data.token);

        dispatch(
          initProfile({
            _id,
            category,
            name,
            bio,
            type,
            authType: 'gmail',
            DOB,
            privatePlan,
            profilePic,
            location,
            links,
            email,
            token: response.data.token,
            phone,
            password: '',
            ...response.data.userData,
          }),
        );
        if (state.redirect) {
          navigate(state.redirect);
        }
        // else
        // props.history.push(
        //   response.data.userData == "Athlete" ? "/athlete" : "/instructor"
        // );
      })
      .catch((error) => {
        if (error.response && error.response.status === 404)
          return dispatch(
            updateFeedback({
              loading: false,
              snackbar: true,
              message: "User with provided email or phone doesn't exist",
              severity: 'error',
            }),
          );
        if (error.response && error.response.status === 409)
          return dispatch(
            updateFeedback({
              loading: false,
              snackbar: true,
              message: 'Invalid Password',
              severity: 'error',
            }),
          );
        if (error.response && error.response.status === 408) {
          dispatch(
            updateFeedback({
              loading: false,
            }),
          );
          modalContext
            .showConfirmationModal(
              'Alert!',
              'This email is already registered with other auth provide , would you like to link gmail with this account?',
              'Yes',
              'No',
            )
            .then((result) => {
              if (result) {
                dispatch(
                  updateFeedback({
                    loading: true,
                  }),
                );
                axios
                  .patch(`${api.protocol}${api.baseUrl}${api.updateAuth}`, {
                    email: res?.profileObj.email,
                    authType: 'gmail',
                    tokenId: res.tokenId,
                  })
                  .then((response) => {
                    dispatch(
                      updateFeedback({
                        loading: false,
                        snackbar: true,
                        message: 'Account linked with gmail , login to continue',
                        severity: 'success',
                      }),
                    );
                  });
              }
            });
        }
      });
  };
  const responseGoogle = (res) => {
    dispatch(
      updateFeedback({
        loading: true,
      }),
    );
    axios
      .get(`${api.protocol}${api.baseUrl}${api.checkUserExistence}email=${res?.profileObj.email}`)
      .then((response) => {
        dispatch(
          updateFeedback({
            loading: false,
          }),
        );
        if (response.data.authType.includes('gmail')) {
          responseGoogleSignIn(res);
        } else {
          modalContext
            .showConfirmationModal(
              'Alert!',
              'This email is already registered with other auth provide , would you like to link gmail with this account?',
              'Yes',
              'No',
            )
            .then((result) => {
              if (result) {
                dispatch(
                  updateFeedback({
                    loading: true,
                  }),
                );
                axios
                  .patch(`${api.protocol}${api.baseUrl}${api.updateAuth}`, {
                    email: response.data.email,
                    authType: 'gmail',
                    tokenId: res.tokenId,
                  })
                  .then((response) => {
                    updateFeedback({
                      loading: false,
                      snackbar: true,
                      message: 'Account linked with gmail , login to continue',
                      severity: 'success',
                    });
                    responseGoogleSignIn(res);
                  });
              } else {
              }
            });
        }
      })
      .catch((error) => {
        dispatch(
          updateFeedback({
            loading: false,
          }),
        );
        if (error.response.status === 404) {
          dispatch(
            updateOnboarding({
              name: res?.profileObj.name,
              email: res?.profileObj.email,
              profilePic: res?.profileObj.imageUrl,
              tokenId: res.tokenId,
              authType: 'gmail',
            }),
          );
          setOpenModal(true);
          // navigate(
          //     `/onboarding/${
          //         mode == 'client' || state?.type == 'Athlete'
          //             ? 'client/info'
          //             : 'preview'
          //     }`,
          //     { state }
          // )
        }
      });
  };

  return (
    <MotionContainer>
      <Container>
        <Content>
          <ContentStyle>
            <m.div variants={varFade().inRight}>
              <Box
                display={'flex'}
                justifyContent="flex-start"
              >
                <img
                  src={Logo}
                  height={42}
                />
              </Box>
            </m.div>
            <m.div variants={varFade().inRight}>
              {/* <Typography variant="h2" color="grey.700">
                                Your mobile {''}
                                <UnderlinedText
                                    variant="h2"
                                    component={'span'}
                                    color="primary.main"
                                >
                                    Fitness
                                </UnderlinedText>
                                &nbsp;tool
                            </Typography> */}
              <Typography
                align="center"
                sx={{ fontWeight: '500', fontSize: 24, mt: 4 }}
                color={'text.primary'}
              >
                Trainers build and clients
                <br /> achieve
              </Typography>
            </m.div>
            <Typography
              color={'text.secondary'}
              align="center"
              sx={{ mt: 1 }}
            >
              We make creating, managing, and following online fitness programs effortless—so trainers can focus on
              coaching, and clients can focus on results. No hassle, just progress
            </Typography>
            {/* <Box sx={{pt:6,pb:3}}>
                            <ImageBanner />
                        </Box> */}
            <Box
              display={'flex'}
              alignItems={'center'}
              width={'100%'}
              justifyContent={'center'}
              flexGrow={1}
              pt={2}
            >
              <m.div variants={varFade().inRight}>
                <Stack spacing={1}>
                  <Box
                    mt={2}
                    pb={1}
                  >
                    <Button
                      variant="contained"
                      onClick={() => navigate('/signupoptions')}
                      sx={{ px: 4, borderRadius: 1 }}
                    >
                      Get Started Free
                    </Button>
                  </Box>
                  <Typography
                    align="center"
                    color={'text.secondary'}
                    sx={{ textDecoration: 'underline',
                      cursor: 'pointer'
                     }}
                    onClick={() =>
                      navigate('/signupoptions', {
                        state: {
                          type: 'signin',
                        },
                      })
                    }
                  >
                    Already have an account? Login
                  </Typography>

                  {/* <SocialButton
                                     

                                        onClick={() =>
                                            navigate(
                                                state?.type == 'Athlete'
                                                    ? '/onboarding/client'
                                                    : '/onboarding/mobileSignup',
                                                { state }
                                            )
                                        }
                                        fullWidth
                                        style={{
                                          marginTop:0,
                                            marginBottom: 16,
                                        }}
                                    >
                                        <Iconify
                                            icon={'logos:whatsapp-icon'}
                                            width={24}
                                            height={24}
                                        />
                                        &nbsp;&nbsp;&nbsp;
                                      
                                        <Typography
                                            variant="h6"
                                            color="text.primary"
                                        >
                                            Continue with Mobile 
                                        </Typography>
                                    </SocialButton> */}
                  {/* <Divider>
                                        <Typography color={'text.secondary'}>
                                            OR
                                        </Typography>
                                    </Divider>
                                    <Button
                                        onClick={() =>
                                            navigate('/Login', { state })
                                        }
                                        variant="contained"
                                        size="large"
                                        style={{ marginTop: 16 }}
                                    >
                                        Login
                                    </Button> */}
                </Stack>
              </m.div>
            </Box>

            <Stack py={3}>
              <Typography variant="h2">Coach from anywhere</Typography>
              <Typography
                align="center"
                color={'text.secondary'}
              >
                Set up your trainer profile to showcase your experience and fitness programs
              </Typography>
              <br />
              <img src={HomeImg3} />
            </Stack>

            <Stack py={3}>
              <Typography variant="h2">Easiest workout builder</Typography>
              <Typography
                align="center"
                color={'text.secondary'}
              >
                Just drag & drop exercises or days, order them, add or remove.
              </Typography>
              <br />
              <img src={HomeImg4} />
            </Stack>

            <Stack py={3}>
              <Typography variant="h2">All in one library</Typography>
              <Typography
                align="center"
                color={'text.secondary'}
              >
                Save all your exercise videos and workouts in your library and build programs fast
              </Typography>
              <br />
              <img src={HomeImg5} />
            </Stack>

            <Stack py={3}>
              <Typography variant="h2">Track and manage athletes</Typography>
              <Typography
                align="center"
                color={'text.secondary'}
              >
                Manage your athletes fitness programs, meal plans effortlessly with a simple interface
              </Typography>
              <br />
              <img src={HomeImg6} />
            </Stack>

            <Stack py={3}>
              <Typography variant="h2">Start exercising</Typography>
              <Typography
                align="center"
                color={'text.secondary'}
              >
                Reach your goals with your trainer by following workout plans that can be customized for you only
              </Typography>
              <br />
              <img src={HomeImg7} />
            </Stack>

            <Stack
              spacing={6}
              sx={{ pt: 4 }}
            >
              <Stack sx={{ border: '1px solid #C3CBD9', borderRadius: 2, p: 2 }}>
                <Icon1 sx={{ fontSize: 12 }} />
                <br />
                <Typography
                  variant="h3"
                  align="left"
                >
                  Create trainer profile
                </Typography>
                <Typography
                  color={'text.secondary'}
                  align="left"
                >
                  Set up your trainer profile to showcase your experience and fitness programs
                </Typography>
              </Stack>

              <Stack sx={{ border: '1px solid #C3CBD9', borderRadius: 2, p: 2 }}>
                <Icon2 />
                <br />
                <Typography
                  variant="h3"
                  align="left"
                >
                  Easily build programs
                </Typography>
                <Typography
                  color={'text.secondary'}
                  align="left"
                >
                  Set up your trainer profile to showcase your experience and fitness programs
                </Typography>
              </Stack>
              <Stack sx={{ border: '1px solid #C3CBD9', borderRadius: 2, p: 2 }}>
                <Icon3 />
                <br />
                <Typography
                  variant="h3"
                  align="left"
                >
                  Drag and drop
                </Typography>
                <Typography
                  color={'text.secondary'}
                  align="left"
                >
                  Set up your trainer profile to showcase your experience and fitness programs
                </Typography>
              </Stack>
              <Stack sx={{ border: '1px solid #C3CBD9', borderRadius: 2, p: 2 }}>
                <Icon4 />
                <br />
                <Typography
                  variant="h3"
                  align="left"
                >
                  Client’s management
                </Typography>
                <Typography
                  color={'text.secondary'}
                  align="left"
                >
                  Manage client workouts and nutrition easily and simply
                </Typography>
              </Stack>
              <Stack sx={{ border: '1px solid #C3CBD9', borderRadius: 2, p: 2 }}>
                <Icon5 />
                <br />
                <Typography
                  variant="h3"
                  align="left"
                >
                  Share your workouts
                </Typography>
                <Typography
                  color={'text.secondary'}
                  align="left"
                >
                  You can share one day workouts for for free for your potential clients or friends via link
                </Typography>
              </Stack>
              <Stack sx={{ border: '1px solid #C3CBD9', borderRadius: 2, p: 2 }}>
                <Icon6 />

                <Typography
                  variant="h3"
                  align="left"
                >
                  Multiple payment model
                </Typography>
                <Typography
                  color={'text.secondary'}
                  align="left"
                >
                  Choose how client’s pay you either one time or subscription based model
                </Typography>
              </Stack>
            </Stack>
            <br />
            <br />
            <Box
              display={'flex'}
              alignItems={'flex-end'}
              justifyContent={'center'}
            >
              <Typography
                align="center"
                color={'text.secondary'}
                style={{ marginBottom: 16 }}
              >
                By continuing, you agree to Circled.fit
                <br />
                <Link
                  variant="subtitle2"
                  component={RouterLink}
                  to={'/terms'}
                  color={'text.secondary'}
                  sx={{ textDecoration: 'underline' }}
                >
                  Terms of Service
                </Link>
                &nbsp;and&nbsp;
                <Link
                  variant="subtitle2"
                  component={RouterLink}
                  to={'/privacy'}
                  color={'text.secondary'}
                  sx={{ textDecoration: 'underline' }}
                >
                  Privacy Policy
                </Link>
              </Typography>
            </Box>
          </ContentStyle>
        </Content>
        <ModeSelection
          open={openModal}
          state={state}
        />
      </Container>
    </MotionContainer>
  );
}
