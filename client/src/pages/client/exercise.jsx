// @mui
import { styled } from '@mui/material/styles'
import { useState } from 'react'
// components
import Page from '../../components/Page'
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
    Grid,
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
import WorkoutCalendarHeader from 'src/components/instructor/workoutCalendarHeader'
import WorkoutWeek from 'src/components/instructor/workoutWeek'
import ExerciseCard from 'src/components/instructor/exerciseCard'
import Label from 'src/components/Label'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import { useSelector } from 'react-redux'
import CarouselBasic1 from '../overview/extra/carousel/CarouselBasic1'
import { useConfirmationModalContext } from 'src/utils/Modal'
import { Satellite } from '@mui/icons-material'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'

const RootStyle = styled('div')(() => ({
    backgroundColor: '#F2F5F9',
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    width: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    flexDirection: 'column',
    padding: '16px',
    borderRadius: '16px',
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
    backgroundColor: '#fff',
    boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
    borderRadius: '0px 0px 8px 8px',
}))
// ----------------------------------------------------------------------

export default function MyExercisePage() {
    const dispatch = useDispatch()
    const { state } = useLocation()
    const modalContext = useConfirmationModalContext()
    const { search } = useLocation()
    const query = new URLSearchParams(search)
    const [exercises, setExercises] = useState([{}, {}, {}])
    const navigate = useNavigate()
    const Plan = useSelector((s) => s.AtheletePlan.Exercises.ExercisePlan)
    let ex = Plan.weeks[state.week].days[state.day].Exercise[state.index]
    const handleAddNewCard = () => {
        let newEx = [...exercises]
        newEx.push({
            isNew: true,
        })
        setExercises(newEx)
    }
    const handleBack = () => {
        navigate('/workoutCalendar')
    }
    const deleteDay = () => {
        modalContext
            .showConfirmationModal(
                'Delete !',
                `Are you sure you want to delete 
          all exercises ?`,
                'Delete'
            )
            .then((result) => {
                if (result) {
                } else {
                }
            })
    }
    const days = [
        'Saturday',
        'Sunday',
        'Moday',
        'Tuesday',
        'Wednesday',
        'Thrusday',
        'Friday',
    ]
    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <Container>
                    {' '}
                    <Header noColor>
                        <BoxHeader px={2} py={2}>
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
                                <Typography variant="h6" color="text.primary">
                                    Week {state.week + 1}&nbsp;
                                    <Typography
                                        component={'span'}
                                        variant="body2"
                                        color="secondary"
                                    >
                                        /&nbsp;{days[state.day]}
                                        &nbsp;/&nbsp;Exercise {state.index + 1}
                                    </Typography>
                                </Typography>
                            </Box>
                        </BoxHeader>
                    </Header>{' '}
                    <Content
                        style={{
                            paddingTop: 16,
                            paddingBottom: 48,
                            overflowY: 'auto',
                            position: 'relative',
                        }}
                    >
                        <Typography
                            align="center"
                            variant="h4"
                            color="text.primary"
                        >
                            {ex.title}
                        </Typography>
                        <br />

                        <BoxStyle>
                            {' '}
                            <Typography variant="body1" color="text.secondary">
                                {ex.note}
                            </Typography>
                        </BoxStyle>
                        <br />
                        <CarouselBasic1 media={ex.media} />
                        <Box
                            position={'absolute'}
                            bottom={56}
                            left={0}
                            display={'flex'}
                            width="100%"
                            justifyContent="center"
                        >
                            <Button color="secondary" variant="contained">
                                <Typography
                                    variant="body1"
                                    color="common.white"
                                >
                                    Start Exercise
                                </Typography>
                                <Iconify
                                    icon={'ic:round-keyboard-arrow-right'}
                                    style={{
                                        border: '1.5px solid #fff',
                                        borderRadius: '24px',
                                    }}
                                    width={20}
                                    height={20}
                                    color="common.white"
                                />
                            </Button>
                        </Box>
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
