// @mui
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
// components
import Page from '../../../components/Page';
// sections
import {
  Box,
  Button,
  Typography,
  Stack,
  Avatar,
  ButtonBase,
  InputAdornment,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';

import Container from '../../../components/Layout/Container';
import Content from '../../../components/Layout/Content';
import Header from '../../../components/Layout/Header';
import FooterBase from '../../../components/Layout/Footer';
import { useNavigate, useLocation, useParams } from 'react-router';
import moment from 'moment';
import ProfileHeader from 'src/components/dashboard/ProfileHeader';
import IconPhotos from 'src/assets/clientProfile/Icon_Photos';
import IconBodySystem from 'src/assets/clientProfile/Icon_BodySystem';
import Iconify from 'src/components/Iconify';
import Logo from 'src/assets/figgslogo.png';
import CompletePaymentForm from 'src/components/client/completePaymentForm';
import { getSentPrograms, signOut } from 'src/redux/actions/common';
import { useDispatch } from 'react-redux';
import { updateProfile, updateInfo } from 'src/redux/actions/Profile';
import { addFreeOrder } from 'src/redux/actions/payments';
import { updateFeedback } from 'src/redux/actions/feedback';
import { useSelector } from 'react-redux';
import { checkUserExistance } from 'src/redux/actions/common';
import LoginDrawer from 'src/components/common/LoginDrawer';
import Image from 'src/components/Image';
import { createSubscription, approveSubscription, createOrder, approveOrder } from 'src/redux/actions/payments';
import { isSameDateError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
const RootStyle = styled('div')(() => ({
  backgroundColor: '#fff',
  height: '100%',
}));

const BoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
}));
const BoxHeader = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
  boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
  borderRadius: '0px 0px 8px 8px',
}));
const BoxFooter = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
  padding: '16px',
  borderTop: '1px solid rgb(225, 231, 240)',
  borderRadius: '24px 24px 0px 0px',
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

// ----------------------------------------------------------------------

export default function ClientCompletePaymentPage() {
  const [headerDependency, setHeaderDependency] = useState(false);
  const { search, pathname } = useLocation();
  const { id, email, token } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [programData, setProgramData] = useState({});
  const [perror, setPerror] = useState('');
  const Profile = useSelector((s) => s.Profile);
  const [drawer, setOpenDrawer] = useState(false);

  const query = new URLSearchParams(search);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (programData) {
      if (programData.PaymentType == 'Subscription') {
        window.paypal
          ?.Buttons({
            style: {
              layout: 'horizontal',
              color: 'blue',
              height: 55,
            },
            createSubscription: function (data, actions) {
              return createSubscription(id).then((result) => {
                return result;
              });
            },

            onApprove: function (data, actions) {
              console.log(data);
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
        window?.paypal
          ?.Buttons({
            style: {
              layout: 'horizontal',
              color: 'blue',
              height: 55,
            },
            createOrder: function (data, actions) {
              return createOrder(id).then((result) => {
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
    }
    // else{
    //   if(props.fetchPublic)
    //   props.fetchProgram(props.id)
    // }
  }, [programData._id]);

  useEffect(() => {
    checkUserExistance({ email: email.toLowerCase() })
      .then((res) => {
        setUserExists(true);
      })
      .catch((err) => {
        setUserExists(false);
      });
  }, []);

  useEffect(() => {
    if (Profile.token) {
      if (Profile.email.toLowerCase() == email.toLowerCase()) {
        // dispatch(updateProfile({ type: "Athlete" })).then((res) => {
        getSentPrograms(id)
          .then((resData) => {
            setProgramData(resData[0]);
          })
          .catch((err) => {
            setNotFound(true);
            setPerror(404);
          });
        // });
      } else {
        setNotFound(true);
        setPerror(401);
      }
    } else {
      getSentPrograms(id)
        .then((resData) => {
          setProgramData(resData[0]);
        })
        .catch((err) => {
          setNotFound(true);
          setPerror(404);
        });
      // dispatch(updateInfo({ type: "Client" }));
      // if (token)
      //   navigate("/onboarding/client", {
      //     state: {
      //       redirect: pathname,
      //       email,
      //       token,
      //     },
      //   });
      // else {
      //   navigate("/login", {
      //     state
      //       redirect: pathname,
      //       email,
      //       token,
      //     },
      //   });
      // }
    }
  }, []);

  const addnewOrder = (id) => {
    if (!Profile.token) {
      if (token && !userExists)
        navigate('/onboarding/client', {
          state: {
            redirect: pathname,
            email,
            token,
          },
        });
      else {
        navigate('/login', {
          state: {
            redirect: pathname,
            email,
            token,
          },
        });
      }
      return;
    }

    addFreeOrder(id).then((res) => {
      dispatch(updateProfile({ type: 'Athlete' })).then((res) => {
        navigate('/');
      });
      dispatch(
        updateFeedback({
          loading: false,
          sAnimate: true,
          message: 'Program Added Successfully',
          severity: 'success',
        }),
      );
    });
  };

  const handleErrorButton = () => {
    if (perror == 401) {
      dispatch(signOut());
      if (token)
        navigate('/onboarding/client', {
          state: {
            redirect: pathname,
            email,
            token,
          },
        });
      else {
        navigate('/login', {
          state: {
            redirect: pathname,
            email,
            token,
          },
        });
      }
    } else {
      navigate('/');
    }
  };

  return (
    <RootStyle>
      <LoginDrawer
        open={drawer}
        onClose={() => setOpenDrawer(false)}
        type={'program'}
      />
      <Page title=" Simplified Online Fitness Training ">
        {notFound ? (
          <Container>
            <Content>
              <Box
                display={'flex'}
                justifyContent="center"
                alignItems={'center'}
                mt={8}
              >
                <img
                  src={Logo}
                  height={46}
                />
              </Box>
              <Box
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                height={'100%'}
                alignItems={'center'}
              >
                <Iconify
                  icon="ant-design:stop-outlined"
                  sx={{ fontSize: 120, color: 'text.secondary', mb: 4 }}
                />
                <Typography
                  gutterBottom
                  variant="h2"
                  color={'text.secondary'}
                  sx={{ textAlign: 'center' }}
                >
                  {perror == 404 ? 'Program unavailable' : 'Unauthorized Access'}
                </Typography>
                <Typography
                  gutterBottom
                  variant="body"
                  color={'text.secondary'}
                  sx={{ textAlign: 'center' }}
                >
                  {perror == 404
                    ? `This program might have been removed or unavailable anymore`
                    : `This program is sent to ${email} only, you are not authorized to access this program`}
                </Typography>
                <br />
                <Button onClick={handleErrorButton}>
                  {perror == 404 ? 'Back to home' : `Click here to ${token ? 'Signup' : 'Login'} as ${email}`}
                </Button>
              </Box>
            </Content>
          </Container>
        ) : (
          <Container>
            {' '}
            <Header
              style={{
                borderRadius: '0px 0px 8px 8px',
                boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
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
                  {/* <IconButton
                                        onClick={() => navigate('/')}
                                        sx={{ color: 'text.primary' }}
                                    >
                                        <ArrowLeft />
                                    </IconButton>
                                    &nbsp; */}
                  <Typography
                    variant="h5"
                    color="text.primary"
                  >
                    Program view
                  </Typography>
                </Box>
                {/* <BoxStyle>
                <Box
                  display={"flex"}
                  alignItems="center"
                  onClick={() => navigate("/programOverview")}
                >
                  <Avatar
                    variant="rounded"
                    style={{
                      width: "120px",
                      height: "112px",
                      backgroundColor: "#F3F5F8",
                    }}
                    src={
                      programData.BannerImage ||
                      "/images/instructor/programImage.png"
                    }
                  />

                  <Box width="auto" marginLeft={2}>
                    <Typography variant="h6" color="text.primary">
                      {programData?.Title}
                    </Typography>{" "}
                    <Typography variant="h3" color="secondary.main">
                      $ {programData?.Amount}
                    </Typography>
                  </Box>
                </Box>
              </BoxStyle> */}
              </BoxHeader>
            </Header>{' '}
            {!programData?.Amount ? (
              <Content
                withoutPadding
                style={{ marginTop: -8 }}
              >
                <Box
                  position="relative"
                  backgroundColor={'#fff'}
                >
                  <img
                    src={programData?.Program?.BannerImage || '/images/profile-banner.png'}
                    style={{
                      width: '100%',
                      height: 'auto',
                      marginTop: programData?.Program?.BannerImage ? -36 : 0,
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
                        variant="h4"
                        align="left"
                        sx={{
                          textTransform: 'capitalize',
                        }}
                        color="text.primary"
                        gutterBottom
                      >
                        {programData?.Title}
                      </Typography>
                      <Typography color={'text.secondary'}>
                        {programData?.Program?.Description || 'No details available'}
                      </Typography>
                    </Box>
                    <Stack
                      direction={'row'}
                      spacing={1}
                      alignItems={'center'}
                    >
                      <Avatar src={programData?.Program?.createdBy?.profilePic} />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            textTransform: 'capitalize',
                          }}
                          color="text.primary"
                        >
                          {programData?.Program?.createdBy?.name}
                        </Typography>
                        {/* <Typography
                                                    sx={{
                                                        textTransform:
                                                            'capitalize',
                                                    }}
                                                    color="text.secondary"
                                                >
                                                    {
                                                        programData?.Program
                                                            ?.createdBy
                                                            ?.expertise
                                                    }
                                                </Typography> */}
                        <Typography
                          variant="subtitle1"
                          color={'primary'}
                          onClick={() => navigate(`/public/instructor-profile/${programData?.Program?.createdBy?._id}`)}
                        >
                          View profile
                        </Typography>
                      </Box>
                    </Stack>
                    <Divider />
                    <Grid container>
                      {/* <Grid item xs={6} md={6}>
                                                <Typography
                                                    variant="h6"
                                                    color="text.primary"
                                                >
                                                    Program level
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    {programData?.Program?.Type}
                                                </Typography>
                                            </Grid> */}
                      <Grid
                        item
                        xs={6}
                        md={6}
                      >
                        <Typography
                          variant="h6"
                          color="text.primary"
                        >
                          Date created
                        </Typography>
                        <Typography color="text.secondary">
                          {moment(programData?.createdAt).format('DD-MM-YYYY')}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        md={6}
                      >
                        <Typography
                          variant="h6"
                          color="text.primary"
                        >
                          Duration
                        </Typography>
                        <Typography color="text.secondary">{programData?.Program?.Duration} Weeks</Typography>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        md={6}
                        sx={{ mt: 2 }}
                      >
                        <Typography
                          variant="h6"
                          color="text.primary"
                        >
                          Pricing model
                        </Typography>
                        <Typography color="text.secondary">{programData?.Program?.PaymentType}</Typography>
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

                {/* <BoxFooter id="paypal-button-container"></BoxFooter> */}
              </Content>
            ) : (
              <Content
                withoutPadding
                style={{ marginTop: -8 }}
              >
                <BoxStyle>
                  <Box
                    display={'flex'}
                    alignItems="center"
                    onClick={() => navigate('/programOverview')}
                  >
                    <Avatar
                      variant="rounded"
                      style={{
                        width: '96px',
                        height: '83px',
                        backgroundColor: '#F3F5F8',
                      }}
                      src={programData?.Program.BannerImage || '/images/instructor/programImage.png'}
                    />

                    <Box
                      width="auto"
                      marginLeft={2}
                    >
                      <Typography
                        variant="h6"
                        color="text.primary"
                        sx={{
                          textTransform: 'capitalize',
                        }}
                      >
                        {programData?.Title}
                      </Typography>{' '}
                      <Typography color="text.secondary">$ {programData?.Amount?.toFixed(2)}</Typography>
                    </Box>
                  </Box>
                </BoxStyle>
                <Box px={2}>
                  <br />
                  <CompletePaymentForm />
                  <br />
                  <Divider />
                  <Stack
                    spacing={1.5}
                    sx={{ width: '100%' }}
                  >
                    .
                    <Stack spacing={1}>
                      <Typography
                        variant="h4"
                        color="text.primary"
                      >
                        Summary
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent={'space-between'}
                        alignItems="center"
                      >
                        <Typography
                          variant="body1"
                          color="text.secondary"
                        >
                          Original price:
                        </Typography>{' '}
                        <Typography
                          variant="body1"
                          color="text.secondary"
                        >
                          $ {programData.Amount?.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent={'space-between'}
                        alignItems="center"
                      >
                        <Typography
                          variant="body1"
                          color="text.secondary"
                        >
                          Discount:
                        </Typography>{' '}
                        <Typography
                          variant="body1"
                          color="text.secondary"
                        >
                          -&nbsp;$ 0.00
                        </Typography>
                      </Box>
                      <Divider />
                    </Stack>
                    <Box
                      display="flex"
                      justifyContent={'space-between'}
                      alignItems="center"
                    >
                      <Typography
                        variant="h4"
                        color="text.primary"
                      >
                        Subtotal:
                      </Typography>{' '}
                      <Typography
                        variant="h4"
                        color="secondary.main"
                      >
                        $ {programData.Amount?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                    >
                      {programData.Description}
                    </Typography>
                  </Stack>
                </Box>
              </Content>
            )}
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
                      ${programData?.Amount?.toFixed(2)}
                    </Typography>
                  </Box>
                  {programData.Amount && Profile.token ? (
                    <Box id="paypal-button-container"></Box>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        px: 3,
                        minWidth: 172,
                      }}
                      id="paypal-button-container"
                      onClick={() => {
                        if (!Profile.token) {
                          setOpenDrawer(true);
                          return;
                        } else {
                          addnewOrder(id);
                        }
                      }}
                    >
                      <Typography variant="subtitle1">{programData.Amount == 0 ? 'Subscribe' : 'Subscribe'}</Typography>
                    </Button>
                  )}
                  {/* <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      px: 3,
                      minWidth: 172,
                    }}
                    id="paypal-button-container"
                    onClick={() => addnewOrder(id)}
                  >
                    <Typography variant="subtitle1">
                      {programData.Amount == 0 ? "Subscribe" : "PurchasePurchase"}
                    </Typography>
                  </Button> */}
                </Stack>
              </BoxFooter>
            </FooterBase>
          </Container>
        )}
      </Page>
    </RootStyle>
  );
}
