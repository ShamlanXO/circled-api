// @mui
import { styled } from '@mui/material/styles';
import { useEffect, useState, useRef } from 'react';
// components
import Page from 'src/components/Page';
// sections
import { Box, Button, Typography, IconButton, Stack } from '@mui/material';
import CopyFile from 'src/assets/IconSet/CopyFile';
import DeleteIcon from 'src/assets/IconSet/trash';
import Container from 'src/components/Layout/Container';
import Content from 'src/components/Layout/Content';
import Header from 'src/components/Layout/Header';
import { useNavigate, useLocation } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';

import LabeledInput from 'src/components/core/LabeledInput';
import Iconify from 'src/components/Iconify';
import ExerciseCard from 'src/components/instructor/exerciseCard';

import { useOutletContext } from 'react-router-dom';
import { computePath } from 'src/utils/routepath';
import { deleteVideos } from 'src/redux/actions/createProgram';
import { TransitionGroup } from 'react-transition-group';
import { addWorkout, updateWorkout } from 'src/redux/actions/figgsLibrary';
import Collapse from '@mui/material/Collapse';
import ArrowLeft from 'src/assets/IconSet/ArrowLeft';
import union from 'lodash/union';
import { title } from 'src/_mock/text';
const RootStyle = styled('div')(() => ({
  backgroundColor: '#F2F5F9',
  height: '100%',
}));

const BoxHeader = styled(Box)(() => ({
  width: '100%',
  zIndex: 100,
  backgroundColor: '#fff',
  boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
  borderRadius: '0px 0px 8px 8px',
}));
// ----------------------------------------------------------------------

export default function WorkoutDay() {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [workoutData, setWorkoutData] = useOutletContext();
  const [activeExercise, setActiveExercise] = useState(null);
  const navigate = useNavigate();
  const reference = useRef(null);
  reference.current = {};
  console.log(workoutData);
  const handleAddWorkout = () => {
    if (workoutData._id) {
      dispatch(updateWorkout(workoutData)).then((result) => {
        navigate(-1);
      });
    } else {
      dispatch(addWorkout(workoutData)).then((result) => {
        navigate(-1);
      });
    }
  };

  const addNewDay = () => {
    let plan = { ...workoutData };

    plan.Exercise.push({
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

    setWorkoutData(plan);
  };

  const editDay = (data) => {
    let plan = { ...workoutData };
    plan = {
      ...plan,
      ...data,
    };
    reference.current = plan;
    setWorkoutData(plan);
  };

  const moveExerciseUp = (index) => {
    let plan = { ...workoutData };
    let temp = plan.Exercise[index];
    plan.Exercise[index] = plan.Exercise[index - 1];
    plan.Exercise[index - 1] = temp;
    reference.current = plan;
    setWorkoutData(plan);

    let contentElement = document.getElementById(plan.Exercise[index]._id || plan.Exercise[index].id);
    setTimeout(() => {
      contentElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 500);

    setActiveExercise(plan.Exercise[index].id || plan.Exercise[index]._id);
  };

  const moveExerciseDown = (index) => {
    let plan = { ...workoutData };
    let temp = plan.Exercise[index];
    plan.Exercise[index] = plan.Exercise[index + 1];
    plan.Exercise[index + 1] = temp;
    reference.current = plan;
    setWorkoutData(plan);

    let contentElement = document.getElementById(plan.Exercise[index]._id || plan.Exercise[index].id);
    setTimeout(() => {
      contentElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 500);

    setActiveExercise(plan.Exercise[index].id || plan.Exercise[index]._id);
  };

  const copyExercise = (index) => {
    let id = new Date().getTime();
    let plan = { ...workoutData };
    let temp = {
      ...plan.Exercise[index],
      title: plan.Exercise[index].title + ' copy',

      id: id,
    };
    delete temp._id;
    plan.Exercise.splice(index + 1, 0, temp);
    reference.current = plan;
    setWorkoutData(plan);

    setTimeout(() => {
      setActiveExercise(id);
      let contentElement = document.getElementById(id);
      contentElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 500);
  };

  const deleteExercise = (id) => {
    let plan = { ...workoutData };
    let delEx = plan.Exercise.splice(id, 1);
    let urls = delEx?.[0]?.media?.map((i) => {
      return i.split('https://vimeo.com/')[1];
    });
    if (urls)
      dispatch(deleteVideos(urls))
        .then((res) => {
          reference.current = plan;
          setWorkoutData(plan);
        })
        .catch((err) => {
          if (err.response.status == 404) {
            reference.current = plan;
            setWorkoutData(plan);
          }
        });
    else {
      reference.current = plan;
      setWorkoutData(plan);
    }
  };

  const editExercise = (val, index) => {
    let plan = { ...workoutData };
    plan.Exercise[index] = {
      ...plan.Exercise[index],
      ...val,
    };
    reference.current = plan;
    setWorkoutData(plan);
  };

  const uploadNewMedia = (e, i) => {
    navigate('/library/addmedia', {
      state: {
        file: e.target.files,
        index: i,
        workoutId: workoutData._id,
      },
    });
  };
  const uploadMediasFromLib = (val, index) => {
    let media = [
      ...(workoutData.Exercise[index]?.media || []),
      ...val.map((i) => ({ file: i.media, type: i.type, title: i.title })),
    ];
    let triggerMuscle = union(workoutData.Exercise[index]?.triggerMuscle, ...val.map((i) => i.triggerMuscle));

    editExercise({ media: media, triggerMuscle: triggerMuscle }, index);
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
                      color="text.primary"
                    >
                      Create workout
                      {/* &nbsp;{days[state?.day]} */}
                    </Typography>
                  </Typography>
                </Box>
                <Button
                  sx={{ px: 0 }}
                  onClick={() => handleAddWorkout()}
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
            }}
          >
            <LabeledInput
              fullWidth
              placeholder="Example: Chest day"
              clabel="Workout title"
              onChange={(e) => editDay({ Title: e.target.value })}
              name={'title'}
              value={workoutData?.Title}
              InputProps={{
                style: {
                  backgroundColor: 'white',
                  boxShadow: '0px 4px 54px rgb(225 231 240 / 50%)',
                },
              }}
            />

            <TransitionGroup>
              {workoutData.Exercise.map((step, index) => (
                <Collapse key={index}>
                  <Box
                    mt={4}
                    id={step._id || step.id}
                    border={
                      (step._id ? activeExercise == step._id : step.id ? activeExercise == step.id : false)
                        ? '3px solid #2F86EB'
                        : '2px solid rgba(225, 231, 240, 1)'
                    }
                    borderRadius={1}
                    bgcolor={'white'}
                    p={2}
                    onClick={() => setActiveExercise(step._id || step.id)}
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
                          disabled={index + 1 == workoutData.Exercise.length}
                        >
                          <Iconify
                            icon={'ion:chevron-down'}
                            color={index + 1 == workoutData.Exercise.length ? 'grey.300' : 'text.primay'}
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
                      activeExercise={
                        step._id ? activeExercise == step._id : step.id ? activeExercise == step.id : false
                      }
                      viewMode={false}
                      mode={'create'}
                      individualWorkout
                      onMediaClick={(vi) =>
                        navigate('/library/addmedia', {
                          state: {
                            index: index,
                          },
                        })
                      }
                      Program={{}}
                      _id={workoutData._id}
                      updateProgram={() => {
                        console.log('program updated');
                      }}
                      w={0}
                      onUploadNewMedia={(e) =>
                        uploadNewMedia(
                          e,

                          index,
                        )
                      }
                      d={0}
                      index={index}
                      newCard={step.isNew || !step.title}
                      deleteExercise={() => deleteExercise(index)}
                      editExercise={(val) => editExercise(val, index)}
                      uploadMediasFromLib={(val) => uploadMediasFromLib(val, index)}
                      plan={workoutData.Exercise[index]}
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
            
                disabled={!workoutData?.Title}
               
                onClick={() => addNewDay()}
              >
                Add exercise
              </Button>
            </Box>
          </Content>
        </Container>{' '}
      </Page>
    </RootStyle>
  );
}
