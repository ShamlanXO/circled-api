import { Box, Button, Divider, Radio, SwipeableDrawer, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Iconify from '../Iconify';
import Label from '../Label';
import { useConfirmationModalContext } from 'src/utils/Modal';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';
import { MenuItem } from '@mui/material';
import AddCircle from 'src/assets/IconSet/AddOutlined';
import Delete from 'src/assets/IconSet/Delete';
import Edit from 'src/assets/IconSet/edit';
import LibrarySelector from 'src/pages/instructor/library/LibrarySelector';
import LibraryIcon from 'src/assets/IconSet/DB';
import UploadIcon from 'src/assets/IconSet/UploadIcon';
import SaveCheck from 'src/assets/IconSet/SaveCheck';
import { addWorkout } from 'src/redux/actions/figgsLibrary';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { ChromeReaderMode, EditOffOutlined } from '@mui/icons-material';
import ObjectID from 'bson-objectid';
//   const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
//   });

function WorkoutDayBottomDrawer(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Program, updateProgram } = props;
  const { showConfirmationModal } = useConfirmationModalContext();
  const workouts = useSelector((s) => s.Library.workouts);
  useEffect(() => {
    if (props?.ontoggleDraging) props?.ontoggleDraging(!drawerOpen);
  }, [drawerOpen]);

  const toggleDrawer = (isOpen) => (event) => {
 
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(isOpen);
  };

  const onRestDay = (week, day) => {
    let plan = JSON.parse(JSON.stringify(Program.ExercisePlan));

    plan.weeks[week].days[day].IsRest = !plan.weeks[week].days[day].IsRest;
    dispatch(updateProgram({ ExercisePlan: plan }));
    setDrawerOpen(false);
  };

  const onDeleteDay = () => {
    toggleDrawer(false);
    showConfirmationModal(
      'Are you sure?',
      `You are going to delete all exercises of selected day. This process is irreversible`,
      'Delete',
    ).then((res) => {
      if (res) {
        let plan = JSON.parse(JSON.stringify(Program.ExercisePlan));

        plan.weeks[props.w].days[props.d].Exercise = [];
        plan.weeks[props.w].days[props.d].Title = '';
        plan.weeks[props.w].days[props.d].IsRest = false;
        setDrawerOpen(false);
        dispatch(updateProgram({ ExercisePlan: plan }));
      } else {
      }
    });
  };

  const onSelection = (item, week, day) => {
    let plan = JSON.parse(JSON.stringify(Program.ExercisePlan));

    plan.weeks[week].days[day] = { ...item, _id: String(ObjectID()) };
    dispatch(updateProgram({ ExercisePlan: plan }));
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

  return (
    <div
      draggable={false}
      onDragStart={(e) => e.stopPropagation()}
      onDragCapture={(e) => e.stopPropagation()}
      onDragEnd={(e) => e.stopPropagation()}
    >
      
      <SwipeableDrawer
        anchor={'bottom'}
        draggable={false}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
        onDragStart={(e) => e.stopPropagation()}
        onDragCapture={(e) => e.stopPropagation()}
        onDragEnd={(e) => e.stopPropagation()}
        disableBackdropTransition
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {/* <Box display="flex" justifyContent={"center"} sx={{ mb: 1 }}>
          <img
            src={"/images/bottomDrawerIndicator.png"}
            width={"170px"}
            height="5px"
          />
        </Box> */}
        <Box
          padding={'24px 24px 36px'}
          style={{
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            backgroundColor: '#fff',
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            component="form"
          >
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography variant="body">
                {/* Week {props.index} : {props.navText} |&nbsp; */}
                <span style={{ textTransform: 'capitalize' }}>
                  {Program.ExercisePlan.weeks[props.w].days[props.d].Title}
                </span>
              </Typography>
              {/* <Typography variant="body" color={'text.secondary'}>
                                {props.workouts} Exercises
                            </Typography> */}
            </Box>
            {/* <Box
              display="flex"
              justifyContent="space-between"
              marginTop="16px"
              alignItems={"center"}
              mb={2}
            >
              <Box display="flex" alignItems={"center"}>
                <Typography variant="body1" color="text.primary">
                  Number of exercises: {props.workouts}
                </Typography>
              </Box>
            </Box> */}

            {!props.workouts && !Program.ExercisePlan.weeks[props.w].days[props.d].Title ? (
              <MenuItem
                sx={{ px: 0 }}
                onClick={props.onClick}
              >
                <AddCircle
                  icon="icon-park-outline:dumbbell"
                  sx={{ mr: 2 }}
                />
                <Typography align="center">Add workout</Typography>
              </MenuItem>
            ) : null}
            {!props.workouts && !Program.ExercisePlan.weeks[props.w].days[props.d].Title ? (
              <LibrarySelector
                onBack={() => setDrawerOpen(false)}
                onSelection={(i) => onSelection(i, props.w, props.d)}
                slectionMode
              >
                <MenuItem sx={{ px: 0 }}>
                  <LibraryIcon
                    icon="icon-park-outline:dumbbell"
                    sx={{ mr: 2 }}
                  />
                  <Typography
                    sx={{ ml: 2 }}
                    align="center"
                  >
                    Upload from library
                  </Typography>
                </MenuItem>
              </LibrarySelector>
            ) : null}

            <MenuItem
              sx={{ px: 0 }}
              onClick={() => document.getElementById(`${props.w + props.d + 'checkbox'}`).click()}
            >
              <Box
                display="flex"
                alignItems={'center'}
              >
                <Checkbox
                  sx={{
                    width: 32,
                    height: 32,
                    mx: 0,
                    ml: -0.3,
                    mr: 1.5,
                    color: 'text.primary',

                    borderRadius: 1,
                    pr: 0.5,
                    pl: 0,
                  }}
                  icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 28 }} />}
                  size={'medium'}
                  id={props.w + props.d + 'checkbox'}
                  checked={Program.ExercisePlan?.weeks[props.w]?.days[props.d]?.IsRest ? true : false}
                  onChange={() => onRestDay(props.w, props.d)}
                />{' '}
                <Typography
                  align="center"
                  color={'text.primary'}
                >
                  Mark as rest day
                </Typography>
              </Box>
            </MenuItem>
            {Program.ExercisePlan.weeks[props.w].days[props.d].Title ? (
              <MenuItem
                sx={{ px: 0 }}
                // disabled={workouts.find(
                //     (i) =>
                //         i._id ==
                //         Program.ExercisePlan.weeks[props.w]
                //             .days[props.d]._id
                // )}
                disabled={
                  workouts.find((i) => i._id == Program.ExercisePlan.weeks[props.w].days[props.d]._id) ||
                  !Program.ExercisePlan.weeks[props.w].days[props.d].Exercise.length
                }
                onClick={() => {
                  addWorkoutToLibrary(Program.ExercisePlan.weeks[props.w].days[props.d], Program.Title);
                  setDrawerOpen(false);
                }}
              >
                <Checkbox
                  sx={{
                    width: 32,
                    height: 32,
                    mx: 0,
                    ml: -0.3,
                    mr: 1.5,
                    color: 'text.primary',

                    borderRadius: 1,
                    pr: 0.5,
                    pl: 0,
                  }}
                  icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 28 }} />}
                  size={'medium'}
                  id={props.w + props.d + 'savecheckbox'}
                  checked={
                    workouts.find((i) => i._id == Program.ExercisePlan.weeks[props.w].days[props.d]._id) ? true : false
                  }
                />{' '}
                <Typography align="center">
                  {workouts.find((i) => i._id == Program.ExercisePlan.weeks[props.w].days[props.d]._id)
                    ? 'Saved to library'
                    : 'Save to library'}
                </Typography>
              </MenuItem>
            ) : null}

            {props.workouts || Program.ExercisePlan.weeks[props.w].days[props.d].Title ? (
              <MenuItem
                sx={{ px: 0 }}
                onClick={props.onClick}
              >
                <Edit sx={{ mr: 2 }} />
                <Typography align="center">Edit</Typography>
              </MenuItem>
            ) : null}

            {props.workouts || Program.ExercisePlan.weeks[props.w].days[props.d].Title ? (
              <MenuItem
                sx={{ px: 0 }}
                onClick={onDeleteDay}
              >
                <Delete sx={{ color: 'error.main', mr: 2 }} />
                <Typography
                  align="center"
                  color={'error.main'}
                >
                  Remove
                </Typography>
              </MenuItem>
            ) : null}
          </Box>
        </Box>
      </SwipeableDrawer>
      <div onClick={() => (props.clientSide ? props.onClick() : setDrawerOpen(true))}>{props.children}</div>
    </div>
  );
}

export default WorkoutDayBottomDrawer;
