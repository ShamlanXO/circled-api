// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../../components/Page';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
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
  Grid,
  Divider,
} from '@mui/material';
import axios from '../../utils/axios';
import api from '../../utils/api';
import Footer from '../../components/onboarding/footer';
import { useNavigate, useLocation } from 'react-router';
import { updateProfile } from 'src/redux/actions/Profile';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
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
import ProfileUpdateForm from 'src/components/dashboard/ProfileUpdateForm';
import ClientProfileUpdateForm from 'src/components/client/ProfileUpdateForm';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import CommonBottomDrawer from 'src/components/common/EditDrawer';
import moment from 'moment';

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

export default function AccountSettingPage() {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { state } = useLocation();
  const query = new URLSearchParams(search);

  const navigate = useNavigate();
  const Profile = useSelector((s) => s.Profile);
  const [tabValue, setTabValue] = useState('home');
  const [programs, setprograms] = useState([{}, {}, {}, {}]);

  const [current, setCurrent] = useState('Active');

  const swichAccount = () => {
    dispatch(
      updateFeedback({
        loading: true,
        sAnimate: true,
        message: '',
        description: '',
        profileType: Profile.type == 'Athlete' ? 'Instructor' : 'Athlete',
      }),
    );
    dispatch(
      updateProfile({
        type: Profile.type == 'Athlete' ? 'Instructor' : 'Athlete',
      }),
    ).then((res) => {
      setTimeout(() => {
        dispatch(
          updateFeedback({
            loading: false,
            sAnimate: false,
            profileType: '',
          }),
        );
      }, 4000);

      navigate('/');
    });
  };

  return (
    <Page title=" Simplified Online Fitness Training ">
      <RootStyle>
        <Container>
          <Header>
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
                  Personal info
                </Typography>{' '}
              </Box>{' '}
            </BoxHeader>
          </Header>

          <Content style={{ overflowY: 'auto', paddingBottom: '24px', padding: 0 }}>
            <br />
            <Box
              position="relative"
              px={3}
            >
              {/* <Typography variant='h2'>Personal information</Typography>
                            <Grid container spacing={2} sx={{mt:1}}>
                                <Grid item xs={6}>
                              <Typography variant='subtitle1'>First name</Typography>
                              <Typography sx={{textTransform:"capitalize",color:"text.secondary"}}>{Profile.name?.split(" ")?.[0]}</Typography>
                                </Grid>
                                <Grid item  xs={6}>
                              <Typography variant='subtitle1'>Last name</Typography>
                              <Typography sx={{textTransform:"capitalize",color:"text.secondary"}}>{Profile.name?.split(" ")?.[1]}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                              <Typography variant='subtitle1'>Birthday</Typography>
                              <Typography sx={{textTransform:"capitalize",color:"text.secondary"}}>{Profile?.DOB?moment(new Date(Profile?.DOB)).format("DD, MMM yyyy"):""}</Typography>
                                </Grid>
                                <Grid item  xs={6}>
                              <Typography variant='subtitle1'>Gender</Typography>
                              <Typography sx={{textTransform:"capitalize",color:"text.secondary"}}>{Profile?.gender}</Typography>
                                </Grid>
                            </Grid>
                           <br/> */}
              <ClientProfileUpdateForm Profile={Profile} />
            </Box>
            <Divider sx={{ mt: 2, borderWidth: 4, borderColor: '#F5F7FA' }} />
            <Box
              px={3}
              py={2}
            >
              <Typography
                variant="h2"
                gutterBottom
              >
                Account sign in
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
              >
                Email
              </Typography>
              <Typography
                variant="body"
                sx={{ textTransform: 'lowercase', display: 'flex', alignItems: 'center' }}
              >
                <Iconify
                  icon={'iconamoon:email-thin'}
                  sx={{ fontSize: 24, mr: 0.5 }}
                />
                {Profile?.email}
              </Typography>
              <br />
              <br />
            </Box>
            {/* <Divider sx={{my:2,borderWidth:4,borderColor:"#F5F7FA"}}/>
                        <Box px={3} >
                       
                            <Typography variant='h2'>Account mode</Typography>
                            <ButtonBase onClick={swichAccount} sx={{mt:2,mb:5}}>
                                <Typography
                                    variant="subtitle1"
                                    color={'secondary.main'}
                                >
                                    Switch to{' '}
                                    {Profile.type == 'Athlete'
                                        ? 'Trainer'
                                        : 'Athlete'}{' '}
                                    Mode
                                </Typography>
                            </ButtonBase>
                            
                           
                        </Box> */}
          </Content>
        </Container>
      </RootStyle>
    </Page>
  );
}
