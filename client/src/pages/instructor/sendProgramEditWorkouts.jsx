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
import SendWorkoutEditHeader from 'src/components/instructor/sendWorkoutEditHeader'

const RootStyle = styled('div')(() => ({
    backgroundColor: '#F2F5F9',
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    width: '100%',
    boxShadow: '0px 4px 54px #E1E7F0',
    borderRadius: '24px 24px 0px 0px',
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

// ----------------------------------------------------------------------

export default function SendProgramEditWorkouts() {
    const dispatch = useDispatch()
    const { state } = useLocation()
    const [headerDependency, setHeaderDependency] = useState(false)
    const { search } = useLocation()
    console.log(search)
    const query = new URLSearchParams(search)

    const navigate = useNavigate()

    const handelNext = () => {
        navigate('/createDietPlan')
    }
    const handleBack = () => {
        if (query.get('stage') == 2) {
            return navigate('/createProgram')
        }
        navigate('/createProgram?stage=' + (Number(query.get('stage')) - 1))
    }

    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <Container>
                    {' '}
                    <Header
                        style={{ borderRadius: '0px 0px 8px 8px' }}
                        headerDependency={headerDependency}
                    >
                        <SendWorkoutEditHeader
                            setHeaderDependency={setHeaderDependency}
                        />
                    </Header>{' '}
                    <Content style={{ paddingTop: 24 }}>
                        <WorkoutWeek />
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
                                <Button variant="contained" fullWidth>
                                    Save Changes
                                </Button>
                            </Box>
                        </BoxStyle>
                    </FooterBase>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
