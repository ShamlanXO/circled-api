import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Box, Link, Divider, Typography, Stack, ButtonBase } from '@mui/material';
// routes

import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router';
import axios from 'src/utils/axios';
import api from 'src/utils/api';
import { updateFeedback } from 'src/redux/actions/feedback';
import { useDispatch } from 'react-redux';
import { updateOnboarding } from 'src/redux/actions/Onboarding';
import { useConfirmationModalContext } from 'src/utils/Modal';
import Iconify from 'src/components/Iconify';
import { initProfile } from 'src/redux/actions/Profile';

// ----------------------------------------------------------------------
import { useLocation } from 'react-router';

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

export default function HomeHero(props) {
  const dispatch = useDispatch();
  const modalContext = useConfirmationModalContext();
  const navigate = useNavigate();
  const { state } = useLocation();

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
        if (props.redirect) {
          navigate(props.redirect);
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
          navigate(`/onboarding/${props?.mode == 'client' || props?.type == 'Athlete' ? 'client/info' : 'preview'}`, {
            state: { ...state, ...props },
          });
        }
      });
  };

  return (
    <Stack spacing={2}>
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
              Continue with Google
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
      <SocialButton
        // onClick={renderProps.onClick}
        // disabled={renderProps.disabled}

        onClick={() =>
          navigate(props?.type == 'Athlete' ? '/onboarding/client' : '/onboarding', { state: { ...state, ...props } })
        }
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
          Continue with Email &nbsp;
        </Typography>
      </SocialButton>
    </Stack>
  );
}
