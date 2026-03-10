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
    ListItemButton,
    IconButton,
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
import Label from 'src/components/Label'
import SendProgramEmails from 'src/components/instructor/sendProgramEmails'
import UpdateProgramForm from 'src/components/instructor/updateProgramForm'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'

const RootStyle = styled('div')(() => ({
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
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

const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 10px',
    zIndex: 100,
    width: '100%',
    borderRadius: '0px 0px 8px 8px',
}))

// ----------------------------------------------------------------------

export default function UpdateProgram({ steps = 4, active = 1 }) {
    const dispatch = useDispatch()
    const { state } = useLocation()

    const { search } = useLocation()
    console.log(search)
    const query = new URLSearchParams(search)

    const navigate = useNavigate()

    const handelNext = () => {
        navigate('/instructor')
    }
    const handleBack = () => {
        return navigate('/instructor')
    }

    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <Container>
                    {' '}
                    <Header>
                        <Box px={2} py={2}>
                            <Progress steps={5} />
                            <Box
                                width={'100%'}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                            >
                                <Box display={'flex'} alignItems={'center'}>
                                    {' '}
                                    <IconButton
                                        onClick={() => navigate(-1)}
                                        sx={{ color: 'text.primary' }}
                                    >
                                        <ArrowLeft />
                                    </IconButton>
                                    <Typography
                                        variant="h6"
                                        color="text.primary"
                                    >
                                        Fat Toaster 🔥
                                    </Typography>{' '}
                                </Box>{' '}
                                <Button>Edit Workouts</Button>
                            </Box>
                        </Box>
                    </Header>{' '}
                    <Content
                        style={{
                            paddingTop: 24,
                            paddingBottom: 48,
                            overflowY: 'auto',
                        }}
                    >
                        <UpdateProgramForm />
                        <Box marginTop={2}>
                            <ButtonBase
                                onClick={() => navigate('/addEmailRecievers')}
                            >
                                <Iconify icon="bi:arrow-up-right-circle" />
                                &nbsp;&nbsp;
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Send to
                                </Typography>
                            </ButtonBase>
                        </Box>
                        {/* <SendProgramEmails /> */}
                    </Content>
                    <FooterBase>
                        <Footer
                            confirm
                            next
                            back
                            nextClick={handelNext}
                            backClick={handleBack}
                        />
                    </FooterBase>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
