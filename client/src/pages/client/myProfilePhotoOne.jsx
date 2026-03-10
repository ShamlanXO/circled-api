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
import CarouselBasic1 from '../overview/extra/carousel/CarouselBasic1'
import { use } from 'react-router'
import CarouselBasic2 from '../overview/extra/carousel/CarouselBasic2'
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

export default function MyProfilePhotoOne() {
    const dispatch = useDispatch()
    const { state } = useLocation()

    const { search } = useLocation()
    console.log(search)
    const query = new URLSearchParams(search)
    const [photos, setPhotos] = useState([{}, {}, {}])
    const navigate = useNavigate()

    const handleBack = () => {
        navigate('/workoutCalendar')
    }

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
                                    My Profile
                                    <Typography
                                        component={'span'}
                                        variant="body2"
                                        color="secondary"
                                    ></Typography>
                                </Typography>
                            </Box>
                        </BoxHeader>
                    </Header>{' '}
                    <Content
                        style={{
                            paddingTop: 24,
                            paddingBottom: 48,
                            overflowY: 'auto',
                        }}
                    >
                        <Stack spacing={1}>
                            <CarouselBasic2 items={state?.item.images} />
                            <br />
                            <Stack direction={'row'} spacing={10}>
                                <Stack spacing={1} px={2}>
                                    <Typography
                                        variant="subtitle1"
                                        color="text.primary"
                                    >
                                        Title
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {state?.item.title}
                                    </Typography>
                                </Stack>
                                <Stack spacing={1} px={2}>
                                    <Typography
                                        variant="subtitle1"
                                        color="text.primary"
                                    >
                                        Weight
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {state?.item.weight}kg
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Stack
                                direction={'column'}
                                spacing={1}
                                px={2}
                                pt={1}
                            >
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Description
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    {state?.item.description}
                                </Typography>
                            </Stack>
                            <Stack spacing={1} px={2} pt={1}>
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Date uploaded
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    {state.date}
                                </Typography>
                            </Stack>
                            {/* <Box>
                <Button
                  color="error"
                  variant="outlined"
                  sx={{ height: "40px", mt: 4 }}
                >
                  <Iconify
                    icon={"fluent:delete-24-regular"}
                    width={20}
                    height={20}
                    color="error.main"
                  />
                  <Typography variant="body1" color="error.main">
                    Delete
                  </Typography>
                </Button>
              </Box> */}
                        </Stack>
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
