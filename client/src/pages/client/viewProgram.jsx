// @mui
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
// components
import Page from '../../components/Page';
// sections
import {
  Box,
  Button,
  Typography,
  Stack,
  Avatar,
  ButtonBase,
  InputAdornment,
  IconButton,
  StepLabel,
  StepContent,
  Step,
  Stepper,
  Tabs,
  Tab,

  Switch,
  Grid,
  Divider,
} from '@mui/material';

import Container from '../../components/Layout/Container';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import { useNavigate, useLocation, useParams } from 'react-router';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboarding } from '../../redux/actions/Onboarding';
import LinearProgress from '@mui/material/LinearProgress';
import Iconify from '../../components/Iconify';
import LabeledInput from '../../components/core/LabeledInput';
import FooterBase from '../../components/Layout/Footer';
import Progress from 'src/components/progress';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import Footer from 'src/components/onboarding/footer';
import axios from 'axios';
import api from 'src/utils/api';
import WorkoutCalendarHeader from 'src/components/instructor/workoutCalendarHeader';
import WorkoutWeek from 'src/components/instructor/workoutWeek';
import ExerciseCard from 'src/components/instructor/exerciseCard';
import Label from 'src/components/Label';
import { TabContext, TabPanel } from '@mui/lab';
import SwitchCustom from 'src/components/SwitchCustom';
import ProgramOverviewStatus from 'src/components/program/programOverviewStatus';
import ClientList from 'src/components/dashboard/client/ClientList';
import ProgramOverviewPopover from 'src/components/program/programOverviewPopover';
import { getSpecificPublicProgram } from 'src/redux/actions/createProgram';
import { sharedProgramData } from 'src/redux/actions/createProgram';
import {
  createSubscription,
  approveSubscription,
  createOrder,
  approveOrder,
  addFreeOrder,
  checkIfOrderExists,
} from 'src/redux/actions/payments';
import { updateProfile } from 'src/redux/actions/Profile';
import moment from 'moment';
import Image from 'src/components/Image';
import LoginDrawer from 'src/components/common/LoginDrawer';
import { result } from 'lodash';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import { switchExercise } from 'src/redux/actions/clientExercise';
const RootStyle = styled('div')(() => ({
  backgroundColor: '#fff',
  height: '100%',
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
const SocialButton = styled(ButtonBase)(({ theme }) => ({
  height: 45,

  borderRadius: 16,
  background: '#F9FCFD',
  fontFamily: 'Proxima Nova',
  /* Dark primary / 50% */
  color: '#172A44',
  fontSize: 18,
  fontWeight: 'bold',
  width: '100%',
  marginBottom: 8,
  border: '2px solid rgba(23, 42, 68, 0.5)',
}));
const BoxHeader = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
  boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
  borderRadius: '0px 0px 8px 8px',
}));
const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
}));

const PriceContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  borderRadius: 24,
  backgroundColor: 'rgba(255,255,255, 0.5)',
  backdropFilter: 'blur(12px)',
  display: 'flex',
  padding: '12px',
  justifyContent: 'space-between',
  alignItems: 'center',
}));
// ----------------------------------------------------------------------
const BoxFooter = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
  padding: '16px',

  borderTop: '1px solid rgba(23, 42, 68, 0.1)',
  borderRadius: '24px 24px 0px 0px',
}));
export default function ViewProgramPage() {
  const dispatch = useDispatch();
  const [clients, setClients] = useState([]);
  const { search } = useLocation();
  const location = useLocation();
  const Profile = useSelector((s) => s.Profile);
  const query = new URLSearchParams(search);
  const exercises = [{}, {}];
  const [sharedId, setSharedId] = useState(null);
  const [drawer, setOpenDrawer] = useState(false);
  const [orderExists, setOrderExists] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [data, setData] = useState({
    Title: 'Advanced bodybuilding',
    Description: `Lorem ipsum dolor sit amet, 
    consectetur adipiscing elit. Etiam mi tortor, euismod non  purus non, condimentum malesuada dui kobe lasne imanow w gre`,
    ProgramType: 'Begginer ',
    PaymentType: 'Subscription',
    Price: 295.0,
    updatedAt: '22-6-2022',
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getSpecificPublicProgram(id)).then((result) => {
      setData(result);

      if (Profile.token)
        dispatch(sharedProgramData(id)).then((shareId) => {
          setSharedId(shareId);

          if (data.PaymentType == 'Subscription') {
            window.paypal
              ?.Buttons({
                style: {
                  layout: 'horizontal',
                  color: 'blue',
                  height: 55,
                },
                createSubscription: function (data, actions) {
                  return createSubscription(shareId).then((result) => {
                    return result;
                  });
                },

                onApprove: function (data, actions) {
                  approveSubscription(data.subscriptionID)
                    .then(() => {
                      dispatch(
                        updateFeedback({
                          loading: false,
                          sAnimate: true,
                          message: 'Subscription Activated Successfully',
                          severity: 'success',
                        }),
                      );
                      navigate('/');
                    })
                    .catch((err) => {
                      dispatch(
                        updateFeedback({
                          loading: false,
                          snackbar: true,
                          message: 'Unable to activate subscription please contact support',
                          severity: 'info',
                        }),
                      );
                    });
                },

                onError: function (err) {
                  // props.updateFeedback({
                  //   loading: false,
                  //   snackbar: true,
                  //   message:
                  //     "Unable to process please try again",
                  //   severity: "error",
                  // })
                },
              })
              .render('#paypal-button-container');
          } else {
            window.paypal
              ?.Buttons({
                style: {
                  layout: 'horizontal',
                  color: 'blue',
                  height: 55,
                },
                createOrder: function (data, actions) {
                  return createOrder(shareId).then((result) => {
                    return result;
                  });
                },

                onApprove: function (data, actions) {
                  approveOrder(data.orderID)
                    .then(() => {
                      dispatch(
                        updateFeedback({
                          loading: false,
                          sAnimate: true,
                          message: 'Plan Activated Successfully',
                          severity: 'success',
                        }),
                      );
                      navigate('/');
                    })
                    .catch((err) => {
                      dispatch(
                        updateFeedback({
                          loading: false,
                          snackbar: true,
                          message: 'Unable to activate plan please contact support',
                          severity: 'info',
                        }),
                      );
                    });
                },

                onError: function (err) {
                  // props.updateFeedback({
                  //   loading: false,
                  //   snackbar: true,
                  //   message:
                  //     "Unable to process please try again",
                  //   severity: "error",
                  // })
                },
              })
              .render('#paypal-button-container');
          }
        });
    });
  }, [id,Profile.token]);

  useEffect(() => {
    checkIfOrderExists(id).then((res) => {
      setOrderExists(res.exists);
      setOrderId(res.orderId);
    });
  }, [id,Profile.token]);

  const addnewOrder = (id) => {
    if (!Profile.token) {
      navigate('/', {
        state: { redirect: location.pathname, type: 'Athlete' },
        replace: true,
      });
      return;
    }

    addFreeOrder(sharedId, id)
      .then((order_res) => {
        dispatch(updateProfile({ type: 'Athlete' })).then((res) => {
          dispatch(
            updateFeedback({
              sAnimate: true,
              profileType: 'Athlete',
            }),
          );

          dispatch(
            switchExercise({
              _id: order_res,
              isActive: true,
            }),
          ).then((sres) => {
            navigate('/');
            dispatch(
              updateFeedback({
                loading: false,
                sAnimate: true,
                profileType: null,
                message: 'Program Added Successfully',
                severity: 'success',
              }),
            );
          });
        });

        setTimeout(() => {}, 4000);
      })
      .catch((item) => {
        if (item._id) {
          dispatch(
            switchExercise({
              _id: item._id,
              isActive: true,
            }),
          ).then((res) => {
            navigate('/');
          });
        }
      });
  };

  const GoToProgram = (id) => {
    if (orderExists) {
      dispatch(
        switchExercise({
          _id: orderId,
          isActive: true,
        }),
      ).then((res) => {
        navigate('/');
      });
    }
  };

  const shareWorkout = () => {
    if (navigator.share) {
      navigator
        .share({
          title: ` shared a fitness program :`,
          url: `/public/workout-program/${id}`,
        })
        .then(() => {});
    }
  };

  return (
    <RootStyle>
      <LoginDrawer
        open={!Profile.token && drawer}
        onClose={() => setOpenDrawer(false)}
        type={'program'}
      />
      <Page title="An easy-to-use tool to build and manage your client's fitness programs">
        <Container>
          {' '}
          <Header noColor>
            <BoxHeader
              px={2}
              py={2}
            >
              <Box
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
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
                    View Program
                  </Typography>{' '}
                </Box>
                <IconButton onClick={() => shareWorkout()}>
                  <Iconify
                    icon={'ci:share-outline'}
                    width={24}
                    height={24}
                    color="text.primary"
                  />
                </IconButton>
              </Box>
            </BoxHeader>
          </Header>{' '}
          <Content
            withoutPadding
            style={{ marginTop: -12, paddingBottom: 32 }}
          >
            <Box
              position="relative"
              backgroundColor={'#fff'}
            >
              <img
                src={data.BannerImage || '/images/profile-banner.png'}
                style={{
                  width: '100%',
                  height: 'auto',
                  marginTop: data.BannerImage ? -36 : 0,
                  objectFit: 'cover',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              />
            </Box>

            <Box
              px={2}
              py={3}
            >
              <Stack
                spacing={2}
                sx={{ width: '100%' }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    align="left"
                    sx={{ textTransform: 'capitalize' }}
                    color="text.primary"
                    gutterBottom
                  >
                    {data?.Title}
                  </Typography>
                  <Typography color={'text.secondary'}
                   sx={{
                    whiteSpace: 'pre-wrap',
                  }}
                  
                  >{data?.Description || 'No details available'}</Typography>
                </Box>
                <Stack
                  direction={'row'}
                  spacing={1}
                  alignItems={'center'}
                >
                  <Avatar src={data?.createdBy?.profilePic} />
                  <Box pl={0.5}>
                    <Typography
                      variant="h6"
                      sx={{ textTransform: 'capitalize' }}
                      color="text.primary"
                    >
                      {data?.createdBy?.name}
                    </Typography>
                    <Typography
                      sx={{ textTransform: 'capitalize' }}
                      color="text.secondary"
                    >
                      {data?.createdBy?.expertise}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color={'primary'}
                      onClick={() => navigate(`/public/instructor-profile/${data?.createdBy?._id}`)}
                    >
                      View profile
                    </Typography>
                  </Box>
                </Stack>
                <Divider />
                <Grid container>
                  {/* <Grid item xs={6} md={6}>
                                        <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 'bold' }}
                                            color="text.primary"
                                        >
                                            Program level
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {data?.Type}
                                        </Typography>
                                    </Grid> */}
                  {/* <Grid item xs={6} md={6}>
                                        <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 'bold' }}
                                            color="text.primary"
                                        >
                                            Date created
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {moment(data?.createdAt).format(
                                                'DD-MM-YYYY'
                                            )}
                                        </Typography>
                                    </Grid> */}
                  <Grid
                    item
                    xs={6}
                    md={6}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'bold' }}
                      color="text.primary"
                    >
                      Duration
                    </Typography>
                    <Typography color="text.secondary">{data?.Duration} weeks</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={6}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'bold' }}
                      color="text.primary"
                    >
                      Pricing model
                    </Typography>
                    <Typography color="text.secondary">{data?.PaymentType}</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={6}
                    sx={{ mt: 2 }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'bold' }}
                      color="text.primary"
                    >
                      Created on
                    </Typography>
                    <Typography color="text.secondary">{moment(data?.createdAt).format('DD/MM/YYYY')}</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={6}
                    sx={{ mt: 2 }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'bold' }}
                      color="text.primary"
                    >
                      Updated at
                    </Typography>
                    <Typography color="text.secondary">{moment(data?.updatedAt).format('DD/MM/YYYY')}</Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Box>

            {/* <Stack spacing={1.5} sx={{ width: "100%" }}>
              .
              <Stack spacing={1}>
                <Typography variant="h4" color="text.primary">
                  Summary
                </Typography>
                <Box
                  display="flex"
                  justifyContent={"space-between"}
                  alignItems="center"
                >
                  <Typography variant="body1" color="text.secondary">
                    Original price:
                  </Typography>{" "}
                  <Typography variant="body1" color="text.secondary">
                    $ {programData.Amount}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent={"space-between"}
                  alignItems="center"
                >
                  <Typography variant="body1" color="text.secondary">
                    Discount:
                  </Typography>{" "}
                  <Typography variant="body1" color="text.secondary">
                    -&nbsp;$ 0.00
                  </Typography>
                </Box>
                <Divider />
                <Box
                  display="flex"
                  justifyContent={"space-between"}
                  alignItems="center"
                >
                  <Typography variant="body1" color="text.secondary">
                    Subtotal:
                  </Typography>{" "}
                  <Typography variant="body1" color="text.secondary">
                    $ {programData.Amount}
                  </Typography>
                </Box>
              </Stack>
              <Box
                display="flex"
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Typography variant="h4" color="text.primary">
                  Total:
                </Typography>{" "}
                <Typography variant="h4" color="secondary.main">
                  $ {programData.Amount}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {programData.Description}
              </Typography>
            </Stack> */}

            <BoxFooter
              id="paypal-button-container"
              sx={{ display: 'none' }}
            ></BoxFooter>
          </Content>
          {data?.createdBy?._id !== Profile._id ? (
            <FooterBase>
              {data.Price && Profile.token ? (
                <BoxFooter id="paypal-button-container"></BoxFooter>
              ) : (
                <BoxFooter>
                  {!orderExists ? (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!Profile.token) {
                          setOpenDrawer(true);
                          return;
                        } else {
                          addnewOrder(id);
                        }
                      }}
                    >
                      <Typography variant="subtitle1">{data.Price == 0 ? 'Subscribe' : 'Purchase'}</Typography>
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        GoToProgram(orderId);
                      }}
                    >
                      <Typography variant="subtitle1">Go to program</Typography>
                    </Button>
                  )}
                </BoxFooter>
              )}
            </FooterBase>
          ) : (
            <FooterBase>
              <BoxFooter>
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                >
                  <Box>
                    <Typography color="text.secondary">Total price</Typography>
                    <Typography
                      variant="h4"
                      color="text.primary"
                    >
                      ${data?.Price?.toFixed(2)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      px: 3,
                      mt: 1,
                      minWidth: 172,
                    }}
                    onClick={() => {
                      if (!Profile.token) {
                        setOpenDrawer(true);
                        return;
                      } else {
                        navigate(`/programOverview/${id}`);
                      }
                    }}
                  >
                    <Typography variant="subtitle1">View program</Typography>
                  </Button>
                </Stack>
              </BoxFooter>
            </FooterBase>
          )}
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
