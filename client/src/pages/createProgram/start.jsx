// @mui
import { styled } from '@mui/material/styles';
import { useState, useEffect, forwardRef } from 'react';
// sections
import {
  Box,
  Typography,
  Stack,
  ButtonBase,
  InputAdornment,
} from '@mui/material';
import Content from '../../components/Layout/Content';
import { useNavigate, useLocation } from 'react-router';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch } from 'react-redux';

import Iconify from '../../components/Iconify';
import LabeledInput from '../../components/core/LabeledInput';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { handleuploadImage } from 'src/utils/uploader';
import Input from 'src/components/Labs/Cropper';
import { useOutletContext } from 'react-router-dom';
import DurationPopover from 'src/components/instructor/durationPopover';
import WorkoutIntensityPopOver from 'src/components/instructor/calenderFormatPopover';
import { useConfirmationModalContext } from 'src/utils/Modal';
import { hasExercisesInWeeks } from 'src/utils/commonHelper';

const RootStyle = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  flexGrow: 1,
  height: '100vh',
}));

const BoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  maxWidth: 'xs',
  zIndex: 100,
  borderRadius: '0px 0px 8px 8px',
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
const SocialButton = styled(ButtonBase)(({ theme }) => ({
  height: 45,

  borderRadius: 16,
  background: '#F9FCFD',
  fontFamily: 'Proxima Nova',
  color: '#172A44',
  fontSize: 18,
  fontWeight: 'bold',
  width: '100%',
  marginBottom: 8,
  border: '2px solid rgba(23, 42, 68, 0.5)',
}));

// ----------------------------------------------------------------------

export default forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { state, search } = location;
  const modalContext = useConfirmationModalContext();
  const [Program, updateProgram, mode] = useOutletContext();

  const query = new URLSearchParams(search);
  const [selectedDuration, setSelectedDuration] = useState(
    Program?.ExercisePlan?.weeks?.length || 4
  );
  const [selectedType, setSelectedType] = useState(Program.Type ? Program.Type : 'Easy');
  const handleSelectDuration = (val) => {
    if (val > selectedDuration) {
      setSelectedDuration(val);
      setFieldValue('Duration', val);

      return;
    } else {
      if (hasExercisesInWeeks(Program, val, selectedDuration)) {
        modalContext
          .showConfirmationModal(
            'Alert!',
            'Reducing week in already created calendar will delete all the workouts of deleted week. Do you want to continue?',
            'Yes',
            'No',
          )
          .then((res) => {
            if (res) {
              setSelectedDuration(val);
              setFieldValue('Duration', val);
            } else {
            }
          });
      } else {
        setSelectedDuration(val);
        setFieldValue('Duration', val);

        return;
      }
    }
  };

  const handleSelectType = (val) => {
    setFieldValue('calendarType', val);
    dispatch(
      updateProgram({
        calendarType: val,
      }),
    );
  };

  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').max(50, 'Title too long'),
    price: Yup.number().required('Price is required'),
    totalClients: Yup.number().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      title: Program.Title || '',
      description: Program.Description || '',
      BannerImage: Program.BannerImage,
      price: Program.Price,
      PaymentType: Program.PaymentType || 'Free',
      ProgramType: Program.ProgramType || 'Public',
      maximumClient: Program.maximumClient || 'Unlimited',
      totalClients: Program.totalClients || 10,
      calendarType: Program.calendarType || 'Standard days',
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      let weeks = [...Program.ExercisePlan.weeks];
      if (selectedDuration < Program.Duration) {
        weeks.splice(selectedDuration, Program.Duration - 1);
      }

      if (selectedDuration > Program.Duration) {
        for (let i = 0; i < selectedDuration - Program.Duration; i++) {
          weeks.push({
            days: Array(7).fill({
              Title: '',
              IsRest: false,
              Exercise: [],
              Cover: null,
            }),
          });
        }
      }

      dispatch(
        updateProgram({
          Title: values.title,
          Description: values.description,
          BannerImage: values.BannerImage,
          Duration: selectedDuration || 4,
          Price: values.price,
          ProgramType: values.ProgramType,
          ExercisePlan: {
            ...Program.ExercisePlan,
            weeks: weeks,
          },
        }),
      );
    },
  });

  const handleMaximumClient = (val) => {
    if (val == 'Limited') {
      setFieldValue('totalClients', 10);
      setFieldValue('maximumClient', val);
      dispatch(
        updateProgram({
          totalClients: 10,
          maximumClient: val,
        }),
      );
    } else {
      setFieldValue('maximumClient', val);
      dispatch(
        updateProgram({
          maximumClient: val,
        }),
      );
    }
  };

  const handleSubscriptionType = (val) => {
    if (val === 'Free') {
      setFieldValue('price', 0);
      dispatch(updateProgram({ Price: 0, PaymentType: val }));
    } else {
      dispatch(updateProgram({ PaymentType: val }));
    }
    setFieldValue('PaymentType', val);
  };

  const handleProgramType = (val) => {
    setFieldValue('ProgramType', val);
    dispatch(
      updateProgram({
        ProgramType: val,
      }),
    );
  };

  const { errors, touched, handleSubmit, isSubmitting, isValid, validateForm, getFieldProps, setFieldValue, values } =
    formik;

  useEffect(() => {
    if (ref) {
      ref.current = {
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        validateForm,
        getFieldProps,
        setFieldValue,
        values,
      };
    }
  }, [errors, touched, handleSubmit, isSubmitting, validateForm, getFieldProps, setFieldValue, values]);

  return (
    <Content
      withoutPadding
      style={{ paddingBottom: 24, background: '#fff' }}
    >
      <FormikProvider value={formik}>
        <Form
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit}
        >
          <Input
            hidden
            accept="image/*"
            type="file"
            id="bannerImage"
            onChange={(e) => {
              dispatch(updateFeedback({ loading: true }));
              handleuploadImage(e).then((res) => {
                setFieldValue('BannerImage', res.data.Location);
                dispatch(updateFeedback({ loading: false }));
              });
            }}
            cropShape={'rect'}
            aspect={1.5}
          />
          <br />
          <Box
            position="relative"
            width="100%"
            height={values.BannerImage ? 'auto' : '210px'}
            mt={2}
            borderRadius={1}
            border={`1px solid ${values.BannerImage ? 'transparent' : '#E1E7F0'}`}
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              document.getElementById('bannerImage')?.click();
            }}
          >
            {values.BannerImage && (
              <img
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  backgroundColor: '#fff',
                }}
                src={values.BannerImage}
                alt="Banner"
              />
            )}

            {!values.BannerImage && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  textAlign: 'center',
                  paddingTop: 6,
                }}
              >
                <Iconify
                  icon={'fluent:image-32-regular'}
                  width={48}
                  height={48}
                  sx={{ color: 'text.secondary', pointerEvents: 'auto' }}
                />
                <Typography sx={{ mt: 1, textDecoration: 'underline', fontSize: 14, fontWeight: 600 }} color="text.secondary">
                  Add cover image
                </Typography>
                <Typography color="text.secondary">Optional</Typography>
              </Box>
            )}
          </Box>
          <br/>
          <Stack
            spacing={3}
            sx={{ width: '100%', px: 2 }}
          >
            <LabeledInput
              fullWidth
              placeholder="Example: Muscle build"
              maxLength={50}
              clabel="Program title"
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              inputProps={{
                maxLength: 50,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {(formik.values.title + '').length + '/50'}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
            <BoxStyle>
              <Box width="100%">
                <Typography
                  variant="subtitle1"
                  mb={1}
                >
                  Duration
                </Typography>{' '}
                <DurationPopover
                  selectedDuration={selectedDuration}
                  setSelectedDuration={handleSelectDuration}
                ></DurationPopover>
              </Box>{' '}
              &nbsp;&nbsp;
              <Box width="100%">
                <Typography
                  variant="subtitle1"
                  mx={1}
                  mb={1}
                >
                  Calendar format
                </Typography>{' '}
                <WorkoutIntensityPopOver
                  setSelectedType={handleSelectType}
                  selectedType={values.calendarType}
                ></WorkoutIntensityPopOver>
              </Box>
            </BoxStyle>
            <Box position="relative" width="100%">
              <LabeledInput
                fullWidth
                multiline
                minRows={6}
                placeholder="Describe your program for athletes so they know what to expect"
                clabel="Description"
                {...getFieldProps('description')}
                error={Boolean(touched.description && errors.description)}
                inputProps={{ maxLength: 1000 }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 16,
                  fontSize: 12,
                }}
              >
                {(formik.values.description || '').length}/1000
              </Typography>
            </Box>
          </Stack>{' '}
        </Form>
      </FormikProvider>
    </Content>
  );
});
