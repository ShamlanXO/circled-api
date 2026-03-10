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
    Divider,
    ButtonBase,
    IconButton,
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
import LightboxModal from 'src/components/LightBoxContainer'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import ProfileHeader from 'src/components/dashboard/ProfileHeader'
import ProgramList from 'src/components/dashboard/ProgramList'
import ProfileOptionsPopover from 'src/components/instructor/ProfileOptionsPopover'
import { fetchPrograms } from 'src/redux/actions/common'
import { useSelector } from 'react-redux'
import { orderBy } from 'lodash'
import More from 'src/assets/IconSet/More'
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

export default function ProfilePage() {
    const [headerDependency, setHeaderDependency] = useState(false)
    const [programs, setPrograms] = useState([])
    const Profile = useSelector((s) => s.Profile)
    const [sellAll,setSeeAll]=useState(false)
    const [sortOrder, setSortOrder] = useState('desc')
    useEffect(() => {
        fetchPrograms(Profile._id).then((programs) => {
            setPrograms(programs)
        })
    }, [])
    const { search } = useLocation()

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
    console.log(sortOrder)
    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <Container>
                    {' '}
                    <Content withoutPadding style={{ paddingTop: 64 }}>
                        <Header
                            style={{
                                borderRadius: '0px 0px 8px 8px',
                                boxShadow:
                                    '0px 4px 54px rgba(225, 231, 240, 0.5)',
                                overflow: 'hidden',
                            }}
                            position="fixed"
                        >
                            <BoxHeader px={2} py={2} width={'100%'}>
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    width={'100%'}
                                    justifyContent={'space-between'}
                                >
                                    {' '}
                                    <Box display={'flex'} alignItems={'center'}>
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
                                          Profile view
                                        </Typography>{' '}
                                    </Box>
                                    <ProfileOptionsPopover profile={Profile}>
                                        <More
                                            sx={{ color: 'text.primary' }}
                                            style={{ fontSize: 32 }}
                                            color="text.primary"
                                        />
                                    </ProfileOptionsPopover>
                                </Box>{' '}
                            </BoxHeader>
                        </Header>
                        <ProfileHeader
                            setHeaderDependency={setHeaderDependency}
                            Profile={Profile}
                        />
                       
                        <Box px={2}>
                            <Typography variant="h5" sx={{fontWeight:500,fontSize:'20px'}} color="text.primary" >
                                Programs&nbsp; {programs.length}
                            </Typography>
                            {/* <BoxStyle>
                                <Box display="flex" alignItems="center">
                                    
                                    <Typography
                                        variant="subtitle1"
                                        color="text.primary"
                                    >
                                        Programs &nbsp; {programs.length}
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
                            </BoxStyle> */}
                            <ProgramList
                                instructorId={Profile._id}
                                programs={orderBy(
                                    programs,
                                    (i) => new Date(i.createdAt),
                                    [sortOrder]
                                )}
                            />
                        </Box>
                       {/* { programs.length>3?<Box display={"flex"} justifyContent={"center"} py={2} alignItems={"center"} onClick={()=>setSeeAll(!sellAll)}>
                           <Typography align='center' variant='h6'>See all</Typography> 
                            {sellAll?<Iconify icon={"iconamoon:arrow-down-2"} sx={{
                                fontSize:24,
                                ml:0.5
                            }}/>:<Iconify icon={"iconamoon:arrow-up-2"} sx={{
                                fontSize:24,
                                ml:0.5
                            }}/>}
                        </Box>:""} */}
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}
