// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../../components/Page'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
// sections
import {
    Box,
    Typography,
    Stack,
    ButtonBase,
    Button,
    BottomNavigation,
    BottomNavigationAction,
    Tabs,
    Tab,
    IconButton,
    InputBase,
    InputAdornment,
    TextField,
} from '@mui/material'

import { useNavigate, useLocation } from 'react-router'
import { updateProfile } from 'src/redux/actions/Profile'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import Iconify from '../../components/Iconify'
import Container from '../../components/Layout/Container'
import InstructorPrograms from 'src/components/instructor/instructorPrograms'
import Content from '../../components/Layout/Content'
import Header from '../../components/Layout/Header'
import { useState } from 'react'
import {
    unarchiveProgram,
    getAllPrograms,
} from 'src/redux/actions/createProgram'
import ClientProfileUpdateForm from 'src/components/client/ProfileUpdateForm'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
const RootStyle = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}))

const BoxStyle = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
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
const TabContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    padding: '0 20px',
    justifyContent: 'center',
}))
const BoxHeader = styled(Box)(() => ({
    width: '100%',
    zIndex: 100,
    backgroundColor: '#fff',
    boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
    borderRadius: '0px 0px 8px 8px',
}))
// ----------------------------------------------------------------------

export default function AccountSettingPage() {
    const dispatch = useDispatch()
    const { search } = useLocation()
    const { state } = useLocation()

    const query = new URLSearchParams(search)

    const navigate = useNavigate()
    const Profile = useSelector((s) => s.Profile)
    const [tabValue, setTabValue] = useState('home')

    const ProgramList = useSelector((s) => s.ProgramList.Programs)
    const [current, setCurrent] = useState('Active')
    const handleTabChange = (event, newValue) => {
        console.log(newValue)
        if (newValue == 0) {
            setCurrent('Active')
        } else {
            setCurrent('Inactive')
        }
    }
    const swichAccount = () => {
        dispatch(updateFeedback({ loading: true }))
        dispatch(
            updateProfile({
                type: Profile.type == 'Athlete' ? 'Instructor' : 'Athlete',
            })
        ).then((res) => {
            dispatch(updateFeedback({ loading: false }))

            navigate('/')
        })
    }
    let programs =
        ProgramList?.filter((item) => {
            return item.IsArchived == true
        }) || []

    const unArchiveProgram = (id) => {
        dispatch(unarchiveProgram(id)).then((res) => {
            console.log(res)

            dispatch(getAllPrograms())
        })
    }
    return (
        <Page title=" Simplified Online Fitness Training ">
            <RootStyle>
                <Container>
                    <Header>
                        <BoxHeader px={2} py={2}>
                            <Box display={'flex'} alignItems={'center'}>
                                {' '}
                                <IconButton
                                    onClick={() => navigate(-1)}
                                    sx={{ color: 'text.primary' }}
                                >
                                    <ArrowLeft />
                                </IconButton>
                                <Typography variant="h6" color="text.primary">
                                    Archived
                                </Typography>{' '}
                            </Box>{' '}
                        </BoxHeader>
                    </Header>

                    <Content
                        flex={!programs.length}
                        style={{ overflowY: 'auto', paddingBottom: '24px' }}
                    >
                        <Typography
                            variant="subtitle1"
                            color="text.primary"
                            sx={{ py: 2 }}
                        >
                            Total {programs.length}
                        </Typography>
                        {!programs.length ? (
                            <Box
                                height={'100%'}
                                display={'flex'}
                                flexDirection={'column'}
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                {/* <Typography variant="subtitle2" color="text.secondary">
                  Not available
                </Typography> */}
                                <Typography
                                    sx={{ maxWidth: 240 }}
                                    align={'center'}
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    You don't have any drafted program
                                </Typography>
                            </Box>
                        ) : (
                            <InstructorPrograms
                                programs={programs}
                                unarchiveProgram={unArchiveProgram}
                            />
                        )}
                    </Content>
                </Container>
            </RootStyle>
        </Page>
    )
}
