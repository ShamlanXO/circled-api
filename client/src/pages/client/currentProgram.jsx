// @mui
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
// components
import Page from './../../components/Page';
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

import Container from './../../components/Layout/Container';
import Content from './../../components/Layout/Content';
import Header from './../../components/Layout/Header';
import FooterBase from './../../components/Layout/Footer';
import { useNavigate, useLocation, useParams } from 'react-router';
import moment from 'moment';
import ProfileHeader from 'src/components/dashboard/ProfileHeader';
import IconPhotos from 'src/assets/clientProfile/Icon_Photos';
import IconBodySystem from 'src/assets/clientProfile/Icon_BodySystem';
import Iconify from 'src/components/Iconify';
import CompletePaymentForm from 'src/components/client/completePaymentForm';
import { getSentPrograms } from 'src/redux/actions/common';
import { useDispatch } from 'react-redux';
import { updateProfile, updateInfo } from 'src/redux/actions/Profile';
import { addFreeOrder } from 'src/redux/actions/payments';
import { updateFeedback } from 'src/redux/actions/feedback';
import { useSelector } from 'react-redux';
import Image from 'src/components/Image';
import { createSubscription, approveSubscription, createOrder, approveOrder } from 'src/redux/actions/payments';
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
  borderTop: '1px solid #ECEEEF',
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

export default function CurrentProgramPage() {
  const dispatch = useDispatch();

  const { search } = useLocation();
  console.log(search);
  const query = new URLSearchParams(search);
  const exercises = [{}, {}];
  const navigate = useNavigate();

  const [current, setCurrent] = useState('About');

  const Exercise = useSelector((s) => s.AtheletePlan.Exercises);

  return (
    <RootStyle>
      <Page title=" Simplified Online Fitness Training ">
        <Container>
          {' '}
          <Header
            noColor
            fixed
          >
            <BoxHeader
              px={2}
              py={2}
            >
              <Box
                display={'flex'}
                alignItems={'center'}
              >
                <IconButton
                  onClick={() => navigate(-1)}
                  sx={{ color: 'text.primary' }}
                >
                  <ArrowLeft />
                </IconButton>
                &nbsp;
                <Typography
                  variant="h5"
                  color="text.primary"
                >
                  View Program
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
                      Exercise.BannerImage ||
                      "/images/instructor/programImage.png"
                    }
                  />

                  <Box width="auto" marginLeft={2}>
                    <Typography variant="h6" color="text.primary">
                      {Exercise?.Title}
                    </Typography>{" "}
                    <Typography variant="h3" color="secondary.main">
                      $ {Exercise?.Amount}
                    </Typography>
                  </Box>
                </Box>
              </BoxStyle> */}
            </BoxHeader>
          </Header>
          <Content withoutPadding>
            <Image
              ratio={'16/9'}
              sx={{
                borderBottomRightRadius: 4,
                borderBottomLeftRadius: 4,
              }}
              src={Exercise.BannerImage || '/images/instructor/programImage.png'}
            />
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
                    sx={{ textTransform: 'capitalize' }}
                    color="text.primary"
                    gutterBottom
                  >
                    {Exercise?.Title}
                  </Typography>
                  <Typography color={'text.secondary'}>{Exercise?.Description || 'No details available'}</Typography>
                </Box>
                <Stack
                  direction={'row'}
                  spacing={1}
                  alignItems={'center'}
                >
                  <Avatar src={Exercise?.Program?.createdBy?.profilePic} />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ textTransform: 'capitalize' }}
                      color="text.primary"
                    >
                      {Exercise?.createdBy?.name}
                    </Typography>
                    <Typography
                      sx={{ textTransform: 'capitalize' }}
                      color="text.secondary"
                    >
                      {Exercise?.createdBy?.expertise}
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
                                            {Exercise?.Type}
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
                    <Typography color="text.secondary">{moment(Exercise?.createdAt).format('DD-MM-YYYY')}</Typography>
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
                    <Typography color="text.secondary">{Exercise?.Duration} weeks</Typography>
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
                    <Typography color="text.secondary">{Exercise?.PaymentType}</Typography>
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
                    $ {Exercise.Amount}
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
                    $ {Exercise.Amount}
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
                  $ {Exercise.Amount}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {Exercise.Description}
              </Typography>
            </Stack> */}

            <BoxFooter
              id="paypal-button-container"
              sx={{ display: 'none' }}
            ></BoxFooter>
          </Content>
          <FooterBase
            bordered={true}
            style={{ backgroundColor: '#fff' }}
          >
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
                    ${Exercise?.Price?.toFixed(2)}
                  </Typography>
                </Box>
                {/* <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{
                                        backgroundColor:
                                            'rgba(243, 114, 114, 1)',
                                        px: 3,
                                        minWidth: 172,
                                    }}
                                    // onClick={() => addnewOrder(id)}
                                >
                                    <Typography variant="subtitle1">
                                        UNSUBSCRIBE
                                    </Typography>
                                </Button> */}
              </Stack>
            </BoxFooter>
          </FooterBase>
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
