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
    Divider,
    Avatar,
    ButtonBase,
    IconButton,
    InputAdornment,
    Grid,
    Drawer,
} from '@mui/material'
import Iconify from 'src/components/Iconify'

import Container from '../../components/Layout/Container'
import Content from '../../components/Layout/Content'
import Header from '../../components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import Collapse from '@mui/material/Collapse'
import MyProfileHeader from 'src/components/client/profileHeader'
import HealthProfile from 'src/assets/IconSet/fitnessProfile/HealthProfile'
import CameraIcon from 'src/assets/IconSet/camera'
import BodyComposition from 'src/assets/IconSet/fitnessProfile/BodyComposition'
import PersonalDetailIcon from 'src/assets/IconSet/fitnessProfile/PersonalDetails'
import { LinearProgress } from '@mui/material'
import IconSups from 'src/assets/clientProfile/Icon_Sups_Client'
import { useSelector } from 'react-redux'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import moment from 'moment'
import BodyMetrix from 'src/components/client/BodyMetrix'
import PhotoWidget from 'src/components/client/UploadphotoWidget'
import { dispatch } from 'src/redux/store'
import { updateProfile } from 'src/redux/actions/Profile'
import IconHealth from 'src/assets/clientProfile/Icon_Health'
import IconAbout from 'src/assets/clientProfile/Icon_about'
import IconBioscan from 'src/assets/clientProfile/Icon_bioscan'

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

export default function MyProfilePage() {
    const [headerDependency, setHeaderDependency] = useState(false)
    const { search, state, pathname } = useLocation()
    const [mini, setMini] = useState(true)
    const [mini2, setMini2] = useState(true)
    const [view, setView] = useState(null)
    const query = new URLSearchParams(search)
    const Profile = useSelector((s) => s.Profile)
    const AtheletePlan = useSelector((s) => s.AtheletePlan)
    const navigate = useNavigate()
    const minimize = () => {
        setMini(!mini)
    }
    const minimize2 = () => {
        setMini2(!mini2)
    }
    const activityLevelOptions = {
        Light: 'Light: 1-3 times a week',
        Moderate: 'Moderate: 4-5 times a week',
        Active: 'Active: intense 4-5 times a week',
        'Very active': 'Very active: intense 6-7 times a week',
    }
    const handelNext = () => {
        navigate('/createDietPlan')
    }
    const handleBack = () => {
        if (query.get('stage') == 2) {
            return navigate('/createProgram')
        }
        navigate('/createProgram?stage=' + (Number(query.get('stage')) - 1))
    }
    let currentProgram = AtheletePlan?.Exercises
    const currentday = AtheletePlan.currentDay
    const currentweek = AtheletePlan.currentWeek

    console.log(currentProgram, currentday, currentweek)
    return (
        <RootStyle>
            <Page title=" Simplified Online Fitness Training ">
                <Container>
                    {' '}
                    <Content
                        withoutPadding
                        style={{ backgroundColor: '#FBFBFB' }}
                    >
                        <Header
                            style={{
                                overflow: 'hidden',
                            }}
                        >
                            <BoxHeader
                                px={2}
                                py={2}
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
                                        My Profile
                                    </Typography>{' '}
                                </Box>{' '}
                            </BoxHeader>
                        </Header>

                        <Box bgcolor={"#FBFBFB"}>
                            <MyProfileHeader
                                Profile={Profile}
                                clientMyprofile
                                setHeaderDependency={setHeaderDependency}
                                view={state?.view || view}
                                setView={(val) => {
                                    navigate(pathname, {
                                        state: { view: val },
                                        replace: true,
                                    })
                                    setView(val)
                                }}
                            />
                        </Box>

                        <Box px={2} mb={2} bgcolor={"#FBFBFB"}>
                            <Box px={2} pt={1} 
                                boxShadow="0px 4px 4px 0px rgba(43, 64, 87, 0.15)" 
                                bgcolor={"#fff"}
                                borderRadius={"8px"} 
                                border={"1px solid #E1E7F0"}>
                                <Stack direction={"column"} spacing={1}>
                                    <Box onClick={() => setView(1)}>
                                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={1}>
                                            <Stack direction={"row"} spacing={2} alignItems={"center"}>
                                                <IconAbout />
                                                <Typography  color="text.primary">
                                                    About
                                                </Typography>
                                            </Stack>
                                            <IconButton>
                                                <Iconify icon={"eva:chevron-right-fill"} />
                                            </IconButton>
                                        </Stack>
                                        <Divider />
                                    </Box>
                                    <Box onClick={() => setView(2)}>
                                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={1}>
                                            <Stack direction={"row"} spacing={2} alignItems={"center"}>
                                                <IconHealth />
                                                <Typography  color="text.primary">
                                                    Health profile
                                                </Typography>
                                            </Stack>
                                            <IconButton>
                                                <Iconify icon={"eva:chevron-right-fill"} />
                                            </IconButton>
                                        </Stack>
                                      
                                    </Box>
                                    {/* <Box onClick={() => setView(3)}>
                                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={1}>
                                            <Stack direction={"row"} spacing={2} alignItems={"center"}>
                                                <IconBioscan />
                                                <Typography  color="text.primary">
                                                    Bio scan
                                                </Typography>
                                            </Stack>
                                            <IconButton>
                                                <Iconify icon={"eva:chevron-right-fill"} />
                                            </IconButton>
                                        </Stack>
                                    </Box> */}
                                </Stack>
                            </Box>
                        </Box>

                        <Box bgcolor={"#FBFBFB"} px={2} py={2}>
                            <Box sx={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #E1E7F0',
                                boxShadow: '0px 4px 4px 0px rgba(43, 64, 87, 0.15)',
                            }}>
                                {currentProgram?._id ? (
                                    <Box alignItems={'center'} px={3} py={2}>
                                        <Typography variant="h5" gutterBottom color="text.primary">Active Program</Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                mt: 2,
                                                backgroundSize: 'cover',
                                                borderRadius: '4px 4px 4px 4px',
                                                backgroundPosition: 'center',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 96,
                                                    height: 71,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    backgroundImage: `url(${
                                                        currentProgram?.BannerImage ||
                                                        '/images/DefaultThumbnail.png'
                                                    })`,
                                                    borderRadius: 1,
                                                }}
                                            />
                                            <Stack direction={"column"} spacing={1} ml={2}>
                                                <Typography
                                                    sx={{
                                                        ml: 2,
                                                        fontWeight: 'bold',
                                                        textTransform: 'capitalize',
                                                    }}
                                                >
                                                    {currentProgram?.Title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    In progress: Week {currentweek + 1} / {currentProgram?.Duration}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                        <Box display={"flex"} alignItems={"center"}  mt={4}>
                                          <Avatar 
                                          src={currentProgram?.createdBy?.profilePic} 
                                          sx={{width: 44, height: 44, borderRadius: '50%'}} />
                                          <Stack direction={"column"} spacing={0} ml={2}>
                                            <Typography variant="subtitle2" color="text.primary">
                                            By {currentProgram?.createdBy?.name} {currentProgram?.createdBy?.lastName}
                                          </Typography>
                                          <Typography variant="body2" color="text.secondary">
                                            {currentProgram?.createdBy?.expertise}
                                          </Typography>
                                          </Stack>
                                          
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box bgcolor={'#fff'} height={'100%'} py={2} px={2} mb={1}>
                                        <Typography variant="h5" gutterBottom color="text.primary">Active Program</Typography>
                                        <br/>
                                        <Box
                                            height={'100%'}
                                            display={'flex'}
                                            flexDirection={'column'}
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                            width={'100%'}
                                        >
                                            <Typography color={'text.secondary'}>No active program</Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Content>
                </Container>{' '}
            </Page>
            <DetailsBottonDrawer 
                open={view !== null} 
                onClose={() => setView(null)}
                view={view}
                title={view == 1 ? "About the athlete" : view == 2 ? "Health profile" : view == 3 ? "Bio scan" : ""} 
                content={{
                    about: <>
                        <Box mt={1}>
                            <Box bgcolor={'#fff'}>
                                <Typography
                                    color="text.primary"
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Goals
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ mb: 2 }}
                                    color="text.secondary"
                                    flexWrap={'wrap'}
                                >
                                    {Profile.goals || 'N/A'}
                                </Typography>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography
                                            color="text.primary"
                                            mb={0.5}
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            Training experience{' '}
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="body1"
                                        >
                                            {Profile.trainingExperience || 'N/A'}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography
                                            color="text.primary"
                                            mb={0.5}
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            Years of training{' '}
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="body1"
                                        >
                                            {Profile.YearsOfTraining ? Profile.YearsOfTraining + ' years' : 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography
                                            color="text.primary"
                                            mb={0.5}
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            Activity level{' '}
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="body1"
                                        >
                                            {activityLevelOptions?.[Profile.activityLevel] || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>
                    </>,
                    health: <Box mt={1} pb={4}>
                        <Box bgcolor={'#fff'}>
                            <Stack spacing={2} mb={2} direction={'row'}>
                                <Box>
                                    <Typography
                                        color="text.primary"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Height
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ mb: mini2 ? 0 : 2 }}
                                        color="text.secondary"
                                        flexWrap={'wrap'}
                                    >
                                        {Profile?.healthInfo?.height?.toFixed(2) || 'N/A'} cm
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        color="text.primary"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Weight
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ mb: mini2 ? 0 : 2 }}
                                        color="text.secondary"
                                        flexWrap={'wrap'}
                                    >
                                        {Profile?.healthInfo?.weight?.toFixed(2) || 'N/A'} kg
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography
                                        color="text.primary"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Medical condition
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ mb: 0.5 }}
                                        color="text.secondary"
                                        flexWrap={'wrap'}
                                    >
                                        {Profile?.healthInfo?.medicalCondition || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        color="text.primary"
                                        mb={0.5}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Medications
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        variant="body1"
                                    >
                                        {Profile.healthInfo.medications || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        color="text.primary"
                                        mb={0.5}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Injuries
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        variant="body1"
                                    >
                                        {Profile.healthInfo.injuries || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        color="text.primary"
                                        mb={0.5}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Family health history
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        variant="body1"
                                    >
                                        {Profile.healthInfo.history || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        color="text.primary"
                                        mb={0.5}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Allergies and reactions
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        variant="body1"
                                    >
                                        {Profile.healthInfo.allergiesAndReactions || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        color="text.primary"
                                        mb={0.5}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Supplements
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        variant="body1"
                                    >
                                        {Profile.healthInfo.supplements || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        color="text.primary"
                                        mb={0.5}
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        Other
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        variant="body1"
                                    >
                                        {Profile.healthInfo.medicalNotes || 'N/A'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                        <Box mt={1}>
                            <Box bgcolor={'#fff'} py={3}>
                                <Typography
                                    variant="h5"
                                    color="text.primary"
                                    gutterBottom
                                    display={'flex'}
                                    alignItems={'center'}
                                    sx={{ mb: 2 }}
                                >
                                    Body images
                                </Typography>
                                <PhotoWidget data={Profile.bodyImages} setData={d => dispatch(updateProfile({
                                    bodyImages: d
                                }))} />
                            </Box>
                        </Box>
                    </Box>,
                    bioScan: <Box mt={1} pb={4}>
                        <Box bgcolor={'#fff'}>
                          
                            <Typography variant="body1" color="text.secondary">
                                This feature is currently under development. Please check back soon for updates.
                            </Typography>
                        </Box>
                    </Box>
                }}
            />
        </RootStyle>
    )
}

const DetailsBottonDrawer = ({ open, title, onClose, view, content }) => {
    const [openDrawer, setOpenDrawer] = useState(open);
    const handleClose = () => {
        setOpenDrawer(false);
        onClose();
    };

    useEffect(() => {
        setOpenDrawer(open);
    }, [open]);

    return (
        <Drawer anchor="bottom" open={openDrawer} onClose={handleClose}
            sx={{
                '& .MuiDrawer-paper': {
                    borderRadius: '8px 8px 0 0',
                    padding: '8px',
                    maxHeight: '80vh',
                    minHeight: '50vh',
                },
            }}
        >
            <Box display={"flex"} justifyContent={"flex-end"}>
                <IconButton onClick={handleClose}>
                    <Iconify icon={"eva:close-fill"} />
                </IconButton>
            </Box>
            <Box px={2}>
                <Typography variant="h3" sx={{
                    fontSize: '28px',
                }} color="text.primary">{title}</Typography>
            </Box>
            <Box px={2} mt={1} pb={4}>
                {view == 1 ? content.about : view == 2 ? content.health : view == 3 ? content.bioScan : null}
            </Box>
        </Drawer>
    );
};
