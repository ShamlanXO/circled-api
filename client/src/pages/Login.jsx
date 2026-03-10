// @mui
import { styled } from '@mui/material/styles';
// components
import Page from './../components/Page';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// sections
import { Box, Typography, Stack, ButtonBase, Button, Divider } from '@mui/material';
import axios from './../utils/axios';
import api from './../utils/api';
import Footer from './../components/onboarding/footer';
import { useNavigate, useLocation } from 'react-router';
import TextField from './../components/core/LabeledInput';
import PasswordField from './../components/core/PasswordInput';
// ----------------------------------------------------------------------
import Header from './../components/onboarding/header';
import Container from './../components/Layout/Container';
import Content from './../components/Layout/Content';
import { updateFeedback } from './../redux/actions/feedback';
import { initProfile } from './../redux/actions/Profile';
import { useDispatch } from 'react-redux';
import { updateOnboarding } from './../redux/actions/Onboarding';
import GoogleLogin from 'react-google-login';
import { useConfirmationModalContext } from './../utils/Modal';
import Iconify from './../components/Iconify';
import Logo from './../assets/figgslogo.png';
const RootStyle = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  flexGrow: 1,
}));

const BoxStyle = styled(Box)(() => ({
  position: 'relative',
}));

const InsideBoxStyle = styled(Box)(() => ({
  position: 'absolute',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  paddingTop: 52,
  paddingBottom: 24,
  zIndex: 100,
  top: 0,
}));
const SocialButton = styled(Button)(({ theme }) => ({
  height: 52,
  alignItems: 'center',
  borderRadius: 40,
  background: '#fff',
  border: '1.5px solid #C3CBD9',
  borderColor: '#C3CBD9',
  boxShadow: '0px 4px 4px rgba(43, 64, 87, 0.1)',
  fontFamily: 'Proxima Nova',
  paddingLeft: '12px',
  /* Dark primary / 50% */
  color: '#172A44',
  fontSize: 16,
  fontWeight: 'bold',

  marginBottom: 8,
  border: '1.5px solid ',
}));

// ----------------------------------------------------------------------

export default function HomePage() {
  const dispatch = useDispatch();
  const { state } = useLocation();

  const rePass =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });
  const modalContext = useConfirmationModalContext();
  const formik = useFormik({
    initialValues: {
      email: state?.email,
      password: '',
      confirmPass: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      dispatch(
        updateFeedback({
          loading: true,
        }),
      );

      axios
        .post(`${api.protocol}${api.baseUrl}${api.userLogin}`, {
          phone: '',
          password: values.password,
          email: values.email,
        })
        .then((response) => {
          //setTimeout(() => socketConnection(), 1000);
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
        });
    },
  });

  const responseGoogle = (res) => {
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

  const navigate = useNavigate();
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, values } = formik;
  return (
    <Page title=" Simplified Online Fitness Training ">
      <Container>
        <Header
          title={'Login'}
          onClose={() => navigate('/', { state })}
        />
        <Content withoutPadding>
          <FormikProvider value={formik}>
            <Form
              autoComplete="off"
              noValidate
              onSubmit={handleSubmit}
            >
              <RootStyle>
                <Box
                  display={'flex'}
                  justifyContent="center"
                  alignItems={'center'}
                  mt={4}
                >
                  <img
                    src={Logo}
                    height={46}
                  />
                </Box>
                <Box
                  display={'flex'}
                  height={'100%'}
                  flexDirection={'column'}
                  justifyContent={'space-around'}
                  alignItems={'center'}
                  px={2}
                  flexGrow={'1'}
                >
                  <Typography
                    variant="h2"
                    color={'text.primary'}
                    sx={{ my: 4 }}
                  >
                    Welcome Back!
                  </Typography>

                  <Stack
                    spacing={2}
                    sx={{ width: '100%' }}
                  >
                    <TextField
                      fullWidth
                      placeholder=""
                      clabel="Email address"
                      {...getFieldProps('email')}
                      value={values.email}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                    />
                    <PasswordField
                      clabel="Password"
                      fullWidth
                      placeholder=""
                      {...getFieldProps('password')}
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                    />
                    <Box
                      display={'flex'}
                      width={'100%'}
                      sx={{ mt: 1 }}
                      justifyContent={'space-between'}
                    >
                      <div></div>
                      <ButtonBase onClick={() => navigate('/forgotPassword')}>
                        <Typography color={'primary'}>Forgot Password ?</Typography>
                      </ButtonBase>
                    </Box>
                    <Box
                      display={'flex'}
                      width={'100%'}
                      sx={{ mt: 1 }}
                      justifyContent={'space-between'}
                    >
                      <Box
                        display={'flex'}
                        flex={1}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          type="submit"
                        >
                          Login{' '}
                        </Button>
                      </Box>
                    </Box>
                  </Stack>
                  <Box
                    width={'100%'}
                    my={2}
                  >
                    {' '}
                    <Divider>
                      <Typography
                        color={'text.secondary'}
                        sx={{ px: 1 }}
                      >
                        OR
                      </Typography>
                    </Divider>
                  </Box>

                  <GoogleLogin
                    clientId="20299471486-m23pkgk770a4vq3dgjh8uc9k180cpc98.apps.googleusercontent.com"
                    render={(renderProps) => (
                      <SocialButton
                        sx={{
                          mb: 4,
                          borderColor: 'rgba(149, 163, 184, 1)',
                        }}
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        fullWidth
                        startIcon={
                          <Iconify
                            icon={'flat-color-icons:google'}
                            width={24}
                            height={24}
                          />
                        }
                        endIcon={
                          <Box
                            width={24}
                            height={24}
                          ></Box>
                        }
                      >
                        {/* <img src={GoogleIcon} style={{ marginRight: 8 }} /> */}
                        <Typography
                          variant="h6"
                          color="text.primary"
                        >
                          Login with google
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
                  <br />
                  <br />
                </Box>
              </RootStyle>
            </Form>
          </FormikProvider>
        </Content>
      </Container>
    </Page>
  );
}
