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
  Stepper,
  Tabs,
  Tab,

  Switch,
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
import { TabContext, TabPanel } from '@mui/lab';
import SwitchCustom from 'src/components/SwitchCustom';
import ProgramOverviewStatus from 'src/components/program/programOverviewStatus';
import ClientList from 'src/components/dashboard/client/ClientList';
import ProgramOverviewPopover from 'src/components/program/programOverviewPopover';
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

export default function ClientWorkoutCalendar() {
  const dispatch = useDispatch();

  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const exercises = [{}, {}];
  const navigate = useNavigate();
  const Program = useSelector((s) => s.AtheletePlan.Exercises);
  const [current, setCurrent] = useState(0);
  const handleTabChange = (event, newValue) => {
    setCurrent(newValue);
  };

  return (
    <RootStyle>
      <Page title=" Simplified Online Fitness Training ">
        <Container>
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
                    Workout
                  </Typography>{' '}
                </Box>{' '}
                <Box
                  width="120px"
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Tabs
                    variant="fullWidth"
                    value={current}
                    onChange={handleTabChange}
                    aria-label=""
                    indicatorColor="none"
                    sx={{
                      backgroundColor: '#F5F7FA',
                      borderRadius: 12,
                      padding: '4px',
                      borderBottom: 'none',
                    }}
                  >
                    <Tab
                      label={
                        <Iconify
                          icon="fluent:align-space-around-vertical-20-filled"
                          width="20px"
                          height="20px"
                        />
                      }
                      sx={{
                        'minWidth': 10,
                        'borderRadius': 12,
                        'width': '50px',
                        'borderBottom': 'none',
                        '&.Mui-selected': {
                          color: (theme) => theme.palette.text.primary,
                          backgroundColor: '#fff',
                          boxShadow: '0px 1px 7px #E1E7F0',
                          border: '1px solid #E1E7F0',
                          borderBottom: 'none',
                        },
                      }}
                    />{' '}
                    <Tab
                      label={
                        <Iconify
                          icon="fluent:align-space-around-horizontal-20-filled"
                          width="20px"
                          height="20px"
                        />
                      }
                      sx={{
                        'minWidth': 10,
                        'borderRadius': 12,
                        'width': '50px',
                        '&.Mui-selected': {
                          color: (theme) => theme.palette.text.primary,
                          backgroundColor: '#fff',
                          boxShadow: '0px 1px 7px #E1E7F0',
                          border: '1px solid #E1E7F0',
                        },
                      }}
                    />
                  </Tabs>
                </Box>
              </Box>
            </BoxHeader>
          </Header>{' '}
          <Content
            style={{
              width: '100%',
              paddingTop: 12,
              paddingBottom: 24,
              overflowY: 'auto',
              //   overflowX: "auto",
            }}
          >
            <Stack spacing={2}>
              <WorkoutWeek
                clientSide={true}
                fullWidth={current == 0}
                Program={Program}
                handleClick={(day, week, title) =>
                  navigate('/client/myWorkoutCalendar/workoutDay', {
                    state: { day, week, title },
                  })
                }
              />
            </Stack>
          </Content>
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
