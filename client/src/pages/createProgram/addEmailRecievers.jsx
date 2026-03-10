// @mui
import { styled } from '@mui/material/styles'
import { useState, forwardRef } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
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
import SubscriptionTypePopover from 'src/components/instructor/subscriptionTypePopover'
import UpdateProgramForm from 'src/components/instructor/updateProgramForm'
import { validateEmail } from 'src/utils/validator'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'

//import { updateProgram } from "src/redux/actions/createProgram";
import { useOutletContext } from 'react-router-dom'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
const RootStyle = styled('div')(() => ({
    backgroundColor: '#fff',
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
    alignItems: 'end',
    padding: '20px 20px',
    maxWidth: 'xs',
    zIndex: 100,
    borderRadius: '0px 0px 8px 8px',
}))

// ----------------------------------------------------------------------
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default function AddEmailRecievers(props) {
    const dispatch = useDispatch()
    const { state } = useLocation()

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

    const [Program, updateProgram] = useOutletContext()
    const [errorObj, setErrorObj] = useState({})
    const [allRecievers, setAllRecievers] = useState(
        Program?.SendTo ? Program.SendTo : ['']
    )
    const updateRecievers = (arr) => {
        setAllRecievers(arr)
    }

    const handleSubmit = () => {
        let newRecievers = [...allRecievers]
        let errors = false
        newRecievers.map((item, index) => {
            if (!validateEmail(item)) {
                setErrorObj({
                    index: index,
                    message: 'Please enter valid email',
                })
                errors = true
                return
            }
        })
        if (!errors) {
            dispatch(
                updateProgram({
                    SendTo: allRecievers,
                })
            )
            navigate(-1)
        }
    }

    return (
        <Dialog
            fullScreen
            open={props.open}
            onClose={props.handleClose}
            sx={{ paper: { margin: 0 } }}
            PaperProps={{ style: { margin: 0 } }}
            TransitionComponent={Transition}
        >
            <RootStyle>
                <Page title=" Simplified Online Fitness Training ">
                    <Container>
                        <Header
                            style={{ borderRadius: '0px 0px 32px 32px' }}
                            boxShadow
                        >
                            <Box
                                width={'100%'}
                                px={2}
                                py={2}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                            >
                                <Box display={'flex'} alignItems={'center'}>
                                    <IconButton
                                        onClick={() => props.handleClose()}
                                        sx={{ color: 'text.primary' }}
                                    >
                                        <ArrowLeft />
                                    </IconButton>
                                    {/* <Typography variant="body1">{props.headerTitle}</Typography>
                &nbsp; > */}
                                    <Typography variant="subtitle1">
                                        Add receivers
                                    </Typography>
                                </Box>
                                <Button
                                    sx={{ fontSize: 16, paddingRight: 0 }}
                                    onClick={() => props.handleClose()}
                                >
                                    Done
                                </Button>
                            </Box>
                        </Header>
                        <Content
                            style={{
                                paddingTop: 24,
                                paddingBottom: 48,
                                overflowY: 'auto',
                            }}
                        >
                            <SendProgramEmails {...props} />
                        </Content>
                    </Container>{' '}
                </Page>
            </RootStyle>
        </Dialog>
    )
}
