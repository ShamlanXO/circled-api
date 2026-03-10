// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../../components/Page'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider, Formik } from 'formik'
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
import axios from '../../utils/axios'
import api from '../../utils/api'
import Footer from '../../components/onboarding/footer'
import { useNavigate, useLocation } from 'react-router'
import { Divider } from '@mui/material'
import { updateFeedback } from '../../redux/actions/feedback'
import { useDispatch } from 'react-redux'
import { updateOnboarding } from '../../redux/actions/Onboarding'
import Stepper from '../../components/progress'
import Image from '../../components/Image'
import Preview1 from '../../assets/onboarding/overview.svg'
import Preview2 from '../../assets/onboarding/overview2.svg'
import Preview3 from '../../assets/onboarding/overview3.svg'
import Iconify from '../../components/Iconify'
import Container from '../../components/Layout/Container'
import FooterBase from '../../components/Layout/Footer'
import Content from '../../components/Layout/Content'
import Header from '../../components/Layout/Header'
import ProfileHeader from '../../components/client/profileHeader'
import { useState } from 'react'
import { updateProfile } from 'src/redux/actions/Profile'
import Input from 'src/components/Labs/Cropper'
import ProfileUpdateForm from 'src/components/dashboard/ProfileUpdateForm'
import { useSelector } from 'react-redux'
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

export default function EditProfilePage(props) {
    const navigate = useNavigate()
    const Profile = useSelector((s) => s.Profile)
   const dispatch=useDispatch()

    const handleSubmit = (values, actions) => {
        // Handle form submission logic here
        console.log('Form submitted with values:', values);
        actions.setSubmitting(false);
        dispatch(
            updateFeedback({
              loading: true,
            })
          );
        dispatch(updateProfile({ ...values })).then(()=>{
            dispatch(
                updateFeedback({
                  loading: false,
                })
              );
            navigate(-1)})
                 
      };

    return (
        <Page title=" Simplified Online Fitness Training ">
            <Formik
            onSubmit={handleSubmit}
              initialValues= {{
                title: '',
                name: Profile?.name,
                profileName:Profile?.profileName||Profile?.name,
                expertise: Profile?.expertise,
                phone: Profile?.phone,
                dob: Profile?.dob,
                bio: Profile?.bio,
                password: '',
                gender: Profile?.gender,
                goals: Profile?.goals,
                trainingExperience: Profile?.trainingExperience,
                YearsOfTraining: Profile?.YearsOfTraining,
                currentJob: Profile?.currentJob,
                faviroteCardio: Profile?.faviroteCardio,
                activityLevel: Profile?.activityLevel || 'Light',
            }}
            
            >
                  <Form>
            <RootStyle>

                <Container>

                    <Content
                        flex
                        style={{
                            overflowY: 'auto',
                            paddingBottom: '24px',
                            paddingTop: '64px',
                        }}
                        withoutPadding
                    >
                        <Header
                            style={{
                                borderRadius: '0px 0px 8px 8px',
                                boxShadow:
                                    '0px 4px 54px rgba(225, 231, 240, 0.5)',
                                overflow: 'hidden',
                            }}
                            position="fixed"
                        >
                            <BoxHeader px={2} py={2} justifyContent={"space-between"} display={"flex"}>
                                <Box display={'flex'} alignItems={'center'} >
                                    {' '}
                                    <IconButton
                                        onClick={() => navigate(-1)}
                                        sx={{ color: 'text.primary' }}
                                    >
                                        <ArrowLeft />
                                    </IconButton>
                                    <Typography
                                        variant="body1"
                                        color="text.primary"
                                    >
                                        {/* My Profile&nbsp;&gt;&nbsp; */}
                                        <Typography
                                            component={'span'}
                                            variant="h6"
                                            
                                            color="teext.primary"
                                        >
                                            Edit profile
                                        </Typography>
                                    </Typography>{' '}
                                </Box>{' '}
                                <ButtonBase sx={{color:"primary.main"}} size="large" color='primary' type="submit">
                                    <Typography variant='subtitle1'>Done</Typography></ButtonBase>
                            </BoxHeader>
                        </Header>
                        <ProfileHeader Profile={Profile} editmode />
                        {/* <Divider sx={{ borderBottomWidth: 4, mb: 3 }} /> */}
                        <Box position="relative" px={2}>
                            <ProfileUpdateForm
                                Profile={Profile}
                                mode={props.mode}
                            />
                            <br />
                            {/* <ButtonBase onClick={swichAccount}>
                <Typography variant="subtitle1" color="primary.main">
                  Switch to {Profile.type=="Athlete"?"Instructor":"Client"} Account
                </Typography>
              </ButtonBase> */}
                        </Box>
                    </Content>
                </Container>
            </RootStyle>
            </Form>
            </Formik>
        </Page>
    )
}
