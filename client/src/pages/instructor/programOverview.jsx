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
  
  IconButton,
 
  Tabs,
  Tab,
 
  Grid,
  Divider,
  Chip,
} from '@mui/material';

import Container from '../../components/Layout/Container';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import { useNavigate, useLocation, useParams } from 'react-router';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboarding } from '../../redux/actions/Onboarding';

import Iconify from '../../components/Iconify';

import FooterBase from '../../components/Layout/Footer';

import { saveProgram, updateProgram } from 'src/redux/actions/createProgram';
import { TabContext, TabPanel } from '@mui/lab';

import ProgramTypePopover from 'src/components/instructor/ProgramTypePopover';

import ClientList from 'src/components/dashboard/client/ClientList';
import ProgramOverviewPopover from 'src/components/program/programOverviewPopover';
import { getSpecificProgram, getRecent } from 'src/redux/actions/createProgram';
import { getClientsSpecificProgram } from 'src/redux/actions/clientExercise';
import { deleteProgram, archiveProgram, unarchiveProgram } from 'src/redux/actions/createProgram';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import { format, formatDistanceToNow } from 'date-fns';
import { startOfDay } from 'date-fns';
import groupBy from 'lodash/groupBy';

import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import More from 'src/assets/IconSet/More';

const RootStyle = styled('div')(() => ({
  backgroundColor: '#fff',
  height: '100%',
}));

const BoxStyle = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  borderTop: '2px solid #ECEEEF',
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
  justifyContent: 'center',
  alignItems: 'center',
}));
// ----------------------------------------------------------------------

export default function ProgramOverviewPage({ steps = 4, active = 1 }) {
  const dispatch = useDispatch();
  const [clients, setClients] = useState([]);
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const exercises = [{}, {}];
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const [current, setCurrent] = useState('About');
  const [recent, setRecent] = useState([]);
  const userDetails = useSelector((state) => state.Profile);
  const handleTabChange = (event, newValue) => {
    if (newValue == 0) {
      setCurrent('About');
    } else if (newValue == 4) {
      setCurrent('Status');
    } else if (newValue == 1) {
      setCurrent('Clients');
    } else if (newValue == 2) {
      setCurrent('Recent');
    }
  };

  const handelNext = () => {
    navigate('/createProgram?stage=' + (query.get('stage') ? Number(query.get('stage')) + 1 : 2));
  };
  const handleBack = () => {
    navigate('/instructor');
  };

  useEffect(() => {
    getClientsSpecificProgram(id).then((data) => {
      setClients(data);
    });

    dispatch(getSpecificProgram(id)).then(
      (data) => {
        setData({
          ...data,
          name: data.createdBy.name,
          profilePic: data.createdBy.profilePic,
        });
      },
      (err) => navigate(-1),
    );
  }, []);

  const shareWorkout = () => {
    if (navigator.share) {
      navigator
        .share({
          title: ` shared a fitness program :`,
          url: `/public/workout-program/${data._id}`,
        })
        .then(() => {});
    }
  };

  const copyWorkout = () => {
    navigator.clipboard.writeText(`${window.location.origin}/public/workout-program/${data._id}`);

    dispatch(updateFeedback({ snackbar: true, message: 'Copied' }));
  };

  const updateProgramChecked = (val) => {
    dispatch(updateOnboarding({ loading: true }));
    dispatch(saveProgram({ _id: data._id, IsPublished: val }))
      .then((resu) => {
        dispatch(updateOnboarding({ loading: false }));
        setData({ ...data, IsPublished: val });
      })
      .catch((err) => {
        dispatch(updateOnboarding({ loading: false }));
      });
  };
  const handleProgramType = (val) => {
    dispatch(updateOnboarding({ loading: true }));
    setData({
      ...data,
      ProgramType: val,
    });
    dispatch(saveProgram({ _id: data._id, ProgramType: val }))
      .then((resu) => {
        dispatch(updateOnboarding({ loading: false }));
        setData({ ...data, ProgramType: val });
      })
      .catch((err) => {
        dispatch(updateOnboarding({ loading: false }));
      });
  };

  const DeleteTheProgram = (id) => {
    dispatch(deleteProgram(id)).then((res) => {
      navigate(-1);
    });
  };

  const ArchiveTheProgram = (id) => {
    dispatch(archiveProgram(id)).then((res) => {
      navigate(-1);
    });
  };

  const UnArchiveTheProgram = (id) => {
    dispatch(unarchiveProgram(id)).then((res) => {
      dispatch({
        type: 'UPDATE_FEED',
        payload: {
          loading: false,
          snackbar: true,
          message: 'Program Unarchived Successfully',
          severity: 'success',
        },
      });
      navigate(-1);
    });
  };

  useEffect(() => {
    getRecent(id).then((data) => {
      setRecent(data);
    });
  }, []);

  return (
    <RootStyle>
      <Page title=" Simplified Online Fitness Training ">
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
                    Program Overview
                  </Typography>{' '}
                </Box>{' '}
                <ProgramOverviewPopover
                  program={data}
                  shareWorkout={() => shareWorkout()}
                  copyWorkout={() => copyWorkout()}
                  onEdit={() => navigate('/editProgram/' + id + '/publishProgram')}
                  id={id}
                  unArchive={UnArchiveTheProgram}
                  deleteProgram={ArchiveTheProgram}
                >
                  <IconButton sx={{ py: 0 }}>
                    <More
                      sx={{ color: 'text.primary' }}
                      style={{ fontSize: 32 }}
                      color="text.primary"
                    />
                  </IconButton>
                </ProgramOverviewPopover>
              </Box>
            </BoxHeader>
          </Header>{' '}
          <Content
            style={{
              marginTop: -8,
              overflowY: 'auto',
              backgroundColor: '#fff',
            }}
            withoutPadding
          >
            <Box
              position="relative"
              backgroundColor={'#fff'}
            >
              {data.IsArchived ? (
                <Chip
                  color="secondary"
                  label={'Archived'}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: 32,
                    fontWeight: 'bold',
                    borderRadius: 1,
                    px: 2,
                  }}
                />
              ) : null}

              <img
                src={data.BannerImage || '/images/profile-banner.png'}
                style={{
                  width: '100%',
                  height: 'auto',
               
                  objectFit: 'cover',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              />
              {/* <Box position={"absolute"} top={8} right={8}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    navigate("/editProgram/" + id + "/publishProgram")
                  }
                >
                  Edit&nbsp;
                  <Iconify
                    icon={"eva:edit-outline"}
                    color="common.white"
                    width={20}
                    height={20}
                  />
                </Button>
              </Box> */}
              {/* <Box
                width="calc(100% - 16px)"
                position={"absolute"}
                bottom={12}
                left={8}
              >
                <PriceContainer>
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {data.Title}
                  </Typography>
                 
                </PriceContainer>
              </Box> */}
            </Box>

            <TabContext value={current}>
              <TabContainer
                style={{
                  backgroundColor: 'white',
                  paddingTop: 24,
                }}
              >
                <Tabs
                  variant="fullWidth"
                  value={current == 'About' ? 0 : current == 'Status' ? 4 : current == 'Clients' ? 1 : 2}
                  onChange={handleTabChange}
                  aria-label=""
                  style={{ height: '36px' }}
                  // sx={{ backgroundColor: "#F5F7FA" }}
                >
                  <Tab
                    label={
                      <>
                        <Typography
                          sx={{
                            fontWeight: current == 'About' ? 'bold' : 300,
                          }}
                        >
                          About
                        </Typography>
                        <span
                          style={{
                            my: 1,
                            position: 'absolute',
                            bottom: 0,
                            height: 4,
                            width: '95%',
                            borderRadius: 4,
                            // background: '#E1E7F0',
                          }}
                        ></span>
                      </>
                    }
                  />
                  {/* <Tab
                                        label={
                                            <>
                                                <Typography
                                                    sx={{
                                                        fontWeight:
                                                            current == 'Status'
                                                                ? 'bold'
                                                                : 300,
                                                    }}
                                                >
                                                    Status
                                                </Typography>
                                                <span
                                                    style={{
                                                        my: 1,
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        height: 4,
                                                        width: '95%',
                                                        borderRadius: 4,
                                                        //background: '#E1E7F0',
                                                    }}
                                                ></span>
                                            </>
                                        }
                                    /> */}
                  <Tab
                    label={
                      <>
                        <Typography
                          sx={{
                            fontWeight: current == 'Clients' ? 'bold' : 300,
                          }}
                        >
                          Clients
                        </Typography>
                        <span
                          style={{
                            my: 1,
                            position: 'absolute',
                            bottom: 0,
                            height: 4,
                            width: '95%',
                            borderRadius: 4,
                            // background: '#E1E7F0',
                          }}
                        ></span>
                      </>
                    }
                  />
                  <Tab
                    label={
                      <>
                        <Typography
                          sx={{
                            fontWeight: current == 'Recent' ? 'bold' : 300,
                          }}
                        >
                          Recent
                        </Typography>
                        <span
                          style={{
                            my: 1,
                            position: 'absolute',
                            bottom: 0,
                            height: 4,
                            width: '95%',
                            borderRadius: 4,
                            // background: '#E1E7F0',
                          }}
                        ></span>
                      </>
                    }
                  />
                </Tabs>
              </TabContainer>
              <Divider
                sx={{
                  borderBottomWidth: 8,
                  borderColor: '#F5F7FA',
                }}
              />

              <TabPanel
                value="About"
                index={0}
                style={{
                  height: '100%',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack
                    px={2}
                    py={2}
                    backgroundColor={'#fff'}
                  >
                    <Typography
                      variant="body1"
                      color="text.primary"
                      fontWeight={600}
                      gutterBottom
                      sx={{
                        textTransform: 'capitalize',
                        fontSize: 16,
                      }}
                    >
                      {data.Title}
                    </Typography>
                    <Typography
                      line={4}
                      color="text.primary"
                      flexWrap={'wrap'}
                      sx={{
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      <ReactReadMoreReadLess
                        charLimit={120}
                        readMoreText={
                          <Typography
                            variant="subTitle"
                            sx={{
                              mt: 1,
                            }}
                          >
                            See more
                            {/* <Iconify
                                                            icon={
                                                                'ic:round-keyboard-arrow-down'
                                                            }
                                                            width="24px"
                                                            height="24px"
                                                        /> */}
                          </Typography>
                        }
                        readLessText={
                          <Typography
                            variant="subTitle"
                            sx={{
                              mt: 1,
                            }}
                          >
                            See less
                            {/* <Iconify
                                                            icon={
                                                                'ic:round-keyboard-arrow-up'
                                                            }
                                                            width="24px"
                                                            height="24px"
                                                        /> */}
                          </Typography>
                        }
                        readMoreStyle={{
                          fontWeight: 'bold',
                          color: '#2B4057',
                        }}
                        readLessStyle={{
                          fontWeight: 'bold',
                          color: '#2B4057',
                        }}
                      >
                        {data.Description || 'No Description'}
                      </ReactReadMoreReadLess>
                    </Typography>
                  </Stack>
                  <Divider
                    sx={{
                      borderBottomWidth: 8,
                      borderColor: '#F5F7FA',
                    }}
                  />
                  <Stack
                    py={3}
                    px={2}
                    backgroundColor={'#fff'}
                  >
                    {/* <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Avatar
                      src={userDetails?.profilePic}
                      sx={{ height: 44, width: 44 }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ textTransform: "capitalize", fontSize: 16 }}
                        color="text.primary"
                      >
                        {userDetails?.name}
                      </Typography>
                      <Typography
                        sx={{ textTransform: "capitalize" }}
                        color="text.secondary"
                        variant="body2"
                      >
                        {userDetails?.expertise}
                      </Typography>
                    </Box>
                  </Stack> */}

                    <Grid container>
                      {/* <Grid item xs={6}>
                                                <Stack mb={2}>
                                                    <Typography
                                                        variant="body1"
                                                        color="text.primary"
                                                        fontWeight={600}
                                                    >
                                                        Program Level
                                                    </Typography>
                                                    <Typography
                                                        component="span"
                                                        variant="body1"
                                                        color="text.secondary"
                                                    >
                                                        {data.Type}
                                                    </Typography>
                                                </Stack>
                                            </Grid> */}
                      <Grid
                        item
                        xs={6}
                      >
                        <Stack mb={3}>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                          >
                            Date Created
                          </Typography>
                          <Typography
                            component="span"
                            variant="body1"
                            color="text.secondary"
                          >
                            {/* {moment(data.createdAt).format("lll")} */}
                            {format(new Date(data.createdAt), 'dd/MM/yyyy')}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                      >
                        <Stack mb={3}>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                          >
                            Duration
                          </Typography>
                          <Typography
                            component="span"
                            variant="body1"
                            color="text.secondary"
                          >
                            {data.Duration} weeks
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Box
                          display={'flex'}
                          flexDirection={'column'}
                        >
                          <Typography
                            component="span"
                            variant="body1"
                            fontWeight={600}
                            color="text.primary"
                            gutterBottom
                          >
                            Program type
                          </Typography>
                          <Box width={'50%'}>
                            <ProgramTypePopover
                              selectedProgramType={data.ProgramType || 'Public'}
                              setProgramType={handleProgramType}
                            />
                          </Box>
                          <Typography
                            component="span"
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 2 }}
                          >
                            Program is {data.ProgramType == 'Public' ? 'visible' : 'not visible'} when users view your
                            profile.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Stack>

                  <Stack
                    py={2}
                    px={2}
                    mb={6}
                    backgroundColor={'#fff'}
                    display={'flex'}
                    flexGrow={1}
                    flexDirection={'column'}
                  >
                    <Box
                      width={'100%'}
                      display={'flex'}
                      height={'100%'}
                      flexDirection={'row'}
                      px={0}
                      justifyContent={'space-between'}
                    >
                      {/* 
                                            <SwitchCustom
                                                checked={
                                                    data.IsPublished
                                                        ? false
                                                        : true
                                                }
                                                onChange={(e) =>
                                                    updateProgramChecked(
                                                        !e.target.checked
                                                    )
                                                }
                                            /> */}
                    </Box>
                  </Stack>
                  {/* <Divider
                  sx={{ borderBottomWidth: 16, borderColor: "#F5F7FA" }}
                /> */}
                  {/* <Box
                  width={"100%"}
                  display={"flex"}
                  flexDirection={"column"}
                  px={2}
                  justifyContent={"space-between"}
                >
                  <Typography
                    component="span"
                    variant="body1"
                    fontWeight={600}
                    color="text.primary"
                  >
                    Hide program
                  </Typography>
                  <br />
                  <SwitchCustom
                    checked={data.IsPublished}
                    onChange={(e) => updateProgramChecked(e.target.checked)}
                  />
                </Box> */}
                </div>
              </TabPanel>
              {/* <TabPanel
                                value="Status"
                                index={1}
                                style={{ height: '100%' }}
                            >
                                <div
                                    style={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <ProgramOverviewStatus />
                                </div>
                            </TabPanel> */}
              <TabPanel
                value="Clients"
                index={2}
                style={{ height: '100%' }}
              >
                <Box height={'100%'}>
                  <ClientList
                    page="programOverview"
                    _id={data._id}
                    clients={clients}
                  />
                </Box>
              </TabPanel>
              <TabPanel
                value="Recent"
                index={3}
                style={{ height: '100%' }}
              >
                <RecentTab recent={recent} />
              </TabPanel>
            </TabContext>
          </Content>
          <FooterBase>
            <BoxStyle
              px={2}
              py={2}
              pt={3}
            >
              <Stack
                spacing={2}
                direction={'row'}
              >
                <Button
                  fullWidth
                  variant="outlined"
                 
                  onClick={copyWorkout}
                  startIcon={
                    <Iconify
                      icon={'ant-design:link-outlined'}
                      width={24}
                      height={24}
                    />
                  }
                >
                  Copy link
                </Button>
                <Button
                  fullWidth
                  variant="contained"
               
                  onClick={() => navigate('/sendProgram/' + id)}
                >
                  Send
                </Button>
              </Stack>
            </BoxStyle>
          </FooterBase>
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}

const RecentTab = (props) => {
  let group = {};
  if (props.recent.length) {
    group = groupBy(props.recent, (i) => startOfDay(new Date(i.createdAt)));
  }
  const SpaceBox = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '12px 0',
    padding: '5px',
  }));
  return (
    <Box
      backgroundColor={'#fff'}
      height={'100%'}
    >
      {Object.keys(group).length == 0 && (
        <Box
          display={'flex'}
          flexDirection="column"
          justifyContent={'center'}
          alignItems="center"
          height="100%"
        >
          <Typography
            mt={2}
            variant="body1"
            align="center"
            color="text.secondary"
          >
            No recent activities
          </Typography>
        </Box>
      )}
      <Box pt={1}>
        {Object.keys(group).map((dateMsg, ri) => {
          return (
            <Box>
              <Box
                mb={2}
                px={2}
              >
                {/* <Typography variant="h6" color="text.primary">
                {// TODO: Replace moment.calendar()
format(new Date(dateMsg), "PPP")}
              </Typography> */}
                {group[dateMsg].map((item, index) => {
                  if (item.email)
                    return (
                      <Box>
                        {/* <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent={"space-between"}
                        spacing={1}
                      >
                        <Stack>
                          <Typography variant="body" color="text.primary">
                            Program Sent to
                          </Typography>

                          {item?.clientId?.name ? (
                            <Stack direction="row" alignItems="center" mt={1}>
                              <Avatar
                                size={"small"}
                                sx={{ width: 32, height: 32 }}
                                src={item?.clientId?.profilePic}
                              />
                              <Stack>
                                <Typography
                                  variant="body"
                                  color="primary"
                                  sx={{
                                    ml: 1,
                                    textTransform: "capitalize",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item?.clientId?.name}
                                </Typography>
                              </Stack>
                            </Stack>
                          ) : (
                            <Typography variant="body" color="primary">
                              {item.email}
                            </Typography>
                          )}
                        </Stack>
                        <Typography variant="body2" color={"text.secondary"}>
                          {format(new Date(item.createdAt), "hh:mm a")}
                        </Typography>
                      </Stack>
                      {index !== group[dateMsg]?.length - 1 ? (
                        <Divider sx={{ mt: 2 }} />
                      ) : null} */}

                        <SpaceBox
                          sx={{
                            alignItems: 'center',
                          }}
                        >
                          <Avatar src={item?.clientId?.profilePic || '/images/dummyUser.png'} />
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <Box>
                            <Typography
                              variant="body1"
                              color="text.primary"
                            >
                              Program sent to
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {item.email}
                            </Typography>
                          </Box>
                          <Box flexGrow={1} />
                          <Typography
                            align="right"
                            variant="caption"
                            color="text.primary"
                          >
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          </Typography>
                        </SpaceBox>
                        <Divider />
                      </Box>
                    );
                })}
              </Box>
              {/* {ri + 1 != Object.keys(group).length && (
              <Divider sx={{ borderBottomWidth: 8, borderColor: "#F5F7FA" }} />
            )} */}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
