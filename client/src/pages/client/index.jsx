// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../../components/Page';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// sections
import { searchItemByKey } from 'src/utils/search.js';
import {
  Box,
  Typography,
  Stack,
  ButtonBase,
  Button,
  BottomNavigation,
  Tabs,
  Tab,
  Card,
  Divider,
  Radio,
  Badge,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  Avatar,
} from '@mui/material';
import HighLightedAvatar from '../../components/HighLightAvatar';
import axios from '../../utils/axios';
import api from '../../utils/api';
import Footer from '../../components/onboarding/footer';
import { useNavigate, useLocation } from 'react-router';
import { switchExercise } from 'src/redux/actions/clientExercise';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch, useSelector } from 'react-redux';
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
import InstructorHeader from 'src/components/home/HomeHeader';
import { useState, useEffect } from 'react';
import { getLogUnreadCount } from 'src/redux/actions/common';
import { saveTodo } from 'src/redux/actions/clientExercise';
import InstructorPrograms from 'src/components/instructor/instructorPrograms';
import { updateProgram, getAllPrograms, deleteProgram } from 'src/redux/actions/createProgram';
import { updateTodo } from 'src/redux/actions/clientExercise';
import Carousel from 'src/components/client/ProgramCarousel';
import IconWorkoutCalendar from 'src/assets/clientLoggedIn/Icon_workoutCalendar';
import IconDietPlan from 'src/assets/clientLoggedIn/Icon_DietPlan';
import IconInstructor from 'src/assets/clientLoggedIn/Icon_Instructor';
import IconMyPrograms from 'src/assets/clientLoggedIn/Icon_MyPrograms';
import ClientPrograms from 'src/components/client/clientPrograms';
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction';
import PendingIcon from 'src/assets/todo/pending';
import DoneIcon from 'src/assets/todo/completed';
import HomeIcon from 'src/assets/IconSet/Home';
import ProgramIcon from 'src/assets/IconSet/Program';
import ClientTrainingLog from 'src/assets/IconSet/ClientTrainingLog';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import DeleteIcon from 'src/assets/IconSet/Delete';
import PopupAcceptDeny from 'src/components/invitation/PopupAcceptDeny';
import DbIcon from 'src/assets/IconSet/MoreIcon';
import { useMemo } from 'react';
const RootStyle = styled('div')(() => ({
  backgroundColor: '#fff',
}));

const BoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 4px',
}));
const StartWorkoutBox = styled(Box)(({ theme }) => ({
  'width': '100%',
  'display': 'flex',
  'justifyContent': 'space-between',
  'alignItems': 'center',
  'marginTop': 16,
  'backgroundColor': theme.palette.background.paper,
  'borderRadius': '24px',
  'padding': '12px 16px',
  '-webkit-box-reflect':
    'below 8px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(0.6, transparent) , to(rgba(250, 250, 250, 0.4)))',
}));
const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 220,
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  border: '1px solid',
  borderColor: theme.palette.primary.main,
  padding: '24px 16px',
  justifyContent: 'center',
  borderRadius: '16px',
  backgroundImage: 'linear-gradient(117.62deg, #2F86EB 2.82%, #2F86EB 83.21%)',
}));
const BottomNavigationAction = styled(MuiBottomNavigationAction)({
  ' &.Mui-selected': {
    fontWeight: 600,
  },
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 8,
    top: 8,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));
// ----------------------------------------------------------------------

export default function ClientPage() {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { state } = useLocation();
  const [logCount, setLogCount] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const ProgramList = useSelector((s) => s.AtheletePlan);
  const Profile = useSelector((s) => s.Profile);
  const query = new URLSearchParams(search);

  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState('home');
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri'];
  useEffect(() => {
    if (ProgramList?.currentPlan)
      getLogUnreadCount(ProgramList.currentPlan).then((res) => setLogCount(res?.data?.count));
  }, [ProgramList]);
  useEffect(() => {
    let active = ProgramList.AllPrograms.find((item) => item.isActive);

    if (!active?._id && ProgramList.AllPrograms.length > 0) {

    }
  }, [ProgramList.AllPrograms?.length]);

  let carouselItems = [];

  ProgramList.Exercises._id &&
    ProgramList.Exercises.ExercisePlan.weeks.map((weekitem, weekindex) => {
      ProgramList.Exercises.ExercisePlan.weeks[weekindex].days.map((item, index) => {
        if (item.Exercise.length > 0)
          carouselItems.push({
            isCompleted: ProgramList?.stats?.[`${weekindex}-${index}`],
            component: (
              <Box
                pr={1}
                position={'relative'}
              >
                {ProgramList?.stats?.[`${weekindex}-${index}`] && (
                  <IconButton
                    position={'absolute'}
                    backgroundColor={'white'}
                    sx={{
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      padding: 0,
                      position: 'absolute',
                      top: 18,
                      right: 24,
                      backgroundColor: 'white',
                    }}
                  >
                    <Iconify
                      icon={'material-symbols:check-small-rounded'}
                      width={32}
                      color={'success.main'}
                      height={32}
                    />
                  </IconButton>
                )}
                <TabContainer>
                  <Box
                    width={'100%'}
                    display="flex"
                    justifyContent={'space-between'}
                    pb={1.5}
                  >
                    <Typography
                
                      color="common.white"
                      variant="body2"
                      style={{ fontWeight: 400, display: 'flex', alignItems: 'center',gap:2 }}
                    >
                      <Iconify icon={"proicons:phone"} width={24} height={24} color={"#fff"} />
                      Online
                    </Typography>
                  </Box>
                  <Box width={"100%"}>
                  <Typography
                    align={'left'}
                    color="common.white"
                    sx={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}
                  >
                         {item.Title}
                    
                  </Typography>
                  <Typography
                    variant="body1"
                    align={'left'}
                    color="common.white"
                    sx={{
                      textTransform: 'capitalize',
                    }}
                  >

              {item.Exercise.length} Exercise <br/>
              Program: {ProgramList?.Exercises?.Title}
                  </Typography>
                  </Box>
                  <ButtonBase
                    sx={{
                      borderRadius: 1,
                      border: 1,
                      borderColor: 'primary.main',
                      py: 1.5,
                      width: 180,
                      mt:2,
                      height: 40,
                      fontSize: 16,
                      mb:2,
                      //  boxShadow: '0px 12px 31px #2F86EB',
                      backgroundColor: '#fff',
                    }}
                    onClick={() =>
                      navigate('myWorkoutCalendar/workoutDay', {
                        state: {
                          week: weekindex,
                          day: index,
                        },
                      })
                    }
                  >
                    <Typography
                      variant="subtitle1"
                      align={'center'}
                      color="primary.main"
                      sx={{ fontSize: 16 }}
                    >
                      Start Workout
                    </Typography>
                  </ButtonBase>
                </TabContainer>
              </Box>
            ),
          });
      });
    });

  const onUpdateTask = (id, value) => {
    let todoClone = [...ProgramList.todo];
    todoClone[todoClone.findIndex((i) => i._id == id)].isDone = value;
    dispatch(updateTodo(ProgramList.currentPlan, todoClone));
  };

  const deleteTodo = (id) => {
    let todoClone = [...ProgramList.todo].filter((item, i) => item._id != id);

    dispatch(updateTodo(ProgramList.currentPlan, todoClone));
  };

  const { programsList } = useMemo(() => {
    if (searchKey == '') {
      return { programsList: ProgramList.AllPrograms };
    }
    return { programsList: searchItemByKey(ProgramList.AllPrograms, ['Title'], searchKey) };
  }, [searchKey]);

  return (
    <Page title=" Simplified Online Fitness Training ">
      <PopupAcceptDeny />
      <RootStyle>
        <Container>
          <Header
            style={{
              background: tabValue == 'home' ? '#F5F7FA' : '#fff',
              boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
            }}
            headerDependency={tabValue}
          >
            <InstructorHeader
              client
              title={Profile.name}
            />
            {tabValue !== 'home' && (
              <Box px={2}>
                <TextField
                  fullWidth
                  placeholder="Search for programs"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  InputProps={{
                    sx: { height: 48, mt: 2 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <Iconify
                            icon={'eva:search-fill'}
                            width={24}
                            height={24}
                            color="text.secondary"
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}
          </Header>
          <Content
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              background: tabValue == 'home' ? '#F5F7FA' : '#fff',
            }}
          >
            {tabValue == 'home' ? (
              <>
                {ProgramList.AllPrograms.length == 0 || !ProgramList.currentPlan ? (
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDirection={'column'}
                    px={2}
                    width={'100%'}
                    flexGrow={'1'}
                  >
                    <Box
                      width={'100%'}
                      display={'flex'}
                      flexDirection="column"
                      alignItems={'center'}
                    >
                      <Box>
                        <Typography
                          align={'center'}
                          variant="h6"
                          color={'text.primary'}
                          gutterBottom
                        >
                          No active programs
                        </Typography>
                        <Typography
                          align={'center'}
                          variant="subtitle1"
                          color={'text.secondary'}
                        >
                          Check the programs tab or your notifications for any program updates from your trainer
                        </Typography>
                      </Box>{' '}
                    </Box>
                    {programsList?.length ? (
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mt: 3,
                        }}
                        onClick={() => setTabValue('programs')}
                      >
                        View Programs
                      </Button>
                    ) : null}
                  </Box>
                ) : (
                  <Box>
                    <Box
                      width={'100%'}
                      py={2}
                      backgroundColor={'#fff'}
                    >
                      <Carousel
                        items={carouselItems.map((i) => i.component)}
                        currentDay={carouselItems.findIndex((i) => !i.isCompleted)}
                      />
                    </Box>
                    {ProgramList?.todo?.filter((i) => !i.isDone).length ? (
                      <Box
                        backgroundColor={'#fff'}
                        mt={4}
                      >
                        <Grid
                          container
                          spacing={2}
                          sx={{ px: 2 }}
                        >
                          <Grid
                            item
                            xs={12}
                          >
                            <Typography
                              gutterBottom
                              variant="h6"
                              color="text.primary"
                              sx={{
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <HighLightedAvatar src={ProgramList?.Exercises?.createdBy?.profilePic} />
                              &nbsp; You have a task
                            </Typography>
                            <Grid
                              item
                              xs={12}
                            >
                              {!ProgramList?.todo?.length && (
                                <Typography
                                  align={'center'}
                                  color={'text.secondary'}
                                >
                                  No tasks available
                                </Typography>
                              )}
                              {ProgramList?.todo
                                ?.filter((i) => !i.isDone)
                                .map((i, index) => {
                                  return (
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        borderBottom:
                                          ProgramList?.todo?.filter((i) => !i.isDone).length != index + 1
                                            ? '1px solid #E1E7F0'
                                            : null,
                                        alignItems: 'flex-start',
                                        mb: 1,
                                        pb: 2,
                                        pt: 1,
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <Stack
                                        direction={'row'}
                                        alignItems={'center'}
                                        width={'100%'}
                                        justifyContent={'space-between'}
                                      >
                                        <Box display={'flex'}>
                                          {' '}
                                          <Checkbox
                                            sx={{
                                              padding: 0,
                                              margin: 0,
                                            }}
                                            size={'large'}
                                            onChange={(e) => onUpdateTask(i._id, e.target.checked)}
                                            checked={i.isDone}
                                            icon={<RadioButtonUncheckedIcon />}
                                            checkedIcon={<RadioButtonCheckedIcon />}
                                          ></Checkbox>
                                          <Box
                                            sx={{
                                              width: '100%',
                                              ml: 1,
                                              mt: 0.5,
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                width: '100%',
                                              }}
                                              color={'text.secondary'}
                                            >
                                              {i.value}
                                            </Typography>
                                          </Box>
                                        </Box>
                                        {i.isDone ? <DeleteIcon /> : null}
                                      </Stack>
                                    </Box>
                                  );
                                })}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    ) : null}
                    <Box
                      backgroundColor={'#fff'}
                      mt={1}
                      py={2}
                    >
                      <Grid
                        container
                        sx={{ px: 1 }}
                      >
                        <Grid
                          item
                          xs={12}
                        >
                          <Typography
                            sx={{ pl: 1, pb: 2 }}
                            variant="h6"
                            color="text.primary"
                          >
                            Quick Access
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                        >
                          <Stack
                            spacing={1}
                            alignItems="center"
                            onClick={() => navigate('/client/my-instructor')}
                          >
                            <IconInstructor />
                            <Typography
                              color="text.primary"
                              align="center"
                              flexWrap={'wrap'}
                            >
                              Trainer
                            </Typography>
                          </Stack>
                        </Grid>
                        
                        <Grid
                          item
                          xs={4}
                        >
                          <Stack
                            spacing={1}
                            alignItems="center"
                            onClick={() => navigate('/client/myWorkoutCalendar')}
                          >
                            <IconWorkoutCalendar />
                            <Typography
                              color="text.primary"
                              align="center"
                              flexWrap={'wrap'}
                            >
                              Workout
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                        >
                          <Stack
                            spacing={1}
                            alignItems="center"
                            onClick={() => navigate('/client/trainingLog')}
                          >
                            {logCount ? (
                              <StyledBadge
                                badgeContent={logCount}
                                color="primary"
                              >
                                <ClientTrainingLog
                                  sx={{
                                    fontSize: 55,
                                    p: 0.8,
                                  }}
                                />
                              </StyledBadge>
                            ) : (
                              <ClientTrainingLog
                                sx={{
                                  fontSize: 55,
                                  p: 0.8,
                                }}
                              />
                            )}
                            <Typography
                              color="text.primary"
                              align="center"
                              flexWrap={'wrap'}
                            >
                              Comments
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box
                      backgroundColor={'#fff'}
                      mt={3}
                      pb={6}
                    >
                      <Grid
                        container
                        spacing={2}
                        sx={{ px: 2 }}
                      >
                        <Grid
                          item
                          xs={12}
                        >
                          <Typography
                            gutterBottom
                            variant="h6"
                            color="text.primary"
                            sx={{ mb: 2 }}
                          >
                            Completed tasks &nbsp;
                            {ProgramList?.todo.filter((i) => i.isDone)?.length}{' '}
                          </Typography>
                          <Grid
                            item
                            xs={12}
                            sx={{ mb: 4, mt: 8 }}
                          >
                            {!ProgramList?.todo.filter((i) => i.isDone)?.length && (
                              <Typography
                                align={'center'}
                                color={'text.secondary'}
                              >
                                No tasks available
                              </Typography>
                            )}
                            {ProgramList?.todo
                              ?.filter((i) => i.isDone)
                              .map((i, index) => {
                                return (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      borderBottom: '1px solid #E1E7F0',
                                      alignItems: 'flex-start',
                                      mb: 1,
                                      pb: 2,
                                      pt: 1,
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <Stack
                                      direction={'row'}
                                      alignItems={'center'}
                                      width={'100%'}
                                      justifyContent={'space-between'}
                                    >
                                      <Box display={'flex'}>
                                        {' '}
                                        <Checkbox
                                          sx={{
                                            padding: 0,
                                            margin: 0,
                                          }}
                                          size={'large'}
                                          onChange={(e) => onUpdateTask(i._id, e.target.checked)}
                                          checked={i.isDone}
                                          icon={<RadioButtonUncheckedIcon />}
                                          checkedIcon={<RadioButtonCheckedIcon />}
                                        ></Checkbox>
                                        <Box
                                          sx={{
                                            width: '100%',
                                            ml: 1,
                                            mt: 0.5,
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              width: '100%',
                                            }}
                                            color={'text.secondary'}
                                          >
                                            {i.value}
                                          </Typography>
                                        </Box>
                                      </Box>
                                      {i.isDone ? (
                                        <DeleteIcon
                                          onClick={() => deleteTodo(i._id)}
                                          sx={{
                                            color: 'error.main',
                                          }}
                                        />
                                      ) : null}
                                    </Stack>
                                  </Box>
                                );
                              })}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Box
                px={2}
                height={'100%'}
              >
                {' '}
                {programsList?.length == 0 ? (
                  <Box
                    width={'100%'}
                    height="100%"
                    display={'flex'}
                    flexDirection="column"
                    alignItems={'center'}
                    justifyContent="center"
                  >
                    <Typography
                      variant="h3"
                      align={'center'}
                      color="text.secondary"
                    >
                      You don’t have any programs !<br />
                      Subscribe to your first program to get started!
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <BoxStyle>
                      <Typography
                        variant="subtitle1"
                        color="text.primary"
                      >
                        Programs {programsList?.length}{' '}
                      </Typography>
                      <Box
                        display="flex"
                        alignItems="center"
                      >
                        <Iconify
                          icon="ic:round-sort"
                          color="text.secondary"
                          style={{
                            transform: 'scaleX(-1)',
                          }}
                        />
                        &nbsp;
                        <Typography
                          variant="body1"
                          color="text.secondary"
                        >
                          Sort by: Newest
                        </Typography>
                      </Box>
                    </BoxStyle>
                    <ClientPrograms programs={programsList || []} />
                  </>
                )}
              </Box>
            )}
          </Content>
          <FooterBase>
          <BottomNavigation
              sx={{
                borderTop: '1px solid #E1E7F0',
                borderRadius: '8px 8px 0px 0px',
                paddingTop: '12px',
                paddingBottom: '12px',
                height: 'auto',
              }}
              showLabels
              value={tabValue}
              onChange={(event, newValue) => {
                setTabValue(newValue);
                if (newValue === 'home') {
                  navigate('/client', { replace: true });
                }
               else if (newValue === 'more') {
                  navigate('/moreMenu', { replace: true });
                }
              }}
            >
              <BottomNavigationAction
                label="Home"
                value="home"
                sx={[
                  {
                    '&.MuiBottomNavigationAction-root': {
                      color: (theme) => theme.palette.text.secondary,
                      minWidth: 'auto',
                      padding: '6px 12px',
                    },
                    '&.Mui-selected': {
                      color: (theme) => theme.palette.primary.main,
                    },
                    '& .MuiBottomNavigationAction-label': {
                      fontSize: '12px',
                      marginTop: '4px',
                      fontWeight: 600,
                    },
                  },
                ]}
                icon={<HomeIcon />}
              />
             
              <BottomNavigationAction
                label="More"
                value="more"
                sx={[
                  {
                    '&.MuiBottomNavigationAction-root': {
                      color: (theme) => theme.palette.text.secondary,
                      minWidth: 'auto',
                      padding: '6px 12px',
                    },
                    '&.Mui-selected': {
                      color: (theme) => theme.palette.primary.main,
                    },
                    '& .MuiBottomNavigationAction-label': {
                      fontSize: '12px',
                      marginTop: '4px',
                      fontWeight: 600,
                    },
                  },
                ]}
                icon={<DbIcon sx={{ fontSize: 24 }} />}
              />
            </BottomNavigation>
          </FooterBase>
        </Container>
      </RootStyle>
    </Page>
  );
}
