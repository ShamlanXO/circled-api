// @mui
import { styled } from '@mui/material/styles'
import { useEffect, useState, forwardRef } from 'react'
// components
import Page from '../../components/Page'
// sections
import {
    Box,
    Button,
    Typography,
    Stack,
    IconButton,
    Avatar,
    ButtonBase,
    InputAdornment,
} from '@mui/material'

import Container from '../../components/Layout/Container'
import Content from '../../components/Layout/Content'
import Header from '../../components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import LinearProgress from '@mui/material/LinearProgress'
import Iconify from '../../components/Iconify'
import LabeledInput from '../../components/core/LabeledInput'
import FooterBase from '../../components/Layout/Footer'
import Progress from 'src/components/progress'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import Footer from 'src/components/onboarding/footer'
import axios from 'axios'
import api from 'src/utils/api'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import { useConfirmationModalContext } from 'src/utils/Modal'
import WorkoutCalendarHeader from 'src/components/instructor/workoutCalendarHeader'
import WorkoutWeek from 'src/components/instructor/workoutWeek'
import { useOutletContext } from 'react-router-dom'
import { computePath } from 'src/utils/routepath'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { arrayMoveImmutable } from 'array-move'
import cloneDeep from 'lodash/cloneDeep';
import Walkthrough from 'src/components/Labs/Walkthrough'
import { result } from 'lodash'
const RootStyle = styled('div')(() => ({
    backgroundColor: '#F2F5F9',
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    position: 'relative',
}))

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
}))
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
}))
const BoxHeader = styled(Box)(() => ({
    width: '100%',
    zIndex: 100,

    borderRadius: '0px 0px 8px 8px',
}))

// ----------------------------------------------------------------------

export default forwardRef((props, ref) => {
    const dispatch = useDispatch()
 
    const [destData, setDestData] = useState(null)
   
    const [Program, updateProgram, mode, saveProgram] = useOutletContext()
    const navigate = useNavigate()
    const { showConfirmationModal } = useConfirmationModalContext()
   


    const copyExercise = (
        sourceWeek,
        destinationWeek,
        sourceDay,
        destinationDay
    ) => {
        if (sourceWeek === destinationWeek && sourceDay === destinationDay)
            return
        let allPrograms = { ...Program.ExercisePlan }

        if (
            allPrograms.weeks[destinationWeek].days[destinationDay].Exercise
                .length
        ) {
            showConfirmationModal(
                'Are you sure ?',
                `You are going to replace (week ${
                    Number(destinationWeek) + 1
                } - day ${Number(destinationDay) + 1}) exercises with (week ${
                    sourceWeek + 1
                } - day ${sourceDay + 1}). This process is irreversible`,
                'Replace',
                'Cancel'
            ).then((res) => {
                if (res) {
                    allPrograms.weeks[destinationWeek].days[
                        destinationDay
                    ].Exercise = [
                        ...allPrograms.weeks[sourceWeek].days[sourceDay]
                            .Exercise,
                    ]
                    allPrograms.weeks[destinationWeek].days[
                        destinationDay
                    ].Title =
                        allPrograms.weeks[sourceWeek].days[sourceDay].Title

                    dispatch(updateProgram({ ExercisePlan: allPrograms }))
                } else {
                    return
                }
            })
        } else {
            allPrograms.weeks[destinationWeek].days[destinationDay].Exercise = [
                ...allPrograms.weeks[sourceWeek].days[sourceDay].Exercise,
            ]
            allPrograms.weeks[destinationWeek].days[destinationDay].Title =
                allPrograms.weeks[sourceWeek].days[sourceDay].Title

            dispatch(updateProgram({ ExercisePlan: allPrograms }))
        }
    }

    const swapExercise = (
        sourceWeek,
        destinationWeek,
        sourceDay,
        destinationDay
    ) => {
        let allPrograms = cloneDeep(Program.ExercisePlan)
        let temp1 = cloneDeep(allPrograms.weeks[sourceWeek].days)

        let result = arrayMoveImmutable(temp1, sourceDay, destinationDay)
        allPrograms.weeks[sourceWeek].days = result
        dispatch(updateProgram({ ExercisePlan: allPrograms }))
    }

    const copyWeek = (s, d) => {
        let allPrograms = cloneDeep(Program.ExercisePlan)
        let hasExercise = allPrograms.weeks[d].days.find(
            (i) => i.Exercise.length
        )

        if (hasExercise) {
            showConfirmationModal(
                'Are you sure ?',
                `You are going to replace (week ${
                    Number(d) + 1
                }) exercises with (week ${
                    s + 1
                }). This process is irreversible`,
                'Replace',
                'Cancel'
            ).then((res) => {
                if (res) {
                    allPrograms.weeks[d] = allPrograms.weeks[s]
                    dispatch(updateProgram({ ExercisePlan: allPrograms }))
                } else {
                    return
                }
            })
        } else {
            allPrograms.weeks[d] = allPrograms.weeks[s]
            dispatch(updateProgram({ ExercisePlan: allPrograms }))
        }
    }

    const onDragUpdate = (result) => {
        const { source, destination, combine, type } = result

        let destDataC = {}
        if (type == 'Weeks') {
            destDataC = {
                ...destDataC,
                day: null,
                sourceWeek: source.index,
                week: destination?.index,
                type,
            }
            setDestData(destDataC)

            return
        }
        if (!destination) {
            destDataC = {
                sweek: Number(source.droppableId),
                week: Number(source.droppableId),
                cweek: Number(source.droppableId),
            }
        } else {
            destDataC = {
                ...destDataC,
                week: Number(destination?.droppableId),
                day: destination?.index,
                type,
                sweek: Number(source.droppableId),
            }
        }
        if (combine) {
            let destinationWeek = combine.draggableId.split('-')[0]
            let destinationDay = combine.draggableId.split('-')[1]
            destDataC = {
                ...destDataC,
                cweek: destinationWeek,
                cday: destinationDay,
                type,
                sweek: Number(source.droppableId),
            }
        }

        setDestData(destDataC)
    }

    const onDragEnd = (result) => {
        const { source, destination, combine, type } = result
        let allPrograms = cloneDeep(Program.ExercisePlan)
        if (type == 'Weeks') {
            if (source?.index !== destination?.index) {
                copyWeek(source.index, destination.index)
            }

            let destDataC = {}
            setDestData(destDataC)

            return
        }

        setDestData(null)

        if (!destination && !combine) {
            return
        }

        if (combine) {
            let sourceWeek = Number(source.droppableId)
            let sourceDay = source.index
            let destinationWeek = (destination || combine).draggableId.split(
                '-'
            )[0]
            let destinationDay = (destination || combine).draggableId.split(
                '-'
            )[1]
            if (
                allPrograms.weeks[destinationWeek].days[destinationDay].Exercise
                    .length == 0 &&
                !allPrograms.weeks[destinationWeek].days[destinationDay].Title
            )
                copyExercise(
                    sourceWeek,
                    destinationWeek,
                    sourceDay,
                    destinationDay
                )
        } else {
            let sourceWeek = Number(source.droppableId)
            let sourceDay = source.index
            let destinationWeek = Number(destination.droppableId)
            let destinationDay =
                destinationWeek > 0 && sourceWeek != destinationWeek
                    ? destination.index
                    : destination.index
            if (destinationDay < 0) return
            if (
                allPrograms.weeks[destinationWeek].days[destinationDay].Exercise
                    .length == 0 &&
                !allPrograms.weeks[destinationWeek].days[destinationDay]
                    .Title &&
                sourceWeek != destinationWeek
            ) {
                copyExercise(
                    sourceWeek,
                    destinationWeek,
                    sourceDay,
                    destinationDay
                )
            } else {
                if (sourceWeek == destinationWeek)
                    swapExercise(
                        sourceWeek,
                        destinationWeek,
                        sourceDay,
                        destinationDay
                    )
            }
        }
    }
    return (
        <Container>
             <Header noColor boxShadow>
                                    <BoxHeader px={2} py={2}>
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
                                                    sx={{
                                                        color: 'text.primary',
                                                    }}
                                                >
                                                    <ArrowLeft />
                                                </IconButton>
                                                <Typography
                                                    variant="body1"
                                                    color="text.primary"
                                                >
                                                    {/* Program Overview &nbsp;&gt;&nbsp; */}
                                                    <Typography
                                                        component={'span'}
                                                        variant="subtitle1"
                                                        color="text.primary"
                                                    >
                                                        Edit workout
                                                    </Typography>
                                                </Typography>
                                            </Box>{' '}
                                        </Box>
                                    </BoxHeader>
                                </Header>
        <Content
            style={{
                paddingTop: 16,
                paddingLeft: 0,
                paddingRight: 0,
                background: '#F5F7FA',
            }}
        >
            <Walkthrough Program={Program} />
            <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
                <WorkoutWeek
                    Program={Program}
                    updateProgram={updateProgram}
                    mode={mode}
                    destData={destData}
                />
            </DragDropContext>
        </Content>
        </Container>
    )
})
