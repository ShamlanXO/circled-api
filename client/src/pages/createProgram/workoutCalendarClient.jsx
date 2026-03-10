// @mui
import { styled } from '@mui/material/styles';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
// components
import Page from '../../components/Page';
// sections
import { Box, Button, Typography, Stack, IconButton, Avatar, ButtonBase, InputAdornment } from '@mui/material';

import Container from '../../components/Layout/Container';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';
import { updateFeedback } from '../../redux/actions/feedback';
import { useDispatch } from 'react-redux';
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
import { arrayMoveImmutable } from 'array-move';
import { useConfirmationModalContext } from 'src/utils/Modal';
import WorkoutCalendarHeader from 'src/components/instructor/workoutCalendarHeader';
import WorkoutWeek from 'src/components/instructor/workoutWeek';
import { useOutletContext } from 'react-router-dom';
import { computePath } from 'src/utils/routepath';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragOverlay,
  MeasuringStrategy,
} from '@dnd-kit/core';

import ObjectID from 'bson-objectid';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
const RootStyle = styled('div')(() => ({
  backgroundColor: '#F2F5F9',
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

  borderRadius: '0px 0px 8px 8px',
}));

// ----------------------------------------------------------------------

export default function WorkoutCalendar({ steps = 4, active = 1 }) {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [headerDependency, setHeaderDependency] = useState(false);
  const { search } = useLocation();
  const [destData, setDestData] = useState(null);
  const [sourceData, setSourceData] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const query = new URLSearchParams(search);
  const [Program, updateProgram, mode, saveProgram] = useOutletContext();
  const navigate = useNavigate();
  const { showConfirmationModal } = useConfirmationModalContext();
  const saveTimeoutRef = useRef(null);
  const handelNext = () => {
    navigate(computePath(mode, '/createDietPlan', Program._id));
  };
  const handleBack = () => {
    navigate(-1);
  };

  const saveProgramData = () => {
    dispatch(saveProgram({ ...Program }));
    navigate(-1);
  };

  useEffect(() => {
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set a new timeout to save after 2 seconds of no changes
    saveTimeoutRef.current = setTimeout(() => {
      dispatch(saveProgram({ ...Program, silent: true }));
    }, 2000);

    // Cleanup function to clear timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [Program, dispatch]);

 

  
  const swapExercise = (sourceWeek, destinationWeek, sourceDay, destinationDay) => {
    let allPrograms = cloneDeep(Program.ExercisePlan);
    let temp1 = cloneDeep(allPrograms.weeks[sourceWeek].days);

    let result = arrayMoveImmutable(temp1, sourceDay, destinationDay);
    allPrograms.weeks[sourceWeek].days = result;
    dispatch(updateProgram({ ExercisePlan: allPrograms }));
  };


  const copyExercise = (sourceWeek, destinationWeek, sourceDay, destinationDay) => {
    if (sourceWeek === destinationWeek && sourceDay === destinationDay) return;
    let allPrograms = { ...Program.ExercisePlan };

    if (allPrograms.weeks[destinationWeek].days[destinationDay].Exercise.length) {
      showConfirmationModal(
        'Are you sure ?',
        `You are going to replace (week ${Number(destinationWeek) + 1} - day ${
          Number(destinationDay) + 1
        }) exercises with (week ${sourceWeek + 1} - day ${sourceDay + 1}). This process is irreversible`,
        'Replace',
        'Cancel',
      ).then((res) => {
        if (res) {
          allPrograms.weeks[destinationWeek].days[destinationDay].Exercise = [
            ...allPrograms.weeks[sourceWeek].days[sourceDay].Exercise,
          ];

          allPrograms.weeks[destinationWeek].days[destinationDay].Title =
            allPrograms.weeks[sourceWeek].days[sourceDay].Title;

          dispatch(updateProgram({ ExercisePlan: allPrograms }));
        } else {
          return;
        }
      });
    } else {
      let initialItem = {
        ...allPrograms.weeks[sourceWeek].days[sourceDay],
      };

      allPrograms.weeks[destinationWeek].days[destinationDay] = initialItem;

      allPrograms.weeks[sourceWeek].days[sourceDay] = { ...initialItem, _id: String(ObjectID()) };

      dispatch(updateProgram({ ExercisePlan: allPrograms }));
    }
  };

  




  const checkIfTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  const sensors = useSensors(
    useSensor(checkIfTouchDevice() ? TouchSensor : PointerSensor, {
      activationConstraint: {
        tolerance: 5,
        delay: 100,
      },
    }),
  );

  const getWeekandday = useCallback(
    (id) => {
      let week = Program.ExercisePlan.weeks.findIndex((i) => i.days.findIndex((j) => j._id == id) != -1);
      let day = Program.ExercisePlan.weeks[week].days.findIndex((j) => j._id == id);
      return { week, day };
    },
    [Program.ExercisePlan],
  );

  const handleDragStart = (event) => {
    setIsActive(true);
    if (event.active.id) {
      let { week, day } = getWeekandday(event.active.id);
      setSourceData({
        week: week,
        day: day,
      });
    } else {
      setSourceData(null);
    }
  };

  const handleDragEnd = (event) => {
    setIsActive(false);
    if (!destData || !sourceData) {
      setSourceData(null);
      setDestData(null);
      return;
    }

    let allPrograms = cloneDeep(Program.ExercisePlan);
    let sourceWeek = sourceData.week;
    let sourceDay = sourceData.day;
    let destinationWeek = destData.week;
    let destinationDay = destData.day;

    if (
      sourceData.week !== destData.week &&
      Program.ExercisePlan.weeks[destData.week].days[destData.day].Exercise.length == 0
    ) {
      if (
        allPrograms.weeks[destinationWeek].days[destinationDay].Exercise.length == 0 &&
        !allPrograms.weeks[destinationWeek].days[destinationDay].Title
      )
        copyExercise(sourceWeek, destinationWeek, sourceDay, destinationDay);
    } else {
      if (sourceWeek == destinationWeek) swapExercise(sourceWeek, destinationWeek, sourceDay, destinationDay);
    }

    setSourceData(null);
    setDestData(null);
  };

  const handleDragCancel = (event) => {
    setSourceData(null);
  };

  const handleDragOver = useMemo(
    () =>
      debounce((event) => {
        if (event.over?.id) {
          let { week, day } = getWeekandday(event.over.id);
          setDestData({
            week: week,
            day: day,
          });
        } else {
          setDestData(null);
        }
      }, 50),
    [getWeekandday],
  );

  return (
    <RootStyle>
      <Page title=" Simplified Online Fitness Training ">
        <Container>
          {' '}
          <Header headerDependency={headerDependency}>
            {mode == 'customize' ? (
              <BoxHeader
                px={2}
                py={2}
                display={'flex'}
                justifyContent={'space-between'}
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
                    variant="subtitle1"
                    color="text.primary"
                  >
                    Workout
                  </Typography>
                </Box>
                <Button
                  size={'small'}
                  onClick={saveProgramData}
                >
                  Save
                </Button>
              </BoxHeader>
            ) : (
              <Box pt={2}>
                <Box
                  width={'100%'}
                  display={'flex'}
                  px={2}
                  mb={3}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                  >
                    {' '}
                    <IconButton
                      onClick={() => navigate('/')}
                      sx={{ color: 'text.primary' }}
                    >
                      <ArrowLeft />
                    </IconButton>
                    <Typography
                      variant="h6"
                      color="text.primary"
                    >
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                      >
                        <Typography color="primary"></Typography>
                      </Box>
                    </Typography>{' '}
                  </Box>{' '}
                  {/* <Button
                  onClick={() =>
                    navigate(computePath(mode, "/workoutCalendar", Program._id))
                  }
                >
                  Edit Workouts
                </Button> */}
                </Box>
                <Progress
                  noClose={true}
                  withDivider
                  mode={mode}
                  Program={Program}
                  route={
                    mode == 'edit'
                      ? ['workoutCalendar', 'createDietPlan', 'publishProgram']
                      : ['', 'workoutCalendar', 'createDietPlan', 'publishProgram']
                  }
                  label={mode == 'edit' ? ['Calander', 'Diet', 'Publish'] : ['Start', 'Calander', 'Diet', 'Publish']}
                  steps={mode == 'edit' ? 3 : 4}
                  active={mode == 'edit' ? 1 : 2}
                  handleClose={() => navigate('/', { replace: true })}
                />
              </Box>
            )}
            {/* <WorkoutCalendarHeader setHeaderDependency={setHeaderDependency} mode={mode} /> */}
          </Header>{' '}
          <Content
            style={{
              paddingTop: 0,
              paddingLeft: 0,
              paddingRight: 0,
              background: '#F5F7FA',
            }}
          >
            <DndContext
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              onDragCancel={handleDragCancel}
              onDragOver={handleDragOver}
              sensors={sensors}
              collisionDetection={closestCenter}
              measuring={{
                droppable: {
                  strategy: MeasuringStrategy.Always,
                },
              }}
            >
              <WorkoutWeek
                Program={Program}
                updateProgram={updateProgram}
                mode={mode}
                destData={destData}
                sourceData={sourceData}
              />
            </DndContext>
          </Content>
          {mode !== 'customize' ? (
            <FooterBase>
              <Footer
                next
                back
                nextClick={handelNext}
                backClick={handleBack}
              />
            </FooterBase>
          ) : null}
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
