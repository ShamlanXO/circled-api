// @mui
import { styled } from '@mui/material/styles';
import { useState } from 'react';
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
import { useConfirmationModalContext } from 'src/utils/Modal';
import WorkoutCalendarHeader from 'src/components/instructor/workoutCalendarHeader';
import WorkoutWeek from 'src/components/instructor/progressCalender';
import { useOutletContext } from 'react-router-dom';
import { computePath } from 'src/utils/routepath';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import cloneDeep from 'lodash/cloneDeep';
import { result } from 'lodash';
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
  const query = new URLSearchParams(search);
  const [Program, updateProgram, mode, saveProgram] = useOutletContext();
  const navigate = useNavigate();
  const { showConfirmationModal } = useConfirmationModalContext();
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

  const copyExercise = (sourceWeek, destinationWeek, sourceDay, destinationDay) => {
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
      allPrograms.weeks[destinationWeek].days[destinationDay].Exercise = [
        ...allPrograms.weeks[sourceWeek].days[sourceDay].Exercise,
      ];
      allPrograms.weeks[destinationWeek].days[destinationDay].Title =
        allPrograms.weeks[sourceWeek].days[sourceDay].Title;

      dispatch(updateProgram({ ExercisePlan: allPrograms }));
    }
  };

  const swapExercise = (sourceWeek, destinationWeek, sourceDay, destinationDay) => {
    let allPrograms = cloneDeep(Program.ExercisePlan);
    let temp1 = cloneDeep(allPrograms.weeks[sourceWeek].days[sourceDay].Exercise);
    let temp2 = allPrograms.weeks[sourceWeek].days[sourceDay].Title;
    allPrograms.weeks[sourceWeek].days[sourceDay].Exercise = cloneDeep(
      allPrograms.weeks[destinationWeek].days[destinationDay].Exercise,
    );
    allPrograms.weeks[sourceWeek].days[sourceDay].Title = allPrograms.weeks[destinationWeek].days[destinationDay].Title;
    allPrograms.weeks[destinationWeek].days[destinationDay].Exercise = cloneDeep(temp1);
    allPrograms.weeks[destinationWeek].days[destinationDay].Title = temp2;
    console.log(allPrograms.weeks[destinationWeek].days[destinationDay].Title, temp2, 'index check');
    dispatch(updateProgram({ ExercisePlan: allPrograms }));
  };

  const onDragUpdate = (result) => {
    const { source, destination, combine } = result;
    let destDataC = {};
    if (!destination) {
      destDataC = null;
    } else {
      if (Number(destination.droppableId) == 0 && destination.index == 0) {
      } else
        destDataC = {
          ...destDataC,
          week: Number(destination.droppableId),
          day: destination.index,
        };
    }
    if (combine) {
      let destinationWeek = combine.draggableId.split('-')[0];
      let destinationDay = combine.draggableId.split('-')[1];
      destDataC = {
        ...destDataC,
        cweek: destinationWeek,
        cday: destinationDay,
      };
    }

    setDestData(destDataC);
  };

  const onDragEnd = (result) => {
    const { source, destination, combine } = result;
    setDestData(null);
    console.log('==> result', result);
    if (!destination && !combine) {
      return;
    }

    if (combine) {
      let sourceWeek = Number(source.droppableId);
      let sourceDay = source.index;
      let destinationWeek = (destination || combine).draggableId.split('-')[0];
      let destinationDay = (destination || combine).draggableId.split('-')[1];
      copyExercise(sourceWeek, destinationWeek, sourceDay, destinationDay);
    } else {
      let sourceWeek = Number(source.droppableId);
      let sourceDay = source.index;
      let destinationWeek = Number(destination.droppableId);
      let destinationDay = destinationWeek > 0 ? destination.index - 1 : destination.index;
      if (destinationDay < 0) return;
      console.log(sourceWeek, destinationWeek, sourceDay, destinationDay, 'index check');
      swapExercise(sourceWeek, destinationWeek, sourceDay, destinationDay);
    }
  };
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
              paddingLeft: 12,
              paddingRight: 12,
              background: 'none',
            }}
          >
            <DragDropContext
              onDragEnd={onDragEnd}
              onDragUpdate={onDragUpdate}
            >
              <WorkoutWeek
                Program={Program}
                updateProgram={updateProgram}
                mode={mode}
                destData={destData}
              />
            </DragDropContext>
          </Content>
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
