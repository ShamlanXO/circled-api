// @mui
import { styled } from '@mui/material/styles'
import { useRef, useState } from 'react'
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
import UploadNewPhotoForm from 'src/components/client/UploadNewPhotoForm'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import ArrowRight from 'src/assets/IconSet/ArrowRight'

const RootStyle = styled('div')(() => ({
    backgroundColor: '#F2F5F9',
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    width: '100%',
    border: '1px solid #E1E7F0',
    borderBottom: '0px',
    borderRadius: '24px 24px 0px 0px',
    backgroundColor: '#fff',
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
    //boxShadow: "0px 4px 54px rgba(225, 231, 240, 0.5)",
    borderRadius: '0px 0px 8px 8px',
}))
// ----------------------------------------------------------------------

export default function MyProfilePhotosNew() {
    const dispatch = useDispatch()
    const { state } = useLocation()
    const comRef = useRef(null)
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
                    <Header>
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
                                    Upload photo
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
                            position: 'relative',
                        }}
                    >
                        <Typography>
                            Upload images of your progress for
                            <br /> your trainer.
                        </Typography>
                        <br />
                        <UploadNewPhotoForm
                            ref={comRef}
                            mode={state?.mode}
                            item={state?.item}
                        />
                    </Content>
                    <FooterBase>
                        <BoxStyle>
                            <Box
                                display={'flex'}
                                justifyContent={'flex-end'}
                                width={'100%'}
                                px={3}
                                py={2}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        display: 'flex',

                                        width: '50%',
                                        fontSize: 16,
                                    }}
                                    startIcon={
                                        <Iconify
                                            Iconify
                                            icon="grommet-icons:upload-option"
                                            width={20}
                                            height={20}
                                            color="common.white"
                                        />
                                    }
                                    onClick={() => comRef.current.click()}
                                >
                                    Upload
                                </Button>
                            </Box>
                        </BoxStyle>
                    </FooterBase>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
