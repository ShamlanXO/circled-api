// @mui
import { styled } from '@mui/material/styles';
import { useEffect, useState, useRef } from 'react';
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
  Divider,
  IconButton,
  StepLabel,
  StepContent,
  Step,
  Stepper,
  Icon,
} from '@mui/material';

import Container from '../../components/Layout/Container';
import Content from '../../components/Layout/Content';
import Header from '../../components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';
import { updateFeedback } from '../../redux/actions/feedback';
import { scroller, Element } from 'react-scroll';
import { useDispatch, useSelector } from 'react-redux';
import { updateProgram } from 'src/redux/actions/createProgram';
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
import { useOutletContext } from 'react-router-dom';
import { computePath } from 'src/utils/routepath';
import { deleteVideos } from 'src/redux/actions/createProgram';
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@mui/material/Collapse';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import union from 'lodash/union';
import CopyFile from 'src/assets/IconSet/CopyFile';
import DeleteIcon from 'src/assets/IconSet/trash';
import { useConfirmationModalContext } from 'src/utils/Modal';
import { addWorkout } from 'src/redux/actions/figgsLibrary';
import { title } from 'src/_mock/text';
import { id } from 'date-fns/locale';
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
  backgroundColor: '#fff',
  boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
  borderRadius: '0px 0px 8px 8px',
}));

// ----------------------------------------------------------------------

export default function WorkoutDay({ steps = 4, active = 1 }) {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const workouts = useSelector((s) => s.Library.workouts);
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const [exercises, setExercises] = useState([{}, {}]);
  const [Program, updateProgram, mode] = useOutletContext();
  const [activeExercise, setActiveExercise] = useState(null);
  const navigate = useNavigate();
  const reference = useRef(null);
  reference.current = { ...Program };
  useEffect(() => {
    // if(!Program.ExercisePlan.weeks[state.week].days[state.day].Exercise.length)
    // addNewDay()
    dispatch({
      type: 'UPDATE_PROGRAM',
      payload: {
        ScreenStats: {
          CurrentScreen: 'workoutDay',
          Week: state.week,
          Day: state.day,
        },
      },
    });

    return () => {
      let plan = { ...reference.current.ExercisePlan };

      plan.weeks[state.week].days[state.day].Exercise = plan.weeks[state.week].days[state.day].Exercise.filter(
        (i) => i.title || i?.media?.length,
      );
      dispatch(updateProgram({ ExercisePlan: plan }));
    };
  }, []);

  const addNewDay = () => {
    let plan = { ...Program.ExercisePlan };

    plan.weeks[state.week].days[state.day].Exercise.push({
      url: '',
      title: '',
      reps: null,
      sets: null,
      note: '',
      rest: null,
      banner: null,
      isNew: true,
      id: new Date().getTime(),
    });
    reference.current = plan;
    let contentElement = document.getElementById('circled-content');

    setTimeout(() => {
      contentElement.scrollTo({
        top: contentElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 500);

    dispatch(updateProgram({ ExercisePlan: plan }));
  };

  const editDay = (data) => {
    let plan = { ...Program.ExercisePlan };
    plan.weeks[state.week].days[state.day] = {
      ...plan.weeks[state.week].days[state.day],
      ...data,
    };
    reference.current = plan;
    dispatch(updateProgram({ ExercisePlan: plan }));
  };
  const { showConfirmationModal } = useConfirmationModalContext();

  const deleteExercise = (id) => {
    let plan = { ...Program.ExercisePlan };
    showConfirmationModal(
      'Are you sure?',
      `You are going to delete this exercise. This process is irreversible`,
      'Delete',
    ).then((res) => {
      if (res) {
        let delEx = plan.weeks[state.week].days[state.day].Exercise.splice(id, 1);
      }
    });

    // let urls = delEx?.[0]?.media?.map((i) => {
    //     return i.split('https://vimeo.com/')[1]
    // })
    // if (urls)
    //     dispatch(deleteVideos(urls))
    //         .then((res) => {
    //             reference.current = plan
    //             dispatch(updateProgram({ ExercisePlan: plan }))
    //         })
    //         .catch((err) => {
    //             if (err.response.status == 404) {
    //                 reference.current = plan
    //                 dispatch(updateProgram({ ExercisePlan: plan }))
    //             }
    //         })
    // else {
    reference.current = plan;
    dispatch(updateProgram({ ExercisePlan: plan }));
  };

  const editExercise = (val, index) => {
    let program = { ...Program };
    program.ExercisePlan.weeks[state.week].days[state.day].Exercise[index] = {
      ...program.ExercisePlan.weeks[state.week].days[state.day].Exercise[index],
      ...val,
    };
    reference.current = program.ExercisePlan;
    dispatch(updateProgram({ ExercisePlan: program.ExercisePlan }));
  };

  const uploadNewMedia = (e, w, d, i) => {
    navigate(computePath(mode, '/workoutDay/editExercise', Program._id), {
      state: { file: e.target.files, week: w, day: d, index: i },
    });
  };

  const days =
    Program?.calendarType == 'Numeric days'
      ? ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
      : ['Saturday', 'Sunday', 'Moday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday'];

  const uploadMediasFromLib = (items, w, d, i) => {
    let program = { ...Program };
    let media = [
      ...(program.ExercisePlan.weeks[w].days[d].Exercise[i]?.media
        ? program.ExercisePlan.weeks[w].days[d].Exercise[i].media
        : []),
      ...items.map((i) => ({ file: i.media, type: i.type, title: i.title })),
    ];
    let triggerMuscle = union(
      program.ExercisePlan.weeks[w].days[d].Exercise[i].triggerMuscle,
      ...items.map((i) => i.triggerMuscle),
    );

    program.ExercisePlan.weeks[w].days[d].Exercise[i] = {
      ...program.ExercisePlan.weeks[w].days[d].Exercise[i],
      media: media,
      triggerMuscle: triggerMuscle,
    };
    reference.current = program;
    dispatch(updateProgram({ ExercisePlan: program.ExercisePlan }));
    // navigate(computePath(mode, '/workoutDay/editExercise', Program._id), {
    //   state: {
    //     week: w,
    //     day: d,
    //     index: i,
    //   },
    // });
  };

  const addWorkoutToLibrary = (data, Title) => {
    dispatch(addWorkout(data, Title)).then((res) => {
      dispatch({
        type: 'UPDATE_FEED',
        payload: {
          snackbar: true,
          message: '',
          severity: 'success',
          message: 'Workout saved',
        },
      });
    });
  };

  const moveExerciseDown = (index) => {
    let plan = { ...Program.ExercisePlan };
    let temp = plan.weeks[state.week].days[state.day].Exercise[index];
    plan.weeks[state.week].days[state.day].Exercise[index] = plan.weeks[state.week].days[state.day].Exercise[index + 1];
    plan.weeks[state.week].days[state.day].Exercise[index + 1] = temp;
    reference.current = plan;

    let contentElement = document.getElementById(
      plan.weeks[state.week].days[state.day].Exercise[index]._id ||
        plan.weeks[state.week].days[state.day].Exercise[index].id,
    );

    setTimeout(() => {
      contentElement.scrollIntoView({
        top: contentElement.scrollHeight,
        behavior: 'smooth',
        block: 'center',
      });
    }, 500);
    dispatch(updateProgram({ ExercisePlan: plan }));

    setActiveExercise(
      plan.weeks[state.week].days[state.day].Exercise[index]._id ||
        plan.weeks[state.week].days[state.day].Exercise[index].id,
    );
  };

  const moveExerciseUp = (index) => {
    let plan = { ...Program.ExercisePlan };
    let temp = plan.weeks[state.week].days[state.day].Exercise[index];
    plan.weeks[state.week].days[state.day].Exercise[index] = plan.weeks[state.week].days[state.day].Exercise[index - 1];
    plan.weeks[state.week].days[state.day].Exercise[index - 1] = temp;
    reference.current = plan;
    dispatch(updateProgram({ ExercisePlan: plan }));

    let contentElement = document.getElementById(
      plan.weeks[state.week].days[state.day].Exercise[index]._id ||
        plan.weeks[state.week].days[state.day].Exercise[index].id,
    );
    setTimeout(() => {
      contentElement.scrollIntoView({
        top: contentElement.scrollHeight,
        behavior: 'smooth',
        block: 'center',
      });
    }, 500);
    setActiveExercise(
      plan.weeks[state.week].days[state.day].Exercise[index]._id ||
        plan.weeks[state.week].days[state.day].Exercise[index].id,
    );
  };

  const copyExercise = (index) => {
    let id = new Date().getTime();
    let plan = { ...Program.ExercisePlan };
    const originalTitle = plan.weeks[state.week].days[state.day].Exercise[index].title;

    // Find all existing copies of this exercise
    const existingCopies = plan.weeks[state.week].days[state.day].Exercise.filter(
      (ex) => ex.title.startsWith(originalTitle + ' copy') || ex.title.includes(' copy'),
    );

    let newTitle;
    if (existingCopies.length === 0) {
      newTitle = originalTitle + ' copy';
    } else {
      // Extract the highest number from existing copies
      const numbers = existingCopies.map((ex) => {
        const match = ex.title.match(/copy(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      });
      const maxNumber = Math.max(...numbers);

      if (originalTitle.includes('copy')) {
        // First remove any 'copy{N}' pattern
        const titleWithoutCopyNumber = originalTitle.replace(/ copy\d+$/, '');
        // Then remove ' copy' if it exists
        newTitle = titleWithoutCopyNumber.replace(' copy', '') + ' copy' + (maxNumber + 1);
      } else {
        newTitle = originalTitle + ' copy' + (maxNumber + 1);
      }
    }

    let newExercise = {
      ...plan.weeks[state.week].days[state.day].Exercise[index],
      title: newTitle,
      id: id,
    };
    delete newExercise._id;
    plan.weeks[state.week].days[state.day].Exercise.splice(index + 1, 0, newExercise);
    reference.current = plan;
    dispatch(updateProgram({ ExercisePlan: plan }));

    setTimeout(() => {
      let contentElement = document.getElementById(id);
      contentElement.scrollIntoView({
        top: contentElement.scrollHeight,
        behavior: 'smooth',
        block: 'center',
      });
      setActiveExercise(id);
    }, 1000);
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
            >
              <Box
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
                flexDirection={'row'}
                justifyContent={'space-between'}
              >
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  flexDirection={'row'}
                >
                  <IconButton
                    onClick={() =>
                      navigate(-1, {
                        replace: true,
                        state: { tab: 1, sds: 2 },
                      })
                    }
                    sx={{ color: 'text.primary' }}
                  >
                    <ArrowLeft />
                  </IconButton>
                  <Typography
                    variant="body1"
                    color="text.primary"
                  >
                    {/* Week {state?.week + 1} &gt; */}
                    <Typography
                      component={'span'}
                      variant="subtitle1"
                      color="text.primary"
                    >
                      Workout
                      {/* &nbsp;{days[state?.day]} */}
                    </Typography>
                  </Typography>
                </Box>

                <Button
                  // disabled={!(!workouts.find(
                  //     (i) =>
                  //         i._id ==
                  //     Program.ExercisePlan.weeks[state.week].days[state.day]._id
                  // )&&Program.ExercisePlan.weeks[state.week].days[
                  //     state.day
                  // ].Exercise.find(i=>i.title))}
                  sx={{ px: 0 }}
                  onClick={() => navigate(-1)}
                  // onClick={() => addWorkoutToLibrary(
                  //     Program.ExercisePlan.weeks[state.week].days[state.day],
                  //     Program.Title)}
                >
                  Done
                </Button>
              </Box>
            </BoxHeader>
          </Header>{' '}
          <Content
            style={{
              paddingTop: 16,
              paddingBottom: 16,
              overflowY: 'auto',
              backgroundColor: '#F9FAFD',
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <Typography
              sx={{
                fontSize: 20,

                fontWeight: 400,
                color: '#6D7B8F',
              }}
              color="text.secondary"
            >
              Week {state?.week + 1} - Day {state?.day + 1}
            </Typography>
            <br />
            <LabeledInput
              fullWidth
              placeholder="Example: Chest day"
              clabel="Workout title"
              onChange={(e) => editDay({ Title: e.target.value })}
              name={'title'}
              value={Program.ExercisePlan.weeks[state.week].days[state.day].Title}
              InputProps={{
                style: {
                  backgroundColor: 'white',
                  boxShadow: '0px 4px 54px rgb(225 231 240 / 50%)',
                },
              }}
            />

            <TransitionGroup>
              {Program.ExercisePlan.weeks[state.week].days[state.day].Exercise.map((step, index) => (
                <Collapse
                  key={index}
                  in={true}
                  out
                  timeout={500}
                >
                  <Box
                    mt={4}
                    id={step._id || step.id}
                    onClick={() => setActiveExercise(step._id || step.id)}
                    sx={{
                      cursor: 'pointer',
                    }}
                    border={
                      (step._id ? activeExercise == step._id : step.id ? activeExercise == step.id : false)
                        ? '3px solid #2F86EB'
                        : '2px solid rgba(225, 231, 240, 1)'
                    }
                    borderRadius={1}
                    bgcolor={'white'}
                    p={2}
                  >
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'space-between'}
                    >
                      <Typography
                        color="text.primary"
                        sx={{
                          fontSize: 18,
                          fontWeight: 600,
                          my: 0.5,
                          background: 'rgba(245, 247, 250, 1)',
                          color: 'rgba(109, 123, 143, 1)',
                          p: 1,
                          px: 2,
                          borderRadius: 1,
                        }}
                      >
                        Exercise {index + 1}
                      </Typography>
                      <Stack
                        direction={'row'}
                        alignItems={'center'}
                        spacing={2}
                      >
                        <IconButton
                          size="small"
                          onClick={() => moveExerciseUp(index)}
                          disabled={index == 0}
                        >
                          <Iconify
                            icon={'ion:chevron-up'}
                            color={index == 0 ? 'grey.300' : 'text.primay'}
                          />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => moveExerciseDown(index)}
                          disabled={index + 1 == Program.ExercisePlan.weeks[state.week].days[state.day].Exercise.length}
                        >
                          <Iconify
                            icon={'ion:chevron-down'}
                            color={
                              index + 1 == Program.ExercisePlan.weeks[state.week].days[state.day].Exercise.length
                                ? 'grey.300'
                                : 'text.primay'
                            }
                          />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => copyExercise(index)}
                        >
                          <CopyFile />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteExercise(index)}
                        >
                          <DeleteIcon sx={{ fontSize: 21, marginTop: 0.5 }} />
                        </IconButton>
                      </Stack>
                    </Box>
                    <ExerciseCard
                      title={`${Program.ExercisePlan.weeks[state.week].days[state.day].Title} : Exercise ${
                        index + 1
                      } | ${Program.ExercisePlan.weeks[state.week].days[state.day].Exercise[index].title}`}
                      viewMode={true}
                      activeExercise={
                        step._id ? activeExercise == step._id : step.id ? activeExercise == step.id : false
                      }
                      Program={Program}
                      updateProgram={updateProgram}
                      mode={mode}
                      w={state.week}
                      onUploadNewMedia={(e) => uploadNewMedia(e, state.week, state.day, index)}
                      uploadMediasFromLib={(val) => uploadMediasFromLib(val, state.week, state.day, index)}
                      d={state.day}
                      index={index}
                      newCard={step.isNew || !step.title}
                      deleteExercise={() => deleteExercise(index)}
                      editExercise={(val) => editExercise(val, index)}
                      plan={Program.ExercisePlan.weeks[state.week].days[state.day].Exercise[index]}
                    />
                  </Box>
                </Collapse>
              ))}
            </TransitionGroup>

            {/* <center>
              <Divider
                sx={{ mt: 2, variant: "middle", width: 120 }}
                variant={"middle"}
              />
            </center> */}
            <Box
              display={'flex'}
              alignItems={'center'}
              size={'small'}
              sx={{ mr: 0, ml: 0, mt: 2 }}
            >
              <Button
                fullWidth
                variant="contained"
      
                disabled={!Program.ExercisePlan.weeks[state.week].days[state.day].Title}
      
                onClick={() => addNewDay()}
              >
                Add Exercise
              </Button>
            </Box>
          </Content>
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
