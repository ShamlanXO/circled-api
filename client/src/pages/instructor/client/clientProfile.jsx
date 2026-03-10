// @mui
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
// components
import Page from '../../../components/Page';
// sections
import {
  Box,
  Button,
  Typography,
  Stack,
  Avatar,
  Divider,
  ButtonBase,
  Badge,
  Drawer,
  InputAdornment,
  Grid,
} from '@mui/material';

import Container from '../../../components/Layout/Container';
import Content from '../../../components/Layout/Content';
import Header from '../../../components/Layout/Header';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getClientsSpecific, saveTodo } from 'src/redux/actions/clientExercise';
import { IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import ProgramListView from 'src/components/instructor/ProgramListView';
import ClientProfileHeader from 'src/components/dashboard/client/ClientProfileHeader';
import IconWorkoutCalendar from 'src/assets/clientProfile/Icon_workoutCalendar';
import IconDietPlan from 'src/assets/clientProfile/Icon_DietPlan';
import IconNotes from 'src/assets/clientProfile/Icon_Notes';
import TodoList from 'src/pages/instructor/client/Todo';
import { updateFeedback } from 'src/redux/actions/feedback';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import IconSups from 'src/assets/clientProfile/Icon_Sups';
import IconBodySystem from 'src/assets/clientProfile/Icon_BodySystem';
import IconPhotos from 'src/assets/clientProfile/Icon_Photos';
import ClientTrainingLog from 'src/assets/IconSet/InstructorLogsIcon';
import CameraIcon from 'src/assets/IconSet/camera';
import { getLogUnreadCount } from 'src/redux/actions/common';
import BodyMetrix from 'src/components/client/BodyMetrix';
import HealthProfile from 'src/assets/IconSet/fitnessProfile/HealthProfile';
import PhotoWidget from 'src/components/client/UploadphotoWidget';
import Image from 'src/components/Image';
import { sendProgram } from 'src/redux/actions/createProgram';
import { deleteSentPrograms } from 'src/redux/actions/common';
import notificationEvents from 'src/utils/notificationEvents';
import PersonalDetailIcon from 'src/assets/IconSet/fitnessProfile/PersonalDetails';
import SelectProgram from 'src/components/instructor/SelectProgram';
import { getWeekProgress, getCurrentInProgressWeekNumber } from 'src/utils/calendar';
import useSocket from 'src/hooks/useSocket';
import IconHealth from 'src/assets/clientProfile/Icon_Health';
import IconAbout from 'src/assets/clientProfile/Icon_about';
import IconBioscan from 'src/assets/clientProfile/Icon_bioscan';
import { ObjectID } from 'bson';
import { he } from 'date-fns/locale';

const RootStyle = styled('div')(() => ({
  backgroundColor: '#fff',
  height: '100%',
}));

const BoxHeader = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
}));
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 8,
    top: 8,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));
// ----------------------------------------------------------------------

export default function ClientProfilePage() {
  const [headerDependency, setHeaderDependency] = useState(false);
  const [x, y, z, e, reload] = useOutletContext();
  const [logCount, setLogCount] = useState(0);
  const { search, state, pathname } = useLocation();
  const { id } = useParams();
  const query = new URLSearchParams(search);
  const ProgramList = useSelector((s) =>
    s.ProgramList.Programs.filter(
      (item) => item.IsDraft == false && item.IsDeleted == false && item.IsArchived == false,
    ),
  );
  const Profile = useSelector((p) => p.ProgramList.clientDetails);
  const sentProgram = useSelector((s) => s.ProgramList.sentProgram);
  const Program = useSelector((s) => s.ProgramList.clientData?.Program);
  const todoData = useSelector((s) => s.ProgramList.clientData?.todo);
  const CreatedAt = useSelector((s) => s.ProgramList.clientData?.createdAt);
  const currentweek = useSelector((s) => s.ProgramList.clientData?.currentWeek);
  const currentday = useSelector((s) => s.ProgramList.clientData?.currentDay);
  const clientStats = useSelector((s) => s.ProgramList.clientData?.stats);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [todo, setTodo] = useState([]);
  const [mini, setMini] = useState(true);
  const [mini2, setMini2] = useState(true);
  const [view, setView] = useState(null);
  const { isConnected, socket } = useSocket();
  const handelNext = () => {
    navigate('/createDietPlan');
  };
  useEffect(() => {
    getLogUnreadCount(id).then((res) => setLogCount(res?.data?.count));
    dispatch(getClientsSpecific(id));
  }, [id]);

  useEffect(() => {
    if (isConnected) {
      socket.on(notificationEvents.ACCEPT_PROGRAM, (data) => {
        console.log('accept order');
        dispatch(getClientsSpecific(id));
      });
    }
  }, [isConnected]);

  const handleBack = () => {
    if (query.get('stage') == 2) {
      return navigate('/createProgram');
    }
    navigate('/createProgram?stage=' + (Number(query.get('stage')) - 1));
  };

  const handleChange = (val, index) => {
    let newTodo = [...todo];
    newTodo[index].value = val;
    setTodo(newTodo);
  };
  const deleteTodo = (index) => {
    setTodo(todo.filter((item, i) => i != index));
    dispatch(
      saveTodo({
        todo: todo.filter((item, i) => i != index),
      }),
    );
  };
  const pushTodo = () => {
    const id = new ObjectID();
    setTodo([...todo, { value: '', isDone: false, edit: true, _id: id.toString() }]);
  };
  const handleSave = (index) => {
    let newTodo = [...todo];
    newTodo[index].edit = false;
    dispatch(
      saveTodo({
        todo: newTodo.filter((i) => i.value != ''),
      }),
    );
    setTodo(newTodo.filter((i) => i.value != ''));
  };
  const minimize = () => {
    setMini(!mini);
    setTimeout(() => {
      setHeaderDependency(mini);
    }, 300);
  };
  const minimize2 = () => {
    setMini2(!mini2);
  };
  const toggleedit = (index) => {
    let newTodo = [...todo];
    newTodo[index].edit = true;
    setTodo(newTodo);
  };

  const activityLevelOptions = {
    'Light': 'Light: 1-3 times a week',
    'Moderate': 'Moderate: 4-5 times a week',
    'Active': 'Active: intense 4-5 times a week',
    'Very active': 'Very active: intense 6-7 times a week',
  };
  useEffect(() => {
    if (todoData?.length) setTodo(todoData);
    else setTodo([]);
  }, [todoData]);

  const onSave = () => {
    dispatch(
      saveTodo({
        todo: todo.filter((i) => i.value != ''),
      }),
    ).then((res) => {
      dispatch(
        updateFeedback({
          snackbar: true,
          message: 'Todo Saved Successfully',
          severity: 'success',
        }),
      );
    });
  };

  const getOverallProgress = () => {
    let val = 0;
    Program.ExercisePlan.weeks.map((i, index) => {
      val = val + getWeekProgress(i, clientStats, index);
    });

    return val / Program?.ExercisePlan.weeks?.length;
  };

  const SendProgram = () => {
    dispatch(
      sendProgram({
        ProgramId: Program._id,
        ClientId: id,
      }),
    );
  };

  const deleteSentProgram = (id) => {
    deleteSentPrograms(id);
  };

  return (
    <RootStyle>
      <Page title=" Simplified Online Fitness Training ">
        <Container>
          <Header
            style={{
           
            
              overflow: 'hidden',
            }}
          >
            <BoxHeader
              px={2}
              py={2}
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
                  Client profile
                </Typography>{' '}
              </Box>{' '}
              {/* <Button sx={{ py: 0 }} size={"small"} onClick={onSave}>
                Save
              </Button> */}
            </BoxHeader>
          </Header>
          <Content
            withoutPadding
            style={{
              backgroundColor: '#FBFBFB',
            }}
    
          >
            <Box bgcolor={"#FBFBFB"}>
              <ClientProfileHeader
                setHeaderDependency={setHeaderDependency}
                Profile={Profile}
                Program={Program}
                CreatedAt={CreatedAt}
                view={state?.view || view}
                setView={(val) => {
                  navigate(pathname, {
                    state: { view: val },
                    replace: true,
                  });
                  setView(val);
                }}
              />
            </Box>


    <Box px={2} mb={2}    bgcolor={"#FBFBFB"}>
      <Box px={2} pt={1} 
      boxShadow="0px 4px 4px 0px rgba(43, 64, 87, 0.15)" 
      bgcolor={"#fff"}
      borderRadius={"8px"} border={"1px solid #E1E7F0"}>
      <Stack direction={"column"} spacing={1}>
        <Box onClick={() => setView(1)}>
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={1}>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <IconAbout />
          <Typography   color="text.primary">
            About
          </Typography>
          </Stack>
          <IconButton>
            <Iconify icon={"eva:chevron-right-fill"} />
          </IconButton>
          </Stack>
         <Divider />
        </Box>
        <Box onClick={() => setView(2)}>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={1}>
         <Stack direction={"row"} spacing={2} alignItems={"center"}>
         <IconHealth />
          <Typography  color="text.primary">
          Heath profile
          </Typography>
          </Stack>
          <IconButton>
            <Iconify icon={"eva:chevron-right-fill"} />
          </IconButton>
          </Stack>
   
        </Box>
        {/* <Box onClick={() => setView(3)}>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={1}>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
        <IconBioscan />
          <Typography  color="text.primary">
          Bio scan
          </Typography>
          </Stack>
          <IconButton>
            <Iconify icon={"eva:chevron-right-fill"} />
          </IconButton>
          </Stack>
      
         
        </Box> */}
      </Stack>
      </Box>
    </Box>






       
        
              <Box bgcolor={"#FBFBFB"} px={2} py={2}>
              <Box sx={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #E1E7F0',
                boxShadow: '0px 4px 4px 0px rgba(43, 64, 87, 0.15)',
              }}>
                {' '}
               

              {Program?._id?  <Box
                    alignItems={'center'}
                    px={3}
                    py={2}
                    
                  >
                    <Typography variant="h5" gutterBottom color="text.primary">Active Program</Typography>
                    <Box
                      sx={{
                        display: 'flex',
                       
                        mt: 2,
                        backgroundSize: 'cover',
                        borderRadius: '4px 4px 4px 4px',
                        backgroundPosition: 'center',
                      }}
                      // style={{
                      //   backgroundImage: `src(${
                      //     Program?.BannerImage ||
                      //     "/images/instructor/programImage.png"
                      //   })`,
                      // }}
                    >
                      
                        <Image
                          src={Program?.BannerImage || '/images/DefaultThumbnail.png'}
                          sx={{
                            width: 96,
                            height: 71,
                            backgroundPosition: 'center',
                            borderRadius: 1,
                          }}
                        />
                    
                 <Stack direction={"column"} spacing={1} ml={2}>
                      <Typography
                        sx={{
                          ml:  2 ,
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                        }}
                      >
                        {Program?.Title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                       In progress: Week {getCurrentInProgressWeekNumber(Program.ExercisePlan.weeks, clientStats) + 1} / {Program?.Duration}
                      </Typography>

                      </Stack>
                    </Box>
                    <Box>
                     
                    
                    </Box>
                  </Box>
:  <Box

bgcolor={'#fff'}
height={'100%'}
py={2}
px={2}
mb={1}
>
<Typography variant="h5" gutterBottom color="text.primary">Active Program</Typography>
<br/>
{sentProgram ? (
  <ProgramListView
    programs={[{ ...sentProgram.Program, _id: sentProgram._id }]}
    status={'Sent'}
    onDelete={deleteSentProgram}
  />
) : (
  <Box
    height={'100%'}
    display={'flex'}
    flexDirection={'column'}
    justifyContent={'center'}
    alignItems={'center'}
    width={'100%'}
  >

      <Typography color={'text.secondary'}>No active program</Typography>
      <Button color="primary" variant="outlined" size="small" sx={{mt: 2}} fullWidth>
        <SelectProgram
          programs={ProgramList}
          email={Profile.email}
          reload={reload}
        >
          Add program
        </SelectProgram>
      </Button>
  
  </Box>
)}
</Box>
}

 {/* workout calendar section */}
{Program?._id? <Box
              
              
              >
                  <Stack px={2} mt={1}>
                    <Stack
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      direction={'row'}
                      onClick={() => navigate('workoutCalendar')}
                    >
                      <Stack
                        direction={'row'}
                        spacing={1}
                        alignItems="center"
                      >
                        <IconWorkoutCalendar style={{ fontSize: 32 }} />
                        <Typography
                          color="text.primary"
                          align="center"
                          flexWrap={'wrap'}
                        >
                          Workout
                        </Typography>
                      </Stack>
                      <Iconify icon={"eva:chevron-right-fill"}  sx={{fontSize: 24 ,color: "text.secondary"}} />
                    </Stack>
                    <Divider sx={{ my: 1.5 }} />
                  </Stack>
                  <Stack
                    px={2}
                    pb={3}
                  >
                    <Stack
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      direction={'row'}
                      pl={0.5}
                      onClick={() => navigate('trainingLog')}
                    >
                      <Stack
                        direction={'row'}
                        spacing={1}
                        alignItems="center"
                     
                      >
                        {logCount ? (
                          <StyledBadge
                            badgeContent={logCount}
                            color="primary"
                          >
                            <ClientTrainingLog
                              sx={{
                                fontSize: 24,
                                ml:2

                             
                              }}
                            />
                          </StyledBadge>
                        ) : (
                          <ClientTrainingLog
                            sx={{
                              fontSize:24,
                              ml:2
                             
                            }}
                          />
                        )}
                        <Typography
                          color="text.primary"
                          align="center"
                          flexWrap={'wrap'}
                          sx={{
                           pl:0.5
                          }}
                        >
                        Comments
                        </Typography>
                      </Stack>
                      <Iconify icon={"eva:chevron-right-fill"}  sx={{fontSize: 24 ,color: "text.secondary"}} />
                    </Stack>
                  </Stack>
                </Box>:""}


               
                
              </Box>

               {/* todo list */}
             {Program?._id? <Box
                  mt={3}
                  mb={3}
                  px={2}
                  py={2}
                  bgcolor={"#fff"}
                  borderRadius={"8px"}
                  border={"1px solid #E1E7F0"}
                  boxShadow={"0px 4px 4px 0px rgba(43, 64, 87, 0.15)"}
               
                >
                  <Stack
                    direction="row"
                    justifyContent={'space-between'}
                    pb={1}
                  >
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}
                    >
                      Todos
                    </Typography>
                    {/* 
                <Typography
                  sx={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                  color={"primary.main"}
                >
                  View <Iconify icon={"eva:arrow-ios-forward-fill"} />
                </Typography> */}
                  </Stack>
                  <TodoList
                    todo={todo}
                    handleSave={handleSave}
                    handleChange={handleChange}
                    deleteTodo={deleteTodo}
                    pushTodo={pushTodo}
                    toggleedit={toggleedit}
                  />
                </Box>:""}
              </Box>
           
           
          </Content>
        </Container>{' '}
      </Page>
      <DetailsBottonDrawer 
      open={view!==null} 
      onClose={() => setView(null)}
      view={view}
      title={view==1?"About the athlete":view==2?"Health profile":view==3?"Bio scan":""} 
      content={{
        about: <>
        {/* <Box >
                        <BodyMetrix data={Profile.healthInfo} viewMode/>
                        </Box> */}
        <Box mt={1}>
          <Box
         
            bgcolor={'#fff'}
          
          >
          
            <Typography
              color="text.primary"
              sx={{ fontWeight: 'bold' }}
            >
              Goals
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb:  2 }}
              color="text.secondary"
              flexWrap={'wrap'}
            >
              {Profile.goals || 'N/A'}
            </Typography>
          
              <Stack spacing={2}>
                <Box>
                  <Typography
                    color="text.primary"
                    mb={0.5}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Training experience{' '}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body1"
                  >
                    {Profile.trainingExperience || 'N/A'}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    color="text.primary"
                    mb={0.5}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Years of training{' '}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body1"
                  >
                    {Profile.YearsOfTraining ? Profile.YearsOfTraining + ' years' : 'N/A'}
                  </Typography>
                </Box>
            
                <Box>
                  <Typography
                    color="text.primary"
                    mb={0.5}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Activity level{' '}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body1"
                  >
                    {activityLevelOptions?.[Profile.activityLevel] || 'N/A'}
                  </Typography>
                </Box>
              </Stack>
          

          </Box>
        </Box>
       
      </>
      ,
      health:  
      <Box mt={1} pb={4}>
      <Box
     
        bgcolor={'#fff'}
      
      >
        
        <Stack
          spacing={2}
          mb={2}
          direction={'row'}
        >
          <Box>
            <Typography
              color="text.primary"
              sx={{ fontWeight: 'bold' }}
            >
              Height
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: mini2 ? 0 : 2 }}
              color="text.secondary"
              flexWrap={'wrap'}
            >
              {Profile?.healthInfo?.height?.toFixed(2) || 'N/A'} cm
            </Typography>
          </Box>
          <Box>
            <Typography
              color="text.primary"
              sx={{ fontWeight: 'bold' }}
            >
              Weight
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: mini2 ? 0 : 2 }}
              color="text.secondary"
              flexWrap={'wrap'}
            >
              {Profile?.healthInfo?.weight?.toFixed(2) || 'N/A'} kg
            </Typography>
          </Box>
        </Stack>

       
          <Stack spacing={2}>
            <Box>
              <Typography
                color="text.primary"
                sx={{ fontWeight: 'bold' }}
              >
                Medical condition
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 0.5 }}
                color="text.secondary"
                flexWrap={'wrap'}
              >
                {Profile?.healthInfo?.medicalCondition || 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography
                color="text.primary"
                mb={0.5}
                sx={{ fontWeight: 'bold' }}
              >
                Medications
              </Typography>
              <Typography
                color="text.secondary"
                variant="body1"
              >
                {Profile.healthInfo.medications || 'N/A'}
              </Typography>
            </Box>

            <Box>
              <Typography
                color="text.primary"
                mb={0.5}
                sx={{ fontWeight: 'bold' }}
              >
                Injuries
              </Typography>
              <Typography
                color="text.secondary"
                variant="body1"
              >
                {Profile.healthInfo.injuries || 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography
                color="text.primary"
                mb={0.5}
                sx={{ fontWeight: 'bold' }}
              >
                Family health history
              </Typography>
              <Typography
                color="text.secondary"
                variant="body1"
              >
                {Profile.healthInfo.history || 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography
                color="text.primary"
                mb={0.5}
                sx={{ fontWeight: 'bold' }}
              >
                Allergies and reactions
              </Typography>
              <Typography
                color="text.secondary"
                variant="body1"
              >
                {Profile.healthInfo.allergiesAndReactions || 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography
                color="text.primary"
                mb={0.5}
                sx={{ fontWeight: 'bold' }}
              >
                Supplements
              </Typography>
              <Typography
                color="text.secondary"
                variant="body1"
              >
                {Profile.healthInfo.supplements || 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography
                color="text.primary"
                mb={0.5}
                sx={{ fontWeight: 'bold' }}
              >
                Other
              </Typography>
              <Typography
                color="text.secondary"
                variant="body1"
              >
                {Profile.healthInfo.medicalNotes || 'N/A'}
              </Typography>
            </Box>
          </Stack>
     

       
      </Box>
      <Box mt={1}>
        <Box
        
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
          <PhotoWidget data={Profile.bodyImages} />
        </Box>
      </Box>
   
   
   
    </Box>

    ,
    bioScan: <Box mt={1} pb={4}>
      <Box bgcolor={'#fff'}>
        
        <Typography variant="body1" color="text.secondary">
          This feature is currently under development. Please check back soon for updates.
        </Typography>
      </Box>
    </Box>
   
      }}
      
      
      />
    </RootStyle>
  );
}




const DetailsBottonDrawer = ({open ,title ,onClose , view , content}) => {
  const [openDrawer, setOpenDrawer] = useState(open);
  const handleClose = () => {
    setOpenDrawer(false);
    onClose();
  };

  useEffect(() => {
    setOpenDrawer(open);
  }, [open]);

  return (
    <Drawer anchor="bottom" open={openDrawer} onClose={handleClose}
    sx={{
      '& .MuiDrawer-paper': {
        borderRadius: '8px 8px 0 0',
        padding: '8px',
        maxHeight: '80vh',
        minHeight: '50vh',
        
      },
    }}
    >
      <Box display={"flex"} justifyContent={"flex-end"} >
       
       <IconButton onClick={handleClose}>
        <Iconify icon={"eva:close-fill"} />
       </IconButton>
      </Box>
      <Box px={2} >
        <Typography variant="h3" sx={{
          fontSize: '28px',
        }} color="text.primary">{title}</Typography>
      </Box>
      <Box px={2} mt={1} pb={4} >
      {view==1?content.about:view==2?content.health:view==3?content.bioScan:null}
      </Box>
    </Drawer>
  );
};