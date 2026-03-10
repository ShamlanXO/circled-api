// @mui
import { styled } from '@mui/material/styles';
// components
import React, { useEffect, memo, useState } from 'react';
// sections
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import TextMaxLine from '../TextMaxLine';
import Iconify from '../Iconify';
import { useNavigate, useParams } from 'react-router';
import WorkoutDayBottomDrawer from './workoutDayBottomDrawer';
import Slider from 'react-slick';
import { useSelector } from 'react-redux';
import { computePath } from 'src/utils/routepath';
import AddCircled from 'src/assets/IconSet/AddCircled';
import Dumbell from 'src/assets/IconSet/Dumbell';
import DeleteIcon from 'src/assets/IconSet/trash';
import { useConfirmationModalContext } from 'src/utils/Modal';
import { dispatch } from 'src/redux/store';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragOverlay } from '@dnd-kit/core';
import ObjectID from 'bson-objectid';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
// ----------------------------------------------------------------------

const WorkoutDay = styled('div')(() => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 100,
  backgroundColor: '#fff',
  padding: '0px 12px',
  minHeight: 56,

  borderRadius: '0px 8px 8px 0px',
  border: '1px solid #E1E7F0',
}));

const WorkoutDayLabel = styled('div')(() => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 100,
  backgroundColor: '#fff',
  padding: '0px 12px',
  minHeight: 56,

  borderRadius: '8px 0px 0px 8px',
  border: '1px solid #E1E7F0',
}));

const Clone = styled(Box)(() => ({
  display: 'flex',
  marginTop: 32,
  alignItems: 'center',
  padding: '4px 10px',
}));

const IconButton2 = styled(IconButton)(() => ({
  backgroundColor: '#2F86EB',
  color: '#fff',
  height: 18,
  width: 18,
  padding: 2,
}));
const DragItem = styled('div')(() => ({
  padding: 6,
}));
const WeekItem = styled('div')(() => ({
  padding: 6,
  paddingRight: 0,
}));

// ----------------------------------------------------------------------

export default function WorkoutWeek(props) {
  const navigate = useNavigate();

  const { Program, updateProgram } = props;
  const { showConfirmationModal } = useConfirmationModalContext();
  var settings = {
    dots: false,
    infinite: false,
    arrows: false,
    centerMode: false,
    cssEase: 'linear',
    centerPadding: '2px',
    slidesToShow: 1.2,
    slidesToScroll: 1,
  };

  const days = ['Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri'];

  const clientStats = useSelector((s) => s.AtheletePlan.stats);
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(180, 0);
    }, 1000);
  }, []);

  const addWeek = () => {
    dispatch(
      updateProgram({
        ExercisePlan: {
          ...Program.ExercisePlan,
          weeks: [
            ...Program.ExercisePlan.weeks,
            {
              days: [
                { _id: String(ObjectID()), Title: '', IsRest: false, Exercise: [], Cover: null },
                {
                  _id: String(ObjectID()),
                  Title: '',
                  IsRest: false,
                  Exercise: [],
                  Cover: null,
                },
                {
                  _id: String(ObjectID()),
                  Title: '',
                  IsRest: false,
                  Exercise: [],
                  Cover: null,
                },
                {
                  _id: String(ObjectID()),
                  Title: '',
                  IsRest: false,
                  Exercise: [],
                  Cover: null,
                },
                {
                  _id: String(ObjectID()),
                  Title: '',
                  IsRest: false,
                  Exercise: [],
                  Cover: null,
                },
                {
                  _id: String(ObjectID()),
                  Title: '',
                  IsRest: false,
                  Exercise: [],
                  Cover: null,
                },
                {
                  _id: String(ObjectID()),
                  Title: '',
                  IsRest: false,
                  Exercise: [],
                  Cover: null,
                },
              ],
            },
          ],
        },
      }),
    );
  };

  const deleteWeek = (i) => {
    showConfirmationModal(
      'Are you sure?',
      `You are going to delete this week. This process is irreversible`,
      'Delete',
    ).then((res) => {
      if (res) {
        let weeks = Program.ExercisePlan.weeks;
        weeks.splice(i, 1);

        dispatch(
          updateProgram({
            ExercisePlan: {
              ...Program.ExercisePlan,
              weeks: weeks,
            },
          }),
        );
      }
    });
  };

  const moveWeekRight = (i) => {
    let weeks = Program.ExercisePlan.weeks;
    // let contentElement = document.getElementById(weeks[i]._id)
    let temp = weeks[i];
    weeks[i] = weeks[i + 1];
    weeks[i + 1] = temp;
    dispatch(
      updateProgram({
        ExercisePlan: {
          ...Program.ExercisePlan,
          weeks: weeks,
        },
      }),
    );

    //   console.log(contentElement, contentElement.scrollWidth)

    //           setTimeout(() => {

    //               contentElement.scrollIntoView({
    //                   behavior: 'smooth',
    //                   block: 'nearest',
    //                   inline: 'center'
    //               })
    //               alert("scrolling right")
    //           }, 2000)
  };

  const moveWeekLeft = (i) => {
    let weeks = Program.ExercisePlan.weeks;
    let temp = weeks[i];
    weeks[i] = weeks[i - 1];
    weeks[i - 1] = temp;
    dispatch(
      updateProgram({
        ExercisePlan: {
          ...Program.ExercisePlan,
          weeks: weeks,
        },
      }),
    );
  };

  return (
    <Box
      position={'relative'}
      paddingBottom={0}
    >
      {' '}
      {props.fullWidth ? (
        <>
          {Program.ExercisePlan?.weeks?.map((i, w) => {
            return (
              <div style={{ marginTop: 12, marginBottom: 24 }}>
                <Typography
                  color="text.secondary"
                  sx={{ ml: 2, fontSize: 18 }}
                >
                  Week {w + 1}
                </Typography>
                <div>
                  {i.days.map((item, index) => (
                    <div key={index}>
                      <DragItem>
                        <WorkoutDay
                          style={{ minHeight: 56 }}
                          onClick={
                            props.clientSide && item.Exercise?.length && !item.IsRest > 0
                              ? () => props.handleClick(index, w, item.Title)
                              : undefined
                          }
                        >
                          <Box
                            display="flex"
                            alignItems={'center'}
                          >
                            <TextMaxLine
                              line={1}
                              variant="body1"
                              color={
                                props.destData?.cweek == w && props.destData?.cday == index
                                  ? 'primary'
                                  : item.Exercise.length
                                  ? 'text.primary'
                                  : 'text.primary'
                              }
                              sx={{
                                fontSize: 16,
                                width: 36,
                              }}
                            >
                              {Program?.calendarType == 'Numeric days' ? `D${w * 7 + index + 1}` : days[index]}
                            </TextMaxLine>

                            <Divider
                              orientation="vertical"
                              flexItem
                              sx={{
                                ml: 0.5,
                                mr: 1,
                                borderColor: '#E1E7F0',
                              }}
                            />
                            <Box>
                              {item.IsRest ? (
                                <>
                                  <TextMaxLine
                                    align="left"
                                    line={1}
                                    color={
                                      props.destData?.cweek == w && props.destData?.cday == index
                                        ? 'primary'
                                        : 'text.primary'
                                    }
                                    variant="body1"
                                    sx={{
                                      fontSize: 16,
                                      maxWidth: '35vw',
                                    }}
                                  >
                                    {item.IsRest ? 'Rest' : item.Title}
                                  </TextMaxLine>
                                </>
                              ) : (
                                item.Title
                              )}
                            </Box>
                          </Box>
                          <Box
                            display="flex"
                            alignItems={'center'}
                          >
                            {clientStats?.[`${w}-${index}`] && (
                              <Box mt={1}>
                                <Iconify
                                  icon="material-symbols:check-small-rounded"
                                  sx={{
                                    fontSize: 32,
                                    color: '#14B842',
                                  }}
                                />
                              </Box>
                            )}
                            {
                              <Typography
                                variant="body2"
                                color={
                                  props.destData?.cweek == w && props.destData?.cday == index
                                    ? 'primary'
                                    : item.IsRest
                                    ? 'text.secondary'
                                    : 'text.primary'
                                }
                                sx={{
                                  fontSize: 14,
                                }}
                              >
                                {item.IsRest ? 0 : item.Exercise?.length + ' '}
                              </Typography>
                            }
                            &nbsp;
                            {/* <WorkoutDayBottomDrawer> */}
                            {
                              <>
                                {!item.Exercise.length && !item.Title ? (
                                  <IconButton
                                    size="small"

                                    // onClick={() => navigate(computePath(props.mode,"/workoutDay",Program._id),{state:{week:w,day:index}})}
                                  >
                                    <Dumbell />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    size="small"
                                    sx={{
                                      color: item.IsRest ? 'text.secondary' : 'text.primary',
                                    }}
                                    //  onClick={() => navigate("/workoutDay")}
                                  >
                                    <Dumbell />
                                  </IconButton>
                                )}
                              </>
                            }
                          </Box>
                        </WorkoutDay>
                      </DragItem>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      ) : props.clientSide ? (
        <Slider
          {...settings}
          style={{ display: 'flex' }}
        >
          {Program.ExercisePlan?.weeks.map((i, w) => {
            return (
              <Box
                key={w}
                mt={1}
              >
                <Typography
                  color="text.secondary"
                  sx={{ ml: 2, fontSize: 18 }}
                >
                  Week {w + 1}
                </Typography>

                <div>
                  {i.days.map((item, index) => (
                    <div key={index}>
                      <DragItem>
                        <WorkoutDay
                          style={{ minHeight: 56 }}
                          onClick={
                            props.clientSide && item.Exercise?.length && !item.IsRest > 0
                              ? () => props.handleClick(index, w, item.Title)
                              : undefined
                          }
                        >
                          <Box
                            display="flex"
                            alignItems={'center'}
                          >
                            <TextMaxLine
                              line={1}
                              variant="body1"
                              color={
                                props.destData?.cweek == w && props.destData?.cday == index
                                  ? 'primary'
                                  : item.Exercise.length
                                  ? 'text.primary'
                                  : 'text.primary'
                              }
                              sx={{
                                fontSize: 16,
                                width: 36,
                              }}
                            >
                              {Program?.calendarType == 'Numeric days' ? `D${w * 7 + index + 1}` : days[index]}
                            </TextMaxLine>

                            <Divider
                              orientation="vertical"
                              flexItem
                              sx={{
                                ml: 0.5,
                                mr: 1,
                                borderColor: '#E1E7F0',
                              }}
                            />
                            <Box>
                              {item.IsRest ? (
                                <>
                                  <TextMaxLine
                                    align="left"
                                    line={1}
                                    color={
                                      props.destData?.cweek == w && props.destData?.cday == index
                                        ? 'primary'
                                        : 'text.primary'
                                    }
                                    variant="body1"
                                    sx={{
                                      fontSize: 16,
                                      maxWidth: '35vw',
                                    }}
                                  >
                                    {item.IsRest ? 'Rest' : item.Title}
                                  </TextMaxLine>
                                </>
                              ) : (
                                item.Title
                              )}
                            </Box>
                          </Box>
                          <Box
                            display="flex"
                            alignItems={'center'}
                          >
                            {
                              <Typography
                                variant="body2"
                                color={
                                  props.destData?.cweek == w && props.destData?.cday == index
                                    ? 'primary'
                                    : item.IsRest
                                    ? 'text.secondary'
                                    : 'text.primary'
                                }
                                sx={{
                                  fontSize: 14,
                                }}
                              >
                                {item.IsRest ? 0 : item.Exercise?.length + ' '}
                              </Typography>
                            }
                            &nbsp;
                            {/* <WorkoutDayBottomDrawer> */}
                            {
                              <>
                                {!item.Exercise.length && !item.Title ? (
                                  <IconButton
                                    size="small"

                                    // onClick={() => navigate(computePath(props.mode,"/workoutDay",Program._id),{state:{week:w,day:index}})}
                                  >
                                    <Dumbell />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    size="small"
                                    sx={{
                                      color: item.IsRest ? 'text.secondary' : 'text.primary',
                                    }}
                                    //  onClick={() => navigate("/workoutDay")}
                                  >
                                    <Dumbell />
                                  </IconButton>
                                )}
                              </>
                            }
                          </Box>
                        </WorkoutDay>
                      </DragItem>
                    </div>
                  ))}
                </div>
              </Box>
            );
          })}
        </Slider>
      ) : (
        <div style={{ display: 'flex' }}>
          {Program.ExercisePlan?.weeks.map((i, w) => {
            return (
              <SortableContext
                key={w}
                items={i.days.map((item, index) => ({ _id: item._id, id: item._id, day: index, week: w }))}
                strategy={rectSortingStrategy}
              >
                <div>
                  <div style={{ display: 'flex' }}>
                    <div key={w}>
                      <WorkoutWeekComponent
                        i={i}
                        w={w}
                        length={Program.ExercisePlan?.weeks.length}
                        navigate={navigate}
                        Program={Program}
                        moveWeekLeft={moveWeekLeft}
                        moveWeekRight={moveWeekRight}
                        deleteWeek={() => deleteWeek(w)}
                        updateProgram={updateProgram}
                        isDragging={false}
                        days={days}
                        {...props}
                      />
                    </div>
                  </div>
                </div>
              </SortableContext>
            );
          })}
          <DragOverlay>
            {props.sourceData?.week >= 0 ? (
              <OverLaytem
                item={Program.ExercisePlan?.weeks[props.sourceData?.week]?.days[props.sourceData?.day]}
                days={days}
                navigate={navigate}
                w={props.sourceData?.week}
                d={props.sourceData?.day}
                index={props.sourceData?.day}
                overlay={true}
                Program={Program}
                updateProgram={updateProgram}
                {...props}
              />
            ) : null}
          </DragOverlay>
          <Box
            height={580}
            width={880}
            sx={{ width: 580, px: 5 }}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Button
              onClick={addWeek}
              sx={{ width: 150 }}
              variant="outlined"
            >
              Add week
            </Button>
          </Box>
        </div>
      )}
      {!props.clientSide && (
        <Box
          display={'flex'}
          position={'static'}
          bottom={0}
          width={'100%'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Iconify
            icon="tabler:hand-finger"
            color="text.secondary"
            sx={{ fontSize: 18, mr: 0.5 }}
          />
          <Typography color={'text.secondary'}>Hold and drag days to swap or copy</Typography>
        </Box>
      )}
    </Box>
  );
}

const WorkoutWeekComponent = memo((props) => {
  const { w, i, navigate, days, Program, updateProgram, isDragging, moveWeekLeft, moveWeekRight, length } = props;
  const { id } = useParams();

  const isCopyWeek =
    props?.destData?.week == w && props?.destData?.type == 'Weeks' && props?.destData?.sourceWeek !== w;
  return (
    <Box
      key={w}
      minWidth={'80vw'}
      id={i._id || i.id}
      borderRadius={2}
    >
      <div>
        <Stack
          pr={2}
          pt={2}
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            mb={1}
            alignItems={'center'}
            pt={1}
          >
            <Typography
              sx={{
                ml: 2,
                fontSize: 18,
                transform: isDragging ? 'rotate(5deg)' : undefined,
              }}
            >
              Week {w + 1}
            </Typography>
            &nbsp;
            <Stack
              direction={'row'}
              spacing={1}
            >
              <IconButton
                onClick={() => moveWeekLeft(w)}
                disabled={w == 0}
              >
                <Iconify
                  icon="ion:chevron-left"
                  sx={{ fontSize: 18 }}
                  color={w == 0 ? 'grey.300' : 'text.primay'}
                />
              </IconButton>
              <IconButton
                onClick={() => moveWeekRight(w)}
                disabled={w == length - 1}
              >
                <Iconify
                  icon="ion:chevron-right"
                  color={w == length - 1 ? 'grey.300' : 'text.primay'}
                  sx={{ fontSize: 18 }}
                />
              </IconButton>
            </Stack>
          </Box>
          {Program.ExercisePlan.weeks.length > 1 && (
            <IconButton onClick={props.deleteWeek}>
              <DeleteIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
        </Stack>
      </div>

      <div
        style={{
          marginLeft: 12,
          marginRight: 12,
          display: 'flex',
          flexGrow: 1,
          width: '100%',
        }}
      >
        <Box>
          {i.days.map((item, index) => {
            const isHighlighted = false;
            const isCopy = false;

            return (
              <div key={index}>
                <div>
                  <WeekItem>
                    <div
                      style={{
                        transform: false ? 'rotate(0deg)' : undefined,
                      }}
                    >
                      <WorkoutDayBottomDrawer
                        Program={Program}
                        updateProgram={updateProgram}
                        index={w + 1}
                        navText={days[index]}
                        workouts={item.Exercise.length}
                        w={w}
                        d={index}
                        clientSide={props.clientSide}
                        onClick={() =>
                          navigate(computePath(props.mode, '/workoutDay', id || Program._id), {
                            state: {
                              week: w,
                              day: index,
                            },
                          })
                        }
                      >
                        <WorkoutDayLabel
                          style={{
                            minHeight: 56,
                          }}
                          sx={{
                            backgroundColor: isHighlighted ? 'primary.lighter' : undefined,
                            border: isHighlighted ? '1.5px dashed' : undefined,
                            borderColor: isHighlighted ? 'primary.main' : undefined,
                          }}
                          onClick={props.clientSide && props.handleClick}
                        >
                          <Box
                            display="flex"
                            alignItems={'center'}
                          >
                            <TextMaxLine
                              line={1}
                              variant="body1"
                              color={isHighlighted ? 'primary' : item.Exercise.length ? 'text.primary' : 'text.primary'}
                              sx={{
                                fontSize: 16,
                                width: 36,
                              }}
                            >
                              {Program?.calendarType == 'Numeric days' ? `D${w * 7 + index + 1}` : days[index]}
                            </TextMaxLine>
                          </Box>
                        </WorkoutDayLabel>
                      </WorkoutDayBottomDrawer>
                    </div>
                  </WeekItem>
                </div>
              </div>
            );
          })}
        </Box>
        <Box>
          {i.days.map((item, index) => {
            const isHighlighted =
              props.destData?.week == w &&
              props.destData?.day == index &&
              props.sourceData?.week !== w &&
              item.Exercise.length == 0;
            const isCopy = false;
            const isDragging = props.sourceData?.week == w && props.sourceData?.day == index;
            if (w == 0 && index == 0) {
            }
            return (
              <DayItem
                item={item}
                index={index}
                w={w}
                Program={Program}
                isHighlighted={isHighlighted}
                isDraggingItem={isDragging}
                isCopy={isCopy}
                days={days}
                updateProgram={updateProgram}
                navigate={navigate}
                {...props}
              />
            );
          })}
        </Box>
      </div>
    </Box>
  );
});

const DayItem = memo(
  ({
    item,
    index,
    w,
    Program,
    isDraggingItem,
    isHighlighted,
    isCopy,
    updateProgram,
    overlay,
    navigate,
    days,
    ...props
  }) => {
    const id = `${item._id}`;
    const { id: clientId } = useParams();
    const [dragging, setDragging] = useState(true);
    const {
      attributes,
      listeners,
      setNodeRef,
      transform = '',
      transition,
      isDragging,
    } = useSortable({
      id,
      disabled: (item.Exercise.length == 0 && !item.Title) || !dragging,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,

      opacity: overlay || isDraggingItem ? 0.5 : 1,
      userSelect: 'none', // Prevents text selection
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      MsUserSelect: 'none',
      WebkitTouchCallout: 'none',
      cursor: 'grab',
      touchAction: 'manipulation',
    };
    if (w == 0 && index == 0 && !overlay) {
    }

    return (
      <div
        key={index}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <>
          <DragItem
            sx={{
              padding: false ? 3 : undefined,
            }}
          >
            <div
              style={{
                transform: false ? 'rotate(0deg)' : undefined,
                opacity: false ? 0.8 : 1,
                position: 'relative',
              }}
            >
              <WorkoutDayBottomDrawer
                Program={Program}
                ontoggleDraging={(val) => setDragging(val)}
                updateProgram={updateProgram}
                index={w + 1}
                navText={days[index]}
                workouts={item.Exercise.length}
                w={w}
                d={index}
                clientSide={props.clientSide}
                onClick={() =>
                  navigate(computePath(props.mode, '/workoutDay',clientId|| Program._id), {
                    state: {
                      week: w,
                      day: index,
                    },

                  })
                }
              >
                <WorkoutDay
                  style={{
                    minHeight: 56,
                    width: '60vw',
                    position: 'relative',
                  }}
                  sx={{
                    backgroundColor: isHighlighted ? 'primary.lighter' : isDraggingItem ? 'grey.200' : undefined,
                    border: isHighlighted ? '1.5px dashed' : isDraggingItem ? '2.5px dashed' : undefined,
                    borderColor: isHighlighted ? 'primary.main' : isDraggingItem ? 'grey.500' : undefined,
                  }}
                  onClick={props.clientSide && props.handleClick}
                >
                  <Box
                    display="flex"
                    alignItems={'center'}
                  >
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                    >
                      {isCopy && (
                        <Iconify
                          icon="arcticons:huawei-phone-clone"
                          sx={{
                            fontSize: 32,
                            mr: 2,
                          }}
                          color="text.secondary"
                        />
                      )}
                      {(isCopy && 'COPY') ||
                        ((item.Title || item.IsRest) && (
                          <>
                            <TextMaxLine
                              align="left"
                              line={2}
                              color={isHighlighted ? 'primary' : 'text.primary'}
                              variant="body1"
                              sx={{
                                fontSize: 16,
                                maxWidth: '35vw',
                              }}
                            >
                              {item.IsRest ? 'Rest' : item.Title}
                            </TextMaxLine>
                          </>
                        ))}
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    alignItems={'center'}
                  >
                    {(item.IsRest || item.Exercise?.length > 0 || item.Title) && (
                      <Typography
                        variant="body2"
                        color={isHighlighted ? 'primary' : item.IsRest ? 'text.secondary' : 'text.primary'}
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        {item.IsRest ? 0 : item.Exercise?.length + ' '}
                      </Typography>
                    )}
                    &nbsp;
                    {/* <WorkoutDayBottomDrawer> */}
                    {!props.clientSide && (
                      <>
                        {!item.Exercise.length && !item.Title ? (
                          <IconButton
                            size="small"

                            // onClick={() => navigate(computePath(props.mode,"/workoutDay",Program._id),{state:{week:w,day:index}})}
                          >
                            {item.IsRest || item.Exercise?.length > 0 ? (
                              <Dumbell />
                            ) : (
                              <AddCircled
                                sx={{
                                  color: 'primary.main',
                                }}
                              />
                            )}
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            sx={{
                              color: item.IsRest ? 'text.secondary' : 'text.primary',
                            }}
                            //  onClick={() => navigate("/workoutDay")}
                          >
                            {item.isRestDay || item.Exercise?.length > 0 || item.Title ? (
                              <Dumbell />
                            ) : (
                              <AddCircled
                                sx={{
                                  color: 'primary.main',
                                }}
                              />
                            )}
                          </IconButton>
                        )}
                      </>
                    )}
                  </Box>
                </WorkoutDay>
              </WorkoutDayBottomDrawer>
            </div>
          </DragItem>
        </>
      </div>
    );
  },
);

const OverLaytem = memo(
  ({
    item,
    index,
    w,
    Program,
    isDraggingItem,
    isHighlighted,
    isCopy,
    updateProgram,
    overlay,
    navigate,
    days,
    ...props
  }) => {
    const id = `${item._id}`;

    return (
      <div
        key={index}
        style={{
          userSelect: 'none', // Prevents text selection
          WebkitUserSelect: 'none',
          rotate: '5deg',
          MozUserSelect: 'none',
          MsUserSelect: 'none',
          WebkitTouchCallout: 'none',
          cursor: 'grab',
          touchAction: 'manipulation',
        }}
      >
        <>
          <DragItem
            sx={{
              padding: false ? 3 : undefined,
            }}
          >
            <div
              style={{
                transform: false ? 'rotate(0deg)' : undefined,
                opacity: false ? 0.8 : 1,
                position: 'relative',
              }}
            >
              <WorkoutDayBottomDrawer
                Program={Program}
                updateProgram={updateProgram}
                index={w + 1}
                navText={days[index]}
                workouts={item.Exercise.length}
                w={w}
                d={index}
                clientSide={props.clientSide}
                onClick={() =>
                  navigate(computePath(props.mode, '/workoutDay', id || Program._id), {
                    state: {
                      week: w,
                      day: index,
                    },
                  })
                }
              >
                <WorkoutDay
                  style={{
                    minHeight: 56,
                    width: '60vw',
                    position: 'relative',
                  }}
                  sx={{
                    border: '2.5px solid',
                    borderColor: 'primary.main',
                  }}
                  onClick={props.clientSide && props.handleClick}
                >
                  <Box
                    display="flex"
                    alignItems={'center'}
                  >
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                    >
                      {isCopy && (
                        <Iconify
                          icon="arcticons:huawei-phone-clone"
                          sx={{
                            fontSize: 32,
                            mr: 2,
                          }}
                          color="text.secondary"
                        />
                      )}
                      {(isCopy && 'COPY') ||
                        ((item.Title || item.IsRest) && (
                          <>
                            <TextMaxLine
                              align="left"
                              line={2}
                              color={isHighlighted ? 'primary' : 'text.primary'}
                              variant="body1"
                              sx={{
                                fontSize: 16,
                                maxWidth: '35vw',
                              }}
                            >
                              {item.IsRest ? 'Rest' : item.Title}
                            </TextMaxLine>
                          </>
                        ))}
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    alignItems={'center'}
                  >
                    {(item.IsRest || item.Exercise?.length > 0 || item.Title) && (
                      <Typography
                        variant="body2"
                        color={isHighlighted ? 'primary' : item.IsRest ? 'text.secondary' : 'text.primary'}
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        {item.IsRest ? 0 : item.Exercise?.length + ' '}
                      </Typography>
                    )}
                    &nbsp;
                    {/* <WorkoutDayBottomDrawer> */}
                    {!props.clientSide && (
                      <>
                        {!item.Exercise.length && !item.Title ? (
                          <IconButton
                            size="small"

                            // onClick={() => navigate(computePath(props.mode,"/workoutDay",Program._id),{state:{week:w,day:index}})}
                          >
                            {item.IsRest || item.Exercise?.length > 0 ? (
                              <Dumbell />
                            ) : (
                              <AddCircled
                                sx={{
                                  color: 'primary.main',
                                }}
                              />
                            )}
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            sx={{
                              color: item.IsRest ? 'text.secondary' : 'text.primary',
                            }}
                            //  onClick={() => navigate("/workoutDay")}
                          >
                            {item.isRestDay || item.Exercise?.length > 0 || item.Title ? (
                              <Dumbell />
                            ) : (
                              <AddCircled
                                sx={{
                                  color: 'primary.main',
                                }}
                              />
                            )}
                          </IconButton>
                        )}
                      </>
                    )}
                  </Box>
                </WorkoutDay>
              </WorkoutDayBottomDrawer>
            </div>
          </DragItem>
        </>
      </div>
    );
  },
);
