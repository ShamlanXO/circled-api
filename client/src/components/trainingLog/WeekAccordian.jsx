import React, { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import Iconify from 'src/components/Iconify';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import _, { transform } from 'lodash';
import { Box, Stack } from '@mui/material';
import TrackVisibility from 'react-visibility-sensor';
import MessageCard from 'src/components/client/MessageCard';

const WeekAccordian = ({ 
  weekLogs, 
  week, 
  fetchAllLogs, 
  Profile, 
  ClientData, 
  clientDetails,
  Plan, 
  navigate, 
  markLogasread,
  targetWeek,
  targetDay,
  targetExercise,
  isTargetWeek,
  scrollRef
}) => {
  const [expanded, setExpanded] = useState(false);
  const groupedByDay = _.groupBy(weekLogs, (i) => i.day);

  // Auto-expand if this is the target week
  useEffect(() => {
    if (isTargetWeek && targetDay !== null) {
      console.log(`Auto-expanding week ${week} for target day ${targetDay}`);
      setExpanded(true);
    }
  }, [isTargetWeek, targetDay, week]);


  return (
    <Accordion
      expanded={expanded}
      onChange={(event, isExpanded) => setExpanded(isExpanded)}
      sx={{
        'border': '1.5px solid #C3CBD9',
        'borderRadius': 1,
        'overflow': 'hidden',
        'mb': 2,
        '&.Mui-expanded': {
          margin: 0,
          mb: 2,
        },
        ...(isTargetWeek && {
          border: '2px solid rgba(25, 118, 210, 0.5)',
          backgroundColor: 'rgba(25, 118, 210, 0.02)',
        }),
      }}
    >
      <AccordionSummary
        sx={{
          'pl': 1,
          'pb': 0,
          'minHeight': 40,
          '&.Mui-expanded': {
            minHeight: 62,
            maxHeight: 62,
            mb: 0,
            pb: 0,
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          {expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          <Typography 
            variant="subtitle1"
            sx={{
              ...(isTargetWeek && {
                fontWeight: '600',
                color: 'primary.dark',
              }),
            }}
          >
            Week {Number(week) + 1}
            {isTargetWeek && ' (Target)'}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pl: 2, pr: 0, pt: 0, mt: -2 }}>
        <Stack
          direction="column"
          spacing={0}
        >
          {Object.keys(groupedByDay).map((item) => {
            return (
              <DayAccordian
                key={item}
                dayLogs={groupedByDay[item]}
                day={item}
                fetchAllLogs={fetchAllLogs}
                Profile={Profile}
                ClientData={ClientData}
                clientDetails={clientDetails}
                Plan={Plan}
                navigate={navigate}
                markLogasread={markLogasread}
                targetWeek={targetWeek}
                targetDay={targetDay}
                targetExercise={targetExercise}
                isTargetWeek={isTargetWeek}
                isTargetDay={isTargetWeek && Number(item) === Number(targetDay)}
                scrollRef={scrollRef}
              />
            );
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default WeekAccordian;

const DayAccordian = ({ 
  dayLogs, 
  day, 
  fetchAllLogs, 
  Profile, 
  ClientData, 
  clientDetails,
  Plan, 
  navigate, 
  markLogasread,
  targetWeek,
  targetDay,
  targetExercise,
  isTargetWeek,
  isTargetDay,
  scrollRef
}) => {
  const [expanded, setExpanded] = useState(false);
  const sortedByExercise = _.sortBy(dayLogs, (i) => i.exercise);
  const exerciseRef = useRef(null);
  
  console.log(sortedByExercise);

  // Auto-expand if this is the target day
  useEffect(() => {
    if (isTargetDay && targetExercise !== null) {
      console.log(`Auto-expanding day ${day} for target exercise ${targetExercise}`);
      setExpanded(true);
    }
  }, [isTargetDay, targetExercise, day]);

  // Scroll to target exercise when day is expanded
  useEffect(() => {
    if (expanded && isTargetDay && targetExercise !== null && exerciseRef.current) {
      console.log(`Scrolling to exercise ${targetExercise} in day ${day}`);
      setTimeout(() => {
        exerciseRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    }
  }, [expanded, isTargetDay, targetExercise, day]);


  
  return (
    <Accordion
      expanded={expanded}
      onChange={(event, isExpanded) => setExpanded(isExpanded)}
      sx={{
        'boxShadow': 'none',
        'borderBottom': 0,
        'mt': -1,
        '&.Mui-expanded': {
          boxShadow: 'none',
        },
        '&::before': {
          height: '0px',
          backgroundColor: 'transparent',
        },
        ...(isTargetDay && {
          backgroundColor: 'rgba(25, 118, 210, 0.03)',
          borderLeft: '3px solid rgba(25, 118, 210, 0.5)',
        }),
      }}
    >
      <AccordionSummary
        sx={{
          'pl': 0,
          'margin': 0,
          'padding': 0,

          'maxHeight': 40,
          'borderBottom': '0',

          '&.Mui-expanded': {
            maxHeight: 40,
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          {expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          <Typography 
            variant="subtitle1"
            sx={{
              ...(isTargetDay && {
                fontWeight: '600',
                textTransform: 'capitalize',
                color: 'primary.dark',
              }),
            }}
          >
            Day {Number(day) + 1} : {dayLogs?.[0]?.logs?.[0]?.dayTitle}
            {isTargetDay && ' (Target)'}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ mt: -2 }}>
        {sortedByExercise.map((item, index) => {
          const isTargetExercise = isTargetDay && Number(item.exercise) === Number(targetExercise);
          return (
            <Box
              key={`${item.week}-${item.day}-${item.exercise}`}
              ref={isTargetExercise ? exerciseRef : null}
              sx={{
                ...(isTargetExercise && {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderRadius: 1,
                  p: 1,
                  border: '2px solid rgba(25, 118, 210, 0.3)',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)',
                    },
                    '70%': {
                      boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
                    },
                    '100%': {
                      boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
                    },
                  },
                }),
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="subtitle1"
                  color="primary.main"
                  onClick={() => {
                    Profile.type == 'Instructor'
                      ? navigate(`/clientProfile/${ClientData.clientId}/workoutDay`, {
                          state: {
                            open: true,
                            week: item.week,
                            day: item.day,
                            exercise: item.exercise,
                          },
                        })
                      : navigate(`/myWorkoutCalendar/workoutDay`, {
                          state: {
                            open: true,
                            week: item.week,
                            day: item.day,
                            exercise: item.exercise,
                          },
                        });
                  }}
                  sx={{
                    fontWeight: '600',
                    ...(isTargetExercise && {
                      color: 'primary.dark',
                      fontWeight: '700',
                    }),
                  }}
                >
                  Exercise {Number(item.exercise) + 1} : {item.logs[0].title}
                  {isTargetExercise && ' (Current)'}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="primary.main"
                  onClick={() => {
                    Profile.type == 'Instructor'
                      ? navigate(`/clientProfile/${ClientData.clientId}/workoutDay`, {
                          state: {
                            open: true,
                            week: item.week,
                            day: item.day,
                            exercise: item.exercise,
                          },
                        })
                      : navigate(`/myWorkoutCalendar/workoutDay`, {
                          state: {
                            open: true,
                            week: item.week,
                            day: item.day,
                            exercise: item.exercise,
                          },
                        });
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  Link{' '}
                  <Iconify
                    sx={{ transform: 'rotate(90deg)' }}
                    icon={'material-symbols:arrow-insert-rounded'}
                  />
                </Typography>
              </Box>
              <Stack
                direction="column"
                spacing={2}
                mt={2}
              >
                {item.logs.map((l) => (
                  <TrackVisibility key={l._id} onChange={() => !l.IsRead && markLogasread(l._id)}>
                    <Box>
                      {Profile.type == 'Instructor' ? (
                        <MessageCard
                          {...l}
                          {...item}
                          fetchAllLogs={fetchAllLogs}
                          name={
                            ClientData.UserId== l.createdBy
                              ? clientDetails?.name
                              : Profile.profileName || Profile.name
                          }
                          profilePic={
                            ClientData.UserId == l.createdBy ? clientDetails?.profilePic : Profile.profilePic
                          }
                        />
                      ) : (
                        <MessageCard
                          orderId={Profile.type == 'Instructor' ? ClientData._id : Plan.currentPlan}
                          {...l}
                          {...item}
                          fetchAllLogs={fetchAllLogs}
                          name={
                            Plan.Instructor._id == l.createdBy
                              ? Plan.Instructor?.name
                              : Profile.name || Profile.profileName || Profile.name
                          }
                          profilePic={
                            Plan.Instructor._id == l.createdBy ? Plan.Instructor?.profilePic : Profile.profilePic
                          }
                        />
                      )}
                    </Box>
                  </TrackVisibility>
                ))}
              </Stack>
            </Box>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};
