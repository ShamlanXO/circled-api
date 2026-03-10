// @mui
import { styled } from '@mui/material/styles'
// components
import React, { useRef } from 'react'
import Page from '../Page'
// sections
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    ListItemButton,
    Stack,
    Typography,
} from '@mui/material'
import TextMaxLine from '../TextMaxLine'
import { IconButtonAnimate, varFade } from '../animate'
import Iconify from '../Iconify'
import DurationPopover from './durationPopover'
import { useNavigate } from 'react-router'
import { ButtonBase } from '@mui/material'
import WorkoutDayBottomDrawer from './workoutDayBottomDrawer'
import Slider from 'react-slick'
import { useSelector } from 'react-redux'
import { computePath } from 'src/utils/routepath'
import AddCircled from 'src/assets/IconSet/AddCircled'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Dumbell from 'src/assets/IconSet/Dumbell'
import { transform } from 'lodash'
import { getWeekProgress } from 'src/utils/calendar'
import Progress from 'src/components/progress/Circular'
// ----------------------------------------------------------------------

const WorkoutDay = styled('div')(() => ({
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: '#fff',
    padding: '0px 8px',
    minHeight: 56,

    borderBottom: '1px solid #E1E7F0',
}))

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
}))

const Clone = styled(Box)(() => ({
    display: 'flex',
    marginTop: 32,
    alignItems: 'center',
    padding: '4px 10px',
}))

const IconButton2 = styled(IconButton)(() => ({
    backgroundColor: '#2F86EB',
    color: '#fff',
    height: 18,
    width: 18,
    padding: 2,
}))
const DragItem = styled('div')(() => ({
    padding: 2,
}))
const WeekItem = styled('div')(() => ({
    padding: 8,
    paddingRight: 0,
}))

// ----------------------------------------------------------------------

export default function WorkoutWeek(props) {
    const navigate = useNavigate()
    const { Program, updateProgram } = props
    var settings = {
        dots: false,
        infinite: false,
        arrows: false,
        centerMode: false,
        cssEase: 'linear',
        centerPadding: '2px',
        slidesToShow: 1.2,
        slidesToScroll: 1,
    }

    const days = ['Sat', 'Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri']

    const onDragEnd = (result) => {}
    const clientStats = useSelector((s) => s.ProgramList.clientData.stats)

    return (
        <Box position={'relative'} paddingBottom={0}>
            <>
                {Program.ExercisePlan?.weeks?.map((i, w) => {
                    return (
                        <div style={{ marginTop: 12, marginBottom: 24 }}>
                            <Typography
                                color="text.secondary"
                                sx={{
                                    ml: 1,
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    mt: 1.5,
                                    display: 'flex',
                                    width: '100%',
                                    pr: 2,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                Week {w + 1}{' '}
                                <Progress
                                    value={
                                        getWeekProgress(i, clientStats, w) * 100
                                    }
                                />
                            </Typography>
                            <div>
                                {i.days.map((item, index) => (
                                    <div key={index}>
                                        <DragItem>
                                            <WorkoutDay
                                                style={{ minHeight: 56 }}
                                                onClick={
                                                    props.clientSide &&
                                                    item.Exercise?.length > 0
                                                        ? () =>
                                                              props.handleClick(
                                                                  index,
                                                                  w,
                                                                  item.Title
                                                              )
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
                                                            props.destData
                                                                ?.cweek == w &&
                                                            props.destData
                                                                ?.cday == index
                                                                ? 'primary'
                                                                : item.Exercise
                                                                      .length
                                                                ? 'text.primary'
                                                                : 'text.primary'
                                                        }
                                                        sx={{
                                                            fontSize: 16,
                                                            width: 36,
                                                        }}
                                                    >
                                                        {days[index]}
                                                    </TextMaxLine>

                                                    <Divider
                                                        orientation="vertical"
                                                        flexItem
                                                        sx={{
                                                            ml: 0.5,
                                                            mr: 1,
                                                            borderColor:
                                                                '#E1E7F0',
                                                        }}
                                                    />
                                                    <Box>
                                                        {item.Title ||
                                                            (item.IsRest && (
                                                                <>
                                                                    <TextMaxLine
                                                                        align="left"
                                                                        line={1}
                                                                        color={
                                                                            props
                                                                                .destData
                                                                                ?.cweek ==
                                                                                w &&
                                                                            props
                                                                                .destData
                                                                                ?.cday ==
                                                                                index
                                                                                ? 'primary'
                                                                                : 'text.primary'
                                                                        }
                                                                        variant="body1"
                                                                        sx={{
                                                                            fontSize: 16,
                                                                            maxWidth:
                                                                                '35vw',
                                                                        }}
                                                                    >
                                                                        {item.IsRest
                                                                            ? 'Rest'
                                                                            : item.Title}
                                                                    </TextMaxLine>
                                                                </>
                                                            ))}
                                                    </Box>
                                                </Box>
                                                <Box
                                                    display="flex"
                                                    alignItems={'center'}
                                                >
                                                    {clientStats?.[
                                                        `${w}-${index}`
                                                    ] && (
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
                                                                props.destData
                                                                    ?.cweek ==
                                                                    w &&
                                                                props.destData
                                                                    ?.cday ==
                                                                    index
                                                                    ? 'primary'
                                                                    : item.IsRest
                                                                    ? 'text.secondary'
                                                                    : 'text.primary'
                                                            }
                                                            sx={{
                                                                fontSize: 14,
                                                            }}
                                                        >
                                                            {item.IsRest
                                                                ? 0
                                                                : item.Exercise
                                                                      ?.length +
                                                                  ' '}
                                                        </Typography>
                                                    }
                                                    &nbsp;
                                                    {/* <WorkoutDayBottomDrawer> */}
                                                    {
                                                        <>
                                                            {!item.Exercise
                                                                .length &&
                                                            !item.Title ? (
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
                                                                        color: item.IsRest
                                                                            ? 'text.secondary'
                                                                            : 'text.primary',
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
                    )
                })}
            </>
        </Box>
    )
}
