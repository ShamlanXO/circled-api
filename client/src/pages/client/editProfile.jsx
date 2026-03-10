// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../../components/Page';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, Formik, useFormikContext } from 'formik';
// sections
import {
  Box,
  Typography,
  Stack,
  ButtonBase,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  Tabs,
  Tab,
  IconButton,
  InputBase,
  InputAdornment,
  TextField,
} from '@mui/material';
import axios from '../../utils/axios';
import api from '../../utils/api';
import Footer from '../../components/onboarding/footer';
import { useNavigate, useLocation } from 'react-router';
import BodyMetrix from 'src/components/client/BodyMetrix';
import MyProfileHeader from 'src/components/client/profileHeader';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch } from 'react-redux';
import { updateOnboarding } from '../../redux/actions/Onboarding';
import Stepper from '../../components/progress';
import Image from '../../components/Image';
import Preview1 from '../../assets/onboarding/overview.svg';
import Preview2 from '../../assets/onboarding/overview2.svg';
import Preview3 from '../../assets/onboarding/overview3.svg';
import Iconify from '../../components/Iconify';
import Container from '../../components/Layout/Container';
import FooterBase from '../../components/Layout/Footer';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import { useState } from 'react';
import { updateProfile } from 'src/redux/actions/Profile';
import ProfileUpdateForm from 'src/components/dashboard/ProfileUpdateForm';
import HealthUpdateForm from 'src/components/dashboard/HealthUpdateForm';
import CameraIcon from 'src/assets/IconSet/camera';
import PhotoWidget from 'src/components/client/UploadphotoWidget';
import PersonalDetailIcon from 'src/assets/IconSet/fitnessProfile/PersonalDetails';
import { useSelector } from 'react-redux';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const BoxStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
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
const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: '0 20px',
  justifyContent: 'center',
}));
const BoxHeader = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
  boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
  borderRadius: '0px 0px 8px 8px',
}));
// ----------------------------------------------------------------------

export default function EditProfilePage(props) {
  const dispatch = useDispatch();
  const { search } = useLocation();

  const { state } = useLocation();

  const query = new URLSearchParams(search);

  const navigate = useNavigate();

  const Profile = useSelector((s) => s.Profile);

  const handleSubmit = (values, actions) => {
    actions.setSubmitting(false);
    dispatch(
      updateFeedback({
        loading: true,
      }),
    );
    dispatch(updateProfile({ ...values })).then(() => {
      dispatch(
        updateFeedback({
          loading: false,
        }),
      );
      navigate(-1);
    });
  };

  return (
    <Page title=" Simplified Online Fitness Training ">
      <Formik
        onSubmit={handleSubmit}
        initialValues={{
          title: '',
          name: Profile?.name,
          profileName: Profile?.profileName || Profile?.name,
          expertise: Profile?.expertise,
          phone: Profile?.phone,
          dob: Profile?.dob,
          bio: Profile?.bio,
          password: '',
          gender: Profile?.gender,
          goals: Profile?.goals,
          trainingExperience: Profile?.trainingExperience,
          YearsOfTraining: Profile?.YearsOfTraining,
          currentJob: Profile?.currentJob,
          faviroteCardio: Profile?.faviroteCardio,
          healthInfo: Profile?.healthInfo,
          activityLevel: Profile?.activityLevel || 'Light',
        }}
        component={({ values, setFieldValue, handleSubmit, isSubmitting }) => (
          <Form>
            <RootStyle>
              <Container>
                <Content
                  withoutPadding
                  style={{ paddingTop: 64, backgroundColor: '#F5F7FA' }}
                >
                  <Header
                    style={{
                      borderRadius: '0px 0px 8px 8px',
                      boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
                      overflow: 'hidden',
                    }}
                    position="fixed"
                  >
                    <BoxHeader
                      px={2}
                      py={2}
                      justifyContent={'space-between'}
                      display={'flex'}
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
                          variant="body1"
                          color="text.primary"
                        >
                          {/* My Profile&nbsp;&gt;&nbsp; */}
                          <Typography
                            component={'span'}
                            variant="h6"
                            color="teext.primary"
                          >
                            Edit profile
                          </Typography>
                        </Typography>{' '}
                      </Box>{' '}
                      <ButtonBase
                        sx={{ color: 'primary.main' }}
                        size="large"
                        color="primary"
                        type="submit"
                      >
                        <Typography variant="subtitle1">Done</Typography>
                      </ButtonBase>
                    </BoxHeader>
                  </Header>
                  <MyProfileHeader
                    Profile={Profile}
                    editmode
                  />

                  <Box
                    position="relative"
                    px={3}
                    py={2}
                  
                    bgcolor={'#fff'}
                  >
                    <ProfileUpdateForm
                      Profile={Profile}
                      mode={props.mode}
                    />
                    <br />
                  </Box>
                  <Box
                    position="relative"
                    px={3}
                    py={2}
                    mt={1}
                    bgcolor={'#fff'}
                  >
                    <HealthUpdateForm
                      measurements={
                        <Box mt={-4}>
                          <BodyMetrix
                            data={values.healthInfo}
                            setData={(data) => {
                              setFieldValue('healthInfo', { ...values.healthInfo, ...data });
                            }}
                          />
                        </Box>
                      }
                      Profile={Profile}
                      mode={props.mode}
                    />
                    <br />
                    <br />
                  </Box>
                  <Box mt={1}>
                    <Box
                      px={3}
                      bgcolor={'#fff'}
                      py={3}
                    >
                      <Typography
                        variant="h5"
                        color="text.primary"
                        gutterBottom
                        display={'flex'}
                        alignItems={'center'}
                        sx={{ mb: 2 }}
                      >
                        {/* <CameraIcon style={{marginRight:12}} mode="view"/>    */}
                        Body images
                      </Typography>
                      <PhotoWidget
                        mode={'edit'}
                        data={Profile.bodyImages}
                        setData={(d) =>
                          dispatch(
                            updateProfile({
                              bodyImages: d,
                            }),
                          )
                        }
                      />
                    </Box>
                  </Box>
                </Content>
              </Container>
            </RootStyle>
          </Form>
        )}
      ></Formik>
    </Page>
  );
}
