// @mui
import { styled } from '@mui/material/styles';
import { useState } from 'react';
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
  Divider,
  Stepper,
} from '@mui/material';

import Container from '../../components/Layout/Container';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';
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
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import { updateProfile } from 'src/redux/actions/Profile';
import { updateStatus } from 'src/redux/actions/clientExercise';
const RootStyle = styled('div')(() => ({
  backgroundColor: '#F2F5F9',
  height: '100%',
}));

const BoxStyle = styled(Box)(() => ({
  position: 'relative',
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
const BoxHeader = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
  boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
  borderRadius: '0px 0px 8px 8px',
}));
// ----------------------------------------------------------------------

export default function MyWorkoutDayPage() {
  const dispatch = useDispatch();
  const { state, pathname } = useLocation();

  const { search } = useLocation();

  const AtheletePlan = useSelector((s) => s.AtheletePlan);
  const Plan = AtheletePlan.Exercises.ExercisePlan;
  const Stats = AtheletePlan.stats;
  const query = new URLSearchParams(search);
  const [exercises, setExercises] = useState([{}, {}, {}]);
  const navigate = useNavigate();

  const handleAddNewCard = () => {
    let newEx = [...exercises];
    newEx.push({
      isNew: true,
    });
    setExercises(newEx);
  };
  const handleBack = () => {
    navigate('/workoutCalendar');
  };

  let ex = Plan.weeks[state.week].days[state.day].Exercise.map((i, index) => {
    return {
      ...i,
      isCompleted: Stats?.[`${state.week}-${state.day}-${index}`],
    };
  });

  let Incomplete = { state: false };

  for (let index in ex) {
    if (!Stats?.[`${state.week}-${state.day}-${index}`]) {
      Incomplete = { state: true, index: Number(index) };
      break;
    }
  }

  const markComplete = () => {
    let ex = Plan.weeks[state.week].days[state.day].Exercise;
    let stats = Stats;
    for (let index in ex) {
      if (!stats[`${state.week}-${state.day}-${index}`]) {
        stats[`${state.week}-${state.day}-${index}`] = true;
      }
    }
    stats[`${state.week}-${state.day}`] = true;
    dispatch(updateProfile({ stats: stats }));
    dispatch(
      updateStatus({
        _id: AtheletePlan.currentPlan,
        stats: {
          ...AtheletePlan.stats,
          ...stats,
        },
        currentWeek: state.week,
        currentDay: state.day,
      }),
    );
    dispatch(
      updateFeedback({
        sAnimate: true,
        message: 'Workout Completed',
        description: 'You have successfully completed the workout',
      }),
    );
    navigate('/client');
  };

  return (
    <RootStyle>
      <Page title=" Simplified Online Fitness Training ">
        <Container>
          {' '}
          <Header noColor>
            <BoxHeader
              px={2}
              py={2}
              display={'flex'}
              alignItems={'center'}
            >
              <Box
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
                flexDirection={'row'}
              >
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
                  Exercises
                </Typography>
              </Box>
              {/* <Typography color={"primary"} onClick={()=>markComplete()}>
                                Complete
                            </Typography> */}
            </BoxHeader>
          </Header>{' '}
          <Content
            style={{
              paddingTop: 16,
              paddingBottom: 48,
              overflowY: 'auto',
              background: '#fff',
            }}
          >
            {/* <Typography
                            sx={{
                                fontSize: 18,

                                mb: 2,

                                color: '#95A3B8',
                            }}
                            color="text.secondary"
                        >
                            Week {state?.week + 1} - {days[state?.day]}
                        </Typography> */}
            <LabeledInput
              fullWidth
              placeholder="Example: Chest day"
              clabel="Workout title"
              name={'title'}
              value={Plan.weeks[state.week].days[state.day].Title}
              InputProps={{
                readOnly: true,
                style: {
                  background: '#fff',
                  // boxShadow:
                  //     '0px 4px 54px rgb(225 231 240 / 50%)',
                },
              }}
            />

            {ex.map((step, index) => (
              <Box
                border={'2px solid rgba(225, 231, 240, 1)'}
                borderRadius={1}
                bgcolor={'white'}
                p={2}
                mt={4}
                width={'auto'}
              >
                <ExerciseCard
                  clientSide
                  plan={step}
                  d={state.day}
                  index={index}
                  w={state.week}
                />
              </Box>
            ))}
          </Content>
          <FooterBase actionButton>
            <BoxFooter sx={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
              <Typography
                align="center"
                variant="h6"
              >
                Exercises left
                <br />
                {ex.filter((i) => !i.isCompleted).length}
              </Typography>

              <Button
                variant="contained"
                sx={{ borderRadius: 2 }}
                onClick={() => markComplete()}
              >
                {'Completed'}
                {/* &nbsp;<Iconify
                                                                        icon={
                                                                            'icons8:chevron-right-round'
                                                                        }
                                                                        color="white"
                                                                        width={
                                                                            28
                                                                        }
                                                                        height={
                                                                            28
                                                                        }
                                                                    /> */}
              </Button>
            </BoxFooter>
          </FooterBase>
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
