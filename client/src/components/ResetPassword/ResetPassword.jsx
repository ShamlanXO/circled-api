// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../Page';
// sections
import { Box, Typography, TextField, ButtonBase, Stack } from '@mui/material';
import { borderRadius } from '@mui/system';
import { IconButtonAnimate, varFade } from '../animate';
import Iconify from '../Iconify';
import Footer from '../onboarding/footer';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboarding } from '../../redux/actions/Onboarding';
import { useLocation } from 'react-router';
import axios from 'axios';
import api from '../../utils/api';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// ----------------------------------------------------------------------
import Header from '../onboarding/header';
import Container from '../Layout/Container';
import Content from '../Layout/Content';
import PasswordField from '../core/PasswordInput';
import OtpInput from 'react-otp-input';
import useCountdown from 'src/hooks/useCountdown';
const RootStyle = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fff',
  flex: 1,
  flexGrow: 1,
  height: '100vh',
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

// ----------------------------------------------------------------------

export default function ResetPasswordComponent(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Onboarding = useSelector((s) => s.Onboarding);
  const { state } = useLocation();
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationCode, setCode] = useState('');
  const [jwtToken, setJwtToken] = useState('');
  const inputCode = (otp) => {
    const regexp = /^[0-9]*$/;

    let code = otp.toString();

    if (regexp.test(code)) {
      setCode(code);
    }
    if (code.length == 0) {
      setCode('');
    }
  };

  const countdown = useCountdown(Date.now() + 120000);

  const handleOtpVerification = () => {
    dispatch(
      updateFeedback({
        loading: true,
      }),
    );
    axios
      .post(`${api.protocol}${api.baseUrl}${api.verifyMail}`, {
        email: props.formEmail,
        // email: "",
        token: verificationCode,
      })
      .then((res) => {
        dispatch(
          updateFeedback({
            loading: false,
            snackbar: true,
            message: 'Otp Verified!',
            severity: 'success',
          }),
        );
        setOtpVerified(true);

        setJwtToken(res.data);
      })
      .catch((err) => {
        if (err.response.status === 406)
          dispatch(
            updateFeedback({
              loading: false,
              snackbar: true,
              message: 'Acccount with give email address already exists!',
              severity: 'error',
            }),
          );
        if (err.response.status === 404)
          return dispatch(
            updateFeedback({
              loading: false,
              snackbar: true,
              message: 'Invalid code!',
              severity: 'error',
            }),
          );
      });
  };

  const rePass =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

  const ResetSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .matches(
        rePass,
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      ),

    confirmPass: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPass: '',
    },
    validationSchema: ResetSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      dispatch(
        updateFeedback({
          loading: true,
        }),
      );
      axios
        .patch(`${api.protocol}${api.baseUrl}${api.changePassword}`, {
          Email: props.formEmail,
          Password: values.password,
          token: jwtToken,
        })
        .then((res) => {
          dispatch(
            updateFeedback({
              loading: false,
              snackbar: true,
              message: 'Password Reset completed',
              severity: 'success',
            }),
          );
          navigate('/');
        })
        .catch((err) => {
          if (err.response.status === 406)
            dispatch(
              updateFeedback({
                loading: false,
                snackbar: true,
                message: 'Acccount with give email address already exists!',
                severity: 'error',
              }),
            );
          if (err.response.status === 404)
            return dispatch(
              updateFeedback({
                loading: false,
                snackbar: true,
                message: 'Invalid code!',
                severity: 'error',
              }),
            );
        });
    },
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, values } = formik;
  return (
    <>
      {otpVerified ? (
        <RootStyle>
          <FormikProvider value={formik}>
            <Form
              autoComplete="off"
              noValidate
              onSubmit={handleSubmit}
            >
              <Container>
                <Header title={'Create new password'} />
                <Content>
                  <Box
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent="center"
                    alignItems={'center'}
                    px={2}
                    flexGrow={'1'}
                  >
                    <Stack
                      spacing={2}
                      sx={{ width: '100%' }}
                    >
                      <PasswordField
                        clabel=" New Password"
                        fullWidth
                        placeholder=""
                        {...getFieldProps('password')}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                      />
                      <PasswordField
                        clabel="Confirm Password"
                        fullWidth
                        placeholder=""
                        {...getFieldProps('confirmPass')}
                        error={Boolean(touched.confirmPass && errors.confirmPass)}
                        helperText={touched.confirmPass && errors.confirmPass}
                      />
                    </Stack>
                  </Box>
                </Content>
                <Footer next />
              </Container>
            </Form>
          </FormikProvider>
        </RootStyle>
      ) : (
        <RootStyle>
          <Header title={'Reset Password'} />
          <Box
            display={'flex'}
            height={'100%'}
            flexDirection={'column'}
            justifyContent="center"
            alignItems={'center'}
            flexGrow={1}
            px={2}
          >
            <Typography
              variant='"body2'
              color={'grey.600'}
            >
              Please enter the verification code sent to
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              sx={{ my: 1, fontWeight: 'bold', mb: 3 }}
            >
              {props.formEmail}
            </Typography>
            <Box width={'100%'}>
              <OtpInput
                value={verificationCode}
                onChange={inputCode}
                numInputs={6}
                isInputNum={true}
                shouldAutoFocus={true}
                separator={<span>&nbsp;</span>}
                containerStyle={{
                  border: 'none',
                  width: '100%',
                  justifyContent: 'space-around',
                }}
                inputStyle={{
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  padding: 10,
                  width: 48,
                  height: 64,
                  backgroundColor: 'rgba(245, 247, 250, 1)',
                  fontSize: 24,
                  color: '#2F86EB',
                  boxShadow: 'none',
                  borderRadius: 8,
                  borderBottom: '0px',
                  fontWeight: 'bold',
                }}
                focusStyle={{
                  outline: 'none',
                  borderBottom: '0px',
                  color: '#2F86EB',
                  fontWeight: 'bold',
                }}
              />
            </Box>

            <Box
              display={'flex'}
              justifyContent="space-between"
              sx={{ my: 3 }}
            >
              <Typography variant='"body2'>
                Wait till&nbsp;
                {countdown.minutes}&nbsp;mins&nbsp;
                {countdown.seconds}&nbsp;s
              </Typography>
              <ButtonBase sx={{ fontWeight: 'bold', ml: 2 }}>
                <Typography
                  variant='"body2'
                  color="primary"
                >
                  Resend code
                </Typography>
              </ButtonBase>
            </Box>
          </Box>
          <Footer
            back
            next
            backClick={props.handleBackToEmail}
            disabledNext={verificationCode.length < 6}
            nextClick={handleOtpVerification}
          />
        </RootStyle>
      )}
    </>
  );
}
