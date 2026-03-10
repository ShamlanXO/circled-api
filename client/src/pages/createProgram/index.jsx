// @mui
import { styled } from '@mui/material/styles';
import { useState, useEffect, useRef } from 'react';
// components
import Page from '../../components/Page';
// sections
import { Box, Button, Typography, Stack, Avatar, ButtonBase, IconButton, InputAdornment } from '@mui/material';

import Container from '../../components/Layout/Container';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch, useSelector } from 'react-redux';
//import { updateProgram } from "src/redux/actions/createProgram";
import { updateOnboarding } from '../../redux/actions/Onboarding';
import LinearProgress from '@mui/material/LinearProgress';
import Iconify from '../../components/Iconify';
import LabeledInput from '../../components/core/LabeledInput';
import FooterBase from '../../components/Layout/Footer';
import NewProgramForm from 'src/components/instructor/newProgramForm';
import Progress from 'src/components/progress';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import Footer from 'src/components/onboarding/footer';
import { handleuploadImage } from 'src/utils/uploader';
import axios from 'axios';
import api from 'src/utils/api';
import Input from 'src/components/Labs/Cropper';
import { useOutletContext } from 'react-router-dom';
import Start from './start';
import Calendar from './workoutCalendar';
import Diet from './dietPlan';
import Publish from './publishCreateProgram';
import { saveProgram } from 'src/redux/actions/createProgram';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
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
  padding: '20px 0',
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
  /* Dark primary / 50% */
  color: '#172A44',
  fontSize: 18,
  fontWeight: 'bold',
  width: '100%',
  marginBottom: 8,
  border: '2px solid rgba(23, 42, 68, 0.5)',
}));

// ----------------------------------------------------------------------

export default function CreateProgramPage({}) {
  const [Program, updateProgram, mode] = useOutletContext();
  const { state } = useLocation();
  const [selectedTab, setSelectedTab] = useState(state?.tab || 0);
  const [completedTab, setCompletedTab] = useState([]);
  const sref = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTabChange = (newValue) => {
    if (!sref.current.validateForm) {
      setSelectedTab(newValue);
      return;
    }
    sref.current.validateForm().then((validated) => {
      if (Object.keys(validated).length == 0) {
        if (selectedTab !== 3) sref.current.handleSubmit();
        navigate(`/createProgram/`, {
          replace: true,
          state: { tab: newValue },
        });
        setSelectedTab(newValue);
      } else {
        sref.current.handleSubmit();
      }
    });
  };

  const handelNext = () => {
    // sref.current.handleSubmit()

    if (!sref.current.validateForm) {
      setSelectedTab(selectedTab + 1);
      return;
    }
    sref.current.validateForm().then((validated) => {
      if (Object.keys(validated).length == 0) {
        sref.current.handleSubmit();
        if (selectedTab !== 2) {
          setSelectedTab(selectedTab + 1);
          navigate(`/createProgram/`, {
            replace: true,
            state: { tab: selectedTab + 1 },
          });
        }
      } else {
        sref.current.handleSubmit();
      }
    });
  };

  const handleBack = () => {
    setSelectedTab(selectedTab - 1);
  };

  const FotterButtons = () => {
    switch (selectedTab) {
      case 3:
        return (
          <Footer
            confirm
            next
            // back
            nextText={mode == 'edit' ? 'Save' : 'Publish'}
            nextClick={handelNext}
            backClick={handleBack}
          />
        );
      case 2:
        return (
          <Footer
            backClick={handleBack}
            next={Program.DietPlan.Title || Program.DietPlan.Description}
            skip={!Program.DietPlan.Title && !Program.DietPlan?.Description}
            type={'submit'}
            nextClick={handelNext}
            skipClick={handelNext}
          />
        );
      case 1:
        return (
          <Footer
            next
            backClick={handleBack}
            nextClick={handelNext}
          />
        );

      case 0:
        return (
          <Footer
            next
            backClick={handleBack}
            nextClick={handelNext}
          />
        );

      default:
        return (
          <Footer
            next
            backClick={handleBack}
            nextClick={handelNext}
          />
        );
    }
  };

  const renderButton = () => {
    if(mode!='edit'){
      return (
        <Button
          disabled={!Program.Title}
          sx={{ fontSize: 16, paddingRight: 0 }}
          onClick={handleSaveAsDraft}
        >
          Save as draft
        </Button>
      )
    }
    // switch (selectedTab) {
    //   case 2:
    //     return (
    //       <Button
    //         sx={{ fontSize: 16, paddingRight: 0 }}
    //         onClick={handelNext}
    //       >
    //         {mode == 'edit' ? 'Save' : 'Publish'}
    //       </Button>
    //     );
    //   // case 2:
    //   //     return (
    //   //         <Button
    //   //             sx={{ fontSize: 16, paddingRight: 0 }}
    //   //             onClick={handelNext}
    //   //         >
    //   //             {!Program.DietPlan.Title &&
    //   //             !Program.DietPlan?.Description
    //   //                 ? 'Skip'
    //   //                 : 'Next'}
    //   //         </Button>
    //   //     )
    //   case 1:
    //     return (
    //       <Button
    //         sx={{ fontSize: 16, paddingRight: 0 }}
    //         onClick={handelNext}
    //       >
    //         Next
    //       </Button>
    //     );

    //   case 0:
    //     return (
    //       <Button
    //         sx={{ fontSize: 16, paddingRight: 0 }}
    //         onClick={handelNext}
    //       >
    //         Next
    //       </Button>
    //     );

    //   default:
    //     return (
    //       <Button
    //         sx={{ fontSize: 16, paddingRight: 0 }}
    //         onClick={handelNext}
    //       >
    //         Next
    //       </Button>
    //     );
    // }
  };

  useEffect(() => {
    if (selectedTab == 2 && !completedTab.includes(2)) {
      setCompletedTab([...completedTab, 2]);
    }
    if (Program.Title && Program.Description && !completedTab.includes(0)) {
      setCompletedTab([...completedTab, 0]);
    }

    let EmptyWeeks = Program?.ExercisePlan.weeks.find(
      (week) => week.days.find((day) => day.Exercise.length > 0) == null,
    );

    if (!EmptyWeeks && !completedTab.includes(1)) {
      setCompletedTab([...completedTab, 1]);
    }
  }, [Program, selectedTab]);


  const handleSaveAsDraft=()=>{

dispatch(updateFeedback({
  loading: true,
 
}))
    dispatch(saveProgram({
      ...Program,
      IsDraft: true
    })).then((res)=>{
     

        navigate('/drafts')
       dispatch(
                                                    updateFeedback({
                                                        loading: false,
                                                        sAnimate: true,
                                                        snackbar: false,
                                                        message:
                                                            'Program saved as draft',
                                                        severity: 'success',
                                                    })
                                                )
      
    })
  }



  return (
    <Page title=" Simplified Online Fitness Training ">
      <Container>
        <Header
          style={{
            
            backgroundColor: 'white',
            overflow: 'hidden',
          }}
          reducedHeight={16}
        >
          <Box
            pt={2}
       
            overflow={'hidden'}
          >
            <Box
              width={'100%'}
              display={'flex'}
              px={2}
              mb={1}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box
                display={'flex'}
                alignItems={'center'}
              >
                {' '}
                <Typography
                  variant="body1"
                  color="text.primary"
                >
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                  >
                  </Box>
                </Typography>{' '}
              </Box>{' '}
              {renderButton()}
            </Box>

            <Box px={2} >
              <Typography variant='h3' color='text.primary' sx={{
                fontSize: 24,
                fontWeight: 500,
              }}>
          {selectedTab == 0 ? 'Program description' : selectedTab == 1 ? 'Workout plan' : 'Complete and publish'}
              </Typography>
            </Box>
            
          </Box>
        </Header>

        {selectedTab == 0 && <Start ref={sref} />}
        {selectedTab == 1 && <Calendar ref={sref} />}
        {selectedTab == 2 && (
          <Publish
            ref={sref}
            handleBack={handleBack}
          />
        )}
        <FooterBase>
        <Box pb={2}>
              <Progress
                setSelectedTab={handleTabChange}
                noClose={true}
                mode={mode}
              
                Program={Program}
                completedIndex={completedTab}
                selectedTab={selectedTab}
                route={mode == 'edit' ? [0, 1, 2] : [0, 1, 2]}
                label={mode == 'edit' ? ['Workouts', 'Meals', 'Overview'] : ['Start', 'Workouts', 'Overview']}
                steps={mode == 'edit' ? 3 : 3}
                active={mode == 'edit' ? 1 : 1}
                handleClose={() => navigate('/', { replace: true })}
              />
            </Box>
            <Box 
            px={2}
            py={2}
            display={'flex'} flexDirection={'row'} alignItems={'center'}  gap={2} justifyContent={'space-between'}>
              <Box >
                <Button variant='text' sx={{color:'text.primary'}} onClick={() =>{ 
                  if(selectedTab == 0){
                    navigate(-1)
                    return
                  }
                  handleTabChange(selectedTab - 1)}}>
          
                    Back
           
                </Button>
              </Box>
              <Button variant='contained' color='primary' onClick={() => 
                {selectedTab == 2 ? handelNext() : handleTabChange(selectedTab + 1)}
                }>
               {selectedTab == 2 ? 'Publish' : 'Next'}
              </Button>
            </Box>
        </FooterBase>
      </Container>
    </Page>
  );
}
