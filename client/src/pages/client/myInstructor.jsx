// @mui
import { styled } from '@mui/material/styles'
import { useState, useEffect } from 'react'
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
    IconButton,
    InputAdornment,
    Divider,
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
import ProfileHeader from 'src/components/dashboard/ProfileHeader'
import ProgramList from 'src/components/dashboard/ProgramList'
import { fetchPrograms } from 'src/redux/actions/common'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import { orderBy } from 'lodash'
const RootStyle = styled('div')(() => ({
    backgroundColor: '#fff',
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    backgroundColor: '#fff',
}))

// ----------------------------------------------------------------------

export default function MyInstructorPage() {
    const [headerDependency, setHeaderDependency] = useState(false)
    const { search } = useLocation()
    const [programs, setPrograms] = useState([])
    const [sortOrder, setSortOrder] = useState('desc')
    const Instructor = useSelector((s) => s.AtheletePlan.Instructor)
    console.log(Instructor)
    useEffect(() => {
        fetchPrograms(Instructor._id).then((programs) => {
            setPrograms(programs)
        })
    }, [])
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
                    <Header boxShadow>
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
                                    Trainer Profile
                                </Typography>{' '}
                            </Box>{' '}
                        </BoxHeader>
                    </Header>
                    <Content withoutPadding>
                        <ProfileHeader
                            myInstructor={true}
                            Profile={Instructor}
                            setHeaderDependency={setHeaderDependency}
                        />
                       
                        <Box px={2} mt={3}>
                            <BoxStyle>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    
                                >
                                    <Typography variant="h5" sx={{fontWeight:500,fontSize:'20px'}} color="text.primary" 
                                    >
                                        Programs {programs.length}
                                    </Typography>
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    onClick={() =>
                                        setSortOrder(
                                            sortOrder == 'desc' ? 'asc' : 'desc'
                                        )
                                    }
                                >
                                    <Iconify
                                        icon="ic:round-sort"
                                        color="text.secondary"
                                        style={{ transform: 'scaleX(-1)' }}
                                    />
                                    &nbsp;
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        Sort by:
                                        {sortOrder == 'desc'
                                            ? 'Newest'
                                            : 'Oldest'}
                                    </Typography>
                                </Box>
                            </BoxStyle>
                            {programs.length ==0 ? (
                                <Box display={"flex"} alignItems={"center"} justifyContent={"center"}  mt={2} mb={2} height={"100%"}>
                                <Typography variant="h5" sx={{py:1,fontSize:'20px'}} color="text.secondary" >
                                    No programs found
                                </Typography> 
                               
                                </Box>
                            ) : (
                                <></>
                            )}
                            <ProgramList
                            instructorId={Instructor._id}
                                myInstructor={true}
                                programs={orderBy(
                                    programs,
                                    (i) => new Date(i.createdAt),
                                    [sortOrder]
                                )}
                            />
                        </Box>
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
