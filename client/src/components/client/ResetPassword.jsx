// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../Page';
// sections
import {
  Avatar,
  Box,
  InputAdornment,
  Radio,
  Stack,
  RadioGroup,
  Typography,
  Grid,
  Divider,
  Button,
  ButtonBase,
} from '@mui/material';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { IconButtonAnimate, varFade } from '../animate';
import Iconify from '../Iconify';
import axios from '../../utils/axios';
import api from 'src/utils/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import LabeledInput from '../core/LabeledInput';
import PasswordField from '../core/PasswordInput';
import { updateFeedback } from 'src/redux/actions/feedback';
import { MobileDatePicker } from '@mui/lab';
import LabeledPhoneInput from '../core/PhoneInput';
import { updateProfile } from 'src/redux/actions/Profile';
import { useDispatch } from 'react-redux';

import 'src/pages/onboarding/dropdown.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

const BoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 10px',
  zIndex: 100,
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

export default function ClientProfileUpdateForm(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rePass =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

  const RegisterSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Password is required'),
    password: Yup.string()
      .required('Password is required')
      .matches(
        rePass,
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      ),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const [filePicked, setFilePicked] = useState(null);
  const formik = useFormik({
    initialValues: {},
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      dispatch(
        updateFeedback({
          loading: true,
        }),
      );
      axios
        .post(`${api.protocol}${api.baseUrl}${api.resetPass}`, {
          Password: values.password,
          currentPassword: values.currentPassword,
        })
        .then((response) => {
          navigate(-1);
          dispatch(
            updateFeedback({
              loading: false,
              snackbar: true,
              message: 'Password reset successfully',
              severity: 'success',
            }),
          );
        })
        .catch((error) => {
          dispatch(
            updateFeedback({
              loading: false,
            }),
          );
          if (error.response.status === 409) {
            return setErrors({
              currentPassword: 'Current password is incorrect',
            });
          }
          return dispatch(
            updateFeedback({
              loading: false,
              snackbar: false,
              message: 'Error updating the password!',
              severity: 'error',
            }),
          );
        });
    },
  });

  const imageHandler = (event) => {
    if (!event.target.files[0]) return false;

    setFilePicked(URL.createObjectURL(event.target.files[0]));

    setFieldValue('avatar', event.target.files[0]);
  };
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, values } = formik;

  return (
    <FormikProvider value={formik}>
      <Form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <Stack
          spacing={2}
          sx={{ width: '100%' }}
        >
          <PasswordField
            clabel="Current Password"
            fullWidth
            placeholder=""
            {...getFieldProps('currentPassword')}
            error={Boolean(touched.currentPassword && errors.currentPassword)}
            helperText={touched.currentPassword && errors.currentPassword}
          />
          <PasswordField
            clabel="New Password"
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
            {...getFieldProps('confirmPassword')}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
          />
        </Stack>{' '}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 4 }}
          type="submit"
        >
          Reset Password
        </Button>
      </Form>
    </FormikProvider>
  );
}
