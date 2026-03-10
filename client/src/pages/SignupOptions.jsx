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
import { initProfile } from '../redux/actions/Profile';
import Logo from '../assets/circle.png';
import ModeSelection from '../components/auth/ModeSelection';
import ImageBanner from '../assets/fitnessBanner';
import Content from '../components/Layout/Content';
import Container from '../components/Layout/Container';
import Header from 'src/components/Layout/Header';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import { IconButton } from '@mui/material';
// ----------------------------------------------------------------------
import { useLocation } from 'react-router';
import { useState } from 'react';
const RootStyle = styled(m.div)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#fff',
  pb: 2,
  overflowY: 'auto',
}));
const BoxHeader = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
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
  paddingTop: theme.spacing(8),
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
  borderRadius: 8,
  boxShadow: '0px 4px 4px 0px #2B40571A',

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
        <Header
          style={{
            borderRadius: '0px 0px 8px 8px',

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
            </Box>{' '}
          </BoxHeader>
        </Header>
        <Content>
          <ContentStyle>
            <m.div variants={varFade().inRight}>
              <Box
                display={'flex'}
                justifyContent="center"
              >
                <img
                  src={Logo}
                  height={64}
                />
              </Box>
            </m.div>
            <m.div variants={varFade().inRight}>
              <Typography
                align="center"
                sx={{ fontWeight: '500', fontSize: 24 }}
                color={'text.primary'}
              >
                {state?.type == 'signin' ? 'Sign in' : 'Welcome to circled.fit'}
              </Typography>
            </m.div>
            <Typography
              color={'text.secondary'}
              align="center"
              sx={{ mt: 1 }}
            >
              {state?.type == 'signin' ? (
                <>
                  Sign to your circled account and
                  <br /> Enjoy your journey
                </>
              ) : (
                <>
                  Sign up and start building your program or <br />
                  If you have an account we’ll log you in.
                </>
              )}
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
            >
              <m.div
                variants={varFade().inRight}
                style={{ width: '100%' }}
              >
                <Stack spacing={2}>
                  <Box>
                    <GoogleLogin
                      clientId="20299471486-m23pkgk770a4vq3dgjh8uc9k180cpc98.apps.googleusercontent.com"
                      render={(renderProps) => (
                        <SocialButton
                          style={{ marginTop: 16 }}
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                          fullWidth
                        >
                          <Iconify
                            icon={'flat-color-icons:google'}
                            width={24}
                            height={24}
                          />
                          &nbsp;&nbsp;
                          {/* <img src={GoogleIcon} style={{ marginRight: 8 }} /> */}
                          <Typography
                            variant="h6"
                            color="text.primary"
                          >
                            Sign up with Google
                          </Typography>
                        </SocialButton>
                      )}
                      buttonText="Login"
                      onSuccess={responseGoogle}
                      onFailure={(res) => {
                        console.log(res);
                      }}
                      cookiePolicy={'single_host_origin'}
                    />
                  </Box>
                  <Box>
                    <SocialButton
                      // onClick={renderProps.onClick}
                      // disabled={renderProps.disabled}
                      onClick={() => {
                        dispatch(
                          updateOnboarding({
                            authType: 'email',
                          }),
                        );
                        setOpenModal(true);
                      }}
                      // onClick={() =>
                      //     navigate(
                      //         state?.type == 'Athlete'
                      //             ? '/onboarding/client'
                      //             : '/onboarding',
                      //         { state }
                      //     )
                      // }
                      fullWidth
                      style={{
                        marginTop: 16,
                        marginBottom: 16,
                      }}
                    >
                      <Iconify
                        icon={'fontisto:email'}
                        width={24}
                        height={24}
                      />
                      &nbsp;&nbsp;&nbsp;
                      {/* <img src={GoogleIcon} style={{ marginRight: 8 }} /> */}
                      <Typography
                        variant="h6"
                        color="text.primary"
                      >
                        Sign up with Email
                      </Typography>
                    </SocialButton>
                  </Box>
                  <Box>
                    <Typography color={'text.secondary'}>
                      {state?.type == 'signin'
                        ? `If you don’t have an account we will sign you up`
                        : 'If you have an account we’ll log you in.'}
                    </Typography>
                  </Box>
                </Stack>
              </m.div>
            </Box>

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
