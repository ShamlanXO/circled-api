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
import { useNavigate, useLocation, useOutletContext } from 'react-router';
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

const RootStyle = styled('div')(() => ({
  backgroundColor: '#F5F7FA',
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
// ----------------------------------------------------------------------

export default function MyWorkoutDayPage() {
  const { state } = useLocation();
  const [workoutData] = useOutletContext();
  const Plan = useSelector((s) => s.AtheletePlan.Exercises.ExercisePlan);

  const navigate = useNavigate();

  let ex = workoutData.Exercise;
  const days = ['Saturday', 'Sunday', 'Moday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday'];
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
            </BoxHeader>
          </Header>{' '}
          <Content
            style={{
              paddingTop: 16,
              paddingBottom: 48,
              overflowY: 'auto',
            }}
          >
            <Typography
              sx={{
                fontSize: 18,

                mb: 2,

                color: '#95A3B8',
              }}
              color="text.secondary"
            >
              Week {state?.week + 1} - {days[state?.day]}
            </Typography>
            <LabeledInput
              fullWidth
              placeholder="Example: Chest day"
              clabel="Workout name"
              name={'title'}
              value={Plan.weeks[state.week].days[state.day].Title}
              InputProps={{
                readOnly: true,
                style: {
                  backgroundColor: 'white',
                  boxShadow: '0px 4px 54px rgb(225 231 240 / 50%)',
                },
              }}
            />

            {ex.map((step, index) => (
              <Box>
                <center>
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: 18,
                      color: '#95A3B8',
                      mb: 2,
                      mt: 2,
                    }}
                  >
                    Exercise {index + 1}
                  </Typography>
                </center>
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
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
